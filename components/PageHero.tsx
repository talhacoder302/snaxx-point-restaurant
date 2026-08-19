import Link from "next/link";
import type { ReactNode } from "react";
import Reveal from "./Reveal";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export default function PageHero({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
}: PageHeroProps) {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden pt-[72px]">
      {/* Ambient glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[170px] -top-[230px] h-[420px] w-[420px] rounded-full border border-ember/[0.18] shadow-[0_0_100px_rgba(227,167,53,0.08),inset_0_0_80px_rgba(227,167,53,0.05)] animate-float"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[150px] -left-[100px] h-[260px] w-[260px] rounded-full border border-flame/[0.14] animate-float-reverse"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[7%] top-[28%] h-20 w-20 rounded-full border border-ember/[0.15] bg-ember/[0.04] animate-drift"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 text-center sm:px-8 lg:px-10">
        <Reveal>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-ember/20 bg-ember/[0.06] px-4 py-2 text-[11px] font-bold uppercase tracking-[1.8px] text-ember-light">
            <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_#e3a735] animate-pulse-dot" />
            {eyebrow}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mx-auto mt-7 max-w-4xl font-display text-[clamp(2.6rem,6vw,4.8rem)] font-black leading-[1.02] tracking-[-0.02em] text-white">
            {title}
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mx-auto mt-6 max-w-[620px] text-[16px] leading-[1.8] text-smoke">
            {description}
          </p>
        </Reveal>

        {(primaryCta || secondaryCta) && (
          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] bg-gradient-to-br from-ember-light to-ember-dark px-7 text-sm font-bold text-ink shadow-[0_14px_35px_rgba(227,167,53,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(227,167,53,0.3)]"
                >
                  {primaryCta.label}
                  <span aria-hidden="true">→</span>
                </Link>
              )}

              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] border border-white/10 bg-white/[0.035] px-7 text-sm font-bold text-white/95 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-ember/35 hover:bg-ember/[0.06]"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}