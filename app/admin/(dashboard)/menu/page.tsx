import Link from "next/link";
import { getMenuCategories } from "@/lib/menu";
import MenuCategoryAccordion from "@/components/admin/MenuCategoryAccordion";
import { deleteCategory, deleteItem } from "./actions";

export default async function AdminMenuPage() {
  const categories = await getMenuCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-white">Products</h1>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/menu/items/new"
            className="rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13px] font-semibold text-white/85 transition-colors hover:border-ember/40"
          >
            + Add Product
          </Link>
          <Link
            href="/admin/menu/categories/new"
            className="rounded-[10px] bg-gradient-to-br from-ember-light to-ember-dark px-4 py-2.5 text-[13px] font-bold text-white"
          >
            + Add Category
          </Link>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="mt-8 text-[14px] text-smoke">
          No categories yet. Add your first one above.
        </p>
      ) : (
        <MenuCategoryAccordion
          categories={categories}
          deleteCategory={deleteCategory}
          deleteItem={deleteItem}
        />
      )}
    </div>
  );
}
