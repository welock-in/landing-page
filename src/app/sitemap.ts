import type { MetadataRoute } from "next";

import {
  allFaqEntries,
  faqCategories,
  faqCategoryPath,
  faqEntryPath,
} from "@/content/faqPage";
import { defaultLocale, LOCALE_META, locales } from "@/i18n/config";
import { localePath } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/utils";

/**
 * The date the content behind these URLs last meaningfully changed.
 *
 * Deliberately a constant rather than `new Date()`. Stamping every entry with
 * build time told crawlers the whole site changed on every deploy, including
 * deploys that touched one CSS file, which trains them to stop believing
 * `lastmod` at all. Bump this when the content actually changes.
 */
const CONTENT_UPDATED = new Date("2026-07-28T00:00:00.000Z");

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

/**
 * Sitemap, derived from the same data that builds the routes.
 *
 * Nothing is listed by hand: adding an FAQ entry or a comparison adds its URL
 * here automatically, so the sitemap cannot fall behind the site, which is
 * how it came to advertise three URLs on a domain that does not resolve.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /**
   * One entry per URL per language, each carrying the full alternates set.
   *
   * `alternates.languages` is the sitemap's half of the hreflang contract: the
   * same annotations the pages carry in their `<head>`. Declaring them in both
   * places is redundant by design: a crawler that reaches a page through the
   * sitemap learns about its siblings before it has fetched any of them, which
   * is what gets the French edition indexed rather than treated as a duplicate
   * of the English one it already knows.
   */
  const languages = (path: string) =>
    Object.fromEntries(
      locales.map((locale) => [
        LOCALE_META[locale].tag,
        absoluteUrl(localePath(path, locale)),
      ]),
    );

  const entry = (
    path: string,
    priority: number,
    changeFrequency: ChangeFrequency,
  ) =>
    locales.map((locale) => ({
      url: absoluteUrl(localePath(path, locale)),
      lastModified: CONTENT_UPDATED,
      changeFrequency,
      // The default language is the one a search engine should prefer when it
      // has no reason to choose; the translations sit just below it.
      priority: locale === defaultLocale ? priority : Math.max(0.1, priority - 0.1),
      alternates: { languages: languages(path) },
    }));

  return [
    ...entry("/", 1, "weekly"),
    ...entry("/download", 0.9, "monthly"),
    ...entry("/protection", 0.9, "monthly"),
    ...entry("/faq", 0.8, "weekly"),
    ...faqCategories.flatMap((category) =>
      entry(faqCategoryPath(category.slug), 0.6, "monthly"),
    ),
    ...allFaqEntries.flatMap(({ category, entry: item }) =>
      entry(faqEntryPath(category.slug, item.slug), 0.5, "monthly"),
    ),
    // Support surface. /help is a hub that links most of the site, so it earns
    // a mid priority; the others are destinations people search for by name.
    ...entry("/help", 0.6, "monthly"),
    ...entry("/support", 0.5, "monthly"),
    ...entry("/contact", 0.5, "yearly"),
    // Legal pages. Listed low and yearly: Play Console and the App Store need
    // them to resolve, crawlers do not need to revisit them.
    ...entry("/terms", 0.3, "yearly"),
    ...entry("/privacy", 0.3, "yearly"),
    ...entry("/delete-account", 0.3, "yearly"),
  ];
}
