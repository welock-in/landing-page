/**
 * Central site configuration.
 *
 * Single source of truth for branding, URLs, and SEO defaults.
 * Anything that appears in metadata, the sitemap, or structured data
 * should be derived from here so it stays consistent everywhere.
 */

const PROD_URL = "https://welock.in";

/** Absolute base URL of the site, env-overridable for previews/staging. */
export const siteUrl: string = (
  process.env.NEXT_PUBLIC_SITE_URL ?? PROD_URL
).replace(/\/$/, "");

export const siteConfig = {
  name: "WeLockIn",
  title: "WeLockIn — Block distractions before they block your future.",
  description:
    "WeLockIn blocks the apps that steal your attention — once and for all. One-click, impossible-to-bypass focus sessions across macOS, iOS and Windows. $20 for life.",
  url: siteUrl,
  locale: "en_US",
  /** Used for OG images and Twitter cards. */
  ogImage: `${siteUrl}/opengraph-image`,
  twitter: "@welockin",
  keywords: [
    "WeLockIn",
    "block distractions",
    "focus app",
    "app blocker",
    "website blocker",
    "deep work",
    "productivity",
    "study focus",
    "Freedom alternative",
    "nuclear lock",
  ] as string[],
  authors: [{ name: "WeLockIn" }] as { name: string; url?: string }[],
  creator: "WeLockIn",
  /** Built-by line shown on the pricing card. */
  builtBy: "Built by students from EPFL & Polytechnique",
  contactEmail: "hello@welock.in",
};

export type SiteConfig = typeof siteConfig;

/** Primary navigation — consumed by the header and the sitemap. */
export const mainNav: { title: string; href: string }[] = [
  { title: "How it works", href: "/#how" },
  { title: "Features", href: "/#features" },
  { title: "Devices", href: "/#download" },
  { title: "Impact", href: "/#stats" },
  { title: "FAQ", href: "/#faq" },
];

export const socialLinks: { label: string; href: string }[] = [];
