import { createClient } from "@/lib/supabase/server";

export type Offer = {
  id: string;
  title: string;
  description: string;
  /** Emoji used as the food visual (fallback when imagePath is not set). */
  emoji: string;
  /** Path to an image in public/offers, e.g. "/offers/chicken-dabo.jpg". Takes priority over emoji when set. */
  imagePath: string | null;
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
  image_path: string | null;
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
    imagePath: row.image_path ?? null,
    originalPrice: row.original_price,
    discountedPrice: row.discounted_price,
    discountBadge: row.discount_badge,
    featured: row.featured,
    ctaLabel: row.cta_label,
  };
}

const COLUMNS_WITH_IMAGE =
  "id, title, description, emoji, image_path, original_price, discounted_price, discount_badge, featured, cta_label";
const COLUMNS_WITHOUT_IMAGE =
  "id, title, description, emoji, original_price, discounted_price, discount_badge, featured, cta_label";

type SupabaseErrorLike = { code?: string; message: string } | null;

/** Awaits a Supabase query and casts its (loosely-typed) result to T in one place. */
async function runQuery<T>(
  queryPromise: PromiseLike<{ data: unknown; error: SupabaseErrorLike }>
): Promise<{ data: T | null; error: SupabaseErrorLike }> {
  const { data, error } = await queryPromise;
  return { data: data as T | null, error };
}

/**
 * True when the error is Postgres's "undefined column" for image_path —
 * meaning the `alter table ... add column image_path` migration
 * (supabase/add-offer-image-path.sql) hasn't been run against this database
 * yet. Lets callers fall back to emoji-only offers instead of breaking.
 */
function isMissingImagePathColumn(error: SupabaseErrorLike): boolean {
  return !!error && (error.code === "42703" || /image_path/.test(error.message ?? ""));
}

/** Fetches all offers from Supabase, ordered for display. */
export async function getOffers(): Promise<Offer[]> {
  const supabase = await createClient();

  let { data, error } = await runQuery<OfferRow[]>(
    supabase.from("offers").select(COLUMNS_WITH_IMAGE).order("sort_order", { ascending: true })
  );

  if (error && isMissingImagePathColumn(error)) {
    console.warn(
      "offers.image_path column not found — showing emoji-only offers until supabase/add-offer-image-path.sql is run."
    );
    ({ data, error } = await runQuery<OfferRow[]>(
      supabase.from("offers").select(COLUMNS_WITHOUT_IMAGE).order("sort_order", { ascending: true })
    ));
  }

  if (error) {
    console.error("Failed to fetch offers:", error.message);
    return [];
  }

  return (data ?? []).map(mapRow);
}

/** Fetches a single offer by id, or null if it doesn't exist. */
export async function getOfferById(id: string): Promise<Offer | null> {
  const supabase = await createClient();

  let { data, error } = await runQuery<OfferRow>(
    supabase.from("offers").select(COLUMNS_WITH_IMAGE).eq("id", id).maybeSingle()
  );

  if (error && isMissingImagePathColumn(error)) {
    ({ data, error } = await runQuery<OfferRow>(
      supabase.from("offers").select(COLUMNS_WITHOUT_IMAGE).eq("id", id).maybeSingle()
    ));
  }

  if (error || !data) {
    return null;
  }

  return mapRow(data);
}
