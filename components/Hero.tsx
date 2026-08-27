import Link from "next/link";
import { site } from "@/lib/site";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-[72px]">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-10 lg:py-24">
        {/* ── Left: content ─────────────────────────── */}
        <div className="max-w-[680px] text-center lg:text-left">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-ember/20 bg-ember/[0.06] px-4 py-2 text-[11px] font-bold uppercase tracking-[1.8px] text-ember-light">
            <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_#e4002b] animate-pulse-dot" />
            Now Open
          </div>

          <h1 className="mt-7 font-display text-[clamp(3.4rem,7vw,6.5rem)] font-black leading-[0.95] tracking-[-0.03em] text-ink">
            <span className="block">Every Bite.</span>
            <span className="block text-gradient">Pure Delight!</span>
          </h1>

          <p className="mx-auto mt-7 max-w-[560px] text-[17px] leading-[1.8] text-smoke lg:mx-0">
            Snaxx Point Restaurant is now open and serving fresh, delicious
            food every day. Come hungry, leave happy — {"we're"} ready to
            welcome you.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/offers"
              className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] bg-ember px-6 text-sm font-bold text-white shadow-[0_14px_35px_rgba(228,0,43,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-ember-dark hover:shadow-[0_18px_42px_rgba(228,0,43,0.3)]"
            >
              Explore Offers
              <span aria-hidden="true">→</span>
            </Link>

            <a
              href={buildWhatsAppOrderLink("a meal")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] border border-ink/10 bg-white px-6 text-sm font-bold text-ink/95 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-ember/35 hover:bg-ember/[0.06]"
            >
              <span aria-hidden="true">💬</span>
              Order on WhatsApp
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 lg:justify-start">
            <a
              href={site.phoneHref}
              className="group flex items-center gap-3 text-[13px] text-mist transition-colors hover:text-ember-light"
            >
              <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-ink/10 bg-white text-sm text-ember-light transition-colors group-hover:border-ember/30">
                ☎
              </span>
              {site.phoneDisplay}
            </a>

            <a
              href={site.emailHref}
              className="group flex items-center gap-3 text-[13px] text-mist transition-colors hover:text-ember-light"
            >
              <span className="grid h-9 w-9 place-items-center rounded-[10px] border border-ink/10 bg-white text-sm text-ember-light transition-colors group-hover:border-ember/30">
                ✉
              </span>
              {site.email}
            </a>
          </div>
        </div>

        {/* ── Right: visual ─────────────────────────── */}
        <div className="relative mx-auto grid min-h-[420px] w-full max-w-[520px] place-items-center sm:min-h-[480px]">
          {/* Glowing food disc */}
          <div className="food-disc relative grid h-[215px] w-[215px] place-items-center rounded-full sm:h-[330px] sm:w-[330px]">
            <span
              className="select-none text-[78px] drop-shadow-[0_25px_30px_rgba(0,0,0,0.15)] animate-food-float sm:text-[125px]"
              role="img"
              aria-label="A delicious burger"
            >
              🍔
            </span>
          </div>

          {/* Floating mini cards */}
          <div className="glass-panel absolute right-0 top-8 rounded-[15px] px-4 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.08)] animate-mini-float sm:right-[4%] sm:top-10">
            <p className="text-[10px] uppercase tracking-[1.5px] text-mist">
              Status
            </p>
            <p className="mt-1 text-sm font-bold text-ink">
              Now Open 🎉
            </p>
          </div>

          <div className="glass-panel absolute bottom-10 left-0 rounded-[15px] px-4 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.08)] animate-mini-float-reverse sm:bottom-12">
            <p className="text-[10px] uppercase tracking-[1.5px] text-mist">
              At Snaxx Point
            </p>
            <p className="mt-1 text-sm font-bold text-ink">
              Every Bite, Pure Delight!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}