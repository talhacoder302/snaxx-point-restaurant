import type { Order } from "@/lib/orders";
import { formatOrderTime, timeAgo } from "@/lib/orders";
import { formatPhone, orderStatusLabel } from "@/lib/order-status";
import { formatPrice } from "@/lib/price";
import { site } from "@/lib/site";
import { buildWhatsAppCustomerLink } from "@/lib/whatsapp";
import ClockIcon from "../icons/ClockIcon";
import LocationIcon from "../icons/LocationIcon";
import PhoneIcon from "../icons/PhoneIcon";
import WhatsAppIcon from "../icons/WhatsAppIcon";
import OrderStatusControl from "./OrderStatusControl";
import { ORDER_STATUS_BADGE } from "./orderStatusStyles";

type OrderCardProps = {
  order: Order;
  now: Date;
};

export default function OrderCard({ order, now }: OrderCardProps) {
  const createdAt = new Date(order.createdAt);
  const isNew = order.status === "pending";
  const isClosed = order.status === "completed" || order.status === "cancelled";
  const badge = ORDER_STATUS_BADGE[order.status];

  const mapsQuery = [order.deliveryAddress, order.landmark].filter(Boolean).join(", ");
  const whatsappLink = buildWhatsAppCustomerLink(
    order.phone,
    `Hello ${order.customerName}, this is ${site.name} about your order #${order.reference}.`
  );

  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-[18px] border bg-admin-surface transition-colors ${
        isNew
          ? "border-ember/40 shadow-[0_0_0_1px_rgba(228,0,43,0.15),0_18px_50px_rgba(228,0,43,0.12)]"
          : "border-admin-fg/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:border-admin-fg/[0.14] dark:shadow-none"
      } ${isClosed ? "opacity-75" : ""}`}
    >
      {isNew && (
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-ember-dark via-ember to-ember-dark"
        />
      )}

      {/* Header — reference, type, status, time */}
      <header className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-[19px] font-black tracking-wide text-admin-fg">
              #{order.reference}
            </h3>
            <span className="rounded-full border border-admin-fg/10 bg-admin-fg/[0.05] px-2.5 py-0.5 text-[11.5px] font-semibold text-admin-fg/75">
              {order.orderType === "delivery" ? "🛵 Delivery" : "🛍️ Pickup"}
            </span>
          </div>
          <p className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-admin-fg/60">
            <ClockIcon className="h-3.5 w-3.5" />
            <time dateTime={order.createdAt} title={createdAt.toLocaleString("en-GB", { timeZone: site.timeZone })}>
              <span className="font-semibold text-admin-fg/75">{formatOrderTime(createdAt)}</span>
              {" · "}
              {timeAgo(createdAt, now)}
            </time>
          </p>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11.5px] font-bold ${badge.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${badge.dot} ${isNew ? "animate-pulse-dot" : ""}`} />
          {orderStatusLabel(order.status, order.orderType)}
        </span>
      </header>

      {/* Customer */}
      <section className="mx-5 mt-4 rounded-[14px] border border-admin-fg/[0.06] bg-admin-fg/[0.025] p-3.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold text-admin-fg">{order.customerName}</p>
            <p className="mt-0.5 text-[13px] tabular-nums text-admin-fg/60">{formatPhone(order.phone)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <a
              href={`tel:${order.phone}`}
              aria-label={`Call ${order.customerName}`}
              title="Call"
              className="grid h-9 w-9 place-items-center rounded-full border border-admin-fg/10 bg-admin-field text-admin-fg/80 transition-colors hover:border-admin-fg/25 hover:text-admin-fg"
            >
              <PhoneIcon className="h-4 w-4" />
            </a>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${order.customerName}`}
              title="WhatsApp"
              className="grid h-9 w-9 place-items-center rounded-full border border-[#25D366]/30 bg-[#25D366]/[0.08] transition-colors hover:bg-[#25D366]/[0.16]"
            >
              <WhatsAppIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        {order.orderType === "delivery" && order.deliveryAddress && (
          <div className="mt-3 flex gap-2 border-t border-admin-fg/[0.06] pt-3">
            <LocationIcon className="mt-0.5 h-4 w-4 shrink-0 text-ember" />
            <div className="min-w-0 text-[13px] leading-[1.55]">
              <p className="text-admin-fg/85">{order.deliveryAddress}</p>
              {order.landmark && <p className="text-admin-fg/60">Near {order.landmark}</p>}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-[12px] font-semibold text-ember-dark underline-offset-2 hover:text-ember dark:text-ember-glow/80 dark:hover:text-admin-fg hover:underline"
              >
                Open in Maps ↗
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Items */}
      <section className="px-5 pt-4">
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li key={item.key} className="flex items-baseline gap-3 text-[13.5px]">
              <span className="grid h-6 min-w-6 shrink-0 place-items-center rounded-[7px] bg-admin-fg/[0.06] px-1.5 text-[12px] font-bold tabular-nums text-admin-fg">
                {item.quantity}×
              </span>
              <span className="min-w-0 flex-1 text-admin-fg/85">{item.name}</span>
              <span className="shrink-0 tabular-nums text-admin-fg/60">
                {item.lineTotal !== null ? formatPrice(item.lineTotal) : item.price}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-admin-fg/[0.1] pt-3">
          <span className="text-[12.5px] font-semibold text-admin-fg/60">
            {order.totalItems} {order.totalItems === 1 ? "item" : "items"}
          </span>
          <span className="text-[18px] font-black tabular-nums text-admin-fg">
            {order.subtotal !== null ? formatPrice(order.subtotal) : "Price to confirm"}
          </span>
        </div>
      </section>

      {order.notes && (
        <p className="mx-5 mt-3 rounded-[12px] border border-amber-500/25 bg-amber-50 px-3.5 py-2.5 text-[13px] leading-[1.55] text-amber-950 dark:border-amber-400/20 dark:bg-amber-400/[0.07] dark:text-amber-100/90">
          <span className="font-bold text-amber-700 dark:text-amber-300">Note: </span>
          {order.notes}
        </p>
      )}

      <footer className="mt-auto px-5 pb-5 pt-4">
        <OrderStatusControl orderId={order.id} status={order.status} orderType={order.orderType} />
      </footer>
    </article>
  );
}
