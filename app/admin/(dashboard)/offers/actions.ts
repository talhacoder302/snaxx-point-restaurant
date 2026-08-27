"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OfferFormState = { error?: string } | undefined;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

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

/**
 * Saves an uploaded offer image to public/offers and returns its site-relative
 * path (e.g. "/offers/<uuid>.jpg"). Throws with a user-facing message on
 * invalid input — the generated filename never comes from the client, so
 * there's no path-traversal or filename-collision risk.
 */
async function saveUploadedOfferImage(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be smaller than 5MB.");
  }

  const extension = IMAGE_EXTENSIONS[file.type];
  if (!extension) {
    throw new Error("Image must be a JPG, PNG, WEBP, or GIF file.");
  }

  const offersDir = path.join(process.cwd(), "public", "offers");
  await mkdir(offersDir, { recursive: true });

  const filename = `${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(offersDir, filename), buffer);

  return `/offers/${filename}`;
}

async function readOfferFields(formData: FormData) {
  const imageFile = formData.get("imageFile");
  let image_path = String(formData.get("imagePath") ?? "").trim() || null;

  if (imageFile instanceof File && imageFile.size > 0) {
    image_path = await saveUploadedOfferImage(imageFile);
  }

  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    emoji: String(formData.get("emoji") ?? "🍽️").trim() || "🍽️",
    image_path,
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

const MISSING_IMAGE_COLUMN_HINT =
  "Your database doesn't have the image_path column yet — run supabase/add-offer-image-path.sql in the Supabase SQL Editor, then try again.";

function isMissingImagePathColumn(error: { code?: string; message?: string } | null): boolean {
  return !!error && (error.code === "42703" || /image_path/.test(error.message ?? ""));
}

export async function createOffer(
  _prevState: OfferFormState,
  formData: FormData
): Promise<OfferFormState> {
  const supabase = await requireUser();

  let fields: Awaited<ReturnType<typeof readOfferFields>>;
  try {
    fields = await readOfferFields(formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save the uploaded image." };
  }

  if (!fields.title || !fields.original_price || !fields.discounted_price) {
    return { error: "Title, original price, and discounted price are required." };
  }

  const { error } = await supabase.from("offers").insert(fields);
  if (error) {
    if (isMissingImagePathColumn(error)) {
      if (fields.image_path) {
        return { error: MISSING_IMAGE_COLUMN_HINT };
      }
      const { image_path: _unused, ...withoutImage } = fields;
      const retry = await supabase.from("offers").insert(withoutImage);
      if (retry.error) {
        return { error: retry.error.message };
      }
      revalidatePublicPages();
      redirect("/admin");
    }
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

  let fields: Awaited<ReturnType<typeof readOfferFields>>;
  try {
    fields = await readOfferFields(formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save the uploaded image." };
  }

  if (!fields.title || !fields.original_price || !fields.discounted_price) {
    return { error: "Title, original price, and discounted price are required." };
  }

  const { error } = await supabase.from("offers").update(fields).eq("id", offerId);
  if (error) {
    if (isMissingImagePathColumn(error)) {
      if (fields.image_path) {
        return { error: MISSING_IMAGE_COLUMN_HINT };
      }
      const { image_path: _unused, ...withoutImage } = fields;
      const retry = await supabase.from("offers").update(withoutImage).eq("id", offerId);
      if (retry.error) {
        return { error: retry.error.message };
      }
      revalidatePublicPages();
      redirect("/admin");
    }
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
