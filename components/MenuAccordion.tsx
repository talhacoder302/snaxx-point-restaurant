"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { MenuCategory } from "@/lib/menu";
import ChevronDownIcon from "./icons/ChevronDownIcon";

type MenuAccordionProps = {
  categories: MenuCategory[];
};

// Matches the grid-template-rows transition duration below — scrolling has
// to wait until the collapse/expand animation finishes, otherwise it targets
// a layout that's still shifting and lands in the wrong place.
const COLLAPSE_TRANSITION_MS = 300;

export default function MenuAccordion({ categories }: MenuAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(categories[0]?.id ?? null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const scrollToCategoryWhenSettled = (id: string) => {
    if (scrollTimeoutRef.current !== null) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, COLLAPSE_TRANSITION_MS + 20);
  };

  const openCategory = (id: string) => {
    setOpenId(id);
    scrollToCategoryWhenSettled(id);
  };

  const toggleCategory = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
    scrollToCategoryWhenSettled(id);
  };

  return (
    <>
      {categories.length > 1 && (
        <div className="flex flex-wrap justify-start gap-2.5">
          {categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              onClick={(event) => {
                event.preventDefault();
                openCategory(category.id);
              }}
              className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                openId === category.id
                  ? "border-ember/40 bg-ember/[0.08] text-ember"
                  : "border-ink/10 bg-white text-ink/75 hover:border-ember/40 hover:text-ember"
              }`}
            >
              {category.name}
            </a>
          ))}
        </div>
      )}

      <div className="mt-12 space-y-4">
        {categories.map((category) => {
          const isOpen = openId === category.id;

          return (
            <div
              key={category.id}
              id={category.id}
              className="scroll-mt-28 overflow-hidden rounded-[18px] border border-ink/[0.07] bg-white"
            >
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-cream-deep/60 sm:px-6"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-display text-xl font-black text-ink sm:text-2xl">
                    {category.name}
                  </span>
                  <span className="text-[12.5px] font-semibold text-smoke">
                    {category.items.length} {category.items.length === 1 ? "item" : "items"}
                  </span>
                </span>

                <span
                  aria-hidden="true"
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/10 text-ink/60 transition-transform duration-300 ${
                    isOpen ? "rotate-180 border-ember/30 text-ember" : ""
                  }`}
                >
                  <ChevronDownIcon className="h-4 w-4" />
                </span>
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <ul className="divide-y divide-ink/[0.07] border-t border-ink/[0.07]">
                    {category.items.map((item) => (
                      <li
                        key={item.id}
                        className={`flex items-center gap-4 px-5 py-4 sm:px-6 ${
                          !item.available ? "opacity-60" : ""
                        }`}
                      >
                        {item.imagePath && (
                          <Image
                            src={item.imagePath}
                            alt={item.name}
                            width={56}
                            height={56}
                            className="h-14 w-14 shrink-0 rounded-[12px] object-cover"
                          />
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2.5">
                            <h4 className="text-[15px] font-bold text-ink">{item.name}</h4>
                            {!item.available && (
                              <span className="rounded-full bg-ink/[0.06] px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[1px] text-smoke">
                                Unavailable
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="mt-1 text-[13.5px] leading-[1.6] text-smoke">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <span className="shrink-0 text-[15px] font-black text-gradient">
                          {item.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
