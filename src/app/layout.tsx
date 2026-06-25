import type { Metadata, Viewport } from "next";
import { Figtree, Playfair_Display } from "next/font/google";

import { siteConfig, siteUrl } from "@/config/site";
import { buildMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
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
      className={`${figtree.variable} ${playfair.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-ink">
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
