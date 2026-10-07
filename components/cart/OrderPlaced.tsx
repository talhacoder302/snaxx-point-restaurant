"use client";

import type { PlacedOrder } from "@/app/orders/actions";
import { formatPhone } from "@/lib/order-status";
import { formatPrice } from "@/lib/price";
import { buildWhatsAppPlacedOrderLink } from "@/lib/whatsapp";
import CheckIcon from "../icons/CheckIcon";
import ClockIcon from "../icons/ClockIcon";
import LocationIcon from "../icons/LocationIcon";
import WhatsAppIcon from "../icons/WhatsAppIcon";

type OrderPlacedProps = {
  order: PlacedOrder;
  onDone: () => void;
};

export default function OrderPlaced({ order, onDone }: OrderPlacedProps) {
  // Shown in the customer's own time zone — this runs only in the browser.
  const placedAt = new Date(order.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <>
      <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="relative grid h-20 w-20 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#1DA851]/20 [animation-iteration-count:2]" />
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#31E17B] to-[#1DA851] text-white shadow-[0_14px_35px_rgba(29,168,81,0.35)]">
              <CheckIcon className="h-8 w-8" />
            </span>
          </span>

          <h3 className="mt-5 font-display text-2xl font-black text-ink">Order placed!</h3>
          <p className="mt-2 max-w-[290px] text-[14px] leading-[1.7] text-smoke">
            Thank you, {order.customerName.split(" ")[0]}. We&rsquo;ll call or WhatsApp you on{" "}
            <span className="font-semibold text-ink">{formatPhone(order.phone)}</span> shortly to confirm.
          </p>
        </div>

        <div className="mt-7 overflow-hidden rounded-[18px] border border-ink/[0.08] bg-cream-deep/60">
          <div className="flex items-center justify-between gap-3 border-b border-dashed border-ink/[0.12] px-4 py-3.5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-mist">Order</p>
              <p className="font-display text-xl font-black text-ember">#{order.reference}</p>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1 text-[12px] font-semibold text-mist">
                <ClockIcon className="h-3.5 w-3.5" />
                {placedAt}
              </p>
              <p className="mt-0.5 text-[12.5px] font-bold text-ink">
                {order.orderType === "delivery" ? "🛵 Delivery" : "🛍️ Pickup"}
              </p>
            </div>
          </div>

          <ul className="space-y-1.5 px-4 py-3.5">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between gap-3 text-[13.5px]">
                <span className="text-ink">{item.name}</span>
                <span className="shrink-0 font-bold tabular-nums text-smoke">× {item.quantity}</span>
              </li>
            ))}
          </ul>

          {(order.deliveryAddress || order.subtotal !== null) && (
            <div className="space-y-2 border-t border-ink/[0.07] px-4 py-3.5">
              {order.deliveryAddress && (
                <p className="flex gap-2 text-[13px] leading-[1.55] text-smoke">
                  <LocationIcon className="mt-0.5 h-4 w-4 shrink-0 text-ember/70" />
                  {order.deliveryAddress}
                </p>
              )}
              {order.subtotal !== null && (
                <div className="flex items-baseline justify-between">
                  <span className="text-[13px] font-semibold text-smoke">Total</span>
                  <span className="text-[18px] font-black tabular-nums text-gradient">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="space-y-3 border-t border-ink/[0.07] px-5 py-5 sm:px-6">
        <a
          href={buildWhatsAppPlacedOrderLink(order)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-h-[48px] items-center justify-center gap-2.5 rounded-[14px] border border-[#1DA851]/30 bg-[#1DA851]/[0.06] px-5 text-[13.5px] font-bold text-[#128C3F] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1DA851]/[0.12]"
        >
          <WhatsAppIcon className="h-4 w-4" />
          Need it faster? Message us on WhatsApp
        </a>
        <button
          type="button"
          onClick={onDone}
          className="flex min-h-[48px] w-full items-center justify-center rounded-[14px] bg-ink text-[14px] font-bold text-white transition-colors hover:bg-ink/85"
        >
          Done
        </button>
      </footer>
    </>
  );
}
