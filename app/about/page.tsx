import type { Metadata } from "next";
import Link from "next/link";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover the story behind Snaxx Point Restaurant — fresh food, bold flavours, and a passion for great dining.",
};

const values = [
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
    icon: "🔥",
    title: "Bold Flavours",
    description:
      "We love big, honest flavours. Each recipe is crafted to be memorable — never boring, never ordinary.",
  },
  {
    icon: "🤝",
    title: "Warm Hospitality",
    description:
      "Great food is only half the story. Every guest is welcomed with a smile and well looked after.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="page-glow relative flex min-h-screen flex-col overflow-hidden">
      {/* Film-grain noise overlay */}
      <div aria-hidden="true" className="noise-overlay" />

      <Navbar />

      <main className="relative z-10 flex-1">
        <PageHero
          eyebrow="About Us"
          title={
            <>
              Our Story Is
              <span className="block text-gradient">Being Written Daily</span>
            </>
          }
          description="Snaxx Point Restaurant is built on a simple belief — good food, made with care, brings people together."
          primaryCta={{ label: "Explore Offers", href: "/offers" }}
          secondaryCta={{ label: "Get In Touch", href: "/contact" }}
        />

        {/* Story section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-ember/[0.1] bg-ember/[0.04] blur-3xl"
          />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10">
            {/* Visual */}
            <Reveal from="left">
              <div className="relative mx-auto grid min-h-[380px] w-full max-w-[480px] place-items-center">
                {/* Spinning ring */}
                <div className="absolute h-[280px] w-[280px] rounded-full border border-ember/[0.13] animate-spin-slow sm:h-[360px] sm:w-[360px]">
                  <span className="absolute left-1/2 top-4 h-[11px] w-[11px] -translate-x-1/2 rounded-full bg-ember shadow-[0_0_25px_#e3a735]" />
                  <span className="absolute bottom-10 right-3.5 h-[7px] w-[7px] rounded-full bg-flame shadow-[0_0_20px_#9b2e1b]" />
                </div>

                {/* Glowing food disc */}
                <div className="food-disc relative grid h-[200px] w-[200px] place-items-center rounded-full sm:h-[300px] sm:w-[300px]">
                  <span
                    className="select-none text-[72px] drop-shadow-[0_25px_30px_rgba(0,0,0,0.5)] animate-food-float sm:text-[110px]"
                    role="img"
                    aria-label="A delicious meal"
                  >
                    🍽️
                  </span>
                </div>

                {/* Floating mini card */}
                <div className="glass-panel absolute bottom-8 left-0 rounded-[15px] px-4 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] animate-mini-float sm:bottom-12">
                  <p className="text-[10px] uppercase tracking-[1.5px] text-[#858585]">
                    At Snaxx Point
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Every Bite, Pure Delight!
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Content */}
            <div>
              <SectionHeading
                align="left"
                eyebrow="Our Story"
                title={
                  <>
                    Built On Good Food
                    <span className="block text-gradient">& Great Times</span>
                  </>
                }
              />

              <Reveal delay={150}>
                <p className="mt-6 text-[15.5px] leading-[1.85] text-smoke">
                  Snaxx Point Restaurant started with a simple idea: everyone
                  deserves a meal that feels special. Not complicated. Not
                  overdone. Just honest, delicious food made with real care.
                </p>
              </Reveal>

              <Reveal delay={250}>
                <p className="mt-5 text-[15.5px] leading-[1.85] text-smoke">
                  Our menu is built around fresh ingredients, bold flavours,
                  and generous portions — the kind of food that makes you want
                  to come back for more. And because great meals are better
                  shared, our doors are open for friends and family to gather,
                  relax, and enjoy the moment.
                </p>
              </Reveal>

              <Reveal delay={350}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/offers"
                    className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-[13px] bg-gradient-to-br from-ember-light to-ember-dark px-6 text-sm font-bold text-ink shadow-[0_14px_35px_rgba(227,167,53,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(227,167,53,0.3)]"
                  >
                    See Our Offers
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Philosophy + quality section */}
        <section className="relative overflow-hidden py-24 sm:py-32">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-flame/[0.1] bg-flame/[0.04] blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <Reveal>
              <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.02] px-6 py-16 text-center backdrop-blur-md sm:px-12 sm:py-20">
                {/* Inner glow ring */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-ember/60 to-transparent"
                />

                <div className="inline-flex items-center gap-2.5 rounded-full border border-ember/20 bg-ember/[0.06] px-4 py-2 text-[11px] font-bold uppercase tracking-[1.8px] text-ember-light">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_#e3a735] animate-pulse-dot" />
                  Our Philosophy
                </div>

                <h2 className="mx-auto mt-7 max-w-2xl font-display text-[clamp(2.2rem,5vw,4rem)] font-black leading-[1.05] tracking-[-0.02em] text-white">
                  Fresh Ingredients.
                  <span className="block text-gradient">Honest Flavours.</span>
                </h2>

                <p className="mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.8] text-smoke">
                  We believe the best meals start with the best ingredients.
                  {"That's"} why freshness is at the heart of everything we do —
                  from the produce we choose to the moment your plate is served.
                </p>

                <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
                  {[
                    { icon: "🌿", label: "Fresh Ingredients" },
                    { icon: "👨‍🍳", label: "Prepared Daily" },
                    { icon: "🍽️", label: "Served With Pride" },
                  ].map((item, index) => (
                    <Reveal key={item.label} delay={index * 120}>
                      <div className="rounded-[16px] border border-white/[0.08] bg-white/[0.03] px-4 py-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-ember/25">
                        <span className="text-2xl" role="img" aria-hidden="true">
                          {item.icon}
                        </span>
                        <p className="mt-3 text-[13px] font-bold text-white">
                          {item.label}
                        </p>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Values grid */}
        <section className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="What We Stand For"
              title={
                <>
                  Our <span className="text-gradient">Values</span>
                </>
              }
              description="Four simple promises guide everything we do — from the kitchen to your table."
            />

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, index) => (
                <Reveal key={value.title} delay={index * 120}>
                  <article className="group relative h-full overflow-hidden rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-ember/25 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(227,167,53,0.08)]">
                    {/* Top glow line */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <span className="grid h-14 w-14 place-items-center rounded-2xl border border-ember/15 bg-ember/[0.07] text-2xl shadow-[0_0_30px_rgba(227,167,53,0.06)] transition-transform duration-300 group-hover:scale-110">
                      {value.icon}
                    </span>

                    <h3 className="mt-6 text-lg font-bold text-white">
                      {value.title}
                    </h3>

                    <p className="mt-3 text-[14.5px] leading-[1.75] text-smoke">
                      {value.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <ContactCTA />
      </main>

      <Footer />
    </div>
  );
}