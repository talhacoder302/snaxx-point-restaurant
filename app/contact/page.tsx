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
  { day: "Monday – Thursday", hours: "09:00 AM – 11:00 PM" },
  { day: "Friday", hours: "02:00 PM – 12:00 AM" },
  { day: "Saturday", hours: "10:00 AM – 12:00 AM" },
  { day: "Sunday", hours: "09:00 AM – 11:00 PM" },
] as const;

export default function ContactPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
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
                  className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-ink/[0.07] bg-white p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-ember/25 hover:bg-cream-deep/50 hover:shadow-[0_20px_60px_rgba(228,0,43,0.08)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-ember/15 bg-ember/[0.07] text-2xl shadow-[0_0_30px_rgba(228,0,43,0.06)] transition-transform duration-300 group-hover:scale-110">
                    💬
                  </span>

                  <h2 className="mt-6 text-lg font-bold text-ink">
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
                  className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-ink/[0.07] bg-white p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-ember/25 hover:bg-cream-deep/50 hover:shadow-[0_20px_60px_rgba(228,0,43,0.08)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <span className="grid h-14 w-14 place-items-center rounded-2xl border border-ember/15 bg-ember/[0.07] text-2xl shadow-[0_0_30px_rgba(228,0,43,0.06)] transition-transform duration-300 group-hover:scale-110">
                    ☎
                  </span>

                  <h2 className="mt-6 text-lg font-bold text-ink">
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
                      className="group flex items-center gap-4 rounded-[16px] border border-ink/[0.07] bg-white px-5 py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/25"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ember/15 bg-ember/[0.07] text-lg text-ember-light">
                        💬
                      </span>
                      <span>
                        <span className="block text-[11px] font-bold uppercase tracking-[1.5px] text-mist">
                          WhatsApp
                        </span>
                        <span className="mt-0.5 block text-[15px] font-bold text-ink">
                          {site.phoneDisplay}
                        </span>
                      </span>
                    </a>

                    <a
                      href={site.phoneHref}
                      className="group flex items-center gap-4 rounded-[16px] border border-ink/[0.07] bg-white px-5 py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/25"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ember/15 bg-ember/[0.07] text-lg text-ember-light">
                        ☎
                      </span>
                      <span>
                        <span className="block text-[11px] font-bold uppercase tracking-[1.5px] text-mist">
                          Phone
                        </span>
                        <span className="mt-0.5 block text-[15px] font-bold text-ink">
                          {site.phoneDisplay}
                        </span>
                      </span>
                    </a>

                    <a
                      href={site.emailHref}
                      className="group flex items-center gap-4 rounded-[16px] border border-ink/[0.07] bg-white px-5 py-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-ember/25"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ember/15 bg-ember/[0.07] text-lg text-ember-light">
                        ✉
                      </span>
                      <span>
                        <span className="block text-[11px] font-bold uppercase tracking-[1.5px] text-mist">
                          Email
                        </span>
                        <span className="mt-0.5 block text-[15px] font-bold text-ink">
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
          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Opening hours */}
              <Reveal>
                <div className="relative h-full overflow-hidden rounded-[22px] border border-ink/[0.07] bg-white p-8 backdrop-blur-md sm:p-10">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent"
                  />

                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-ember/15 bg-ember/[0.07] text-xl">
                      🕐
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-ink">
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
                        className="flex items-center justify-between gap-4 border-b border-ink/[0.08] pb-3.5 last:border-b-0 last:pb-0"
                      >
                        <span className="text-[14.5px] font-semibold text-ink/85">
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
                <div className="relative h-full overflow-hidden rounded-[22px] border border-ink/[0.07] bg-white p-8 backdrop-blur-md sm:p-10">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent"
                  />

                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl border border-ember/15 bg-ember/[0.07] text-xl">
                      📍
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-ink">
                        Find Us
                      </h2>
                      <p className="text-[12px] font-semibold uppercase tracking-[1.5px] text-ember-light">
                        Visit Us Today
                      </p>
                    </div>
                  </div>

                  <div className="mt-7 h-[280px] overflow-hidden rounded-[16px] border border-ink/10">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11174.15969389896!2d73.06471010757416!3d33.6287124908567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df9500249e6bd9%3A0x2090320af965a1d4!2sSnaxx%20Point%20Restaurant!5e0!3m2!1sen!2s!4v1787221165706!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title="Snaxx Point Restaurant location on Google Maps"
                    />
                    
                  </div>

                  <p className="mt-6 text-[13.5px] leading-[1.75] text-smoke">
                    Check directions, call us, or send a WhatsApp message and
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