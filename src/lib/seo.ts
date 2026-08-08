import type { Metadata } from "next";

import { product, siteConfig, siteUrl } from "@/config/site";

type SeoInput = {
  title?: string;
  description?: string;
  /** Site-relative path, e.g. "/pricing". Becomes the canonical URL. */
  path?: string;
  /**
   * Absolute URL of a social image. Omit it and the `opengraph-image` file
   * convention supplies one, with the correct dimensions and alt text — which
   * is why this is no longer defaulted here.
   */
  image?: string;
  noIndex?: boolean;
  keywords?: string[];
};

/**
 * Build a fully-formed `Metadata` object with sensible, SEO-complete
 * defaults (canonical, Open Graph, Twitter). Per-page metadata only needs
 * to override what differs.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image,
  noIndex = false,
  keywords,
}: SeoInput = {}): Metadata {
  const url = new URL(path, siteUrl).toString();
  const resolvedTitle = title ?? siteConfig.title;
  const images = image
    ? [{ url: image, width: 1200, height: 630, alt: resolvedTitle }]
    : undefined;

  return {
    title: resolvedTitle,
    description,
    // Only set where a page has genuinely distinct terms. Repeating one global
    // list on every page says nothing about any of them.
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title: resolvedTitle,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      ...(image ? { images: [image] } : {}),
      creator: siteConfig.twitter,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

/* -------------------------------------------------------------------------- */
/*  Structured data                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Stable node identifiers.
 *
 * Every schema block on the site points at these rather than repeating the
 * organisation and product inline. That is what turns a scatter of unrelated
 * JSON-LD snippets into one graph a search engine — or a language model — can
 * actually resolve: the FAQ on a question page knows which product it is about,
 * and the product knows who publishes it.
 */
const ORG_ID = `${siteUrl}/#organization`;
const SITE_ID = `${siteUrl}/#website`;
const APP_ID = `${siteUrl}/#software`;

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: `${siteUrl}/`,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/icon.png`,
      width: 512,
      height: 512,
    },
    description: siteConfig.description,
    email: siteConfig.contactEmail,
    foundingLocation: { "@type": "Place", name: "Lausanne, Switzerland" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: siteConfig.contactEmail,
      availableLanguage: ["English", "French"],
    },
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    name: siteConfig.name,
    url: `${siteUrl}/`,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

/**
 * The product itself.
 *
 * Ships without an `Offer`, because the site states no price. Worth knowing
 * what that costs: an assistant asked what WeLockIn costs has nothing to read,
 * so it will either say the price is not published or infer a subscription from
 * what the rest of the category charges. If a price is ever published, add the
 * Offer back here first — it is the single highest-leverage node on the site.
 */
export function softwareApplicationJsonLd(): JsonLd {
  return {
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: siteConfig.name,
    url: `${siteUrl}/`,
    applicationCategory: product.category,
    applicationSubCategory: "Distraction blocker",
    operatingSystem: product.operatingSystems.join(", "),
    description: siteConfig.description,
    publisher: { "@id": ORG_ID },
    image: `${siteUrl}/icon.png`,
    softwareHelp: { "@id": `${siteUrl}/faq#faq` },
    featureList: [
      "Block any app or website",
      "One-tap categories: adult content, gambling, dating apps, mature games",
      "Five unlock difficulty levels",
      "Nuclear Mode — locks until a date you set, with no override",
      "Survives restarts and uninstalling the app",
      "Syncs across unlimited devices",
      "Recurring schedules",
      "Notification blocking",
      "On-device filtering — no browsing logs",
      "Focus sounds",
    ],
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: new URL(crumb.path, siteUrl).toString(),
    })),
  };
}

/**
 * FAQ structured data.
 *
 * Worth being clear-eyed about: since 2023 Google has only shown FAQ rich
 * results for government and health sites, so this will not win a rich snippet.
 * It earns its place because ChatGPT, Perplexity and Claude do parse it, and a
 * question marked up as a question is the most extractable shape there is.
 */
export function faqPageJsonLd(
  items: { question: string; answer: string }[],
  path: string,
): JsonLd {
  const url = new URL(path, siteUrl).toString();
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": APP_ID },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Wrap nodes into one `@graph` so they resolve as a single connected entity. */
export function jsonLdGraph(...nodes: JsonLd[]): string {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": nodes });
}
