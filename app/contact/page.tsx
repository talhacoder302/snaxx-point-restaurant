import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/lib/site";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Snaxx Point Restaurant — call +92 300 8505528 or email snaxxpointrestaurant@gmail.com.",
};

const openingHours = [
  { day: "Monday – Thursday", hours: "11:00 AM – 11:00 PM" },
  { day: "Friday", hours: "2:00 PM – 12:00 AM" },
  { day: "Saturday", hours: "11:00 AM – 12:00 AM" },
  { day: "Sunday", hours: "11:00 AM – 11:00 PM" },
] as const;

export default function ContactPage() {
  return (
    <div className="page-glow relative flex min-h-screen flex-col overflow-hidden">
      {/* Film-grain noise overlay */}
      <div aria-hidden="true" className="noise-overlay" />

      <Navbar />

      <main className="relative z-10 flex-1">
        <PageHero
          eyebrow="Contact"
          title={
            <>
              {"Let's Talk"}
              <span className="block text-gradient">Tasty</span>
            </>
          }
          description="Questions, reservations, or ready to place an order? Reach out — we'd love to hear from you."
          primaryCta={{ label: "Order on WhatsApp", href: buildWhatsAppOrderLink("a meal") }}
          secondaryCta={{ label: "Call Now", href: site.phoneHref }}
        />

        {/* Contact info cards */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* WhatsApp card */}
              <Reveal>
                <a
                  href={buildWhatsAppOrderLink("a meal")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-ember/25 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(227,167,53,0.08)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-ember/15 bg-ember/[0.07] text-2xl shadow-[0_0_30px_rgba(227,167,53,0.06)] transition-transform duration-300 group-hover:scale-110">
                    💬
                  </span>

                  <h2 className="mt-6 text-lg font-bold text-white">
                    Order on WhatsApp
                  </h2>
                  <p className="mt-2 flex-1 text-[14.5px] leading-[1.75] text-smoke">
                    The fastest way to order. Message us on WhatsApp and
                    {"we'll"} confirm your order right away.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-bold text-ember-light transition-colors group-hover:text-ember">
                    {site.phoneDisplay}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </a>
              </Reveal>

              {/* Phone card */}
              <Reveal delay={120}>
                <a
                  href={site.phoneHref}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-ember/25 hover:bg-white/[0.05] hover:shadow-[0_20px_60px_rgba(227,167,53,0.08)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-ember/15 bg-ember/[0.07] text-2xl shadow-[0_0_30px_rgba(227,167,53,0.06)] transition-transform duration-300 group-hover:scale-110">
                    ☎
                  </span>

                  <h2 className="mt-6 text-lg font-bold text-white">
                    Call Us
                  </h2>
                  <p className="mt-2 flex-1 text-[14.5px] leading-[1.75] text-smoke">
                    Prefer to talk? Give us a ring — {"we're"} happy to help
                    with orders, reservations, or any questions.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-bold text-ember-light transition-colors group-hover:text-ember">
                    {site.phoneDisplay}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Contact form + info */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-1/3 h-[380px] w-[380px] rounded-full border border-ember/[0.1] bg-ember/[0.04] blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              {/* Left: info */}
              <div>
                <SectionHeading
                  align="left"
                  eyebrow="Send A Message"
                  title={
                    <>
                      {"We'd Love To"}
                      <span className="block text-gradient">Hear From You</span>
                    </>
                  }
                  description="Fill in the form and we'll get back to you shortly. For anything urgent, give us a call — we're always happy to talk."
                />

                <Reveal delay={200}>
                  <div className="mt-8 space-y-4">
                    <a
                      href={buildWhatsAppOrderLink("a meal")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-[16px] border border-white/[0.08] bg-white/[0.03] px-5 py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/25"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ember/15 bg-ember/[0.07] text-lg text-ember-light">
                        💬
                      </span>
                      <span>
                        <span className="block text-[11px] font-bold uppercase tracking-[1.5px] text-mist">
                          WhatsApp
                        </span>
                        <span className="mt-0.5 block text-[15px] font-bold text-white">
                          {site.phoneDisplay}
                        </span>
                      </span>
                    </a>

                    <a
                      href={site.phoneHref}
                      className="group flex items-center gap-4 rounded-[16px] border border-white/[0.08] bg-white/[0.03] px-5 py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/25"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ember/15 bg-ember/[0.07] text-lg text-ember-light">
                        ☎
                      </span>
                      <span>
                        <span className="block text-[11px] font-bold uppercase tracking-[1.5px] text-mist">
                          Phone
                        </span>
                        <span className="mt-0.5 block text-[15px] font-bold text-white">
                          {site.phoneDisplay}
                        </span>
                      </span>
                    </a>

                    <a
                      href={site.emailHref}
                      className="group flex items-center gap-4 rounded-[16px] border border-white/[0.08] bg-white/[0.03] px-5 py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/25"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ember/15 bg-ember/[0.07] text-lg text-ember-light">
                        ✉
                      </span>
                      <span>
                        <span className="block text-[11px] font-bold uppercase tracking-[1.5px] text-mist">
                          Email
                        </span>
                        <span className="mt-0.5 block text-[15px] font-bold text-white">
                          {site.email}
                        </span>
                      </span>
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Right: form */}
              <Reveal delay={150}>
                <ContactForm />
              </Reveal>
            </div>
          </div>
        </section>

        {/* Opening hours + location */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-flame/[0.1] bg-flame/[0.04] blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Opening hours */}
              <Reveal>
                <div className="relative h-full overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md sm:p-10">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent"
                  />

                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-ember/15 bg-ember/[0.07] text-xl">
                      🕐
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Opening Hours
                      </h2>
                      <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ember-light">
                        {"We're"} Open Daily
                      </p>
                    </div>
                  </div>

                  <ul className="mt-7 space-y-3.5">
                    {openingHours.map((slot) => (
                      <li
                        key={slot.day}
                        className="flex items-center justify-between gap-4 border-b border-white/[0.05] pb-3.5 last:border-b-0 last:pb-0"
                      >
                        <span className="text-[14.5px] font-semibold text-white/85">
                          {slot.day}
                        </span>
                        <span className="text-[14px] font-medium text-smoke">
                          {slot.hours}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Location */}
              <Reveal delay={120}>
                <div className="relative h-full overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-md sm:p-10">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent"
                  />

                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-ember/15 bg-ember/[0.07] text-xl">
                      📍
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        Find Us
                      </h2>
                      <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ember-light">
                        Visit Us Today
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 flex h-[220px] items-center justify-center rounded-[16px] border border-dashed border-white/[0.12] bg-white/[0.02]">
                    <div className="text-center">
                      <span className="text-3xl" role="img" aria-hidden="true">
                        🗺️
                      </span>
                      <p className="mt-3 text-[14px] font-semibold text-white/80">
                        {"We're"} Open & Ready To Serve
                      </p>
                      <p className="mx-auto mt-1.5 max-w-[280px] text-[13px] leading-[1.7] text-smoke">
                        Call or WhatsApp us for directions and {"we'll"} point
                        you the right way.
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-[13.5px] leading-[1.75] text-smoke">
                    Need directions? Call us or send a WhatsApp message and
                    {"we'll"} guide you straight to our door.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}