import type { Metadata } from "next";

import "@/components/content/content.css";
import { FaqPage } from "@/components/faq/FaqPage";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { JsonLd } from "@/components/ui/JsonLd";
import { allFaqEntries } from "@/content/faqPage";
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqPageJsonLd,
  jsonLdGraph,
  softwareApplicationJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQ — Everything about locking in",
  description:
    "How WeLockIn blocks apps and sites, the five unlock difficulty levels, Nuclear Mode, supported devices, privacy and troubleshooting — answered.",
  path: "/faq",
  keywords: [
    "WeLockIn FAQ",
    "app blocker questions",
    "nuclear mode",
    "unlock difficulty levels",
    "app blocker that cannot be bypassed",
  ],
});

const TRAIL = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default function FaqRoute() {
  return (
    <>
      <Navbar />
      <FaqPage />
      <Footer />

      {/* The hub links to every answer, so its structured data carries every
          question too — this is the URL most likely to be reached for a broad
          "WeLockIn FAQ" query, by a person or an assistant. */}
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
