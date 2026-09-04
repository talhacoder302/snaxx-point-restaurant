import Image from "next/image";
import type { MenuCategory } from "@/lib/menu";
import Reveal from "./Reveal";

type MenuSectionProps = {
  category: MenuCategory;
  delay?: number;
};

export default function MenuSection({ category, delay = 0 }: MenuSectionProps) {
  return (
    <Reveal delay={delay}>
      <div id={category.id} className="scroll-mt-28">
        <h3 className="font-display text-2xl font-black text-ink">{category.name}</h3>

        <ul className="mt-6 divide-y divide-ink/[0.07] overflow-hidden rounded-[18px] border border-ink/[0.07] bg-white">
          {category.items.map((item) => (
            <li
              key={item.id}
              className={`flex items-center gap-4 px-5 py-4 ${!item.available ? "opacity-60" : ""}`}
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
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-smoke">{item.description}</p>
                )}
              </div>

              <span className="shrink-0 text-[15px] font-black text-gradient">{item.price}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
