import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import "@/components/content/content.css";
import { CtaBand } from "@/components/content/CtaBand";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  faqCategories,
  faqCategoryPath,
  faqEntryPath,
  findFaqCategory,
} from "@/content/faqPage";
import { metadataFor } from "@/i18n/metadata";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  jsonLdGraph,
  softwareApplicationJsonLd,
} from "@/lib/seo";

type Params = { lang: string; category: string };

// Only this segment's params: `lang` is supplied by the parent layout's
// own generateStaticParams, which is what fans each of these out per language.
export function generateStaticParams(): Omit<Params, "lang">[] {
  return faqCategories.map((category) => ({ category: category.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  if (!findFaqCategory(slug)) return {};

  // The category's own framing is translated even though the 44 answers under
  // it are not: the hub is what search results show, and a translated
  // headline on it is worth more than a translated paragraph three clicks in.
  return metadataFor(params, (d) => {
    const translated = d.faq.categories[slug as keyof typeof d.faq.categories];
    return {
      title: translated.headline,
      description: translated.description,
      path: faqCategoryPath(slug),
    };
  });
}

/**
 * A category hub.
 *
 * Its job is twofold: answer the topic in one place for anyone who lands here
 * from search, and give every question in the category a strong inbound link
 * from a page that is itself two clicks from the homepage.
 */
export default async function FaqCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: slug } = await params;
  const category = findFaqCategory(slug);
  if (!category) notFound();

  const path = faqCategoryPath(slug);
  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
    { name: category.name, path },
  ];

  const siblings = faqCategories.filter((c) => c.slug !== slug);

  return (
    <>
      <Navbar />
      <main>
        <div className="cp">
          <div className="cp-wrap">
            <Breadcrumbs trail={trail} />

            <p className="cp-eyebrow">FAQ</p>
            <h1 className="cp-h1">{category.headline}</h1>
            <p className="cp-lead">{category.intro}</p>
            <p className="cp-sub">
              {category.items.length} questions answered.
            </p>

            {/* Question and answer both render here, so the hub stands on its
                own for a reader who never clicks through, and every answer
                still gets its own page for the searches that are that specific. */}
            {category.items.map((entry) => (
              <section key={entry.slug}>
                <h2 className="cp-h2">
                  <Link href={faqEntryPath(slug, entry.slug)}>
                    {entry.question}
                  </Link>
                </h2>
                <p className="cp-p">{entry.answer}</p>
                <p className="cp-sub">
                  <Link href={faqEntryPath(slug, entry.slug)}>
                    Read the full answer
                  </Link>
                </p>
              </section>
            ))}

            <h2 className="cp-h2">Other FAQ topics</h2>
            <div className="cp-cards">
              {siblings.map((sibling) => (
                <Link
                  key={sibling.slug}
                  className="cp-card"
                  href={faqCategoryPath(sibling.slug)}
                >
                  <span className="cp-card-title">{sibling.name}</span>
                  <span className="cp-card-meta">
                    {sibling.items.length} questions
                  </span>
                </Link>
              ))}
            </div>

            <CtaBand />
          </div>
        </div>
      </main>
      <Footer />

      <JsonLd
        graph={jsonLdGraph(
          softwareApplicationJsonLd(),
          breadcrumbJsonLd(trail),
          faqPageJsonLd(
            category.items.map((entry) => ({
              question: entry.question,
              answer: entry.answer,
            })),
            path,
          ),
        )}
      />
    </>
  );
}
