import { site } from "./site";

/**
 * Builds a WhatsApp order link with a professional pre-filled message.
 * Uses the centralized WHATSAPP_NUMBER from lib/site.ts — change it there
 * and every WhatsApp button across the website updates automatically.
 */
export function buildWhatsAppOrderLink(offerName: string): string {
  const message = `Hello ${site.name} Restaurant, I would like to order the ${offerName}. Please share the details. Thank you!`;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${site.whatsappNumber}?text=${encodedMessage}`;
}