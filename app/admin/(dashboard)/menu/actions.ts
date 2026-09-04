"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type MenuFormState = { error?: string } | undefined;

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

const MENU_ITEM_IMAGES_BUCKET = "menu-item-images";
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
 * Uploads a menu item image to Supabase Storage (not the app's own disk) so
 * it survives every redeploy, and returns its public URL. Throws with a
 * user-facing message on invalid input — the generated filename never comes
 * from the client, so there's no path-traversal or filename-collision risk.
 */
async function saveUploadedItemImage(
  supabase: SupabaseServerClient,
  file: File
): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image must be smaller than 5MB.");
  }

  const extension = IMAGE_EXTENSIONS[file.type];
  if (!extension) {
    throw new Error("Image must be a JPG, PNG, WEBP, or GIF file.");
  }

  const filename = `${randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from(MENU_ITEM_IMAGES_BUCKET)
    .upload(filename, file, { contentType: file.type });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  return supabase.storage.from(MENU_ITEM_IMAGES_BUCKET).getPublicUrl(filename).data.publicUrl;
}

function revalidatePublicPages() {
  revalidatePath("/menu");
  revalidatePath("/");
}

// ---------- Categories ----------

export async function createCategory(
  _prevState: MenuFormState,
  formData: FormData
): Promise<MenuFormState> {
  const supabase = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;

  if (!name) {
    return { error: "Category name is required." };
  }

  const { error } = await supabase
    .from("menu_categories")
    .insert({ name, sort_order: sortOrder });

  if (error) {
    return { error: error.message };
  }

  revalidatePublicPages();
  redirect("/admin/menu");
}

export async function updateCategory(
  categoryId: string,
  _prevState: MenuFormState,
  formData: FormData
): Promise<MenuFormState> {
  const supabase = await requireUser();

  const name = String(formData.get("name") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0) || 0;

  if (!name) {
    return { error: "Category name is required." };
  }

  const { error } = await supabase
    .from("menu_categories")
    .update({ name, sort_order: sortOrder })
    .eq("id", categoryId);

  if (error) {
    return { error: error.message };
  }

  revalidatePublicPages();
  redirect("/admin/menu");
}

export async function deleteCategory(formData: FormData) {
  const supabase = await requireUser();
  const categoryId = String(formData.get("categoryId") ?? "");

  if (!categoryId) {
    throw new Error("Missing category id.");
  }

  const { error } = await supabase.from("menu_categories").delete().eq("id", categoryId);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePublicPages();
}

// ---------- Items ----------

async function readItemFields(supabase: SupabaseServerClient, formData: FormData) {
  const imageFile = formData.get("imageFile");
  let image_path = String(formData.get("imagePath") ?? "").trim() || null;

  if (imageFile instanceof File && imageFile.size > 0) {
    image_path = await saveUploadedItemImage(supabase, imageFile);
  }

  return {
    category_id: String(formData.get("categoryId") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    price: String(formData.get("price") ?? "").trim(),
    image_path,
    available: formData.get("available") === "on",
    sort_order: Number(formData.get("sortOrder") ?? 0) || 0,
  };
}

export async function createItem(
  _prevState: MenuFormState,
  formData: FormData
): Promise<MenuFormState> {
  const supabase = await requireUser();

  let fields: Awaited<ReturnType<typeof readItemFields>>;
  try {
    fields = await readItemFields(supabase, formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save the uploaded image." };
  }

  if (!fields.category_id || !fields.name || !fields.price) {
    return { error: "Category, name, and price are required." };
  }

  const { error } = await supabase.from("menu_items").insert(fields);
  if (error) {
    return { error: error.message };
  }

  revalidatePublicPages();
  redirect("/admin/menu");
}

export async function updateItem(
  itemId: string,
  _prevState: MenuFormState,
  formData: FormData
): Promise<MenuFormState> {
  const supabase = await requireUser();

  let fields: Awaited<ReturnType<typeof readItemFields>>;
  try {
    fields = await readItemFields(supabase, formData);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to save the uploaded image." };
  }

  if (!fields.category_id || !fields.name || !fields.price) {
    return { error: "Category, name, and price are required." };
  }

  const { error } = await supabase.from("menu_items").update(fields).eq("id", itemId);
  if (error) {
    return { error: error.message };
  }

  revalidatePublicPages();
  redirect("/admin/menu");
}

export async function deleteItem(formData: FormData) {
  const supabase = await requireUser();
  const itemId = String(formData.get("itemId") ?? "");

  if (!itemId) {
    throw new Error("Missing item id.");
  }

  const { error } = await supabase.from("menu_items").delete().eq("id", itemId);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePublicPages();
}
