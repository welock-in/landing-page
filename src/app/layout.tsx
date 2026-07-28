import type { Metadata, Viewport } from "next";
import { Figtree, EB_Garamond } from "next/font/google";

import { siteConfig, siteUrl } from "@/config/site";
import { OS_DETECT_SCRIPT } from "@/lib/platform";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

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
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Page titles render as "Page Title · WeLockIn"; the home page uses `default`.
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  ...buildMetadata(),
};

export const viewport: Viewport = {
  themeColor: "#f5f0e8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${ebGaramond.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-ink">
        {/* First thing in the body so the download CTA paints with the right
            platform label — see OS_DETECT_SCRIPT. */}
        <script dangerouslySetInnerHTML={{ __html: OS_DETECT_SCRIPT }} />
        {children}
        <script
          type="application/ld+json"
          // Structured data for search engines.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]),
          }}
        />
      </body>
    </html>
  );
}
