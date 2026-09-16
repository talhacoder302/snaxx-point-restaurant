"use client";

import { useActionState, useState } from "react";
import type { MenuFormState } from "@/app/admin/(dashboard)/menu/actions";

type CategoryFormProps = {
  action: (state: MenuFormState, formData: FormData) => Promise<MenuFormState>;
  category?: { name: string; sortOrder: number; showOnHome?: boolean; bannerImagePath?: string | null };
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

export default function CategoryForm({ action, category, submitLabel }: CategoryFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [preview, setPreview] = useState<string | null>(category?.bannerImagePath ?? null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : category?.bannerImagePath ?? null);
  };

  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-5">
      <Field label="Name">
        <input
          name="name"
          defaultValue={category?.name}
          placeholder="Shakes"
          required
          className={inputClasses}
        />
      </Field>

      <Field label="Sort Order (lower shows first)">
        <input
          name="sortOrder"
          type="number"
          defaultValue={category?.sortOrder ?? 0}
          className={`${inputClasses} max-w-[140px]`}
        />
      </Field>

      <Field label="Banner Image (optional — shown behind the category name in its home page slider)">
        <div className="flex items-center gap-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-only preview, arbitrary uploaded/local paths
            <img
              src={preview}
              alt="Banner preview"
              className="h-16 w-28 shrink-0 rounded-[10px] border border-white/10 object-cover"
            />
          ) : (
            <div className="grid h-16 w-28 shrink-0 place-items-center rounded-[10px] border border-dashed border-white/15 text-2xl">
              🖼️
            </div>
          )}

          <input
            type="file"
            name="bannerImageFile"
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
            name="bannerImagePath"
            defaultValue={category?.bannerImagePath ?? ""}
            placeholder="https://..."
            className={`${inputClasses} mt-2`}
          />
          <p className="mt-1.5">Ignored if you choose a file above.</p>
        </details>
      </Field>

      <label className="flex items-center gap-2.5 text-[13px] font-semibold text-white/80">
        <input
          type="checkbox"
          name="showOnHome"
          defaultChecked={category?.showOnHome ?? true}
          className="h-4 w-4 rounded border-white/20 bg-white/[0.04] accent-ember"
        />
        Show on Home Page (as its own slider section)
      </label>

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
