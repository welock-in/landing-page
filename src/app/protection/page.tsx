import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectionPage } from "@/components/protection/ProtectionPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Protection — Block adult & explicit sites for good",
  description:
    "Block adult content, gambling, dating apps and mature games across every device. Five unlock difficulty levels, on-device filtering, always on.",
  path: "/protection",
  keywords: [
    "WeLockIn Protection",
    "block adult sites",
    "porn blocker",
    "gambling blocker",
    "accountability partner",
    "nuclear mode",
  ],
});

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
