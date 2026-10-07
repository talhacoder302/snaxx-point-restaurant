import { createClient } from "@/lib/supabase/server";
import {
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

/** How many of the latest orders the dashboard loads — plenty for a day's service and its stats. */
const RECENT_ORDERS_LIMIT = 300;

/**
 * Fetches the most recent orders, newest first. `setupNeeded` is true when
 * the orders table doesn't exist yet (supabase/create-orders-table.sql
 * hasn't been run), so the dashboard can say so instead of looking empty.
 */
export async function getRecentOrders(): Promise<{ orders: Order[]; setupNeeded: boolean }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, customer_name, phone, order_type, delivery_address, landmark, notes, items, total_items, subtotal, status, created_at, updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(RECENT_ORDERS_LIMIT);

  if (error) {
    const setupNeeded = error.code === "42P01" || error.code === "PGRST205";
    if (!setupNeeded) console.error("Failed to fetch orders:", error.message);
    return { orders: [], setupNeeded };
  }

  return { orders: ((data ?? []) as OrderRow[]).map(mapRow), setupNeeded: false };
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
