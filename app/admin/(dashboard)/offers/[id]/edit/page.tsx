import { notFound } from "next/navigation";
import OfferForm from "@/components/admin/OfferForm";
import { getOfferById } from "@/lib/offers";
import { updateOffer } from "../../actions";

export default async function EditOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOfferById(id);

  if (!offer) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-black text-white">Edit Offer</h1>
      <OfferForm
        action={updateOffer.bind(null, id)}
        offer={offer}
        submitLabel="Save Changes"
      />
    </div>
  );
}
