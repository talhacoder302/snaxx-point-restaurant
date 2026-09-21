"use client";

import { useEffect, useRef, useState } from "react";
import { addToCart } from "@/lib/cart";
import AddShoppingCartIcon from "../icons/AddShoppingCartIcon";
import CartIcon from "../icons/CartIcon";
import CheckIcon from "../icons/CheckIcon";

type AddToCartButtonProps = {
  /** Unique across menu items and offers, e.g. "menu:<id>" or "offer:<id>". */
  itemKey: string;
  name: string;
  /** Price text as shown on the site; kept in the cart for totals only. */
  price: string;
  /** "icon" is a round icon-only button; "pill" is a labelled button. */
  variant?: "icon" | "pill";
  className?: string;
};

const ADDED_FEEDBACK_MS = 1400;

export default function AddToCartButton({
  itemKey,
  name,
  price,
  variant = "icon",
  className = "",
}: AddToCartButtonProps) {
  const [justAdded, setJustAdded] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const handleClick = () => {
    addToCart({ key: itemKey, name, price });
    setJustAdded(true);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setJustAdded(false), ADDED_FEEDBACK_MS);
  };

  const label = justAdded ? `${name} added to cart` : `Add ${name} to cart`;

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        className={`inline-flex items-center justify-center gap-2 transition-all duration-300 ${className}`}
      >
        {justAdded ? <CheckIcon className="h-4 w-4" /> : <CartIcon className="h-4 w-4" />}
        {justAdded ? "Added" : "Add to Cart"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white shadow-[0_6px_16px_rgba(228,0,43,0.25)] transition-all duration-300 hover:scale-110 active:scale-95 ${
        justAdded ? "bg-[#1DA851]" : "bg-ember hover:bg-ember-dark"
      } ${className}`}
    >
      {justAdded ? <CheckIcon className="h-5 w-5" /> : <AddShoppingCartIcon className="h-5 w-5" />}
    </button>
  );
}
