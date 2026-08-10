import { Hanken_Grotesk } from "next/font/google";
import { metadataFor, type LangParams } from "@/i18n/metadata";

import { notFound } from "next/navigation";

import { BlockedScreen } from "@/components/blocked/BlockedScreen";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

// This screen is the one place the brand uses a grotesk rather than Figtree,
// so the face is loaded on this route only.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function generateMetadata({ params }: LangParams) {
  return metadataFor(params, (d) => ({
    ...d.pages.blocked.meta,
    path: "/blocked",
    noIndex: true,
  }));
}

export default async function BlockedRoute({
  params,
  searchParams,
}: LangParams & {
  searchParams: Promise<{ site?: string | string[] }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { blocked } = (await getDictionary(lang)).pages;

  // The app deep-links here as /blocked?site=Instagram.com; without it we fall
  // back to the generic wording.
  const { site } = await searchParams;
  const siteName = (Array.isArray(site) ? site[0] : site)?.slice(0, 80);

  return (
    <BlockedScreen siteName={siteName} className={hanken.className} copy={blocked} />
  );
}
