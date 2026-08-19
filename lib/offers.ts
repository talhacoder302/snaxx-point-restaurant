import { createClient } from "@/lib/supabase/server";

export type Offer = {
  id: string;
  title: string;
  description: string;
  /** Emoji used as the food visual. */
  emoji: string;
  originalPrice: string;
  discountedPrice: string;
  discountBadge: string;
  /** Featured offers get a larger, highlighted card. */
  featured?: boolean;
  ctaLabel: string;
};

type OfferRow = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  original_price: string;
  discounted_price: string;
  discount_badge: string;
  featured: boolean;
  cta_label: string;
};

function mapRow(row: OfferRow): Offer {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    emoji: row.emoji,
    originalPrice: row.original_price,
    discountedPrice: row.discounted_price,
    discountBadge: row.discount_badge,
    featured: row.featured,
    ctaLabel: row.cta_label,
  };
}

/** Fetches all offers from Supabase, ordered for display. */
export async function getOffers(): Promise<Offer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("offers")
    .select(
      "id, title, description, emoji, original_price, discounted_price, discount_badge, featured, cta_label"
    )
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch offers:", error.message);
    return [];
  }

  return (data as OfferRow[]).map(mapRow);
}

/** Fetches a single offer by id, or null if it doesn't exist. */
export async function getOfferById(id: string): Promise<Offer | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("offers")
    .select(
      "id, title, description, emoji, original_price, discounted_price, discount_badge, featured, cta_label"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapRow(data as OfferRow);
}
