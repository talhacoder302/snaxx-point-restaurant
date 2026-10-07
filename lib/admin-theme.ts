import { cookies } from "next/headers";
import { ADMIN_THEME_COOKIE, type AdminTheme } from "./admin-theme-cookie";

/** The admin's chosen theme — light unless they've switched to dark. Read on the server so pages render in the right mode with no flash. */
export async function getAdminTheme(): Promise<AdminTheme> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_THEME_COOKIE)?.value === "dark" ? "dark" : "light";
}
