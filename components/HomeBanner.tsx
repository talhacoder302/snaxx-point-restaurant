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

  const goTo = (nextIndex: number) => {
    setIndex((nextIndex + slides.length) % slides.length);
  };

  const slide = slides[index];
  const isExternalCta = slide.cta.href.startsWith("http");

  return (
    <section
      className="relative overflow-hidden pt-[72px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative h-[560px] w-full sm:h-[640px] lg:h-[calc(100vh-72px)] lg:max-h-[780px] lg:min-h-[600px]">
        {slide.image ? (
          <div
            key={slide.id}
            className="absolute inset-0 h-full w-full animate-banner-fade overflow-hidden"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="animate-kenburns object-cover"
            />
          </div>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(228,0,43,0.28),transparent_55%)]"
        />

        {/* Floating brand card — desktop only */}
        <div className="glass-panel absolute right-8 top-10 hidden rounded-[15px] px-4 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.2)] animate-mini-float lg:block">
          <p className="text-[10px] uppercase tracking-[1.5px] text-mist">
            At Snaxx Point
          </p>
          <p className="mt-1 text-sm font-bold text-ink">
            Every Bite, Pure Delight!
          </p>
        </div>

        {/* Prev / Next controls */}
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous slide"
          className="glass-panel absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-lg text-ink transition-transform duration-200 hover:scale-110 sm:flex"
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next slide"
          className="glass-panel absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-lg text-ink transition-transform duration-200 hover:scale-110 sm:flex"
        >
          ›
        </button>

        {/* Content */}
        <div
          key={`content-${slide.id}`}
          className="absolute inset-0 flex flex-col items-center justify-end gap-4 px-6 pb-16 text-center animate-banner-fade sm:pb-24"
        >
          <span className="rounded-full bg-ember px-4 py-1.5 text-[11px] font-bold uppercase tracking-[1.8px] text-white shadow-[0_10px_25px_rgba(228,0,43,0.3)]">
            {slide.eyebrow}
          </span>

          <h1 className="font-display text-[clamp(2.4rem,7vw,4.5rem)] font-black leading-[1.03] text-white">
            {slide.title}
          </h1>

          <p className="max-w-[540px] text-[15.5px] leading-[1.75] text-white/85 sm:text-[16.5px]">
            {slide.description}
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            {isExternalCta ? (
              <a
                href={slide.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] bg-ember px-7 text-sm font-bold text-white shadow-[0_14px_35px_rgba(228,0,43,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-ember-dark hover:shadow-[0_18px_42px_rgba(228,0,43,0.4)]"
              >
                {slide.cta.label}
                <span aria-hidden="true">→</span>
              </a>
            ) : (
              <Link
                href={slide.cta.href}
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] bg-ember px-7 text-sm font-bold text-white shadow-[0_14px_35px_rgba(228,0,43,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-ember-dark hover:shadow-[0_18px_42px_rgba(228,0,43,0.4)]"
              >
                {slide.cta.label}
                <span aria-hidden="true">→</span>
              </Link>
            )}

            {!isExternalCta && (
              <a
                href={buildWhatsAppOrderLink("a meal")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-[13px] border border-white/25 bg-white/[0.06] px-7 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/[0.12]"
              >
                💬 Order on WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((dotSlide, dotIndex) => (
              <button
                key={dotSlide.id}
                type="button"
                onClick={() => goTo(dotIndex)}
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
