import Reveal from "./Reveal";

const features = [
  {
    icon: "🥗",
    title: "Fresh & Delicious",
    description:
      "Every plate starts with fresh, quality ingredients — prepared daily so every bite tastes just right.",
  },
  {
    icon: "👨‍🍳",
    title: "Made With Care",
    description:
      "Our kitchen puts heart into every dish, from the first chop to the final garnish. Real food, real flavour.",
  },
  {
    icon: "🍽️",
    title: "Great Food, Great Moments",
    description:
      "Good food brings people together. Every meal at Snaxx Point becomes a memory worth savouring.",
  },
] as const;

export default function FeatureCards() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[2px] text-ember-light">
            Why Snaxx Point
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.05] tracking-[-0.02em] text-ink">
            Crafted With <span className="text-gradient">Passion</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 120}>
              <article className="group relative h-full overflow-hidden rounded-[20px] border border-ink/[0.07] bg-white p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-ember/25 hover:bg-cream-deep/50 hover:shadow-[0_20px_60px_rgba(228,0,43,0.08)]">
                {/* Top glow line */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />

                <span
                  aria-hidden="true"
                  className="grid h-14 w-14 place-items-center rounded-2xl border border-ember/15 bg-ember/[0.07] text-2xl shadow-[0_0_30px_rgba(228,0,43,0.06)] transition-transform duration-300 group-hover:scale-110"
                >
                  {feature.icon}
                </span>

                <h3 className="mt-6 text-lg font-bold text-ink">
                  {feature.title}
                </h3>

                <p className="mt-3 text-[14.5px] leading-[1.75] text-smoke">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}