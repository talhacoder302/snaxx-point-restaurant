import NowOpen from "@/components/NowOpen";
import ContactCTA from "@/components/ContactCTA";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import HomeBanner from "@/components/HomeBanner";
import Navbar from "@/components/Navbar";
import OfferPreview from "@/components/OfferPreview";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Navbar />

      <main className="relative z-10 flex-1">
        <HomeBanner />
        <NowOpen />
        <FeatureCards />
        <OfferPreview />
        <ContactCTA />
      </main>

      <Footer />
    </div>
  );
}