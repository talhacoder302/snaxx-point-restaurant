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
  /** Featured items are the ones shown in the home page's category slider. */
  featured: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  sortOrder: number;
  /** Whether this category gets its own slider section on the home page. */
  showOnHome: boolean;
  /** Path to a banner image in Supabase Storage, shown behind the category's home slider heading. */
  bannerImagePath: string | null;
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
  featured: boolean;
};

type MenuCategoryRow = {
  id: string;
  name: string;
  sort_order: number;
  show_on_home: boolean;
  banner_image_path: string | null;
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
    featured: row.featured,
  };
}

const CATEGORY_COLUMNS_WITH_ITEMS =
  "id, name, sort_order, show_on_home, banner_image_path, menu_items(id, category_id, name, description, price, image_path, available, sort_order, featured)";

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
      showOnHome: row.show_on_home,
      bannerImagePath: row.banner_image_path,
      items: (row.menu_items ?? []).map(mapItemRow),
    })
  );
}

/**
 * Fetches categories for the home page's per-category slider sections:
 * only categories marked `showOnHome`, each containing only its `featured`
 * items, and only when at least one such item exists (an empty slider isn't
 * worth a section).
 */
export async function getHomeMenuCategories(): Promise<MenuCategory[]> {
  const categories = await getMenuCategories();

  return categories
    .filter((category) => category.showOnHome)
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => item.featured && item.available),
    }))
    .filter((category) => category.items.length > 0);
}

/** Fetches a single category (without items), or null if it doesn't exist. */
export async function getCategoryById(
  id: string
): Promise<{ id: string; name: string; sortOrder: number; showOnHome: boolean; bannerImagePath: string | null } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("menu_categories")
    .select("id, name, sort_order, show_on_home, banner_image_path")
    .eq("id", id)
    .maybeSingle<MenuCategoryRow>();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    sortOrder: data.sort_order,
    showOnHome: data.show_on_home,
    bannerImagePath: data.banner_image_path,
  };
}

/** Fetches a single menu item by id, or null if it doesn't exist. */
export async function getMenuItemById(id: string): Promise<MenuItem | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("id, category_id, name, description, price, image_path, available, sort_order, featured")
    .eq("id", id)
    .maybeSingle<MenuItemRow>();

  if (error || !data) {
    return null;
  }

  return mapItemRow(data);
}
