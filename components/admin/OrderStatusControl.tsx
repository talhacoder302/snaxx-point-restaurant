"use client";

import { useOptimistic, useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/(dashboard)/orders/actions";
import {
  ORDER_STATUSES,
  orderStatusLabel,
  type OrderStatus,
  type OrderType,
} from "@/lib/order-status";
import ChevronDownIcon from "../icons/ChevronDownIcon";

type OrderStatusControlProps = {
  orderId: string;
  status: OrderStatus;
  orderType: OrderType;
};

/** The one-click "move it along" action for each stage of an order. */
function nextStep(status: OrderStatus, orderType: OrderType): { status: OrderStatus; label: string } | null {
  switch (status) {
    case "pending":
      return { status: "confirmed", label: "Confirm Order" };
    case "confirmed":
      return { status: "preparing", label: "Start Preparing" };
    case "preparing":
      return {
        status: "ready",
        label: orderType === "pickup" ? "Mark Ready for Pickup" : "Send Out for Delivery",
      };
    case "ready":
      return { status: "completed", label: orderType === "pickup" ? "Mark Picked Up" : "Mark Delivered" };
    default:
      return null;
  }
}

export default function OrderStatusControl({ orderId, status, orderType }: OrderStatusControlProps) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(status);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const changeStatus = (next: OrderStatus) => {
    if (next === optimisticStatus) return;
    if (next === "cancelled" && !confirm("Cancel this order?")) return;

    setError(null);
    startTransition(async () => {
      setOptimisticStatus(next);
      const result = await updateOrderStatus(orderId, next);
      if (result.error) setError(result.error);
    });
  };

  const step = nextStep(optimisticStatus, orderType);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {step && (
          <button
            type="button"
            onClick={() => changeStatus(step.status)}
            disabled={pending}
            className="flex-1 rounded-[10px] bg-gradient-to-br from-ember-light to-ember-dark px-4 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_20px_rgba(228,0,43,0.25)] transition-all hover:brightness-110 disabled:opacity-60"
          >
            {pending ? "Updating…" : step.label}
          </button>
        )}

        <label className={`relative ${step ? "" : "flex-1"}`}>
          <span className="sr-only">Change order status</span>
          <select
            value={optimisticStatus}
            onChange={(event) => changeStatus(event.target.value as OrderStatus)}
            disabled={pending}
            className="w-full appearance-none rounded-[10px] border border-admin-fg/10 bg-admin-field py-2.5 pl-3.5 pr-9 text-[13px] font-semibold text-admin-fg/85 outline-none transition-colors hover:border-admin-fg/20 focus:border-ember/50 disabled:opacity-60"
          >
            {ORDER_STATUSES.map((value) => (
              <option key={value} value={value} className="bg-admin-bg text-admin-fg">
                {orderStatusLabel(value, orderType)}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-fg/60" />
        </label>
      </div>

      {error && <p className="mt-2 text-[12.5px] text-ember-dark dark:text-[#ff8a9d]">{error}</p>}
    </div>
  );
}
