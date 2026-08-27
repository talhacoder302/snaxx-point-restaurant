import Link from "next/link";
import { getOffers } from "@/lib/offers";
import DeleteOfferButton from "@/components/admin/DeleteOfferButton";

export default async function AdminOffersPage() {
  const offers = await getOffers();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-black text-white">Offers</h1>
        <Link
          href="/admin/offers/new"
          className="rounded-[10px] bg-gradient-to-br from-ember-light to-ember-dark px-4 py-2.5 text-[13px] font-bold text-white"
        >
          + Add Offer
        </Link>
      </div>

      {offers.length === 0 ? (
        <p className="mt-8 text-[14px] text-smoke">
          No offers yet. Add your first one above.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-[16px] border border-white/[0.08]">
          <table className="w-full text-left text-[13.5px]">
            <thead className="bg-white/[0.03] text-[12px] uppercase tracking-wide text-smoke">
              <tr>
                <th className="px-4 py-3">Offer</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {offers.map((offer) => (
                <tr key={offer.id} className="border-t border-white/[0.06]">
                  <td className="px-4 py-3 text-white">
                    <span className="mr-2">{offer.emoji}</span>
                    {offer.title}
                  </td>
                  <td className="px-4 py-3 text-smoke">
                    <span className="line-through">{offer.originalPrice}</span>{" "}
                    <span className="text-ember">{offer.discountedPrice}</span>
                  </td>
                  <td className="px-4 py-3 text-smoke">{offer.featured ? "Yes" : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/offers/${offer.id}/edit`}
                        className="rounded-[8px] border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12.5px] font-semibold text-white/85 transition-colors hover:border-ember/40"
                      >
                        Edit
                      </Link>
                      <DeleteOfferButton offerId={offer.id} offerTitle={offer.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
