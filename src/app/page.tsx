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
import { JsonLd } from "@/components/ui/JsonLd";
import { homeFaqs } from "@/content/faqs";
import { faqPageJsonLd, jsonLdGraph, softwareApplicationJsonLd } from "@/lib/seo";

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

      {/* The product entity belongs on the page most likely to be crawled and
          quoted first. It carries no Offer — the site publishes no price — so
          what an assistant can quote here is the feature list and the FAQ. */}
      <JsonLd
        graph={jsonLdGraph(
          softwareApplicationJsonLd(),
          faqPageJsonLd(
            homeFaqs.map(({ entry }) => ({
              question: entry.question,
              answer: entry.answer,
            })),
            "/",
          ),
        )}
      />
    </>
  );
}
