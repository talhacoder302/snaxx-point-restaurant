"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ADMIN_THEME_COOKIE, type AdminTheme } from "@/lib/admin-theme-cookie";
import DarkModeIcon from "../icons/DarkModeIcon";
import LightModeIcon from "../icons/LightModeIcon";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Switches the admin area between light and dark, remembering the choice in a cookie. */
export default function ThemeToggle({ initialTheme }: { initialTheme: AdminTheme }) {
  const router = useRouter();
  const [theme, setTheme] = useState(initialTheme);
  const [, startTransition] = useTransition();

  const toggle = () => {
    const next: AdminTheme = theme === "dark" ? "light" : "dark";
    setTheme(next);

    document.cookie = `${ADMIN_THEME_COOKIE}=${next}; path=/admin; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
    // Switch instantly, then let the server re-render so its markup agrees.
    document.querySelector("[data-admin-theme]")?.setAttribute("data-admin-theme", next);
    startTransition(() => router.refresh());
  };

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-[10px] border border-admin-fg/10 bg-admin-field text-admin-fg/70 transition-colors hover:border-ember/40 hover:text-admin-fg"
    >
      {theme === "dark" ? <LightModeIcon className="h-[18px] w-[18px]" /> : <DarkModeIcon className="h-[18px] w-[18px]" />}
    </button>
  );
}
