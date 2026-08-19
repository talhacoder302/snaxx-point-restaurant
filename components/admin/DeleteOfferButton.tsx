"use client";

import { deleteOffer } from "@/app/admin/(dashboard)/offers/actions";

export default function DeleteOfferButton({
  offerId,
  offerTitle,
}: {
  offerId: string;
  offerTitle: string;
}) {
  return (
    <form
      action={deleteOffer}
      onSubmit={(event) => {
        if (!confirm(`Delete "${offerTitle}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="offerId" value={offerId} />
      <button
        type="submit"
        className="rounded-[8px] border border-flame/30 bg-flame/[0.08] px-3 py-1.5 text-[12.5px] font-semibold text-flame transition-colors hover:bg-flame/[0.15]"
      >
        Delete
      </button>
    </form>
  );
}
