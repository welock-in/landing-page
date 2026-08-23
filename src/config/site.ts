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
 * a page. It is a hop. Naming the apex here pointed every canonical tag, OG
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
  name: "Welockin",
  title: "Welockin: Block distractions before they block your future.",
  description:
    "Welockin blocks the apps that steal your attention, once and for all. One-click, impossible-to-bypass focus sessions across macOS, iOS, iPadOS and Windows.",
  url: siteUrl,
  locale: "en_US",
  twitter: "@welockin",
  keywords: [
    "Welockin",
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
  authors: [{ name: "Welockin" }] as { name: string; url?: string }[],
  creator: "Welockin",
  /** Built-by line shown on the landing page. */
  builtBy: "Built by students from EPFL & Polytechnique",
  contactEmail: "hello@welock.in",
};

/**
 * Where the organisation is, for `Organization.address`.
 *
 * Deliberately incomplete: `streetAddress` and `postalCode` are absent because
 * there is no registered office to name, and inventing one to fill a schema
 * field is how a structured-data audit turns into a legitimacy problem rather
 * than solving one. Locality, region and country are true and verifiable, and
 * a `PostalAddress` is valid with only those.
 *
 * The cost of the omission is worth knowing: an assistant asked "where is
 * Welockin based" can answer Lausanne, and one asked for a postal address
 * cannot. Fill the two blanks in the day there is a registered address, and
 * every schema block on the site picks them up.
 */
export const organizationAddress = {
  locality: "Lausanne",
  region: "Vaud",
  /** ISO 3166-1 alpha-2, which is what schema.org expects here. */
  country: "CH",
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Product facts, in one place.
 *
 * Deliberately carries no price. The site does not state one anywhere, which
 * also means the `SoftwareApplication` schema ships without an `Offer`. See
 * the note in lib/seo.ts before adding one back.
 */
export const product = {
  /** No device cap: link as many devices as you want; they all lock together. */
  deviceSlots: "unlimited",
  deviceSlotsLabel: "as many devices as you want",
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
/**
 * Labels are keys into `common.nav` rather than literal text. The URL is a
 * property of the site, the wording is a property of the language. `href` is
 * always the un-prefixed path; the locale is applied at render.
 */
export const mainNav: { key: "howItWorks" | "protection" | "download" | "faq"; href: string }[] = [
  { key: "howItWorks", href: "/#how" },
  { key: "protection", href: "/protection" },
  { key: "download", href: "/download" },
  { key: "faq", href: "/faq" },
];

/**
 * Social profiles.
 *
 * These are not decoration: `organizationJsonLd` reads this list straight into
 * `sameAs`, which is the property that tells a search engine (or an assistant
 * checking whether a business is real) that these accounts and this site are
 * one entity rather than several. Adding a profile here is the whole job;
 * nothing else needs editing.
 *
 * Two rules. Only accounts Welockin actually controls, and only URLs that
 * resolve: a `sameAs` pointing at a dead handle is a worse signal than no
 * `sameAs` at all, because it is a claim of identity that fails when checked.
 * And bare profile URLs only. The share button on every one of these platforms
 * hands you the address with `?utm_source=…` attached, and a tracking
 * parameter here tells a search engine the canonical identity of the business
 * is a tracked link, which is exactly the wrong claim.
 */
export const socialLinks: { label: string; href: string }[] = [
  { label: "Instagram", href: "https://www.instagram.com/welock_in" },
];
