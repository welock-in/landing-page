import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ProtectionPage } from "@/components/sections/protection/ProtectionPage";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Protection — Block adult & explicit sites for good",
  description:
    "WeLockIn Protection blocks adult content, gambling, dating apps and mature games across all your devices. Choose how hard it is to turn off.",
  path: "/protection",
});

export default function ProtectionRoute() {
  return (
    <>
      <Navbar />
      <main>
        <ProtectionPage />
      </main>
      <Footer />
    </>
  );
}
