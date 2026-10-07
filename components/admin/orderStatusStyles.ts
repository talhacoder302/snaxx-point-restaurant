import type { OrderStatus } from "@/lib/order-status";

/** Badge colours for each status on the dark admin surface. Always paired with the status label. */
export const ORDER_STATUS_BADGE: Record<OrderStatus, { badge: string; dot: string }> = {
  pending: { badge: "border-ember/40 bg-ember/[0.14] text-[#ff8a9d]", dot: "bg-ember" },
  confirmed: { badge: "border-sky-400/30 bg-sky-400/[0.1] text-sky-300", dot: "bg-sky-400" },
  preparing: { badge: "border-violet-400/30 bg-violet-400/[0.1] text-violet-300", dot: "bg-violet-400" },
  ready: { badge: "border-amber-400/30 bg-amber-400/[0.1] text-amber-300", dot: "bg-amber-400" },
  completed: { badge: "border-emerald-400/30 bg-emerald-400/[0.1] text-emerald-300", dot: "bg-emerald-400" },
  cancelled: { badge: "border-white/15 bg-white/[0.05] text-white/50", dot: "bg-white/40" },
};
