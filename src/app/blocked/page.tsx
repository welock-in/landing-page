import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";

import { BlockedScreen } from "@/components/blocked/BlockedScreen";
import { buildMetadata } from "@/lib/seo";

// This screen is the one place the brand uses a grotesk rather than Figtree,
// so the face is loaded on this route only.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = buildMetadata({
  title: "Blocked",
  description: "This site is blocked by Welockin.",
  path: "/blocked",
  // An in-app interstitial, not a landing page — keep it out of search results.
  noIndex: true,
});

export default async function BlockedRoute({
  searchParams,
}: {
  searchParams: Promise<{ site?: string | string[] }>;
}) {
  // The app deep-links here as /blocked?site=Instagram.com; without it we fall
  // back to the generic wording.
  const { site } = await searchParams;
  const siteName = (Array.isArray(site) ? site[0] : site)?.slice(0, 80);

  return <BlockedScreen siteName={siteName} className={hanken.className} />;
}
