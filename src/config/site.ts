/**
 * Central site configuration.
 *
 * Single source of truth for branding, URLs, and SEO defaults.
 * Anything that appears in metadata, the sitemap, or structured data
 * should be derived from here so it stays consistent everywhere.
 */

/**
 * The host production actually serves.
 *
 * `welock.in` 308-redirects to `www.welock.in` at the edge, so the apex is not
 * a page — it is a hop. Naming the apex here pointed every canonical tag, OG
 * URL and sitemap entry at a redirect, which is the one thing a canonical must
 * never be. If the redirect is ever flipped to serve the apex instead (nicer,
 * given the brand is the domain hack), change this line and nothing else.
 */
const PROD_URL = "https://www.welock.in";

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

/**
 * Commercial facts, in one place.
 *
 * These are the numbers structured data, `/pricing.md` and every comparison
 * page quote. An AI assistant answering "how much is WeLockIn" reads whichever
 * of those it reaches first, so they must never be able to disagree.
 */
export const product = {
  price: 20,
  currency: "USD",
  /** One purchase, no renewal — the whole positioning. */
  billing: "one-time" as const,
  /** Device slots included with the single purchase. */
  deviceSlots: 3,
  deviceSlotsLabel: "1 computer + 1 phone + 1 tablet",
  operatingSystems: ["macOS", "iOS", "iPadOS", "Windows"],
  comingSoon: ["Android"],
  category: "ProductivityApplication",
} as const;

/**
 * Primary navigation.
 *
 * These used to be in-page anchors, which meant the header shipped no crawlable
 * links to anywhere but `/`. Real routes here give every page a link back to
 * each hub, on every page of the site.
 */
export const mainNav: { title: string; href: string }[] = [
  { title: "How it works", href: "/#how" },
  { title: "Protection", href: "/protection" },
  { title: "Pricing", href: "/pricing" },
  { title: "Compare", href: "/vs" },
  { title: "FAQ", href: "/faq" },
];

/**
 * Social profiles.
 *
 * Empty because no real profile URLs exist in this repo yet. Fill them in and
 * they should also go into `sameAs` on the Organization schema — that is the
 * property that tells a search engine those accounts and this site are the
 * same entity, which is currently the largest missing signal on the site.
 */
export const socialLinks: { label: string; href: string }[] = [];
