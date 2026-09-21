"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import CartDrawer from "./CartDrawer";

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

  const value = useMemo(
    () => ({
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }),
    [isOpen]
  );

  return (
    <CartUIContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartUIContext.Provider>
  );
}
