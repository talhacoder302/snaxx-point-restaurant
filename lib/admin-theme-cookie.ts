/** Shared by the server (reads it) and the theme toggle (writes it) — keep free of server-only imports. */
export type AdminTheme = "light" | "dark";

export const ADMIN_THEME_COOKIE = "admin-theme";
