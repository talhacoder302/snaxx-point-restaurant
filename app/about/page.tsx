import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AboutHero from "@/components/AboutHero";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
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
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Navbar />

      <main className="relative z-10 flex-1">
        <AboutHero />

        {/* Story section */}
        <section className="relative overflow-hidden bg-cream-deep py-24 sm:py-32">
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              {/* Visual */}
              <Reveal from="left" className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-ink/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                  <Image
                    src="/about.jpg"
                    alt="A wok-fried chicken and vegetable dish at Snaxx Point"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-[78%_50%]"
                    priority
                  />
                </div>

                {/* Floating mini card */}
                <div className="glass-panel absolute -bottom-6 left-6 rounded-[15px] px-4 py-3.5 shadow-[0_18px_50px_rgba(0,0,0,0.15)] animate-mini-float sm:left-10">
                  <p className="text-[10px] uppercase tracking-[1.5px] text-mist">
                    At Snaxx Point
                  </p>
                  <p className="mt-1 text-sm font-bold text-ink">
                    Every Bite, Pure Delight!
                  </p>
                </div>
              </Reveal>

              {/* Content */}
              <Reveal from="right" delay={100}>
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

                <p className="mt-6 max-w-lg text-[15.5px] leading-[1.85] text-smoke">
                  Snaxx Point Restaurant started with a simple idea: everyone
                  deserves a meal that feels special. Not complicated. Not
                  overdone. Just honest, delicious food made with real care.
                </p>

                <p className="mt-5 max-w-lg text-[15.5px] leading-[1.85] text-smoke">
                  Our menu is built around fresh ingredients, bold flavours,
                  and generous portions — the kind of food that makes you want
                  to come back for more. And because great meals are better
                  shared, our doors are open for friends and family to gather,
                  relax, and enjoy the moment.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/offers"
                    className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-[13px] bg-ember px-6 text-sm font-bold text-white shadow-[0_14px_35px_rgba(228,0,43,0.18)] transition-all duration-300 hover:-translate-y-1 hover:bg-ember-dark hover:shadow-[0_18px_42px_rgba(228,0,43,0.3)]"
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
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <Reveal>
              <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink px-6 py-16 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:px-12 sm:py-20">
                {/* Decorative glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-24 left-1/2 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(228,0,43,0.3),transparent_70%)] blur-2xl"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-ember/60 to-transparent"
                />

                <div className="relative inline-flex items-center gap-2.5 rounded-full border border-ember/25 bg-ember/10 px-4 py-2 text-sm font-bold uppercase tracking-[1.8px] text-ember-light">
                  <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_12px_#e4002b] animate-pulse-dot" />
                  Our Philosophy
                </div>

                <h2 className="relative mx-auto mt-7 max-w-2xl font-display text-[clamp(2.2rem,5vw,4rem)] font-black leading-[1.05] tracking-[-0.02em] text-white">
                  Fresh Ingredients.
                  <span className="block text-gradient">Honest Flavours.</span>
                </h2>

                <p className="relative mx-auto mt-6 max-w-[560px] text-[16px] leading-[1.8] text-white/60">
                  We believe the best meals start with the best ingredients.
                  {"That's"} why freshness is at the heart of everything we do —
                  from the produce we choose to the moment your plate is served.
                </p>

                <div className="relative mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
                  {[
                    { icon: "🌿", label: "Fresh Ingredients" },
                    { icon: "👨‍🍳", label: "Prepared Daily" },
                    { icon: "🍽️", label: "Served With Pride" },
                  ].map((item, index) => (
                    <Reveal key={item.label} delay={index * 120}>
                      <div className="rounded-[16px] border border-white/10 bg-white/[0.04] px-4 py-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-ember/35 hover:bg-white/[0.07]">
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
        <section className="relative bg-cream-deep py-24 sm:py-32">
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
                  <article className="group relative h-full overflow-hidden rounded-[20px] border border-ink/[0.07] bg-white p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-ember/25 hover:shadow-[0_20px_60px_rgba(228,0,43,0.08)]">
                    {/* Top glow line */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <span className="grid h-14 w-14 place-items-center rounded-2xl border border-ember/15 bg-ember/[0.07] text-2xl shadow-[0_0_30px_rgba(228,0,43,0.06)] transition-transform duration-300 group-hover:scale-110">
                      {value.icon}
                    </span>

                    <h3 className="mt-6 text-lg font-bold text-ink">
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