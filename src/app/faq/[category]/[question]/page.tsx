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
  allFaqEntries,
  faqCategoryPath,
  faqEntryPath,
  findFaqEntry,
  relatedFaqEntries,
} from "@/content/faqPage";
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqPageJsonLd,
  jsonLdGraph,
  softwareApplicationJsonLd,
} from "@/lib/seo";

type Params = { category: string; question: string };

/**
 * Every question is prerendered at build time. There are only 48 of them and
 * they change when someone edits a file, so there is nothing to gain from
 * rendering any of this on demand.
 */
export function generateStaticParams(): Params[] {
  return allFaqEntries.map(({ category, entry }) => ({
    category: category.slug,
    question: entry.slug,
  }));
}

/** Anything outside the generated set is a typo or a stale link, not a page. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { category, question } = await params;
  const found = findFaqEntry(category, question);
  if (!found) return {};

  return buildMetadata({
    title: found.entry.question,
    description: found.entry.description,
    path: faqEntryPath(category, question),
  });
}

export default async function FaqQuestionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { category: categorySlug, question: questionSlug } = await params;
  const found = findFaqEntry(categorySlug, questionSlug);
  if (!found) notFound();

  const { category, entry } = found;
  const related = relatedFaqEntries(categorySlug, questionSlug);
  const path = faqEntryPath(categorySlug, questionSlug);

  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
    { name: category.name, path: faqCategoryPath(categorySlug) },
    { name: entry.question, path },
  ];

  return (
    <>
      <Navbar />
      <main>
        <article className="cp">
          <div className="cp-wrap">
            <Breadcrumbs trail={trail} />

            <p className="cp-eyebrow">{category.name}</p>
            <h1 className="cp-h1">{entry.question}</h1>

            {/* The direct answer leads, before any supporting detail. Someone
                who reads only this paragraph should still have their answer. */}
            <div className="cp-answer">{entry.answer}</div>

            <h2 className="cp-h2">What that means in practice</h2>
            <ul className="cp-list">
              {entry.detail.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <h2 className="cp-h2">Related questions</h2>
            <div className="cp-cards">
              {related.map(({ categorySlug: slug, entry: item }) => (
                <Link
                  key={`${slug}/${item.slug}`}
                  className="cp-card"
                  href={faqEntryPath(slug, item.slug)}
                >
                  <span className="cp-card-title">{item.question}</span>
                  <span className="cp-card-meta">
                    {slug === categorySlug ? category.name : "More in the FAQ"}
                  </span>
                </Link>
              ))}
            </div>

            <p className="cp-sub">
              Browse all of{" "}
              <Link href={faqCategoryPath(categorySlug)}>{category.name}</Link>, or
              go back to the <Link href="/faq">full FAQ</Link>.
            </p>

            <CtaBand />
          </div>
        </article>
      </main>
      <Footer />

      <JsonLd
        graph={jsonLdGraph(
          softwareApplicationJsonLd(),
          breadcrumbJsonLd(trail),
          faqPageJsonLd(
            [{ question: entry.question, answer: entry.answer }],
            path,
          ),
        )}
      />
    </>
  );
}
