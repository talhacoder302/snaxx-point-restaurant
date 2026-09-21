"use client";

import { useCart } from "@/lib/cart";
import CartIcon from "../icons/CartIcon";
import { useCartUI } from "./CartProvider";

/** Navbar button that opens the cart drawer and shows how many items are in it. */
export default function CartButton() {
  const { totalQuantity } = useCart();
  const { openCart } = useCartUI();

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={
        totalQuantity > 0 ? `Open cart, ${totalQuantity} items` : "Open cart, empty"
      }
      className="relative grid h-11 w-11 place-items-center rounded-xl border border-ink/10 bg-white text-ink transition-colors hover:border-ember/40 hover:text-ember"
    >
      <CartIcon className="h-5 w-5" />
      {totalQuantity > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ember px-1 text-[11px] font-bold leading-none text-white"
        >
          {totalQuantity}
        </span>
      )}
    </button>
  );
}
