"use client";

import { useActionState, useState } from "react";
import type { Offer } from "@/lib/offers";
import type { OfferFormState } from "@/app/admin/(dashboard)/offers/actions";

type OfferFormProps = {
  action: (state: OfferFormState, formData: FormData) => Promise<OfferFormState>;
  offer?: Offer;
  submitLabel: string;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-white/80">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputClasses =
  "w-full rounded-[10px] border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none focus:border-ember/50";

export default function OfferForm({ action, offer, submitLabel }: OfferFormProps) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [preview, setPreview] = useState<string | null>(offer?.imagePath ?? null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : offer?.imagePath ?? null);
  };

  return (
    <form action={formAction} className="mt-8 max-w-xl space-y-5">
      <Field label="Title">
        <input
          name="title"
          defaultValue={offer?.title}
          required
          className={inputClasses}
        />
      </Field>

      <Field label="Description">
        <textarea
          name="description"
          defaultValue={offer?.description}
          rows={3}
          required
          className={inputClasses}
        />
      </Field>

      <Field label="Emoji (used as a fallback if no image is set)">
        <input
          name="emoji"
          defaultValue={offer?.emoji ?? "🍽️"}
          className={`${inputClasses} max-w-[100px] text-center text-lg`}
        />
      </Field>

      <Field label="Image">
        <div className="flex items-center gap-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin-only preview, arbitrary uploaded/local paths
            <img
              src={preview}
              alt="Offer preview"
              className="h-16 w-16 shrink-0 rounded-[10px] border border-white/10 object-cover"
            />
          ) : (
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[10px] border border-dashed border-white/15 text-2xl">
              {offer?.emoji ?? "🍽️"}
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
            defaultValue={offer?.imagePath ?? ""}
            placeholder="https://..."
            className={`${inputClasses} mt-2`}
          />
          <p className="mt-1.5">
            Ignored if you choose a file above. Leave both blank to show the
            emoji instead.
          </p>
        </details>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Original Price">
          <input
            name="originalPrice"
            defaultValue={offer?.originalPrice}
            placeholder="PKR 500"
            required
            className={inputClasses}
          />
        </Field>

        <Field label="Discounted Price">
          <input
            name="discountedPrice"
            defaultValue={offer?.discountedPrice}
            placeholder="PKR 499"
            required
            className={inputClasses}
          />
        </Field>
      </div>

      <Field label="Discount Badge">
        <input
          name="discountBadge"
          defaultValue={offer?.discountBadge}
          placeholder="Save PKR 1"
          required
          className={inputClasses}
        />
      </Field>

      <Field label="CTA Label">
        <input
          name="ctaLabel"
          defaultValue={offer?.ctaLabel ?? "Order Now"}
          className={inputClasses}
        />
      </Field>

      <label className="flex items-center gap-2.5 text-[13px] font-semibold text-white/80">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={offer?.featured}
          className="h-4 w-4 rounded border-white/20 bg-white/[0.04] accent-ember"
        />
        Featured offer
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
