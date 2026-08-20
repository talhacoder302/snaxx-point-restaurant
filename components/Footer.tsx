import Image from "next/image";
import Link from "next/link";
import { navLinks, site } from "@/lib/site";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/[0.05]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-5 px-5 py-7 text-[11px] text-[#666] sm:px-8 md:flex-row lg:px-10">
        <div className="flex items-center gap-3">
          <Image
            src="/snaxxpoint-logo.png"
            alt="Snaxx Point Restaurant Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <p className="text-center md:text-left">
            © {year} <strong className="font-semibold text-[#999]">Snaxx Point Restaurant</strong>.
            All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors duration-200 hover:text-ember-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={buildWhatsAppOrderLink("a meal")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Order on WhatsApp"
            title="WhatsApp"
            className="grid h-8 w-8 place-items-center rounded-[9px] border border-white/[0.07] text-[#888] transition-all duration-200 hover:-translate-y-0.5 hover:border-ember/30 hover:text-ember-light"
          >
            💬
          </a>

          <a
            href={site.phoneHref}
            aria-label="Call Snaxx Point"
            title="Call"
            className="grid h-8 w-8 place-items-center rounded-[9px] border border-white/[0.07] text-[#888] transition-all duration-200 hover:-translate-y-0.5 hover:border-ember/30 hover:text-ember-light"
          >
            ☎
          </a>

          <a
            href={site.emailHref}
            aria-label="Email Snaxx Point"
            title="Email"
            className="grid h-8 w-8 place-items-center rounded-[9px] border border-white/[0.07] text-[#888] transition-all duration-200 hover:-translate-y-0.5 hover:border-ember/30 hover:text-ember-light"
          >
            ✉
          </a>
        </div>
      </div>
    </footer>
  );
}