/**
 * Offer data for Snaxx Point Restaurant.
 *
 * This file is intentionally isolated so it can be replaced with
 * WordPress / CMS data later. Keep the shape stable — the Offers page
 * renders whatever this array contains.
 */

export type Offer = {
  id: string;
  title: string;
  description: string;
  /** Emoji used as the food visual placeholder. Swap for a real image URL later. */
  emoji: string;
  originalPrice: string;
  discountedPrice: string;
  discountBadge: string;
  /** Featured offers get a larger, highlighted card. */
  featured?: boolean;
  ctaLabel: string;
};

export const offers: Offer[] = [
  {
    id: "chicken-dabo",
    title: "Chicken Dabo",
    description: "250 grams of juicy, flavour-packed chicken — a hearty bite at an unbeatable price.",
    emoji: "🍗",
    originalPrice: "PKR 500",
    discountedPrice: "PKR 499",
    discountBadge: "Save PKR 1",
    featured: true,
    ctaLabel: "Order Now",
  },
  {
    id: "pizza-deal-1-2",
    title: "Pizza Deal 1 & 2",
    description: "Deal 1: PKR 699 · Deal 2: PKR 1,399 — cheesy, loaded pizzas for every craving.",
    emoji: "🍕",
    originalPrice: "PKR 700",
    discountedPrice: "PKR 699",
    discountBadge: "Save PKR 1",
    ctaLabel: "Order Now",
  },
  {
    id: "makhni-chicken-karahi",
    title: "Makhni Chicken Karahi",
    description: "Half: PKR 1,499 · Full: PKR 2,949 — rich, creamy makhni karahi made to share.",
    emoji: "🍛",
    originalPrice: "PKR 1,500",
    discountedPrice: "PKR 1,499",
    discountBadge: "Save PKR 1",
    ctaLabel: "Order Now",
  },
  {
    id: "banana-shake",
    title: "Banana Shake",
    description: "Thick, creamy and refreshing — the perfect sweet treat to cool you down.",
    emoji: "🥤",
    originalPrice: "PKR 300",
    discountedPrice: "PKR 299",
    discountBadge: "Save PKR 1",
    ctaLabel: "Order Now",
  },
  {
    id: "zinger-wrap",
    title: "Zinger Wrap",
    description: "Crispy zinger, fresh veggies and our signature sauce — wrapped up and ready to go.",
    emoji: "🌯",
    originalPrice: "PKR 480",
    discountedPrice: "PKR 479",
    discountBadge: "Save PKR 1",
    ctaLabel: "Order Now",
  },
  {
    id: "malai-boti-pizza",
    title: "Malai Boti Pizza",
    description: "Tender malai boti on a cheesy, loaded pizza — a flavour combination you'll love.",
    emoji: "🍕",
    originalPrice: "PKR 1,750",
    discountedPrice: "PKR 1,749",
    discountBadge: "Save PKR 1",
    ctaLabel: "Order Now",
  },
  {
    id: "chicken-corn-soup",
    title: "Chicken Corn Soup",
    description: "Half: PKR 379 · Full: PKR 1,299 — warm, comforting and full of flavour.",
    emoji: "🍲",
    originalPrice: "PKR 1,300",
    discountedPrice: "PKR 1,299",
    discountBadge: "Save PKR 1",
    ctaLabel: "Order Now",
  },
  {
    id: "chicken-black-pepper",
    title: "Chicken Black Pepper",
    description: "Bold black pepper flavours with tender chicken — a classic done right.",
    emoji: "🍗",
    originalPrice: "PKR 1,100",
    discountedPrice: "PKR 1,099",
    discountBadge: "Save PKR 1",
    ctaLabel: "Order Now",
  },
  {
    id: "hot-sour-soup",
    title: "Hot & Sour Soup",
    description: "Half: PKR 419 · Full: PKR 1,399 — tangy, spicy and absolutely satisfying.",
    emoji: "🍜",
    originalPrice: "PKR 1,400",
    discountedPrice: "PKR 1,399",
    discountBadge: "Save PKR 1",
    ctaLabel: "Order Now",
  },
];