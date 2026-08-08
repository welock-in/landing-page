import "./home.css";
import { BentoFeatures } from "./BentoFeatures";
import { FaqSection } from "./FaqSection";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { LockedEverywhere } from "./LockedEverywhere";
import { LogoCloud } from "./LogoCloud";
import { Results } from "./Results";
import { ShareBand } from "./ShareBand";

/**
 * The home page tree — every section of the design's <main>. The navbar and
 * footer stay outside; the server page renders them around this.
 */
export function HomePage() {
  return (
    <main>
      <Hero />
      <LogoCloud />
      <BentoFeatures />
      <Results />
      <HowItWorks />
      <LockedEverywhere />
      <FaqSection />
      <ShareBand />
    </main>
  );
}
