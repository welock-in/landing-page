import type { Metadata } from "next";

import { FaqPage } from "@/components/faq/FaqPage";
import { Footer } from "@/components/layout/Footer";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "FAQ — Everything about locking in",
  description:
    "How WeLockIn blocks apps and sites, the five unlock difficulty levels, Nuclear Mode, supported devices, privacy and pricing — answered.",
  path: "/faq",
  keywords: [
    "WeLockIn FAQ",
    "app blocker questions",
    "nuclear mode",
    "unlock difficulty levels",
    "one-time payment focus app",
  ],
});

export default function FaqRoute() {
  return (
    <>
      <FaqPage />
      <Footer />
    </>
  );
}
