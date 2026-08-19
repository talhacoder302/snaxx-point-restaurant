import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import OfferCard from "@/components/OfferCard";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getOffers } from "@/lib/offers";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Order exclusive offers and delicious deals at Snaxx Point Restaurant — fresh food at great prices, available now.",
};

export default async function OffersPage() {
  const offers = await getOffers();
  const featuredOffer = offers.find((offer) => offer.featured);
  const regularOffers = offers.filter((offer) => !offer.featured);

  return (
    <div className="page-glow relative flex min-h-screen flex-col overflow-hidden">
      {/* Film-grain noise overlay */}
      <div aria-hidden="true" className="noise-overlay" />

      <Navbar />

      <main className="relative z-10 flex-1">
        <PageHero
          eyebrow="Offers"
          title={
            <>
              Special Offers.
              <span className="block text-gradient">Delicious Deals.</span>
            </>
          }
          description="Great food deserves great prices. Explore our hand-picked combos and exclusive deals — available now and ready to order."
          primaryCta={{ label: "Browse Offers", href: "#offers" }}
          secondaryCta={{ label: "Order on WhatsApp", href: buildWhatsAppOrderLink("a meal") }}
        />

        {/* Offers grid */}
        <section id="offers" className="relative scroll-mt-24 py-20 sm:py-28">
          {/* Ambient glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-1/3 h-[380px] w-[380px] rounded-full border border-ember/[0.1] bg-ember/[0.04] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 bottom-1/4 h-[380px] w-[380px] rounded-full border border-flame/[0.1] bg-flame/[0.04] blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <SectionHeading
              eyebrow="Today's Deals"
              title={
                <>
                  Tasty Combos, <span className="text-gradient">Tasty Savings</span>
                </>
              }
              description="Freshly prepared, generously portioned, and priced to make you smile. Order now on WhatsApp or call us to reserve your favourite deal."
            />

            {offers.length === 0 ? (
              /* Empty state — shown when no offers exist (future CMS-ready) */
              <Reveal delay={150}>
                <div className="mx-auto mt-14 max-w-xl rounded-[22px] border border-white/[0.08] bg-white/[0.03] px-8 py-14 text-center backdrop-blur-md">
                  <span
                    role="img"
                    aria-hidden="true"
                    className="text-5xl"
                  >
                    🍽️
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-black text-white">
                    No Offers Right Now
                  </h3>
                  <p className="mx-auto mt-3 max-w-[380px] text-[14.5px] leading-[1.75] text-smoke">
                    Check back soon for new exclusive deals and delicious
                    combos.
                  </p>
                </div>
              </Reveal>
            ) : (
              <>
                {/* Featured offer */}
                {featuredOffer && (
                  <div className="mt-14">
                    <OfferCard offer={featuredOffer} />
                  </div>
                )}

                {/* Regular offers grid */}
                {regularOffers.length > 0 && (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {regularOffers.map((offer, index) => (
                      <OfferCard key={offer.id} offer={offer} delay={index * 100} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <ContactCTA />
      </main>

      <Footer />
    </div>
  );
}