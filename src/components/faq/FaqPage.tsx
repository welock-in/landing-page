"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CtaBand } from "@/components/content/CtaBand";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { siteConfig } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { faqCategories, faqCategoryPath, faqEntryPath } from "@/content/faqPage";
import "./faq-page.css";

/** Lower-case and strip accents so "cout" matches "coût". */
function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Searching only kicks in from two characters — one letter matches everything. */
const MIN_QUERY = 2;

const TRAIL: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

/**
 * The FAQ index.
 *
 * This page is the hub: its job is to route people — and crawlers — to the
 * right answer, so every question here is a real link to its own page rather
 * than an accordion that opens in place. The full answers live one click away
 * on the category hubs and the question pages, which keeps this page from
 * competing with the fifty-odd pages it exists to feed.
 */
type FaqHubCopy = Dictionary["faq"]["hub"];

export function FaqPage({ copy }: { copy: FaqHubCopy }) {
  const [query, setQuery] = useState("");

  const nq = norm(query).trim();
  const searching = nq.length >= MIN_QUERY;

  const cats = useMemo(
    () =>
      faqCategories
        .map((cat) => ({
          ...cat,
          items: cat.items.filter(
            (it) =>
              !searching ||
              norm(`${it.question} ${it.answer} ${it.keywords}`).includes(nq),
          ),
        }))
        // While searching, categories with no hits drop out entirely.
        .filter((c) => !searching || c.items.length > 0),
    [nq, searching],
  );

  const visibleCount = cats.reduce((n, c) => n + c.items.length, 0);
  const noResults = searching && visibleCount === 0;
  const totalCount = faqCategories.reduce((n, c) => n + c.items.length, 0);

  return (
    <main>
      <section className="fq">
        <div className="fq-wrap">
          <Breadcrumbs trail={TRAIL} />

          <h1 className="fq-title">{copy.title}</h1>
          <p className="fq-sub">
            Everything about locking in — and why there&rsquo;s no sneaking back
            out. {totalCount} questions, each with its own page.
          </p>

          <div className="fq-search">
            <span className="fq-searchIcon">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.8-3.8" />
              </svg>
            </span>
            <input
              className="fq-input"
              type="search"
              placeholder={copy.searchPlaceholder}
              aria-label={copy.searchLabel}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query.length > 0 && (
              <button
                className="fq-clear"
                type="button"
                aria-label={copy.clearSearch}
                onClick={() => setQuery("")}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            )}
          </div>

          <div className="fq-cats">
            {cats.map((cat) => (
              <section key={cat.slug} className="fq-cat">
                <div className="fq-catHead">
                  <h2 className="fq-catName">
                    <Link href={faqCategoryPath(cat.slug)}>{cat.name}</Link>
                  </h2>
                  <span className="fq-catCount">
                    {cat.items.length}{" "}
                    {cat.items.length === 1 ? "question" : "questions"}
                  </span>
                </div>

                <ul className="fq-qList">
                  {cat.items.map((it) => (
                    <li key={it.slug}>
                      <Link
                        className="fq-qLink"
                        href={faqEntryPath(cat.slug, it.slug)}
                      >
                        <span className="fq-qText">{it.question}</span>
                        <span className="fq-qTeaser">{it.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {noResults && (
            <div className="fq-empty">
              {/* eslint-disable-next-line @next/next/no-img-element -- hand-drawn mascot */}
              <img
                src="/images/peep-fez.png"
                alt={copy.mascotAlt}
                width={200}
                height={492}
                loading="lazy"
                decoding="async"
              />
              <p className="fq-emptyTitle">
                {copy.noResults} &ldquo;{query}&rdquo;
              </p>
              <p className="fq-emptyText">
                Even Peep couldn&rsquo;t find it. Email{" "}
                <a href={`mailto:${siteConfig.contactEmail}`}>
                  {siteConfig.contactEmail}
                </a>{" "}
                and a real human will answer.
              </p>
            </div>
          )}

          <p className="fq-contact">
            Still stuck?{" "}
            <a href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
          </p>

          <CtaBand />
        </div>
      </section>
    </main>
  );
}
