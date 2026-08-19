import OfferForm from "@/components/admin/OfferForm";
import { createOffer } from "../actions";

export default function NewOfferPage() {
  return (
    <div>
      <h1 className="font-display text-2xl font-black text-white">Add Offer</h1>
      <OfferForm action={createOffer} submitLabel="Create Offer" />
    </div>
  );
}
