import { createClient } from "@/lib/supabase/server";

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: string;
  /** Path to an image in Supabase Storage, e.g. a menu-item-images public URL. */
  imagePath: string | null;
  available: boolean;
  sortOrder: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  sortOrder: number;
  items: MenuItem[];
};

type MenuItemRow = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: string;
  image_path: string | null;
  available: boolean;
  sort_order: number;
};

type MenuCategoryRow = {
  id: string;
  name: string;
  sort_order: number;
};

function mapItemRow(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: row.price,
    imagePath: row.image_path,
    available: row.available,
    sortOrder: row.sort_order,
  };
}

const CATEGORY_COLUMNS_WITH_ITEMS =
  "id, name, sort_order, menu_items(id, category_id, name, description, price, image_path, available, sort_order)";

/** Fetches all categories with their items, ordered for display. */
export async function getMenuCategories(): Promise<MenuCategory[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("menu_categories")
    .select(CATEGORY_COLUMNS_WITH_ITEMS)
    .order("sort_order", { ascending: true })
    .order("sort_order", { ascending: true, referencedTable: "menu_items" });

  if (error) {
    console.error("Failed to fetch menu categories:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as (MenuCategoryRow & { menu_items: MenuItemRow[] })[]).map(
    (row) => ({
      id: row.id,
      name: row.name,
      sortOrder: row.sort_order,
      items: (row.menu_items ?? []).map(mapItemRow),
    })
  );
}

/** Fetches a single category (without items), or null if it doesn't exist. */
export async function getCategoryById(id: string): Promise<{ id: string; name: string; sortOrder: number } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("menu_categories")
    .select("id, name, sort_order")
    .eq("id", id)
    .maybeSingle<MenuCategoryRow>();

  if (error || !data) {
    return null;
  }

  return { id: data.id, name: data.name, sortOrder: data.sort_order };
}

/** Fetches a single menu item by id, or null if it doesn't exist. */
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("id, category_id, name, description, price, image_path, available, sort_order")
    .eq("id", id)
    .maybeSingle<MenuItemRow>();

  if (error || !data) {
    return null;
  }

  return mapItemRow(data);
}
