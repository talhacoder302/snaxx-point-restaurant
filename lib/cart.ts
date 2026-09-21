import { useSyncExternalStore } from "react";

export type CartItem = {
  /** Unique across menu items and offers, e.g. "menu:<id>" or "offer:<id>". */
  key: string;
  name: string;
  /** Price text as shown on the site. Used only for the cart's own totals — never sent to WhatsApp. */
  price: string;
  quantity: number;
};

const STORAGE_KEY = "snaxx-cart";
const MAX_QUANTITY = 99;
const EMPTY_CART: CartItem[] = [];

let items: CartItem[] = EMPTY_CART;
let loaded = false;
const listeners = new Set<() => void>();

type StoredCartItem = Omit<CartItem, "price"> & { price?: unknown };

function isStoredCartItem(value: unknown): value is StoredCartItem {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.key === "string" &&
    typeof item.name === "string" &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

function readFromStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_CART;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_CART;
    // Carts saved before prices were tracked have no price — keep them, with a blank price.
    const valid = parsed.filter(isStoredCartItem).map((item) => ({
      ...item,
      price: typeof item.price === "string" ? item.price : "",
    }));
    return valid.length > 0 ? valid : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function commit(next: CartItem[]) {
  items = next.length > 0 ? next : EMPTY_CART;
  try {
    if (items.length > 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage unavailable (private mode, quota) — the cart still works for this page view.
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  // Keep multiple tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    items = readFromStorage();
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): CartItem[] {
  if (!loaded) {
    loaded = true;
    items = readFromStorage();
  }
  return items;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

export function addToCart(item: { key: string; name: string; price: string }) {
  const current = getSnapshot();
  const existing = current.find((entry) => entry.key === item.key);

  if (existing) {
    commit(
      current.map((entry) =>
        entry.key === item.key
          ? { ...entry, price: item.price, quantity: Math.min(entry.quantity + 1, MAX_QUANTITY) }
          : entry
      )
    );
    return;
  }

  commit([...current, { key: item.key, name: item.name, price: item.price, quantity: 1 }]);
}

/** Sets an item's quantity; a quantity below 1 removes it. */
export function setCartQuantity(key: string, quantity: number) {
  const current = getSnapshot();

  if (quantity < 1) {
    commit(current.filter((entry) => entry.key !== key));
    return;
  }

  commit(
    current.map((entry) =>
      entry.key === key ? { ...entry, quantity: Math.min(quantity, MAX_QUANTITY) } : entry
    )
  );
}

export function removeFromCart(key: string) {
  commit(getSnapshot().filter((entry) => entry.key !== key));
}

export function clearCart() {
  commit(EMPTY_CART);
}

export function useCart() {
  const cartItems = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { items: cartItems, totalQuantity };
}

export { MAX_QUANTITY };
