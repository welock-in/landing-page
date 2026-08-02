"use client";

import { useRef } from "react";

import "./home.css";
import { BentoFeatures } from "./BentoFeatures";
import { FaqSection } from "./FaqSection";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { LockedEverywhere } from "./LockedEverywhere";
import { LogoCloud } from "./LogoCloud";
import { Results } from "./Results";
import { ShareBand } from "./ShareBand";
import { TeaStream } from "./TeaStream";

/**
 * The home page client tree — every section of the design's <main>, plus the
 * scroll-revealed tea stream that runs down the whole page. The navbar and
 * footer stay outside; the server page renders them around this.
 */
export function HomePage() {
  const mainRef = useRef<HTMLElement>(null);

  return (
    <main ref={mainRef}>
      <TeaStream mainRef={mainRef} />
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
