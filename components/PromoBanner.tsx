import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

export default function PromoBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[380px] w-full sm:h-[440px] lg:h-[500px]">
        <Image
          src="/about.jpg"
          alt="Freshly prepared Snaxx Point dishes"
          fill
          className="object-cover"
        />

        {/* Scrim for text legibility over the photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/25" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(228,0,43,0.25),transparent_60%)]"
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[1.8px] text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_#e4002b] animate-pulse-dot" />
              Limited Time
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="font-display text-[clamp(2.6rem,7vw,5rem)] font-black leading-[1] tracking-[-0.02em] text-white">
              Up To <span className="text-gradient">50% Off</span>
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="max-w-[520px] text-[15px] leading-[1.8] text-white/80 sm:text-[16px]">
              On selected combos and family deals — order today on WhatsApp
              before the offer is gone.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <Link
              href="/offers"
              className="mt-2 inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] bg-ember px-7 text-sm font-bold text-white shadow-[0_14px_35px_rgba(228,0,43,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-ember-dark hover:shadow-[0_18px_42px_rgba(228,0,43,0.4)]"
            >
              View Offers
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
