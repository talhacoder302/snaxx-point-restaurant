"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { MenuCategory } from "@/lib/menu";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import WhatsAppIcon from "./icons/WhatsAppIcon";
import Reveal from "./Reveal";

type CategorySliderProps = {
  category: MenuCategory;
  delay?: number;
};

export default function CategorySlider({ category, delay = 0 }: CategorySliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <Reveal delay={delay}>
      <div id={category.id} className="scroll-mt-28">
        {/* Diagonal banner header — official ember/flame palette */}
        <div className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-ember-light via-ember to-flame shadow-[0_16px_40px_rgba(228,0,43,0.22)]">
          <span
            aria-hidden="true"
            className="absolute inset-0 [clip-path:polygon(0_0,62%_0,48%_100%,0_100%)] bg-white/[0.06]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />

          <div className="relative flex items-center justify-between gap-6 px-6 py-6 sm:px-10 sm:py-8">
            <h3 className="font-display text-[clamp(1.9rem,5vw,3rem)] font-black leading-[1.05] tracking-[-0.02em] text-white">
              {category.name}
            </h3>

            {category.bannerImagePath && (
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-[12px] border border-white/20 sm:h-28 sm:w-40 sm:rounded-[14px]">
                <Image
                  src={category.bannerImagePath}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 640px) 80px, 160px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Horizontal item slider */}
        <div className="relative mt-5">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {category.items.map((item) => (
              <article
                key={item.id}
                className="group relative flex w-[180px] shrink-0 snap-start flex-col overflow-hidden rounded-[16px] border border-ink/[0.07] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ember/25 hover:shadow-[0_18px_45px_rgba(228,0,43,0.1)] sm:w-[210px]"
              >
                <div className="relative h-32 w-full overflow-hidden bg-cream-deep sm:h-36">
                  {item.imagePath ? (
                    <Image
                      src={item.imagePath}
                      alt={item.name}
                      fill
                      sizes="210px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-4xl">🍽️</div>
                  )}
                </div>

                <div className="flex flex-1 flex-col px-3.5 py-3.5">
                  <h4 className="text-[13.5px] font-bold leading-tight text-ink">{item.name}</h4>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <span className="text-[14px] font-black text-gradient">{item.price}</span>

                    <a
                      href={buildWhatsAppOrderLink(item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Order ${item.name} on WhatsApp`}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember text-white shadow-[0_8px_20px_rgba(228,0,43,0.25)] transition-colors hover:bg-ember-dark"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            ))}

            <Link
              href={`/menu#${category.id}`}
              className="flex w-[130px] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-ember/25 bg-ember/[0.04] text-center text-[13px] font-bold text-ember-light transition-colors hover:bg-ember/[0.08] sm:w-[150px]"
            >
              View Full Menu
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {category.items.length > 2 && (
            <div className="mt-3 hidden items-center justify-end gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollByCards(-1)}
                aria-label={`Scroll ${category.name} left`}
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition-colors hover:border-ember/35 hover:text-ember"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => scrollByCards(1)}
                aria-label={`Scroll ${category.name} right`}
                className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition-colors hover:border-ember/35 hover:text-ember"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}
