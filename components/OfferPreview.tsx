import Link from "next/link";
import Reveal from "./Reveal";

export default function OfferPreview() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-ember/[0.1] bg-ember/[0.04] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-flame/[0.1] bg-flame/[0.04] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] px-6 py-16 text-center backdrop-blur-md sm:px-12 sm:py-20">
            {/* Inner glow ring */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-ember/60 to-transparent"
            />

            <div className="inline-flex items-center gap-2.5 rounded-full border border-ember/20 bg-ember/[0.06] px-4 py-2 text-[11px] font-bold uppercase tracking-[1.8px] text-ember-light">
              <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_#e3a735] animate-pulse-dot" />
              Offers
            </div>

            <h2 className="mx-auto mt-7 max-w-2xl font-display text-[clamp(2.2rem,5vw,4rem)] font-black leading-[1.05] tracking-[-0.02em] text-white">
              Something Special
              <span className="block text-gradient">Is Waiting For You</span>
            </h2>

            <p className="mx-auto mt-6 max-w-[540px] text-[16px] leading-[1.8] text-smoke">
              Exclusive deals and mouth-watering combos are live right now.
              Order today and enjoy great food at even better prices.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/offers"
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] bg-gradient-to-br from-ember-light to-ember-dark px-7 text-sm font-bold text-ink shadow-[0_14px_35px_rgba(227,167,53,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(227,167,53,0.3)]"
              >
                View Offers
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] border border-white/10 bg-white/[0.035] px-7 text-sm font-bold text-white/95 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-ember/35 hover:bg-ember/[0.06]"
              >
                Get In Touch
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}