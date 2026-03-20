import { NavBar } from "@/components/marketing/NavBar";
import { MarqueeBand } from "@/components/marketing/MarqueeBand";
import { TrustBar } from "@/components/marketing/TrustBar";
import HeroSection from "@/components/marketing/HeroSection";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Features } from "@/components/marketing/Features";
import { Corridors } from "@/components/marketing/Corridors";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Pricing } from "@/components/marketing/Pricing";
import { CtaSection } from "@/components/marketing/CtaSection";
import { Footer } from "@/components/marketing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF6EF]">
      <NavBar />
      <HeroSection />
      <MarqueeBand />
      <TrustBar />
      <HowItWorks />
      <Features />
      <Corridors />
      <Testimonials />
      <Pricing />
      <CtaSection />
      <Footer />
    </div>
  );
}
