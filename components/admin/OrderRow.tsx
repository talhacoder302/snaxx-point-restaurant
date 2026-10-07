import Link from "next/link";
import type { Order } from "@/lib/orders";
import { formatOrderTime, timeAgo } from "@/lib/orders";
import { formatPhone, orderStatusLabel } from "@/lib/order-status";
import { formatPrice } from "@/lib/price";
import OrderStatusControl from "./OrderStatusControl";
import { ORDER_STATUS_BADGE } from "./orderStatusStyles";

type OrderRowProps = {
  order: Order;
  now: Date;
  highlighted?: boolean;
};

/**
 * One order per line, for the Orders page's compact list view — many more
 * orders fit on screen. The order number opens its full card.
 */
export default function OrderRow({ order, now, highlighted = false }: OrderRowProps) {
  const createdAt = new Date(order.createdAt);
  const isNew = order.status === "pending";
  const isClosed = order.status === "completed" || order.status === "cancelled";
  const badge = ORDER_STATUS_BADGE[order.status];
  const itemsSummary = order.items.map((item) => `${item.quantity}× ${item.name}`).join(", ");

  return (
    <li
      id={`order-${order.id}`}
      className={`relative grid scroll-mt-6 items-center gap-x-4 gap-y-2 px-4 py-3 lg:grid-cols-[76px_minmax(0,1.1fr)_minmax(0,1.3fr)_88px_auto] ${
        isNew ? "bg-ember/[0.04] dark:bg-ember/[0.07]" : ""
      } ${highlighted ? "ring-2 ring-inset ring-ember" : ""} ${isClosed ? "opacity-70" : ""}`}
    >
      {isNew && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[3px] bg-ember" />}

      {/* Time */}
      <div className="flex items-baseline gap-2 lg:block">
        <p className="text-[13px] font-bold tabular-nums text-admin-fg">{formatOrderTime(createdAt)}</p>
        <p className="text-[11.5px] text-admin-fg/60">{timeAgo(createdAt, now)}</p>
      </div>

      {/* Order + customer */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/orders?order=${order.id}&view=cards`}
            className="font-display text-[15px] font-black text-admin-fg hover:text-ember"
            title="Open full order"
          >
            #{order.reference}
          </Link>
          <span className="text-[12px]" title={order.orderType === "pickup" ? "Pickup" : "Delivery"}>
            {order.orderType === "pickup" ? "🛍️" : "🛵"}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-bold xl:hidden ${badge.badge}`}
          >
            {orderStatusLabel(order.status, order.orderType)}
          </span>
        </div>
        <p className="truncate text-[13px] text-admin-fg/80">
          {order.customerName}
          <span className="text-admin-fg/60"> · {formatPhone(order.phone)}</span>
        </p>
      </div>

      {/* Items */}
      <p className="truncate text-[12.5px] text-admin-fg/60" title={itemsSummary}>
        {itemsSummary}
      </p>

      {/* Total */}
      <p className="text-[14px] font-black tabular-nums text-admin-fg lg:text-right">
        {order.subtotal !== null ? formatPrice(order.subtotal) : "—"}
      </p>

      {/* Status */}
      <div className="flex items-center gap-2 lg:justify-end">
        <span
          className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10.5px] font-bold xl:inline-flex ${badge.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
          {orderStatusLabel(order.status, order.orderType)}
        </span>
        <OrderStatusControl
          orderId={order.id}
          status={order.status}
          orderType={order.orderType}
          compact
        />
      </div>
    </li>
  );
}
