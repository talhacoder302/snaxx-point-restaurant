import type { ReactNode } from "react";
import { site } from "@/lib/site";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import PhoneIcon from "./icons/PhoneIcon";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import Reveal from "./Reveal";

type ContactHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
};

export default function ContactHero({ eyebrow, title, description }: ContactHeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink pt-[72px]">
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(228,0,43,0.35),transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent"
      />

      <div className="relative mx-auto flex min-h-[56vh] max-w-3xl flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-ember/25 bg-ember/10 px-4 py-2 text-sm font-bold uppercase tracking-[1.8px] text-ember-light">
            <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_#e4002b] animate-pulse-dot" />
            {eyebrow}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mx-auto mt-7 font-display text-[clamp(2.6rem,6vw,4.8rem)] font-black leading-[1.02] tracking-[-0.02em] text-white">
            {title}
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.8] text-white/60">
            {description}
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildWhatsAppOrderLink("a meal")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] bg-ember px-7 text-sm font-bold text-white shadow-[0_14px_35px_rgba(228,0,43,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-ember-dark hover:shadow-[0_18px_42px_rgba(228,0,43,0.4)]"
            >
              <WhatsAppIcon circle className="h-4 w-4" circleClassName="h-8 w-8" />
              Order on WhatsApp
            </a>

            <a
              href={site.phoneHref}
              className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] border border-white/15 bg-white/[0.04] px-7 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/40 hover:bg-white/[0.1]"
            >
              <PhoneIcon className="h-[18px] w-[18px]" />
              Call Now
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
