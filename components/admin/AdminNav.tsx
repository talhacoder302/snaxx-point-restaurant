"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Offers", isActive: pathname === "/admin" || pathname.startsWith("/admin/offers") },
    { href: "/admin/menu", label: "Products", isActive: pathname.startsWith("/admin/menu") },
  ];

  return (
    <nav className="flex items-center gap-5 justify-self-center">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={link.isActive ? "page" : undefined}
          className={`relative py-1 text-[13px] font-semibold transition-colors ${
            link.isActive ? "text-ember" : "text-white/70 hover:text-white"
          }`}
        >
          {link.label}
          {link.isActive && (
            <span className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-r from-transparent via-ember to-transparent" />
          )}
        </Link>
      ))}
    </nav>
  );
}
