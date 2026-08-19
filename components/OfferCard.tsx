import type { Offer } from "@/lib/offers";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import Reveal from "./Reveal";

type OfferCardProps = {
  offer: Offer;
  delay?: number;
};

export default function OfferCard({ offer, delay = 0 }: OfferCardProps) {
  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] border backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(227,167,53,0.12)] ${
          offer.featured
            ? "border-ember/25 bg-gradient-to-br from-ember/[0.09] via-white/[0.03] to-flame/[0.05] hover:border-ember/45"
            : "border-white/[0.08] bg-white/[0.03] hover:border-ember/25 hover:bg-white/[0.05]"
        }`}
      >
        {/* Top glow line */}
        <span
          aria-hidden="true"
          className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Discount badge */}
        <span className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-br from-ember-light to-ember-dark px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[1px] text-ink shadow-[0_10px_25px_rgba(227,167,53,0.25)]">
          {offer.discountBadge}
        </span>

        {/* Food visual */}
        <div className="relative grid h-44 place-items-center overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute h-32 w-32 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(227,167,53,0.16),rgba(155,46,27,0.05)_45%,transparent_70%)] border border-ember/[0.12] transition-transform duration-500 group-hover:scale-110"
          />
          <span
            role="img"
            aria-label={offer.title}
            className="relative select-none text-[64px] drop-shadow-[0_20px_25px_rgba(0,0,0,0.45)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 animate-food-float"
          >
            {offer.emoji}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-6 pb-6">
          <h3 className="text-lg font-bold text-white">{offer.title}</h3>

          <p className="mt-2.5 flex-1 text-[14px] leading-[1.75] text-smoke">
            {offer.description}
          </p>

          {/* Pricing */}
          <div className="mt-5 flex items-baseline gap-2.5">
            <span className="text-[15px] font-semibold text-mist line-through decoration-flame/60">
              {offer.originalPrice}
            </span>
            <span className="text-[22px] font-black text-gradient">
              {offer.discountedPrice}
            </span>
          </div>

          {/* CTA — opens WhatsApp with a pre-filled order message */}
          <a
            href={buildWhatsAppOrderLink(offer.title)}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-5 inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[12px] text-[13px] font-bold transition-all duration-300 hover:-translate-y-0.5 ${
              offer.featured
                ? "bg-gradient-to-br from-ember-light to-ember-dark text-ink shadow-[0_12px_30px_rgba(227,167,53,0.2)] hover:shadow-[0_16px_38px_rgba(227,167,53,0.32)]"
                : "border border-white/10 bg-white/[0.035] text-white/95 backdrop-blur-md hover:border-ember/35 hover:bg-ember/[0.06]"
            }`}
          >
            <span aria-hidden="true">💬</span>
            {offer.ctaLabel}
          </a>
        </div>
      </article>
    </Reveal>
  );
}