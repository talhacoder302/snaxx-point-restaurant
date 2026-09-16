import type { MenuCategory } from "@/lib/menu";
import CategorySlider from "./CategorySlider";
import SectionHeading from "./SectionHeading";

type HomeMenuShowcaseProps = {
  categories: MenuCategory[];
};

export default function HomeMenuShowcase({ categories }: HomeMenuShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <SectionHeading
          eyebrow="Our Menu"
          title={
            <>
              Handpicked <span className="text-gradient">Favourites</span>
            </>
          }
          description="A taste of everything we make — fresh, fired up, and ready to order on WhatsApp."
        />

        <div className="mt-14 space-y-14 sm:mt-16 sm:space-y-16">
          {categories.map((category, index) => (
            <CategorySlider key={category.id} category={category} delay={index === 0 ? 0 : 60} />
          ))}
        </div>
      </div>
    </section>
  );
}
