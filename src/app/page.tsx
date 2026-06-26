import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Faq } from "@/components/sections/Faq";
import { Globe } from "@/components/sections/Globe";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { LockedEverywhere } from "@/components/sections/LockedEverywhere";
import { LogoCloud } from "@/components/sections/LogoCloud";
import { Stats } from "@/components/sections/Stats";
import { VideoStory } from "@/components/sections/VideoStory";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoCloud />
        <HowItWorks />
        <LockedEverywhere />
        <Stats />
        <Globe />
        <Faq />
        <VideoStory />
      </main>
      <Footer />
    </>
  );
}
