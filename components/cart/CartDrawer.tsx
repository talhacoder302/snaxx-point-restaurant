"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  MAX_QUANTITY,
  clearCart,
  removeFromCart,
  setCartQuantity,
  useCart,
  type CartItem,
} from "@/lib/cart";
import { formatPrice, parsePrice } from "@/lib/price";
import { buildWhatsAppCartLink } from "@/lib/whatsapp";
import CartIcon from "../icons/CartIcon";
import CloseIcon from "../icons/CloseIcon";
import MinusIcon from "../icons/MinusIcon";
import PlusIcon from "../icons/PlusIcon";
import WhatsAppIcon from "../icons/WhatsAppIcon";
import { useCartUI } from "./CartProvider";

/** Sum of price × quantity, or null if any item's price isn't a single number. */
function computeTotal(items: CartItem[]): number | null {
  let total = 0;
  for (const item of items) {
    const unitPrice = parsePrice(item.price);
    if (unitPrice === null) return null;
    total += unitPrice * item.quantity;
  }
  return total;
}

export default function CartDrawer() {
  const { items, totalQuantity } = useCart();
  const total = computeTotal(items);
  const { isOpen, closeCart } = useCartUI();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock page scroll, close on Escape, and move focus into the drawer while open.
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  return (
    <div
      className={`fixed inset-0 z-[70] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your order"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.15)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between gap-4 border-b border-ink/[0.07] px-5 py-4 sm:px-6">
          <h2 className="font-display text-xl font-black text-ink">
            Your Order
            {totalQuantity > 0 && (
              <span className="ml-2 text-[13px] font-semibold text-smoke">
                {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
              </span>
            )}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 text-ink/70 transition-colors hover:border-ember/35 hover:text-ember"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-ember/[0.08] text-ember">
              <CartIcon className="h-8 w-8" />
            </span>
            <h3 className="mt-5 font-display text-xl font-black text-ink">Your cart is empty</h3>
            <p className="mt-2 max-w-[260px] text-[14px] leading-[1.7] text-smoke">
              Add your favourites from the menu and send the whole order to us on WhatsApp.
            </p>
            <Link
              href="/menu"
              onClick={closeCart}
              className="mt-6 rounded-full bg-ember px-6 py-3 text-[13px] font-bold text-white shadow-[0_10px_25px_rgba(228,0,43,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ember-dark"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-ink/[0.07] overflow-y-auto px-5 sm:px-6">
              {items.map((item) => {
                const unitPrice = parsePrice(item.price);

                return (
                  <li key={item.key} className="flex items-start gap-3 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-[14.5px] font-bold leading-snug text-ink">{item.name}</p>
                      {unitPrice !== null && item.quantity > 1 && (
                        <p className="mt-0.5 text-[12.5px] text-smoke">
                          {formatPrice(unitPrice)} each
                        </p>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        className="mt-1 text-[12px] font-semibold text-smoke underline-offset-2 transition-colors hover:text-ember hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <div className="flex items-center gap-1 rounded-full border border-ink/10 p-1">
                        <button
                          type="button"
                          onClick={() => setCartQuantity(item.key, item.quantity - 1)}
                          aria-label={`Decrease quantity of ${item.name}`}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ember/[0.08] hover:text-ember"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span
                          className="min-w-6 text-center text-[14px] font-bold tabular-nums text-ink"
                          aria-label={`Quantity ${item.quantity}`}
                        >
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCartQuantity(item.key, item.quantity + 1)}
                          disabled={item.quantity >= MAX_QUANTITY}
                          aria-label={`Increase quantity of ${item.name}`}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink/70 transition-colors hover:bg-ember/[0.08] hover:text-ember disabled:opacity-40"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {unitPrice !== null ? (
                        <span className="text-[14.5px] font-black tabular-nums text-gradient">
                          {formatPrice(unitPrice * item.quantity)}
                        </span>
                      ) : (
                        item.price && (
                          <span className="text-[13px] font-semibold text-smoke">{item.price}</span>
                        )
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="space-y-3 border-t border-ink/[0.07] px-5 py-5 sm:px-6">
              {total !== null && (
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[14px] font-semibold text-smoke">Total</span>
                  <span className="text-[22px] font-black tabular-nums text-gradient">
                    {formatPrice(total)}
                  </span>
                </div>
              )}
              <a
                href={buildWhatsAppCartLink(items)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-[50px] items-center justify-center gap-2.5 rounded-[14px] bg-ember px-5 text-[14px] font-bold text-white shadow-[0_12px_30px_rgba(228,0,43,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ember-dark"
              >
                <WhatsAppIcon circle className="h-4 w-4" circleClassName="h-7 w-7" />
                Send Order on WhatsApp
              </a>
              <button
                type="button"
                onClick={clearCart}
                className="w-full text-center text-[12.5px] font-semibold text-smoke transition-colors hover:text-ember"
              >
                Clear cart
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
