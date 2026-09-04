import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/lib/menu";
import { updateCategory } from "../../../actions";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-white">Edit Category</h1>
      <CategoryForm
        action={updateCategory.bind(null, id)}
        category={category}
        submitLabel="Save Changes"
      />
    </div>
  );
}
