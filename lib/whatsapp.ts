import type { CartItem } from "./cart";
import { site } from "./site";

/**
 * Builds a WhatsApp order link with a professional pre-filled message.
 * Uses the centralized WHATSAPP_NUMBER from lib/site.ts — change it there
 * and every WhatsApp button across the website updates automatically.
 */
export function buildWhatsAppOrderLink(offerName: string): string {
  const message = `Hello ${site.name} Restaurant, I would like to order the *${offerName}*. Please share the details. Thank you!`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${site.whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Builds a WhatsApp link that carries the whole cart as one neatly formatted
 * order message — one numbered block per item, so the restaurant can read it
 * at a glance.
 */
export function buildWhatsAppCartLink(items: CartItem[]): string {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const lines = items.map(
    (item, index) => `*${index + 1}. ${item.name}*\nQuantity: ${item.quantity}`
  );

  const message = [
    `Hello ${site.name} Restaurant, I would like to place an order:`,
    lines.join("\n\n"),
    `Total items: ${totalQuantity}`,
    "Please confirm my order. Thank you!",
  ].join("\n\n");

  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Converts a customer's phone number as typed ("0300 1234567", "+92 300…")
 * into WhatsApp's international digits-only format ("923001234567").
 * Local Pakistani numbers starting with 0 get the 92 country code.
 */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits;
}

/** Opens a chat with a customer from the admin dashboard. */
export function buildWhatsAppCustomerLink(phone: string, message: string): string {
  return `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(message)}`;
}

type PlacedOrderSummary = {
  reference: string;
  customerName: string;
  orderType: "delivery" | "pickup";
  deliveryAddress: string | null;
  items: { name: string; quantity: number }[];
};

/**
 * Optional follow-up after an order is saved: lets the customer send the
 * restaurant a WhatsApp message quoting the order reference for a faster
 * confirmation. Like the cart message, it carries no prices.
 */
export function buildWhatsAppPlacedOrderLink(order: PlacedOrderSummary): string {
  const lines = order.items.map((item) => `• ${item.name} × ${item.quantity}`);

  const message = [
    `Hello ${site.name} Restaurant, I just placed order *#${order.reference}* on your website.`,
    lines.join("\n"),
    order.orderType === "delivery"
      ? `Name: ${order.customerName}\nDelivery to: ${order.deliveryAddress ?? ""}`
      : `Name: ${order.customerName}\nI will pick it up.`,
    "Please confirm. Thank you!",
  ].join("\n\n");

  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
