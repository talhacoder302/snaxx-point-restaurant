"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

type BannerSlide = {
  id: string;
  /**
   * Drop a photo at public/banners/<id>.jpg (or .png/.webp) and set this to
   * that path, e.g. "/banners/every-bite.jpg" — the placeholder below is
   * shown automatically until then.
   */
  image: string | null;
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
};

const slides: BannerSlide[] = [
  {
    id: "every-bite",
    image: "/home-banner.jpg",
    eyebrow: "Now Open",
    title: "Every Bite. Pure Delight!",
    description: "Fresh food, made with care, served every day.",
    cta: { label: "Explore Offers", href: "/offers" },
  },
  {
    id: "fresh-deals",
    image: "/home-banner2.jpg",
    eyebrow: "This Week",
    title: "Fresh Deals, Daily",
    description: "Hand-picked combos at prices that make you smile.",
    cta: { label: "View Offers", href: "/offers" },
  },
  {
    id: "order-now",
    image: "/home-banner-2.webp",
    eyebrow: "Order In Minutes",
    title: "Craving Something Good?",
    description: "Order now on WhatsApp and we'll get it fired up.",
    cta: { label: "Order on WhatsApp", href: buildWhatsAppOrderLink("a meal") },
  },
];

const AUTO_ADVANCE_MS = 6000;

export default function HomeBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [paused]);

  const slide = slides[index];
  const isExternalCta = slide.cta.href.startsWith("http");

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[440px] w-full sm:h-[500px] lg:h-[600px]">
        {slide.image ? (
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-ink to-[#3a0009]">
            <span className="text-5xl" role="img" aria-hidden="true">
              🖼️
            </span>
            <p className="max-w-xs px-6 text-center text-[11px] font-semibold uppercase tracking-[1.5px] text-white/40">
              Banner placeholder — add public/banners/{slide.id}.jpg
            </p>
          </div>
        )}

        {/* Scrim for text legibility over a photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end gap-4 px-6 pb-14 text-center sm:pb-20">
          <span className="rounded-full bg-ember px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.8px] text-white">
            {slide.eyebrow}
          </span>

          <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] font-black leading-[1.05] text-white">
            {slide.title}
          </h1>

          <p className="max-w-[520px] text-[15px] leading-[1.7] text-white/85">
            {slide.description}
          </p>

          {isExternalCta ? (
            <a
              href={slide.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[13px] bg-ember px-7 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-ember-dark"
            >
              {slide.cta.label}
              <span aria-hidden="true">→</span>
            </a>
          ) : (
            <Link
              href={slide.cta.href}
              className="mt-2 inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[13px] bg-ember px-7 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-ember-dark"
            >
              {slide.cta.label}
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {/* Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((dotSlide, dotIndex) => (
              <button
                key={dotSlide.id}
                type="button"
                onClick={() => setIndex(dotIndex)}
                aria-label={`Show ${dotSlide.title}`}
                aria-current={dotIndex === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  dotIndex === index
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
