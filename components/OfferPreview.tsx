import Link from "next/link";
import Reveal from "./Reveal";

export default function OfferPreview() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-ink/[0.07] bg-white px-6 py-16 text-center shadow-[0_10px_40px_rgba(0,0,0,0.04)] sm:px-12 sm:py-20">
            {/* Inner glow ring */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-ember/60 to-transparent"
            />

            <div className="inline-flex items-center gap-2.5 rounded-full border border-ember/20 bg-ember/[0.06] px-4 py-2 text-[11px] font-bold uppercase tracking-[1.8px] text-ember-light">
              <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_#e4002b] animate-pulse-dot" />
              Offers
            </div>

            <h2 className="mx-auto mt-7 max-w-2xl font-display text-[clamp(2.2rem,5vw,4rem)] font-black leading-[1.05] tracking-[-0.02em] text-ink">
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
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] bg-ember text-white shadow-[0_14px_35px_rgba(228,0,43,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-ember-dark hover:shadow-[0_18px_42px_rgba(228,0,43,0.3)] px-7 text-sm font-bold"
              >
                View Offers
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/contact"
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] border border-ink/10 bg-white px-7 text-sm font-bold text-ink/95 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-ember/35 hover:bg-ember/[0.06]"
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