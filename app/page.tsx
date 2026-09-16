import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import HighlightStrip from "@/components/HighlightStrip";
import HomeBanner from "@/components/HomeBanner";
import HomeMenuShowcase from "@/components/HomeMenuShowcase";
import Navbar from "@/components/Navbar";
import PromoBanner from "@/components/PromoBanner";
import { getHomeMenuCategories } from "@/lib/menu";

export default async function Home() {
  const homeCategories = await getHomeMenuCategories();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Navbar />

      <main className="relative z-10 flex-1">
        <HomeBanner />
        <PromoBanner />
        <HomeMenuShowcase categories={homeCategories} />
        <HighlightStrip />
        <ContactCTA />
      </main>

      <Footer />
    </div>
  );
}
