import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/utils";

/**
 * Sitemap. One entry per marketing route. As routes are added (e.g. /blog,
 * /changelog), push them here — or derive from the data layer for
 * large/dynamic sets.
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
    {
      url: absoluteUrl("/faq"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
