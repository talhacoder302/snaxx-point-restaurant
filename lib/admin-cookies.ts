/**
 * Admin display preferences stored in cookies, so the server renders the
 * right version straight away. Shared by the server (reads them) and the
 * client toggles (write them) — keep free of server-only imports.
 */
export type AdminTheme = "light" | "dark";
export const ADMIN_THEME_COOKIE = "admin-theme";

export type OrdersView = "cards" | "list";
export const ORDERS_VIEW_COOKIE = "admin-orders-view";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Writes an admin preference cookie from the browser. */
export function setAdminCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/admin; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}
