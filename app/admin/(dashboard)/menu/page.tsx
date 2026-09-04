import Link from "next/link";
import { getMenuCategories } from "@/lib/menu";
import DeleteMenuButton from "@/components/admin/DeleteMenuButton";
import { deleteCategory, deleteItem } from "./actions";

export default async function AdminMenuPage() {
  const categories = await getMenuCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-white">Menu</h1>
        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/menu/items/new"
            className="rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-2.5 text-[13px] font-semibold text-white/85 transition-colors hover:border-ember/40"
          >
            + Add Item
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
        <div className="mt-8 space-y-8">
          {categories.map((category) => (
            <div key={category.id} className="overflow-hidden rounded-[16px] border border-white/[0.08]">
              <div className="flex items-center justify-between bg-white/[0.03] px-4 py-3">
                <h2 className="text-[15px] font-bold text-white">{category.name}</h2>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/menu/categories/${category.id}/edit`}
                    className="rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-semibold text-white/85 transition-colors hover:border-ember/40"
                  >
                    Edit
                  </Link>
                  <DeleteMenuButton
                    action={deleteCategory}
                    hiddenFieldName="categoryId"
                    hiddenFieldValue={category.id}
                    confirmMessage={`Delete "${category.name}" and all its items? This cannot be undone.`}
                  />
                </div>
              </div>

              {category.items.length === 0 ? (
                <p className="px-4 py-4 text-[13.5px] text-smoke">No items in this category yet.</p>
              ) : (
                <table className="w-full text-left text-[13.5px]">
                  <thead className="text-[12px] uppercase tracking-wide text-smoke">
                    <tr>
                      <th className="px-4 py-2.5">Item</th>
                      <th className="px-4 py-2.5">Price</th>
                      <th className="px-4 py-2.5">Available</th>
                      <th className="px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item) => (
                      <tr key={item.id} className="border-t border-white/[0.06]">
                        <td className="px-4 py-3 text-white">{item.name}</td>
                        <td className="px-4 py-3 text-ember">{item.price}</td>
                        <td className="px-4 py-3 text-smoke">{item.available ? "Yes" : "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/menu/items/${item.id}/edit`}
                              className="rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-semibold text-white/85 transition-colors hover:border-ember/40"
                            >
                              Edit
                            </Link>
                            <DeleteMenuButton
                              action={deleteItem}
                              hiddenFieldName="itemId"
                              hiddenFieldValue={item.id}
                              confirmMessage={`Delete "${item.name}"? This cannot be undone.`}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
