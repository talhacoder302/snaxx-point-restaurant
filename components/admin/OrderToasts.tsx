"use client";

import Link from "next/link";
import type { OrderType } from "@/lib/order-status";
import { formatPrice } from "@/lib/price";
import CloseIcon from "../icons/CloseIcon";

export type OrderToast = {
  id: string;
  reference: string;
  customerName: string;
  orderType: OrderType;
  totalItems: number;
  subtotal: number | null;
  createdAt: string;
};

type OrderToastsProps = {
  toasts: OrderToast[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
};

/** How many toasts are shown at once; the rest are summarised in a "+N more" row. */
const VISIBLE_TOASTS = 3;

/**
 * New-order pop-ups, bottom-left on every admin page. They stay until
 * dismissed — staff are often away from the screen when an order lands.
 */
export default function OrderToasts({ toasts, onDismiss, onDismissAll }: OrderToastsProps) {
  if (toasts.length === 0) return null;

  const visible = toasts.slice(0, VISIBLE_TOASTS);
  const hiddenCount = toasts.length - visible.length;

  return (
    <div
      role="region"
      aria-label="New order notifications"
      aria-live="polite"
      className="fixed bottom-5 left-5 z-[80] flex w-[min(360px,calc(100vw-2.5rem))] flex-col gap-2.5"
    >
      {visible.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast-in overflow-hidden rounded-[16px] border border-ember/30 bg-admin-surface shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl dark:bg-[#232323]"
        >
          <div className="h-[3px] bg-gradient-to-r from-ember-dark via-ember to-ember-dark" />
          <div className="flex items-start gap-3 p-4">
            <span className="relative mt-1 flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember/60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ember" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[1.2px] text-ember">New order</p>
              <p className="mt-0.5 truncate text-[15px] font-bold text-admin-fg">
                #{toast.reference} · {toast.customerName}
              </p>
              <p className="mt-0.5 text-[12.5px] text-admin-fg/60">
                {toast.orderType === "pickup" ? "🛍️ Pickup" : "🛵 Delivery"} · {toast.totalItems}{" "}
                {toast.totalItems === 1 ? "item" : "items"}
                {toast.subtotal !== null && ` · ${formatPrice(toast.subtotal)}`}
              </p>

              <Link
                href={`/admin/orders?order=${toast.id}`}
                onClick={() => onDismiss(toast.id)}
                className="mt-3 inline-flex rounded-[9px] bg-gradient-to-br from-ember-light to-ember-dark px-3.5 py-1.5 text-[12.5px] font-bold text-white transition-all hover:brightness-110"
              >
                View order
              </Link>
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label={`Dismiss notification for order ${toast.reference}`}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-admin-fg/60 transition-colors hover:bg-admin-fg/[0.06] hover:text-admin-fg"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {toasts.length > 1 && (
        <div className="flex items-center justify-between gap-3 rounded-[12px] border border-admin-fg/10 bg-admin-surface px-4 py-2.5 text-[12.5px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] dark:bg-[#232323]">
          <Link
            href="/admin/orders?status=pending"
            onClick={onDismissAll}
            className="font-semibold text-ember-dark hover:underline dark:text-[#ff8a9d]"
          >
            {hiddenCount > 0 ? `+${hiddenCount} more · ` : ""}View all new
          </Link>
          <button
            type="button"
            onClick={onDismissAll}
            className="font-semibold text-admin-fg/60 transition-colors hover:text-admin-fg"
          >
            Dismiss all
          </button>
        </div>
      )}
    </div>
  );
}
