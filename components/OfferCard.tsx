import Image from "next/image";
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
        className={`group relative flex h-full flex-col overflow-hidden rounded-[22px] border bg-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_rgba(228,0,43,0.12)] ${
          offer.featured
            ? "border-ember/25 shadow-[0_14px_40px_rgba(228,0,43,0.08)] hover:border-ember/45"
            : "border-ink/[0.07] hover:border-ember/25"
        }`}
      >
        {/* Top glow line */}
        <span
          aria-hidden="true"
          className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Discount badge */}
        <span className="absolute right-4 top-4 z-10 rounded-full bg-ember px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[1px] text-white shadow-[0_10px_25px_rgba(228,0,43,0.25)]">
          {offer.discountBadge}
        </span>

        {/* Food visual */}
        <div className="relative grid h-44 place-items-center overflow-hidden">
          {offer.imagePath ? (
            <Image
              src={offer.imagePath}
              alt={offer.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <>
              <div
                aria-hidden="true"
                className="absolute h-32 w-32 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(228,0,43,0.16),rgba(122,0,22,0.05)_45%,transparent_70%)] border border-ember/[0.12] transition-transform duration-500 group-hover:scale-110"
              />
              <span
                role="img"
                aria-label={offer.title}
                className="relative select-none text-[64px] drop-shadow-[0_20px_25px_rgba(0,0,0,0.12)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 animate-food-float"
              >
                {offer.emoji}
              </span>
            </>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
          <h3 className="text-lg font-bold text-ink">{offer.title}</h3>

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
                ? "bg-ember text-white shadow-[0_12px_30px_rgba(228,0,43,0.2)] hover:bg-ember-dark hover:shadow-[0_16px_38px_rgba(228,0,43,0.32)]"
                : "border border-ink/10 bg-white text-ink/95 backdrop-blur-md hover:border-ember/35 hover:bg-ember/[0.06]"
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