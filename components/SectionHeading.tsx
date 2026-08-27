import type { ReactNode } from "react";
import Reveal from "./Reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "center" | "left";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <Reveal
      className={
        isCenter
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      <p className="text-[11px] font-bold uppercase tracking-[2px] text-ember-light">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.05] tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-[15.5px] leading-[1.8] text-smoke">
          {description}
        </p>
      )}
    </Reveal>
  );
}