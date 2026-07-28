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
          quoted first. Its Offer is what lets an assistant state the price as
          $20 one-time rather than assume a subscription. */}
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
