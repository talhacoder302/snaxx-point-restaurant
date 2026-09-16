import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import ClockIcon from "./icons/ClockIcon";

export default function PromoBanner() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="relative h-[320px] w-full overflow-hidden rounded-[26px] shadow-[0_25px_70px_rgba(228,0,43,0.22)] sm:h-[380px] lg:h-[420px]">
            <Image
              src="/about.jpg"
              alt="Freshly prepared Snaxx Point dishes"
              fill
              className="object-cover"
            />

            {/* Light warm tint so the photo stays visible, with darkening concentrated behind the text */}
            <div className="absolute inset-0 bg-gradient-to-t from-flame/40 via-ember-dark/15 to-transparent" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_75%_at_50%_50%,rgba(58,0,9,0.65),transparent_70%)]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center [text-shadow:0_4px_18px_rgba(0,0,0,0.45)]">
              <Reveal delay={100}>
                <span className="inline-flex items-center gap-2.5 rounded-full bg-white/15 px-4 py-2 text-base font-bold uppercase tracking-[1.8px] text-white backdrop-blur-md">
                  <ClockIcon className="h-4 w-4 text-white" />
                  Limited Time
                </span>
              </Reveal>

              <Reveal delay={200}>
                <h2 className="font-display text-[clamp(2.2rem,6vw,4rem)] font-black leading-[1] tracking-[-0.02em] text-white">
                  Up To <span className="text-ember-glow">50% Off</span>
                </h2>
              </Reveal>

              <Reveal delay={300}>
                <p className="max-w-[520px] text-[15px] leading-[1.8] text-white/90 sm:text-[16px]">
                  On selected combos and family deals — order today on WhatsApp
                  before the offer is gone.
                </p>
              </Reveal>

              <Reveal delay={400}>
                <Link
                  href="/offers"
                  className="mt-2 inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] bg-white px-7 text-sm font-bold text-flame shadow-[0_14px_35px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:bg-cream-deep"
                >
                  View Offers
                  <span aria-hidden="true">→</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
