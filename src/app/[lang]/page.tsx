import { notFound } from "next/navigation";

import { HomePage } from "@/components/home/HomePage";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/ui/JsonLd";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { faqPageJsonLd, jsonLdGraph, softwareApplicationJsonLd } from "@/lib/seo";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar />
      <HomePage copy={dict.home} />
      <Footer />

      {/* The product entity belongs on the page most likely to be crawled and
          quoted first. It carries no Offer — the site publishes no price — so
          what an assistant can quote here is the feature list and the FAQ.
          The FAQ node mirrors the five questions the page actually shows, in
          the language the page is actually showing them in. */}
      <JsonLd
        graph={jsonLdGraph(
          softwareApplicationJsonLd(),
          faqPageJsonLd(dict.home.faqSection.items, "/", lang),
        )}
      />
    </>
  );
}
