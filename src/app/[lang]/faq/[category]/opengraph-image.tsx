import { faqCategories, findFaqCategory } from "@/content/faqPage";
import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Welockin FAQ: answers grouped by topic.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = { category: string };

/**
 * Prerendered alongside the pages themselves. The route sets
 * `dynamicParams = false`, so every category is known at build time and no
 * card is ever rendered on demand.
 */
export function generateStaticParams(): Params[] {
  return faqCategories.map((category) => ({ category: category.slug }));
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { category: slug } = await params;
  const category = findFaqCategory(slug);

  return ogCard({
    eyebrow: "FAQ",
    title: category?.headline ?? "Frequently asked questions",
    subtitle: category?.description,
  });
}
