import { site } from "@/lib/site";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import Reveal from "./Reveal";

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-ember/[0.12] bg-gradient-to-br from-ember/[0.08] via-transparent to-flame/[0.06] px-6 py-16 text-center sm:px-12 sm:py-20">
            {/* Glow orbs */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-ember/[0.08] blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-flame/[0.08] blur-3xl"
            />

            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[2px] text-ember-light">
                Get In Touch
              </p>

              <h2 className="mx-auto mt-5 max-w-2xl font-display text-[clamp(2.2rem,5vw,4rem)] font-black leading-[1.05] tracking-[-0.02em] text-white">
                {"Let's Talk"} <span className="text-gradient">Tasty</span>
              </h2>

              <p className="mx-auto mt-6 max-w-[520px] text-[16px] leading-[1.8] text-smoke">
                Questions, reservations, or ready to place an order? {"We'd"}
                love to hear from you.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={buildWhatsAppOrderLink("a meal")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-[14px] bg-gradient-to-br from-ember-light to-ember-dark px-8 text-sm font-bold text-ink shadow-[0_14px_35px_rgba(227,167,53,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(227,167,53,0.3)] sm:w-auto"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 place-items-center rounded-full bg-ink/10 text-base"
                  >
                    💬
                  </span>
                  Order on WhatsApp
                </a>

                <a
                  href={site.phoneHref}
                  className="group inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-[14px] border border-white/10 bg-white/[0.035] px-8 text-sm font-bold text-white/95 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-ember/35 hover:bg-ember/[0.06] sm:w-auto"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.05] text-base text-ember-light"
                  >
                    ☎
                  </span>
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}