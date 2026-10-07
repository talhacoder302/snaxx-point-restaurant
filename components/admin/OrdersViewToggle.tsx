"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ORDERS_VIEW_COOKIE, setAdminCookie, type OrdersView } from "@/lib/admin-cookies";
import GridViewIcon from "../icons/GridViewIcon";
import ViewListIcon from "../icons/ViewListIcon";

const OPTIONS = [
  { value: "cards", label: "Cards", Icon: GridViewIcon },
  { value: "list", label: "Compact list", Icon: ViewListIcon },
] as const;

/** Switches the Orders page between detailed cards and a compact one-line-per-order list. */
export default function OrdersViewToggle({ initialView }: { initialView: OrdersView }) {
  const router = useRouter();
  const [view, setView] = useState(initialView);
  const [, startTransition] = useTransition();

  const choose = (next: OrdersView) => {
    if (next === view) return;
    setView(next);
    setAdminCookie(ORDERS_VIEW_COOKIE, next);
    startTransition(() => router.refresh());
  };

  return (
    <div
      role="group"
      aria-label="Orders layout"
      className="flex shrink-0 rounded-[10px] border border-admin-fg/10 bg-admin-field p-0.5"
    >
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => choose(value)}
          aria-pressed={view === value}
          aria-label={label}
          title={label}
          className={`grid h-8 w-9 place-items-center rounded-[8px] transition-colors ${
            view === value
              ? "bg-ember/[0.1] text-ember-dark dark:bg-ember/[0.18] dark:text-[#ff8a9d]"
              : "text-admin-fg/60 hover:text-admin-fg"
          }`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </button>
      ))}
    </div>
  );
}
