import { FAQS } from "@/components/home/data";
import { HomePage } from "@/components/home/HomePage";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqPageJsonLd, jsonLdGraph, softwareApplicationJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomePage />
      <Footer />

      {/* The product entity belongs on the page most likely to be crawled and
          quoted first. It carries no Offer — the site publishes no price — so
          what an assistant can quote here is the feature list and the FAQ.
          The FAQ node mirrors the five questions the page actually shows. */}
      <JsonLd
        graph={jsonLdGraph(softwareApplicationJsonLd(), faqPageJsonLd(FAQS, "/"))}
      />
    </>
  );
}
