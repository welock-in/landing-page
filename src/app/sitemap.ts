import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils";

/**
 * Sitemap. Currently a single-page marketing site, so it lists the home
 * route only. As real routes (e.g. /blog, /changelog) are added, push them
 * here — or derive from the data layer for large/dynamic sets.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/protection"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
