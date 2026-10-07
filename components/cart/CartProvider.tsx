"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { PlacedOrder } from "@/app/orders/actions";
import CartDrawer from "./CartDrawer";

/** What the drawer is showing: the cart, the checkout form, or a just-placed order. */
export type CartView =
  | { name: "cart" }
  | { name: "checkout" }
  | { name: "placed"; order: PlacedOrder };

type CartUIContextValue = {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartUIContext = createContext<CartUIContextValue | null>(null);

export function useCartUI(): CartUIContextValue {
  const context = useContext(CartUIContext);
  if (!context) {
    throw new Error("useCartUI must be used inside <CartProvider>.");
  }
  return context;
}

/** Owns the cart drawer's open state and renders the drawer once for the whole site. */
export default function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<CartView>({ name: "cart" });

  const value = useMemo(
    () => ({
      isOpen,
      openCart: () => {
        // A confirmation is shown once; reopening starts from the (now empty) cart.
        // An unfinished checkout is kept, so the customer can pick up where they left off.
        setView((current) => (current.name === "placed" ? { name: "cart" } : current));
        setIsOpen(true);
      },
      closeCart: () => setIsOpen(false),
    }),
    [isOpen]
  );

  return (
    <CartUIContext.Provider value={value}>
      {children}
      <CartDrawer view={view} onViewChange={setView} />
    </CartUIContext.Provider>
  );
}
