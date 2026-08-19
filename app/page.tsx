import NowOpen from "@/components/NowOpen";
import ContactCTA from "@/components/ContactCTA";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import OfferPreview from "@/components/OfferPreview";

export default function Home() {
  return (
    <div className="page-glow relative flex min-h-screen flex-col overflow-hidden">
      {/* Film-grain noise overlay */}
      <div aria-hidden="true" className="noise-overlay" />

      {/* Floating decorative orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[170px] -top-[230px] h-[420px] w-[420px] rounded-full border border-ember/[0.18] shadow-[0_0_100px_rgba(227,167,53,0.08),inset_0_0_80px_rgba(227,167,53,0.05)] animate-float"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[150px] -left-[100px] h-[260px] w-[260px] rounded-full border border-flame/[0.14] animate-float-reverse"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[7%] top-[28%] h-20 w-20 rounded-full border border-ember/[0.15] bg-ember/[0.04] animate-drift"
      />

      <Navbar />

      <main className="relative z-10 flex-1">
        <Hero />
        <NowOpen />
        <FeatureCards />
        <OfferPreview />
        <ContactCTA />
      </main>

      <Footer />
    </div>
  );
}