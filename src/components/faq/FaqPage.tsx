"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ChevronIcon, LogoIcon } from "@/components/ui/icons";
import { siteConfig } from "@/config/site";
import { faqCategories } from "@/content/faqPage";
import "./faq-page.css";

/** Lower-case and strip accents so "cout" matches "coût". */
function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Searching only kicks in from two characters — one letter matches everything. */
const MIN_QUERY = 2;

export function FaqPage() {
  const [query, setQuery] = useState("");
  // One category open at a time; the first starts expanded.
  const [openCats, setOpenCats] = useState<Record<number, boolean>>({ 0: true });
  const [openQ, setOpenQ] = useState<string | null>(null);

  const nq = norm(query).trim();
  const searching = nq.length >= MIN_QUERY;

  const cats = useMemo(
    () =>
      faqCategories
        .map((cat, ci) => {
          const items = cat.items
            .map((it, qi) => ({ it, key: `${ci}-${qi}` }))
            .filter(
              ({ it }) =>
                !searching ||
                norm(`${it.question} ${it.answer} ${it.keywords}`).includes(nq),
            );
          return { ...cat, ci, items };
        })
        // While searching, categories with no hits drop out entirely.
        .filter((c) => !searching || c.items.length > 0),
    [nq, searching],
  );

  const visibleCount = cats.reduce((n, c) => n + c.items.length, 0);
  const noResults = searching && visibleCount === 0;

  const toggleCat = (ci: number) => {
    if (searching) return;
    setOpenCats((prev) => ({ [ci]: !prev[ci] }));
  };

  return (
    <>
      <header className="fqTop">
        <div className="fq-topBar">
          <Link className="fq-back" href="/">
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M11 18l-6-6 6-6" />
            </svg>
            Back
          </Link>
          <Link className="fq-brand" href="/" aria-label={`${siteConfig.name} home`}>
            <LogoIcon width={24} height={24} />
            <span>
              welock<span className="fq-brandAccent">.in</span>
            </span>
          </Link>
        </div>
      </header>

      <main>
        <section className="fq">
          <div className="fq-wrap">
            <h1 className="fq-title">Frequently asked questions</h1>
            <p className="fq-sub">
              Everything about locking in — and why there&rsquo;s no sneaking back
              out.
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
                placeholder="Search — e.g. 'porn', 'refund', 'bypass'…"
                aria-label="Search frequently asked questions"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query.length > 0 && (
                <button
                  className="fq-clear"
                  type="button"
                  aria-label="Clear search"
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
              {cats.map((cat) => {
                // A search forces every matching category — and answer — open.
                const catOpen = searching ? cat.items.length > 0 : !!openCats[cat.ci];
                return (
                  <section
                    key={cat.name}
                    className={`fq-cat${catOpen ? " open" : ""}`}
                  >
                    <button
                      className="fq-catHead"
                      type="button"
                      aria-expanded={catOpen}
                      onClick={() => toggleCat(cat.ci)}
                    >
                      <span className="fq-catName">{cat.name}</span>
                      <span className="fq-catMeta">
                        <span className="fq-catCount">
                          {cat.items.length}{" "}
                          {cat.items.length === 1 ? "question" : "questions"}
                        </span>
                        <span className="fq-catChev">
                          <ChevronIcon width={19} height={19} />
                        </span>
                      </span>
                    </button>
                    <div className="fq-catBody">
                      <div className="fq-catBodyIn">
                        <div className="fq-catList">
                          {cat.items.map(({ it, key }) => {
                            const open = searching || openQ === key;
                            return (
                              <div key={key} className={`fq-q${open ? " open" : ""}`}>
                                <button
                                  className="fq-qBtn"
                                  type="button"
                                  aria-expanded={open}
                                  onClick={() => {
                                    if (searching) return;
                                    setOpenQ(openQ === key ? null : key);
                                  }}
                                >
                                  {it.question}
                                  <span className="fq-qChev">
                                    <ChevronIcon width={17} height={17} />
                                  </span>
                                </button>
                                <div className="fq-qAns">
                                  <p>{it.answer}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>

            {noResults && (
              <div className="fq-empty">
                {/* eslint-disable-next-line @next/next/no-img-element -- hand-drawn mascot */}
                <img
                  src="/images/peep-fez.png"
                  alt="Peep, the WeLockIn mascot, looking apologetic"
                />
                <p className="fq-emptyTitle">No results for &ldquo;{query}&rdquo;</p>
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
          </div>
        </section>
      </main>
    </>
  );
}
