
import "@/components/content/content.css";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { metadataFor, type LangParams } from "@/i18n/metadata";
import { notFound } from "next/navigation";

import { FaqPage } from "@/components/faq/FaqPage";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/ui/JsonLd";
import { allFaqEntries } from "@/content/faqPage";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  jsonLdGraph,
  softwareApplicationJsonLd,
} from "@/lib/seo";

export function generateMetadata({ params }: LangParams) {
  return metadataFor(params, (d) => ({
    ...d.faq.meta,
    path: "/faq",
    keywords: [
    "Welockin FAQ",
    "app blocker questions",
    "nuclear mode",
    "unlock difficulty levels",
    "app blocker that cannot be bypassed",
    ],
  }));
}

const TRAIL = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default async function FaqRoute({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <Navbar />
      <FaqPage copy={dict.faq.hub} />
      <Footer />

      {/* The hub links to every answer, so its structured data carries every
          question too — this is the URL most likely to be reached for a broad
          "Welockin FAQ" query, by a person or an assistant. */}
      <JsonLd
        graph={jsonLdGraph(
          softwareApplicationJsonLd(),
          breadcrumbJsonLd(TRAIL),
          faqPageJsonLd(
            allFaqEntries.map(({ entry }) => ({
              question: entry.question,
              answer: entry.answer,
            })),
            "/faq",
          ),
        )}
      />
    </>
  );
}
