import type { Dictionary } from "@/i18n/dictionaries";
import "./home.css";
import { BentoFeatures } from "./BentoFeatures";
import { FaqSection } from "./FaqSection";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { LockedEverywhere } from "./LockedEverywhere";
import { LogoCloud } from "./LogoCloud";
import { Results } from "./Results";
import { ShareBand } from "./ShareBand";

export type HomeCopy = Dictionary["home"];

/**
 * The home page tree: every section of the design's <main>. The navbar and
 * footer stay outside; the server page renders them around this.
 *
 * Most sections below are client components, so their copy is handed down as
 * props from here rather than read from a context. That keeps the catalog on
 * the server: each section ships only the strings it renders.
 */
export function HomePage({ copy }: { copy: HomeCopy }) {
  return (
    <main>
      <Hero copy={copy.hero} />
      <LogoCloud copy={copy.logoCloud} />
      <BentoFeatures
        copy={copy.bento}
        strictness={copy.strictnessWidget}
        sync={copy.syncWidget}
      />
      <Results copy={copy.results} />
      <HowItWorks copy={copy.howItWorks} />
      <LockedEverywhere copy={copy.lockedEverywhere} />
      <FaqSection copy={copy.faqSection} />
      <ShareBand copy={copy.shareBand} />
    </main>
  );
}
