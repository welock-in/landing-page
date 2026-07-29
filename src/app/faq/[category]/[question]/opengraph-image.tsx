import { allFaqEntries, findFaqEntry } from "@/content/faqPage";
import { ogCard, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "A WeLockIn FAQ answer.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = { category: string; question: string };

export function generateStaticParams(): Params[] {
  return allFaqEntries.map(({ category, entry }) => ({
    category: category.slug,
    question: entry.slug,
  }));
}

export default async function Image({ params }: { params: Promise<Params> }) {
  const { category, question } = await params;
  const found = findFaqEntry(category, question);

  return ogCard({
    eyebrow: found?.category.name ?? "FAQ",
    // The question itself is the headline — someone sharing this link is
    // sharing the answer to that one thing.
    title: found?.entry.question ?? "Frequently asked questions",
    subtitle: found?.entry.description,
  });
}
