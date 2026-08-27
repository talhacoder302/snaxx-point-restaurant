"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close the mobile menu on route change (render-time state adjustment)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-ink/[0.07] bg-cream/90 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label="Snaxx Point Restaurant — Home"
        >
          <Image
            src="/snaxxpoint-logo.png"
            alt="Snaxx Point Restaurant Logo"
            width={44}
            height={44}
            className="h-11 w-11 object-contain drop-shadow-[0_8px_18px_rgba(228,0,43,0.3)] transition-transform duration-300 group-hover:scale-105"
          />
          <span className="leading-none">
            <span className="block text-[17px] font-extrabold tracking-tight text-ink">
              Snaxx Point
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[2px] text-ember">
              Restaurant
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-ember"
                      : "text-ink/70 hover:text-ink"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-ember to-transparent" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Order Now */}
        <div className="flex items-center gap-3">
          <a
            href={buildWhatsAppOrderLink("a meal")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2.5 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-[13px] font-semibold text-ink/90 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/40 hover:text-ink sm:inline-flex"
          >
            <span className="h-2 w-2 rounded-full bg-[#7dfc98] shadow-[0_0_12px_#7dfc98]" />
            Order Now
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-ink/10 bg-white text-ink backdrop-blur-md transition-colors hover:border-ember/40 md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 top-0 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                  menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rounded-full bg-current transition-all duration-200 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-current transition-all duration-300 ${
                  menuOpen
                    ? "bottom-1/2 translate-y-1/2 -rotate-45"
                    : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-b border-ink/[0.07] bg-cream/98 backdrop-blur-xl transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="space-y-1 px-5 py-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                    isActive
                      ? "bg-ember/10 text-ember"
                      : "text-ink/75 hover:bg-ink/[0.04] hover:text-ink"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}

          <li className="pt-3">
            <a
              href={buildWhatsAppOrderLink("a meal")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-xl bg-ember px-4 py-3.5 text-sm font-bold text-white shadow-[0_14px_35px_rgba(228,0,43,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ember-dark"
            >
              <span className="h-2 w-2 rounded-full bg-white/70" />
              Order Now — {site.phoneDisplay}
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}