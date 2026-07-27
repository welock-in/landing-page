import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { Globe } from "@/components/sections/Globe";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { LockedEverywhere } from "@/components/sections/LockedEverywhere";
import { LogoCloud } from "@/components/sections/LogoCloud";
import { Results } from "@/components/sections/Results";
import { ShareBand } from "@/components/sections/ShareBand";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoCloud />
        <Features />
        <Results />
        <HowItWorks />
        <LockedEverywhere />
        <Globe />
        <Faq />
        <ShareBand />
      </main>
      <Footer />
    </>
  );
}
