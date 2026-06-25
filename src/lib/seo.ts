import type { Metadata } from "next";

import { siteConfig, siteUrl } from "@/config/site";

type SeoInput = {
  title?: string;
  description?: string;
  /** Site-relative path, e.g. "/pricing". Becomes the canonical URL. */
  path?: string;
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
  image = siteConfig.ogImage,
  noIndex = false,
  keywords = siteConfig.keywords,
}: SeoInput = {}): Metadata {
  const url = new URL(path, siteUrl).toString();
  const resolvedTitle = title ?? siteConfig.title;

  return {
    title: resolvedTitle,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      url,
      title: resolvedTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: resolvedTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [image],
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

/** JSON-LD Organization schema for rich results. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteUrl}/icon.png`,
  };
}

/** JSON-LD WebSite schema. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}
