import "server-only";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { buildMetadata } from "@/lib/seo";
import { isLocale } from "./config";
import { getDictionary, type Dictionary } from "./dictionaries";

type PageSeo = {
  title?: string;
  description?: string;
  /** Un-prefixed path, e.g. "/download". The locale is applied for you. */
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
};

/**
 * `generateMetadata` for a localised page, in one call.
 *
 * Every page needs the same four things: reject an unknown `lang`, load the
 * catalog, pull its own title and description out of it, and stamp the locale
 * so the canonical and hreflang set come out right. Doing that by hand in
 * fourteen files is fourteen chances to forget the locale and quietly
 * canonicalise the French page to the English one, which is precisely the bug
 * that makes a translated site invisible in search.
 *
 * Usage:
 *   export function generateMetadata({ params }: LangParams) {
 *     return metadataFor(params, (d) => ({ ...d.pages.download.meta, path: "/download" }));
 *   }
 */
export async function metadataFor(
  params: Promise<{ lang: string }>,
  pick: (dict: Dictionary) => PageSeo,
): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  return buildMetadata({ ...pick(dict), locale: lang });
}

/** Props shape shared by every page and layout under `app/[lang]`. */
export type LangParams = { params: Promise<{ lang: string }> };
