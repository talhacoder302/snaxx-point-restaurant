import type { Metadata } from "next";
import Form from "next/form";
import Link from "next/link";
import LiveRefresh from "@/components/admin/LiveRefresh";
import OrderCard from "@/components/admin/OrderCard";
import OrderRow from "@/components/admin/OrderRow";
import OrdersViewToggle from "@/components/admin/OrdersViewToggle";
import ScrollToOrder from "@/components/admin/ScrollToOrder";
import { ORDER_STATUS_BADGE } from "@/components/admin/orderStatusStyles";
import SearchIcon from "@/components/icons/SearchIcon";
import type { OrdersView } from "@/lib/admin-cookies";
import { getOrdersView } from "@/lib/admin-theme";
import { dayKey, formatDayLabel, formatOrderTime, getDashboardOrders, type Order } from "@/lib/orders";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  formatPhone,
  isActiveStatus,
  isOrderStatus,
  type OrderStatus,
} from "@/lib/order-status";
import { formatPrice } from "@/lib/price";

export const metadata: Metadata = {
  title: "Orders · Admin",
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Date ranges for finished orders. Active orders are always shown, whatever their date. */
const DAY_RANGES = [
  { days: 1, label: "Today" },
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
] as const;

type StatusFilter = "active" | "all" | OrderStatus;

type PageState = { status: StatusFilter; days: number; q: string };

function readParam(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

/** Builds an Orders URL, leaving defaults out so links stay short. */
function ordersHref({ status, days, q }: PageState): string {
  const params = new URLSearchParams();
  if (status !== "active") params.set("status", status);
  if (days !== 1) params.set("days", String(days));
  if (q) params.set("q", q);
  const query = params.toString();
  return query ? `/admin/orders?${query}` : "/admin/orders";
}

/** Order number, customer name, or phone (any format: 0300…, +92300…, 300…). */
function matchesSearch(order: Order, q: string): boolean {
  const text = q.toLowerCase().replace(/^#/, "");
  if (order.reference.toLowerCase().includes(text)) return true;
  if (order.customerName.toLowerCase().includes(text)) return true;

  const digits = q.replace(/\D/g, "");
  if (digits.length >= 3) {
    const phones = [order.phone, formatPhone(order.phone)].map((phone) => phone.replace(/\D/g, ""));
    if (phones.some((phone) => phone.includes(digits))) return true;
  }
  return false;
}

function matchesStatus(order: Order, filter: StatusFilter): boolean {
  if (filter === "all") return true;
  if (filter === "active") return isActiveStatus(order.status);
  return order.status === filter;
}

function StatTile({
  label,
  value,
  detail,
  accent,
}: {
  label: string;
  value: string;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[16px] border p-4 sm:p-5 ${
        accent
          ? "border-ember/35 bg-ember/[0.08]"
          : "border-admin-fg/[0.08] bg-admin-surface shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none"
      }`}
    >
      <p className="text-[11.5px] font-bold uppercase tracking-[1.2px] text-admin-fg/60">{label}</p>
      <p className="mt-2 font-display text-[28px] font-black leading-none tabular-nums text-admin-fg">
        {value}
      </p>
      <p className="mt-2 text-[12px] text-admin-fg/60">{detail}</p>
    </div>
  );
}

/** Groups already-sorted orders under "Today", "Yesterday", or a date heading. */
function groupByDay(orders: Order[], now: Date) {
  const groups: { key: string; label: string; orders: Order[] }[] = [];
  for (const order of orders) {
    const createdAt = new Date(order.createdAt);
    const key = dayKey(createdAt);
    const last = groups.at(-1);
    if (last?.key === key) {
      last.orders.push(order);
    } else {
      groups.push({ key, label: formatDayLabel(createdAt, now), orders: [order] });
    }
  }
  return groups;
}

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  const params = await searchParams;

  const statusParam = readParam(params.status);
  const status: StatusFilter =
    statusParam === "all" || isOrderStatus(statusParam) ? statusParam : "active";
  const daysParam = Number(readParam(params.days));
  const days = DAY_RANGES.some((range) => range.days === daysParam) ? daysParam : 1;
  const q = readParam(params.q).slice(0, 60);
  const highlightId = readParam(params.order) || null;
  const viewParam = readParam(params.view);
  const view: OrdersView =
    viewParam === "cards" || viewParam === "list" ? viewParam : await getOrdersView();

  const state: PageState = { status, days, q };

  const { orders, setupNeeded } = await getDashboardOrders(days);
  const now = new Date();
  const todayKey = dayKey(now);
  const firstDayKey = dayKey(new Date(now.getTime() - (days - 1) * DAY_MS));

  // Active orders are always included; finished ones only within the chosen date range.
  const inRange = orders.filter(
    (order) => isActiveStatus(order.status) || dayKey(new Date(order.createdAt)) >= firstDayKey
  );

  // ── Stats (always about today and what's in progress, whatever the filters) ──
  const todaysOrders = orders.filter((order) => dayKey(new Date(order.createdAt)) === todayKey);
  const todaysBillable = todaysOrders.filter((order) => order.status !== "cancelled");
  const todaysSales = todaysBillable.reduce((sum, order) => sum + (order.subtotal ?? 0), 0);
  const unpricedToday = todaysBillable.filter((order) => order.subtotal === null).length;
  const newCount = orders.filter((order) => order.status === "pending").length;
  const inProgressCount = orders.filter(
    (order) => isActiveStatus(order.status) && order.status !== "pending"
  ).length;

  // ── What to list — a search looks across every status ──
  let visibleOrders = q
    ? inRange.filter((order) => matchesSearch(order, q))
    : inRange.filter((order) => matchesStatus(order, status));

  // An order opened from an alert is always shown, even if the filters would hide it.
  if (highlightId && !visibleOrders.some((order) => order.id === highlightId)) {
    const highlighted = orders.find((order) => order.id === highlightId);
    if (highlighted) visibleOrders = [highlighted, ...visibleOrders];
  }

  const groups = groupByDay(visibleOrders, now);

  const tabs: { filter: StatusFilter; label: string; dot: string | null }[] = [
    { filter: "active", label: "Active", dot: null },
    ...ORDER_STATUSES.map((value) => ({
      filter: value,
      label: ORDER_STATUS_LABELS[value],
      dot: ORDER_STATUS_BADGE[value].dot,
    })),
    { filter: "all", label: "All", dot: null },
  ];

  return (
    <div>
      {highlightId && <ScrollToOrder orderId={highlightId} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-admin-fg">Orders</h1>
          <p className="mt-1 text-[13px] text-admin-fg/60">
            Orders placed on the website, newest first.
          </p>
        </div>
        {!setupNeeded && <LiveRefresh updatedAtLabel={formatOrderTime(now)} />}
      </div>

      {setupNeeded ? (
        <div className="mt-8 rounded-[16px] border border-amber-500/30 bg-amber-50 p-6 dark:border-amber-400/25 dark:bg-amber-400/[0.06]">
          <h2 className="text-[15px] font-bold text-amber-800 dark:text-amber-200">
            One-time setup needed
          </h2>
          <p className="mt-2 text-[13.5px] leading-[1.7] text-admin-fg/70">
            The <code className="rounded bg-admin-fg/10 px-1.5 py-0.5 text-[12.5px]">orders</code>{" "}
            table doesn&rsquo;t exist in your database yet. Open the Supabase dashboard → SQL
            Editor, paste the contents of{" "}
            <code className="rounded bg-admin-fg/10 px-1.5 py-0.5 text-[12.5px]">
              supabase/create-orders-table.sql
            </code>
            , and run it. Then do the same with{" "}
            <code className="rounded bg-admin-fg/10 px-1.5 py-0.5 text-[12.5px]">
              supabase/enable-orders-realtime.sql
            </code>{" "}
            for instant new-order alerts, and refresh this page.
          </p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile
              label="New"
              value={String(newCount)}
              detail="Waiting for confirmation"
              accent={newCount > 0}
            />
            <StatTile
              label="In Progress"
              value={String(inProgressCount)}
              detail="Confirmed, preparing or on the way"
            />
            <StatTile
              label="Today's Orders"
              value={String(todaysOrders.length)}
              detail={`${todaysOrders.length - todaysBillable.length} cancelled`}
            />
            <StatTile
              label="Today's Sales"
              value={formatPrice(todaysSales)}
              detail={
                unpricedToday > 0
                  ? `+ ${unpricedToday} order${unpricedToday === 1 ? "" : "s"} with prices to confirm`
                  : "Excludes cancelled orders"
              }
            />
          </div>

          {/* Search, date range, layout */}
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <Form action="/admin/orders" className="relative min-w-[220px] flex-1">
              {days !== 1 && <input type="hidden" name="days" value={days} />}
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-admin-fg/60" />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Search order #, name or phone"
                aria-label="Search orders"
                className="h-9 w-full rounded-[10px] border border-admin-fg/10 bg-admin-field pl-9 pr-3 text-[13px] text-admin-fg outline-none placeholder:text-admin-fg/60 focus:border-ember/50"
              />
            </Form>

            <div
              role="group"
              aria-label="Date range for finished orders"
              className="flex shrink-0 rounded-[10px] border border-admin-fg/10 bg-admin-field p-0.5"
            >
              {DAY_RANGES.map((range) => (
                <Link
                  key={range.days}
                  href={ordersHref({ ...state, days: range.days })}
                  aria-current={range.days === days ? "true" : undefined}
                  className={`rounded-[8px] px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                    range.days === days
                      ? "bg-ember/[0.1] text-ember-dark dark:bg-ember/[0.18] dark:text-[#ff8a9d]"
                      : "text-admin-fg/60 hover:text-admin-fg"
                  }`}
                >
                  {range.label}
                </Link>
              ))}
            </div>

            <OrdersViewToggle initialView={view} />
          </div>

          {/* Status tabs — replaced by a result line while searching, since search covers every status */}
          {q ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-admin-fg/60">
              <span>
                <span className="font-bold text-admin-fg">{visibleOrders.length}</span>{" "}
                {visibleOrders.length === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;
              </span>
              <Link
                href={ordersHref({ ...state, q: "" })}
                className="font-semibold text-ember-dark hover:underline dark:text-[#ff8a9d]"
              >
                Clear search
              </Link>
            </div>
          ) : (
            <nav
              aria-label="Filter orders by status"
              className="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]"
            >
              {tabs.map((tab) => {
                const isActive = tab.filter === status;
                return (
                  <Link
                    key={tab.filter}
                    href={ordersHref({ ...state, status: tab.filter })}
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                      isActive
                        ? "border-ember/50 bg-ember/[0.1] text-ember-dark dark:bg-ember/[0.14] dark:text-admin-fg"
                        : "border-admin-fg/10 bg-admin-surface text-admin-fg/60 hover:border-admin-fg/20 hover:text-admin-fg"
                    }`}
                  >
                    {tab.dot && <span className={`h-1.5 w-1.5 rounded-full ${tab.dot}`} />}
                    {tab.label}
                    <span
                      className={`rounded-full px-1.5 text-[11px] tabular-nums ${
                        isActive ? "bg-ember/15 dark:bg-admin-fg/15" : "bg-admin-fg/[0.06] text-admin-fg/60"
                      }`}
                    >
                      {inRange.filter((order) => matchesStatus(order, tab.filter)).length}
                    </span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Orders */}
          {visibleOrders.length === 0 ? (
            <div className="mt-6 flex flex-col items-center rounded-[18px] border border-dashed border-admin-fg/[0.1] px-6 py-16 text-center">
              <span className="text-4xl" aria-hidden="true">
                {q ? "🔍" : "🧾"}
              </span>
              <p className="mt-4 text-[15px] font-bold text-admin-fg">
                {q
                  ? "No matching orders"
                  : status === "active"
                    ? "No active orders"
                    : status === "all"
                      ? "No orders yet"
                      : `No ${ORDER_STATUS_LABELS[status].toLowerCase()} orders`}
              </p>
              <p className="mt-1.5 max-w-sm text-[13px] leading-[1.6] text-admin-fg/60">
                {q
                  ? days < 30
                    ? "Try a wider date range, or check the spelling."
                    : "Check the order number, name or phone and try again."
                  : status === "active"
                    ? "You're all caught up. New orders pop up here — and on every admin page — the moment they're placed."
                    : days < 30
                      ? "Nothing here for this date range. Try a wider one."
                      : "Orders will show up here when they reach this stage."}
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-7">
              {groups.map((group) => (
                <section key={group.key} aria-labelledby={`day-${group.key}`}>
                  <div className="mb-3 flex items-center gap-3">
                    <h2 id={`day-${group.key}`} className="text-[13px] font-bold text-admin-fg/80">
                      {group.label}
                    </h2>
                    <span className="h-px flex-1 bg-admin-fg/[0.08]" />
                    <span className="text-[12px] text-admin-fg/60">
                      {group.orders.length} {group.orders.length === 1 ? "order" : "orders"}
                    </span>
                  </div>

                  {view === "list" ? (
                    <ul className="divide-y divide-admin-fg/[0.07] overflow-hidden rounded-[16px] border border-admin-fg/[0.08] bg-admin-surface shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:shadow-none">
                      {group.orders.map((order) => (
                        <OrderRow
                          key={order.id}
                          order={order}
                          now={now}
                          highlighted={order.id === highlightId}
                        />
                      ))}
                    </ul>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {group.orders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          now={now}
                          highlighted={order.id === highlightId}
                        />
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
