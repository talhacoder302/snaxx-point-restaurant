"use client";

import Link from "next/link";
import { useState } from "react";
import type { MenuCategory } from "@/lib/menu";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import DeleteMenuButton from "./DeleteMenuButton";

type MenuCategoryAccordionProps = {
  categories: MenuCategory[];
  deleteCategory: (formData: FormData) => Promise<void>;
  deleteItem: (formData: FormData) => Promise<void>;
};

export default function MenuCategoryAccordion({
  categories,
  deleteCategory,
  deleteItem,
}: MenuCategoryAccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(categories[0] ? [categories[0].id] : [])
  );

  const toggle = (id: string) => {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="mt-8 space-y-4">
      {categories.map((category) => {
        const isOpen = openIds.has(category.id);

        return (
          <div
            key={category.id}
            className="overflow-hidden rounded-[16px] border border-white/[0.08]"
          >
            <div className="flex items-center justify-between gap-3 bg-white/[0.03] px-4 py-3">
              <button
                type="button"
                onClick={() => toggle(category.id)}
                aria-expanded={isOpen}
                className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
              >
                <span
                  aria-hidden="true"
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/10 text-white/50 transition-transform duration-300 ${
                    isOpen ? "rotate-180 border-ember/30 text-ember" : ""
                  }`}
                >
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </span>
                <h2 className="truncate text-[15px] font-bold text-white">{category.name}</h2>
                <span className="shrink-0 text-[12.5px] font-semibold text-smoke">
                  {category.items.length} {category.items.length === 1 ? "product" : "products"}
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-2">
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
                  confirmMessage={`Delete "${category.name}" and all its products? This cannot be undone.`}
                />
              </div>
            </div>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                {category.items.length === 0 ? (
                  <p className="px-4 py-4 text-[13.5px] text-smoke">
                    No products in this category yet.
                  </p>
                ) : (
                  <table className="w-full text-left text-[13.5px]">
                    <thead className="text-[12px] uppercase tracking-wide text-smoke">
                      <tr>
                        <th className="px-4 py-2.5">Product</th>
                        <th className="px-4 py-2.5">Price</th>
                        <th className="px-4 py-2.5">Available</th>
                        <th className="px-4 py-2.5">Featured</th>
                        <th className="px-4 py-2.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item) => (
                        <tr key={item.id} className="border-t border-white/[0.06]">
                          <td className="px-4 py-3 text-white">{item.name}</td>
                          <td className="px-4 py-3 text-ember">{item.price}</td>
                          <td className="px-4 py-3 text-smoke">{item.available ? "Yes" : "—"}</td>
                          <td className="px-4 py-3 text-smoke">{item.featured ? "Yes" : "—"}</td>
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
