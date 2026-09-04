import MenuItemForm from "@/components/admin/MenuItemForm";
import { getMenuCategories } from "@/lib/menu";
import { createItem } from "../../actions";

export default async function NewMenuItemPage() {
  const categories = await getMenuCategories();

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-white">Add Item</h1>
      {categories.length === 0 ? (
        <p className="mt-8 text-[14px] text-smoke">
          Add a category first before adding items.
        </p>
      ) : (
        <MenuItemForm action={createItem} categories={categories} submitLabel="Create Item" />
      )}
    </div>
  );
}
