import { cookies } from "next/headers";
import { ADMIN_THEME_COOKIE, ORDERS_VIEW_COOKIE, type AdminTheme, type OrdersView } from "./admin-cookies";

/** The admin's chosen theme — light unless they've switched to dark. Read on the server so pages render in the right mode with no flash. */
export async function getAdminTheme(): Promise<AdminTheme> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_THEME_COOKIE)?.value === "dark" ? "dark" : "light";
}

/** How the Orders page lists orders — cards unless they've switched to the compact list. */
export async function getOrdersView(): Promise<OrdersView> {
  const cookieStore = await cookies();
  return cookieStore.get(ORDERS_VIEW_COOKIE)?.value === "list" ? "list" : "cards";
}
