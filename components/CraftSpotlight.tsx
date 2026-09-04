import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";

export default function CraftSpotlight() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
          {/* ── Image ─────────────────────────── */}
          <Reveal from="left" className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              <Image
                src="/home-banner2.jpg"
                alt="Snaxx Point dishes plated with care"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>

            <div className="glass-panel absolute -bottom-6 left-6 rounded-[15px] px-4 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.25)] animate-mini-float sm:left-10">
              <p className="text-[10px] uppercase tracking-[1.5px] text-mist">
                Our Kitchen
              </p>
              <p className="mt-1 text-sm font-bold text-ink">
                Every Plate, By Hand 🌿
              </p>
            </div>
          </Reveal>

          {/* ── Text ─────────────────────────── */}
          <Reveal from="right" delay={100}>
            <p className="text-sm font-bold uppercase tracking-[2px] text-ember-light">
              Behind Every Dish
            </p>

            <h2 className="mt-5 font-display text-[clamp(2.1rem,4.5vw,3.5rem)] font-black leading-[1.05] tracking-[-0.02em] text-white">
              Where Passion
              <span className="block text-gradient">Meets The Plate</span>
            </h2>

            <p className="mt-6 max-w-[520px] text-[16px] leading-[1.8] text-white/60">
              From the first ingredient we pick to the last garnish we place,
              nothing here is rushed. It{"'"}s the small details — the right
              spice, the right sear, the right moment — that turn a meal into
              something worth remembering.
            </p>

            <Link
              href="/about"
              className="mt-9 inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] border border-white/15 bg-white/[0.04] px-7 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-ember/40 hover:bg-white/[0.08]"
            >
              Our Story
              <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
