import CategoryForm from "@/components/admin/CategoryForm";
import { createCategory } from "../../actions";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-black text-white">Add Category</h1>
      <CategoryForm action={createCategory} submitLabel="Create Category" />
    </div>
  );
}
