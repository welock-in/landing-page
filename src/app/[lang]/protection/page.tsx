
import { Footer } from "@/components/layout/Footer";
import { metadataFor, type LangParams } from "@/i18n/metadata";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectionPage } from "@/components/protection/ProtectionPage";

export function generateMetadata({ params }: LangParams) {
  return metadataFor(params, (d) => ({
    ...d.pages.protection.meta,
    path: "/protection",
    keywords: [
    "Welockin Protection",
    "block adult sites",
    "porn blocker",
    "gambling blocker",
    "accountability partner",
    "nuclear mode",
    ],
  }));
}

/** This page advertises its own sections instead of the landing page's. */
const protectionNav = [
  { title: "What you block", href: "#block" },
  { title: "Lock levels", href: "#levels" },
  { title: "Nuclear mode", href: "#nuclear" },
];

export default function ProtectionRoute() {
  return (
    <>
      <Navbar links={protectionNav} />
      <ProtectionPage />
      <Footer />
    </>
  );
}
