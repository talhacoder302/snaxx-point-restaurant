import NowOpen from "@/components/NowOpen";
import ContactCTA from "@/components/ContactCTA";
import CraftSpotlight from "@/components/CraftSpotlight";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import HighlightStrip from "@/components/HighlightStrip";
import HomeBanner from "@/components/HomeBanner";
import HowToOrder from "@/components/HowToOrder";
import Navbar from "@/components/Navbar";
import OfferPreview from "@/components/OfferPreview";
import PromoBanner from "@/components/PromoBanner";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Navbar />

      <main className="relative z-10 flex-1">
        <HomeBanner />
        <NowOpen />
        <PromoBanner />
        <HighlightStrip />
        <FeatureCards />
        <CraftSpotlight />
        <OfferPreview />
        <HowToOrder />
        <ContactCTA />
      </main>

      <Footer />
    </div>
  );
}