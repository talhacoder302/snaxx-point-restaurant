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
