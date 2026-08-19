"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OfferFormState = { error?: string } | undefined;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return supabase;
}

function readOfferFields(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    emoji: String(formData.get("emoji") ?? "🍽️").trim() || "🍽️",
    original_price: String(formData.get("originalPrice") ?? "").trim(),
    discounted_price: String(formData.get("discountedPrice") ?? "").trim(),
    discount_badge: String(formData.get("discountBadge") ?? "").trim(),
    cta_label: String(formData.get("ctaLabel") ?? "Order Now").trim() || "Order Now",
    featured: formData.get("featured") === "on",
  };
}

function revalidatePublicPages() {
  revalidatePath("/offers");
  revalidatePath("/");
}

export async function createOffer(
  _prevState: OfferFormState,
  formData: FormData
): Promise<OfferFormState> {
  const supabase = await requireUser();
  const fields = readOfferFields(formData);

  if (!fields.title || !fields.original_price || !fields.discounted_price) {
    return { error: "Title, original price, and discounted price are required." };
  }

  const { error } = await supabase.from("offers").insert(fields);
  if (error) {
    return { error: error.message };
  }

  revalidatePublicPages();
  redirect("/admin");
}

export async function updateOffer(
  offerId: string,
  _prevState: OfferFormState,
  formData: FormData
): Promise<OfferFormState> {
  const supabase = await requireUser();
  const fields = readOfferFields(formData);

  if (!fields.title || !fields.original_price || !fields.discounted_price) {
    return { error: "Title, original price, and discounted price are required." };
  }

  const { error } = await supabase.from("offers").update(fields).eq("id", offerId);
  if (error) {
    return { error: error.message };
  }

  revalidatePublicPages();
  redirect("/admin");
}

export async function deleteOffer(formData: FormData) {
  const supabase = await requireUser();
  const offerId = String(formData.get("offerId") ?? "");

  if (!offerId) {
    throw new Error("Missing offer id.");
  }

  const { error } = await supabase.from("offers").delete().eq("id", offerId);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePublicPages();
}
