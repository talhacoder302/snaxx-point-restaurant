"use client";

import { useActionState, useState } from "react";
import type { MenuCategory, MenuItem } from "@/lib/menu";
import type { MenuFormState } from "@/app/admin/(dashboard)/menu/actions";

type MenuItemFormProps = {
  action: (state: MenuFormState, formData: FormData) => Promise<MenuFormState>;
  categories: MenuCategory[];
  item?: MenuItem;
  submitLabel: string;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-white/80">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputClasses =
  "w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none focus:border-ember/50";

export default function MenuItemForm({ action, categories, item, submitLabel }: MenuItemFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [preview, setPreview] = useState<string | null>(item?.imagePath ?? null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : item?.imagePath ?? null);
  };

  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-5">
      <Field label="Category">
        <select
          name="categoryId"
          defaultValue={item?.categoryId}
          required
          className={inputClasses}
        >
          <option value="" disabled>
            Select a category…
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Name">
        <input
          name="name"
          defaultValue={item?.name}
          placeholder="Mango Shake"
          required
          className={inputClasses}
        />
      </Field>

      <Field label="Description (optional)">
        <textarea
          name="description"
          defaultValue={item?.description ?? ""}
          rows={2}
          className={inputClasses}
        />
      </Field>

      <Field label="Price">
        <input
          name="price"
          defaultValue={item?.price}
          placeholder="Rs. 399"
          required
          className={`${inputClasses} max-w-[180px]`}
        />
      </Field>

      <Field label="Image (optional)">
        <div className="flex items-center gap-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-only preview, arbitrary uploaded/local paths
            <img
              src={preview}
              alt="Item preview"
              className="h-16 w-16 shrink-0 rounded-[10px] border border-white/10 object-cover"
            />
          ) : (
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[10px] border border-dashed border-white/15 text-2xl">
              🍽️
            </div>
          )}

          <input
            type="file"
            name="imageFile"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileChange}
            className="block w-full text-[13px] text-white/70 file:mr-3 file:rounded-[8px] file:border-0 file:bg-ember file:px-3.5 file:py-2 file:text-[13px] file:font-semibold file:text-white hover:file:bg-ember-dark"
          />
        </div>

        <details className="mt-3 text-[12px] text-white/50">
          <summary className="cursor-pointer select-none text-white/60 hover:text-white/80">
            Or paste an image URL directly
          </summary>
          <input
            name="imagePath"
            defaultValue={item?.imagePath ?? ""}
            placeholder="https://..."
            className={`${inputClasses} mt-2`}
          />
          <p className="mt-1.5">Ignored if you choose a file above.</p>
        </details>
      </Field>

      <label className="flex items-center gap-2.5 text-[13px] font-semibold text-white/80">
        <input
          type="checkbox"
          name="available"
          defaultChecked={item?.available ?? true}
          className="h-4 w-4 rounded border-white/20 bg-white/[0.04] accent-ember"
        />
        Available
      </label>

      <Field label="Sort Order (lower shows first)">
        <input
          name="sortOrder"
          type="number"
          defaultValue={item?.sortOrder ?? 0}
          className={`${inputClasses} max-w-[140px]`}
        />
      </Field>

      {state?.error && <p className="text-[13px] text-flame">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-[10px] bg-gradient-to-br from-ember-light to-ember-dark px-5 py-2.5 text-sm font-bold text-white transition-opacity disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
