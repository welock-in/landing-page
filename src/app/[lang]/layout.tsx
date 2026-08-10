import type { Metadata, Viewport } from "next";
import { Figtree, EB_Garamond } from "next/font/google";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig, siteUrl } from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, LOCALE_META, locales } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { OS_DETECT_SCRIPT } from "@/lib/platform";
import {
  buildMetadata,
  jsonLdGraph,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "../globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  // 800 is used by the Protection page headlines.
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  // The only serif left on the site is the footer's newsletter field, so one
  // upright weight covers it. Preloading it put ~63kB of font for a field
  // nobody sees until they reach the bottom on the critical path.
  weight: ["600"],
  display: "swap",
  preload: false,
});

/**
 * Prerenders one tree per language.
 *
 * Without this the non-default locales would be rendered on demand, which for a
 * static marketing site means the first visitor from France pays for the build.
 */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(siteUrl),
    // Page titles render as "Page Title · Welockin"; the home page uses `default`.
    title: {
      default: dict.pages.home.meta.title,
      template: `%s · ${siteConfig.name}`,
    },
    applicationName: siteConfig.name,
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    ...buildMetadata({
      description: dict.pages.home.meta.description,
      path: "/",
      locale: lang,
    }),
  };
}

export const viewport: Viewport = {
  themeColor: "#f5f0e8",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const { tag, dir } = LOCALE_META[lang];

  return (
    <html
      lang={tag}
      dir={dir}
      className={`${figtree.variable} ${ebGaramond.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-ink">
        {/* First thing in the body so the download CTA paints with the right
            platform label — see OS_DETECT_SCRIPT. */}
        <script dangerouslySetInnerHTML={{ __html: OS_DETECT_SCRIPT }} />
        <LocaleProvider locale={lang} common={dict.common}>
          {children}
        </LocaleProvider>
        {/* Site-wide entities. Individual pages add their own nodes — product,
            breadcrumbs, FAQ — which reference these two by @id rather than
            restating them. */}
        <JsonLd graph={jsonLdGraph(organizationJsonLd(), websiteJsonLd())} />
      </body>
    </html>
  );
}
