import { findFaqEntry, type FaqEntry } from "@/content/faqPage";

/**
 * The five questions the landing page shows.
 *
 * These used to be a hand-written copy of five answers that also exist in
 * `faqPage.ts`, and the two had already drifted apart — the homepage and `/faq`
 * gave different answers to the same question, which is both a bad experience
 * and duplicate content competing with itself. Now the homepage selects from
 * the one source, and each teaser links to that question's own page.
 *
 * Picked to cover the five things a first-time visitor actually decides on:
 * how it works, whether the lock is real, what it blocks, what it runs on, and
 * who is behind it.
 */
const SELECTION: [category: string, question: string][] = [
  ["getting-started", "how-it-works"],
  ["nuclear-mode", "is-it-really-permanent"],
  ["what-you-can-block", "what-can-i-block"],
  ["devices-and-platforms", "supported-devices"],
  ["getting-started", "built-by-students"],
];

export type HomeFaq = { categorySlug: string; entry: FaqEntry };

export const homeFaqs: HomeFaq[] = SELECTION.map(([categorySlug, slug]) => {
  const found = findFaqEntry(categorySlug, slug);
  if (!found) {
    // A slug here that no longer exists would silently drop a question from the
    // landing page. Fail the build instead.
    throw new Error(
      `homeFaqs: no FAQ entry at /faq/${categorySlug}/${slug}. ` +
        "Update the selection in src/content/faqs.ts.",
    );
  }
  return { categorySlug, entry: found.entry };
});
