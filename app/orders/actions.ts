"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parsePrice } from "@/lib/price";
import { orderReference, type OrderLine, type OrderType } from "@/lib/order-status";
import { toWhatsAppNumber } from "@/lib/whatsapp";

export type PlaceOrderInput = {
  customerName: string;
  phone: string;
  orderType: OrderType;
  deliveryAddress: string;
  landmark: string;
  notes: string;
  items: { key: string; name: string; quantity: number }[];
};

export type PlacedOrder = {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  orderType: OrderType;
  deliveryAddress: string | null;
  items: { name: string; quantity: number }[];
  totalItems: number;
  subtotal: number | null;
  createdAt: string;
};

export type PlaceOrderResult =
  | { ok: true; order: PlacedOrder }
  | { ok: false; error: string; fieldErrors?: Partial<Record<FieldName, string>> };

type FieldName = "customerName" | "phone" | "deliveryAddress" | "landmark" | "notes";

const MAX_LINES = 50;
const MAX_QUANTITY = 99;

function text(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

/** Prices are looked up again here — never trusted from the browser's cart. */
async function priceItems(
  supabase: Awaited<ReturnType<typeof createClient>>,
  requested: { key: string; name: string; quantity: number }[]
): Promise<{ lines: OrderLine[] } | { error: string }> {
  const menuIds: string[] = [];
  const offerIds: string[] = [];

  for (const item of requested) {
    const [kind, id] = item.key.split(":");
    if (kind === "menu" && id) menuIds.push(id);
    else if (kind === "offer" && id) offerIds.push(id);
  }

  const [menuResult, offerResult] = await Promise.all([
    menuIds.length > 0
      ? supabase.from("menu_items").select("id, name, price, available").in("id", menuIds)
      : Promise.resolve({ data: [], error: null }),
    offerIds.length > 0
      ? supabase.from("offers").select("id, title, discounted_price").in("id", offerIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (menuResult.error || offerResult.error) {
    console.error("Failed to price order:", menuResult.error?.message ?? offerResult.error?.message);
    return { error: "We couldn't check your cart right now. Please try again." };
  }

  const catalogue = new Map<string, { name: string; price: string }>();
  for (const row of (menuResult.data ?? []) as {
    id: string;
    name: string;
    price: string;
    available: boolean;
  }[]) {
    if (row.available) catalogue.set(`menu:${row.id}`, { name: row.name, price: row.price });
  }
  for (const row of (offerResult.data ?? []) as {
    id: string;
    title: string;
    discounted_price: string;
  }[]) {
    catalogue.set(`offer:${row.id}`, { name: row.title, price: row.discounted_price });
  }

  const unavailable = requested.filter((item) => !catalogue.has(item.key));
  if (unavailable.length > 0) {
    const names = unavailable.map((item) => item.name || "an item").join(", ");
    return {
      error: `Sorry, ${names} ${unavailable.length === 1 ? "is" : "are"} no longer available. Please remove ${unavailable.length === 1 ? "it" : "them"} from your cart and try again.`,
    };
  }

  const lines = requested.map((item): OrderLine => {
    const product = catalogue.get(item.key)!;
    const unitPrice = parsePrice(product.price);
    return {
      key: item.key,
      name: product.name,
      price: product.price,
      unitPrice,
      quantity: item.quantity,
      lineTotal: unitPrice === null ? null : unitPrice * item.quantity,
    };
  });

  return { lines };
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  // Server Actions are public endpoints — validate everything, trust nothing.
  const customerName = text(input?.customerName, 80);
  const rawPhone = text(input?.phone, 30);
  const orderType: OrderType = input?.orderType === "pickup" ? "pickup" : "delivery";
  const deliveryAddress = orderType === "delivery" ? text(input?.deliveryAddress, 300) : "";
  const landmark = orderType === "delivery" ? text(input?.landmark, 120) : "";
  const notes = text(input?.notes, 500);

  const fieldErrors: Partial<Record<FieldName, string>> = {};

  if (customerName.length < 2) {
    fieldErrors.customerName = "Please enter your name.";
  }

  const whatsappDigits = toWhatsAppNumber(rawPhone);
  const looksValid =
    /^\d{10,15}$/.test(whatsappDigits) &&
    (!whatsappDigits.startsWith("92") || whatsappDigits.length === 12);
  if (!looksValid) {
    fieldErrors.phone = "Enter a valid mobile number, e.g. 0300 1234567.";
  }

  if (orderType === "delivery" && deliveryAddress.length < 5) {
    fieldErrors.deliveryAddress = "Please enter your full delivery address.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  // Merge duplicate keys and drop anything malformed.
  const quantities = new Map<string, { key: string; name: string; quantity: number }>();
  for (const item of Array.isArray(input?.items) ? input.items : []) {
    const key = text(item?.key, 100);
    const quantity = Number(item?.quantity);
    if (!/^(menu|offer):.+$/.test(key) || !Number.isInteger(quantity) || quantity < 1) continue;

    const existing = quantities.get(key);
    quantities.set(key, {
      key,
      name: text(item?.name, 120),
      quantity: Math.min((existing?.quantity ?? 0) + quantity, MAX_QUANTITY),
    });
  }

  const requested = [...quantities.values()];
  if (requested.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }
  if (requested.length > MAX_LINES) {
    return { ok: false, error: `Please order at most ${MAX_LINES} different items at once.` };
  }

  const supabase = await createClient();

  const priced = await priceItems(supabase, requested);
  if ("error" in priced) {
    return { ok: false, error: priced.error };
  }

  const { lines } = priced;
  const totalItems = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.every((line) => line.lineTotal !== null)
    ? lines.reduce((sum, line) => sum + (line.lineTotal ?? 0), 0)
    : null;

  // The id is generated here because the public (anon) role may insert
  // orders but, by design, can't read them back.
  const id = randomUUID();
  const createdAt = new Date().toISOString();
  const phone = `+${whatsappDigits}`;

  const { error } = await supabase.from("orders").insert({
    id,
    customer_name: customerName,
    phone,
    order_type: orderType,
    delivery_address: deliveryAddress || null,
    landmark: landmark || null,
    notes: notes || null,
    items: lines,
    total_items: totalItems,
    subtotal,
    status: "pending",
    created_at: createdAt,
  });

  if (error) {
    console.error("Failed to save order:", error.message);
    return {
      ok: false,
      error: "We couldn't place your order right now. Please try again, or send it on WhatsApp.",
    };
  }

  revalidatePath("/admin/orders");

  return {
    ok: true,
    order: {
      id,
      reference: orderReference(id),
      customerName,
      phone,
      orderType,
      deliveryAddress: deliveryAddress || null,
      items: lines.map((line) => ({ name: line.name, quantity: line.quantity })),
      totalItems,
      subtotal,
      createdAt,
    },
  };
}
