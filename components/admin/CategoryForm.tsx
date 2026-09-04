"use client";

import { useActionState } from "react";
import type { MenuFormState } from "@/app/admin/(dashboard)/menu/actions";

type CategoryFormProps = {
  action: (state: MenuFormState, formData: FormData) => Promise<MenuFormState>;
  category?: { name: string; sortOrder: number };
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
