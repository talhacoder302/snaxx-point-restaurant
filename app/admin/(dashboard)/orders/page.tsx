import type { Metadata } from "next";
import Link from "next/link";
import LiveRefresh from "@/components/admin/LiveRefresh";
import OrderCard from "@/components/admin/OrderCard";
import { ORDER_STATUS_BADGE } from "@/components/admin/orderStatusStyles";
import { dayKey, formatDayLabel, formatOrderTime, getRecentOrders, type Order } from "@/lib/orders";
import { ORDER_STATUSES, ORDER_STATUS_LABELS, isOrderStatus } from "@/lib/order-status";
import { formatPrice } from "@/lib/price";

export const metadata: Metadata = {
  title: "Orders · Admin",
};

const IN_PROGRESS = new Set(["confirmed", "preparing", "ready"]);

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
        accent ? "border-ember/35 bg-ember/[0.08]" : "border-white/[0.08] bg-white/[0.03]"
      }`}
    >
      <p className="text-[11.5px] font-bold uppercase tracking-[1.2px] text-white/50">{label}</p>
      <p className="mt-2 font-display text-[28px] font-black leading-none tabular-nums text-white">
        {value}
      </p>
      <p className="mt-2 text-[12px] text-white/45">{detail}</p>
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
  const { status: statusParam } = await searchParams;
  const activeStatus = isOrderStatus(statusParam) ? statusParam : null;

  const { orders, setupNeeded } = await getRecentOrders();
  const now = new Date();
  const todayKey = dayKey(now);

  // ── Stats ──
  const todaysOrders = orders.filter((order) => dayKey(new Date(order.createdAt)) === todayKey);
  const todaysBillable = todaysOrders.filter((order) => order.status !== "cancelled");
  const todaysSales = todaysBillable.reduce((sum, order) => sum + (order.subtotal ?? 0), 0);
  const unpricedToday = todaysBillable.filter((order) => order.subtotal === null).length;
  const newCount = orders.filter((order) => order.status === "pending").length;
  const inProgressCount = orders.filter((order) => IN_PROGRESS.has(order.status)).length;

  const countByStatus = Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, orders.filter((order) => order.status === status).length])
  );

  const visibleOrders = activeStatus
    ? orders.filter((order) => order.status === activeStatus)
    : orders;
  const groups = groupByDay(visibleOrders, now);

  const tabs = [
    { href: "/admin/orders", label: "All", count: orders.length, isActive: activeStatus === null, dot: null },
    ...ORDER_STATUSES.map((status) => ({
      href: `/admin/orders?status=${status}`,
      label: ORDER_STATUS_LABELS[status],
      count: countByStatus[status],
      isActive: activeStatus === status,
      dot: ORDER_STATUS_BADGE[status].dot,
    })),
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-white">Orders</h1>
          <p className="mt-1 text-[13px] text-white/50">
            Orders placed on the website, newest first.
          </p>
        </div>
        {!setupNeeded && (
          <LiveRefresh updatedAtLabel={formatOrderTime(now)} newOrderCount={newCount} />
        )}
      </div>

      {setupNeeded ? (
        <div className="mt-8 rounded-[16px] border border-amber-400/25 bg-amber-400/[0.06] p-6">
          <h2 className="text-[15px] font-bold text-amber-200">One-time setup needed</h2>
          <p className="mt-2 text-[13.5px] leading-[1.7] text-white/70">
            The <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12.5px]">orders</code> table
            doesn&rsquo;t exist in your database yet. Open the Supabase dashboard → SQL Editor, paste
            the contents of{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12.5px]">
              supabase/create-orders-table.sql
            </code>
            , and run it. Then refresh this page.
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

          {/* Status filter */}
          <nav
            aria-label="Filter orders by status"
            className="-mx-5 mt-7 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none]"
          >
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={tab.isActive ? "page" : undefined}
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
                  tab.isActive
                    ? "border-ember/50 bg-ember/[0.14] text-white"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                {tab.dot && <span className={`h-1.5 w-1.5 rounded-full ${tab.dot}`} />}
                {tab.label}
                <span
                  className={`rounded-full px-1.5 text-[11px] tabular-nums ${
                    tab.isActive ? "bg-white/15 text-white" : "bg-white/[0.06] text-white/50"
                  }`}
                >
                  {tab.count}
                </span>
              </Link>
            ))}
          </nav>

          {/* Orders */}
          {visibleOrders.length === 0 ? (
            <div className="mt-6 flex flex-col items-center rounded-[18px] border border-dashed border-white/[0.1] px-6 py-16 text-center">
              <span className="text-4xl" aria-hidden="true">
                🧾
              </span>
              <p className="mt-4 text-[15px] font-bold text-white">
                {activeStatus ? `No ${ORDER_STATUS_LABELS[activeStatus].toLowerCase()} orders` : "No orders yet"}
              </p>
              <p className="mt-1.5 max-w-sm text-[13px] leading-[1.6] text-white/50">
                {activeStatus
                  ? "Orders will show up here when they reach this stage."
                  : "When a customer taps “Order Now” in their cart, the order lands here automatically."}
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-8">
              {groups.map((group) => (
                <section key={group.key} aria-labelledby={`day-${group.key}`}>
                  <div className="mb-3 flex items-center gap-3">
                    <h2 id={`day-${group.key}`} className="text-[13px] font-bold text-white/80">
                      {group.label}
                    </h2>
                    <span className="h-px flex-1 bg-white/[0.08]" />
                    <span className="text-[12px] text-white/40">
                      {group.orders.length} {group.orders.length === 1 ? "order" : "orders"}
                    </span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {group.orders.map((order) => (
                      <OrderCard key={order.id} order={order} now={now} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
