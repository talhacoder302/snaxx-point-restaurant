import { createClient } from "@/lib/supabase/server";
import {
  ACTIVE_ORDER_STATUSES,
  isOrderStatus,
  orderReference,
  type OrderLine,
  type OrderStatus,
  type OrderType,
} from "@/lib/order-status";
import { site } from "@/lib/site";

export type Order = {
  id: string;
  reference: string;
  customerName: string;
  /** International format, e.g. "+923001234567". */
  phone: string;
  orderType: OrderType;
  deliveryAddress: string | null;
  landmark: string | null;
  notes: string | null;
  items: OrderLine[];
  totalItems: number;
  subtotal: number | null;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

type OrderRow = {
  id: string;
  customer_name: string;
  phone: string;
  order_type: string;
  delivery_address: string | null;
  landmark: string | null;
  notes: string | null;
  items: unknown;
  total_items: number;
  subtotal: number | string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

function mapRow(row: OrderRow): Order {
  return {
    id: row.id,
    reference: orderReference(row.id),
    customerName: row.customer_name,
    phone: row.phone,
    orderType: row.order_type === "pickup" ? "pickup" : "delivery",
    deliveryAddress: row.delivery_address,
    landmark: row.landmark,
    notes: row.notes,
    items: Array.isArray(row.items) ? (row.items as OrderLine[]) : [],
    totalItems: row.total_items,
    subtotal: row.subtotal === null ? null : Number(row.subtotal),
    status: isOrderStatus(row.status) ? row.status : "pending",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const ORDER_COLUMNS =
  "id, customer_name, phone, order_type, delivery_address, landmark, notes, items, total_items, subtotal, status, created_at, updated_at";

/** Safety caps — far beyond a normal day's service, so nothing is silently dropped in practice. */
const ACTIVE_ORDERS_LIMIT = 500;
const RECENT_ORDERS_LIMIT = 2000;

const DAY_MS = 24 * 60 * 60 * 1000;

function isMissingTable(error: { code?: string } | null): boolean {
  return !!error && (error.code === "42P01" || error.code === "PGRST205");
}

/**
 * Fetches the orders the dashboard needs, newest first: every active order
 * (new → ready) whatever its date — so nothing still in progress is ever
 * hidden — plus all orders from roughly the last `days` days. The page trims
 * the latter to whole calendar days in the restaurant's time zone.
 *
 * `setupNeeded` is true when the orders table doesn't exist yet
 * (supabase/create-orders-table.sql hasn't been run), so the dashboard can
 * say so instead of looking empty.
 */
export async function getDashboardOrders(
  days: number
): Promise<{ orders: Order[]; setupNeeded: boolean }> {
  const supabase = await createClient();
  // One extra day of margin; the caller filters by calendar day.
  const since = new Date(Date.now() - (days + 1) * DAY_MS).toISOString();

  const [active, recent] = await Promise.all([
    supabase
      .from("orders")
      .select(ORDER_COLUMNS)
      .in("status", [...ACTIVE_ORDER_STATUSES])
      .order("created_at", { ascending: false })
      .limit(ACTIVE_ORDERS_LIMIT),
    supabase
      .from("orders")
      .select(ORDER_COLUMNS)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(RECENT_ORDERS_LIMIT),
  ]);

  const error = active.error ?? recent.error;
  if (error) {
    const setupNeeded = isMissingTable(error);
    if (!setupNeeded) console.error("Failed to fetch orders:", error.message);
    return { orders: [], setupNeeded };
  }

  const byId = new Map<string, Order>();
  for (const row of [...(active.data ?? []), ...(recent.data ?? [])] as OrderRow[]) {
    byId.set(row.id, mapRow(row));
  }
  const orders = [...byId.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return { orders, setupNeeded: false };
}

/** Number of orders waiting for confirmation — for the Orders badge on every admin page. */
export async function getNewOrderCount(): Promise<number> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) {
    if (!isMissingTable(error)) console.error("Failed to count new orders:", error.message);
    return 0;
  }
  return count ?? 0;
}

// ---------- Time helpers (always in the restaurant's time zone) ----------

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", { timeZone: site.timeZone });
const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: site.timeZone,
  hour: "numeric",
  minute: "2-digit",
});
const dayLabelFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: site.timeZone,
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** "2026-10-07" — the calendar day an instant falls on, in the restaurant's time zone. */
export function dayKey(date: Date): string {
  return dayKeyFormat.format(date);
}

export function formatOrderTime(date: Date): string {
  return timeFormat.format(date);
}

/** "Today", "Yesterday", or "Monday, 5 October". */
export function formatDayLabel(date: Date, now: Date): string {
  const key = dayKey(date);
  if (key === dayKey(now)) return "Today";
  if (key === dayKey(new Date(now.getTime() - 24 * 60 * 60 * 1000))) return "Yesterday";
  return dayLabelFormat.format(date);
}

/** "Just now", "12 min ago", "3 hr ago", "2 days ago". */
export function timeAgo(date: Date, now: Date): string {
  const minutes = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}
