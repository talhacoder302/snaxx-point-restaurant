import Reveal from "./Reveal";

const highlights = [
  {
    icon: "⚡",
    title: "Order In Seconds",
    description: "Straight to WhatsApp — no app, no signup.",
  },
  {
    icon: "🔥",
    title: "Cooked Fresh, Daily",
    description: "Nothing pre-made, nothing sitting around.",
  },
  {
    icon: "🌶️",
    title: "Bold, Honest Flavour",
    description: "Recipes built for taste, not shortcuts.",
  },
  {
    icon: "📍",
    title: "Proudly Local",
    description: "Serving our neighbourhood, one order at a time.",
  },
] as const;

export default function HighlightStrip() {
  return (
    <section className="relative overflow-hidden bg-ink py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
              <div
                className={`flex flex-col items-center gap-3 text-center lg:px-6 ${
                  index > 0 ? "lg:border-l lg:border-white/10" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 place-items-center rounded-2xl border border-ember/25 bg-ember/10 text-xl"
                >
                  {item.icon}
                </span>
                <h3 className="text-[15px] font-bold text-white">
                  {item.title}
                </h3>
                <p className="max-w-[220px] text-[13.5px] leading-[1.7] text-white/55">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
