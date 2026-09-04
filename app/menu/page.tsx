import type { Metadata } from "next";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import MenuSection from "@/components/MenuSection";
import Navbar from "@/components/Navbar";
import OffersHero from "@/components/OffersHero";
import Reveal from "@/components/Reveal";
import { getMenuCategories } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore the full Snaxx Point Restaurant menu — shakes, juices, smoothies, slushes, beverages, ice cream and more.",
};

export default async function MenuPage() {
  const categories = await getMenuCategories();
  const categoriesWithItems = categories.filter((category) => category.items.length > 0);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Navbar />

      <main className="relative z-10 flex-1">
        <OffersHero
          eyebrow="Our Menu"
          title={
            <>
              Everything We
              <span className="block text-gradient">Serve, In One Place.</span>
            </>
          }
          description="From thick shakes to fresh juices and ice cream — browse the full menu and order your favourites on WhatsApp."
        />

        <section className="relative bg-cream-deep py-20 sm:py-28">
          <div className="relative mx-auto max-w-4xl px-5 sm:px-8 lg:px-10">
            {categoriesWithItems.length === 0 ? (
              <Reveal>
                <div className="mx-auto max-w-xl rounded-[22px] border border-ink/[0.07] bg-white px-8 py-14 text-center backdrop-blur-md">
                  <span role="img" aria-hidden="true" className="text-5xl">
                    🍽️
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-black text-ink">
                    Menu Coming Soon
                  </h3>
                  <p className="mx-auto mt-3 max-w-[380px] text-[14.5px] leading-[1.75] text-smoke">
                    We&apos;re putting the finishing touches on our menu. Check back soon.
                  </p>
                </div>
              </Reveal>
            ) : (
              <>
                {categoriesWithItems.length > 1 && (
                  <Reveal>
                    <div className="flex flex-wrap justify-center gap-2.5">
                      {categoriesWithItems.map((category) => (
                        <a
                          key={category.id}
                          href={`#${category.id}`}
                          className="rounded-full border border-ink/10 bg-white px-4 py-2 text-[13px] font-semibold text-ink/75 transition-colors hover:border-ember/40 hover:text-ember"
                        >
                          {category.name}
                        </a>
                      ))}
                    </div>
                  </Reveal>
                )}

                <div className="mt-12 space-y-14">
                  {categoriesWithItems.map((category, index) => (
                    <MenuSection key={category.id} category={category} delay={index * 80} />
                  ))}
                </div>
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
