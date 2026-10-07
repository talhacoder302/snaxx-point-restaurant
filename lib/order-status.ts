/**
 * Order types and statuses shared by the checkout form (client), the
 * placeOrder Server Action, and the admin dashboard. Keep this file free of
 * server-only imports so Client Components can use it.
 */

export type OrderType = "delivery" | "pickup";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

/** Generic labels, used for filter tabs and the status dropdown. */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "New",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready / On the Way",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** Label for a specific order — "ready" reads differently for delivery vs pickup. */
export function orderStatusLabel(status: OrderStatus, orderType: OrderType): string {
  if (status === "ready") return orderType === "pickup" ? "Ready for Pickup" : "Out for Delivery";
  if (status === "completed") return orderType === "pickup" ? "Picked Up" : "Delivered";
  return ORDER_STATUS_LABELS[status];
}

export type OrderLine = {
  key: string;
  name: string;
  /** Price text as shown on the site at the time of ordering. */
  price: string;
  unitPrice: number | null;
  quantity: number;
  lineTotal: number | null;
};

/** Short, human-friendly reference shown to the customer and on the dashboard. */
export function orderReference(orderId: string): string {
  return orderId.replace(/-/g, "").slice(0, 6).toUpperCase();
}

/** "+923001234567" → "0300 1234567"; other numbers are shown as stored. */
export function formatPhone(phone: string): string {
  const match = phone.match(/^\+92(3\d{2})(\d{7})$/);
  return match ? `0${match[1]} ${match[2]}` : phone;
}
