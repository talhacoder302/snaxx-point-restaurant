import type { OrderStatus } from "@/lib/order-status";

/**
 * Badge colours for each status, in both admin themes: deep text on a pale
 * tint in light mode, soft text on a translucent tint in dark mode. Always
 * paired with the status label, never colour alone.
 */
export const ORDER_STATUS_BADGE: Record<OrderStatus, { badge: string; dot: string }> = {
  pending: {
    badge:
      "border-ember/30 bg-ember/[0.07] text-ember-dark dark:border-ember/40 dark:bg-ember/[0.14] dark:text-[#ff8a9d]",
    dot: "bg-ember",
  },
  confirmed: {
    badge:
      "border-sky-600/25 bg-sky-50 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/[0.1] dark:text-sky-300",
    dot: "bg-sky-500 dark:bg-sky-400",
  },
  preparing: {
    badge:
      "border-violet-600/25 bg-violet-50 text-violet-700 dark:border-violet-400/30 dark:bg-violet-400/[0.1] dark:text-violet-300",
    dot: "bg-violet-500 dark:bg-violet-400",
  },
  ready: {
    badge:
      "border-amber-600/30 bg-amber-50 text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/[0.1] dark:text-amber-300",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  completed: {
    badge:
      "border-emerald-600/25 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/[0.1] dark:text-emerald-300",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  cancelled: {
    badge: "border-admin-fg/15 bg-admin-fg/[0.05] text-admin-fg/60",
    dot: "bg-admin-fg/40",
  },
};
