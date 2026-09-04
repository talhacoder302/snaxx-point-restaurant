import { notFound } from "next/navigation";
import MenuItemForm from "@/components/admin/MenuItemForm";
import { getMenuCategories, getMenuItemById } from "@/lib/menu";
import { updateItem } from "../../../actions";

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [item, categories] = await Promise.all([getMenuItemById(id), getMenuCategories()]);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-white">Edit Item</h1>
      <MenuItemForm
        action={updateItem.bind(null, id)}
        categories={categories}
        item={item}
        submitLabel="Save Changes"
      />
    </div>
  );
}
