"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Offer } from "@/lib/offers";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

const AUTO_ADVANCE_MS = 5000;

export default function FeaturedOffersBanner({ offers }: { offers: Offer[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (offers.length <= 1 || paused) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % offers.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [offers.length, paused]);

  if (offers.length === 0) return null;

  const offer = offers[index];

  return (
    <div
      className="relative mx-auto my-14 max-w-4xl overflow-hidden rounded-[28px] border border-ember/25 bg-gradient-to-br from-ember/[0.1] via-cream-deep/50 to-flame/[0.06] shadow-[0_25px_70px_rgba(228,0,43,0.1)] backdrop-blur-md sm:my-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Top glow line */}
      <span
        aria-hidden="true"
        className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-ember/60 to-transparent"
      />

      <div
        key={offer.id}
        className="animate-banner-fade grid gap-8 px-8 py-12 sm:grid-cols-[auto_1fr] sm:items-center sm:px-12 sm:py-14"
      >
        <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full border border-ember/[0.15] sm:mx-0">
          {offer.imagePath ? (
            <Image
              src={offer.imagePath}
              alt={offer.title}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_50%_45%,rgba(228,0,43,0.18),rgba(122,0,22,0.06)_45%,transparent_70%)]">
              <span role="img" aria-label={offer.title} className="text-[56px]">
                {offer.emoji}
              </span>
            </div>
          )}
        </div>

        <div className="text-center sm:text-left">
          <span className="inline-flex items-center rounded-full bg-ember px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[1px] text-white">
            {offer.discountBadge}
          </span>

          <h2 className="mt-4 font-display text-2xl font-black text-ink sm:text-3xl">
            {offer.title}
          </h2>

          <p className="mx-auto mt-2.5 max-w-md text-[14.5px] leading-[1.75] text-smoke sm:mx-0">
            {offer.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[15px] font-semibold text-mist line-through decoration-flame/60">
                {offer.originalPrice}
              </span>
              <span className="text-[24px] font-black text-gradient">
                {offer.discountedPrice}
              </span>
            </div>

            <a
              href={buildWhatsAppOrderLink(offer.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-ember px-5 text-[13px] font-bold text-white shadow-[0_12px_30px_rgba(228,0,43,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ember-dark"
            >
              <span aria-hidden="true">💬</span>
              {offer.ctaLabel}
            </a>
          </div>
        </div>
      </div>

      {offers.length > 1 && (
        <div className="flex items-center justify-center gap-2 pb-6">
          {offers.map((dotOffer, dotIndex) => (
            <button
              key={dotOffer.id}
              type="button"
              onClick={() => setIndex(dotIndex)}
              aria-label={`Show ${dotOffer.title}`}
              aria-current={dotIndex === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                dotIndex === index
                  ? "w-6 bg-ember"
                  : "w-2 bg-ink/15 hover:bg-ink/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
