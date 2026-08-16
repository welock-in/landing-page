"use client";

import Link from "next/link";
import { useState } from "react";

import { useCommon, useLocalePath } from "@/i18n/LocaleContext";
import { FAQ_LINKS } from "./data";
import type { HomeCopy } from "./HomePage";

/**
 * FAQ accordion: one item open at a time, answers animate via the CSS
 * `grid-template-rows: 0fr → 1fr` trick. The last cell links to /faq.
 *
 * The questions come from the catalog and their "read the full answer" targets
 * from `FAQ_LINKS`, matched by position: a URL is not translated, so the two
 * lists are deliberately kept apart rather than repeating every slug in four
 * languages.
 */
export function FaqSection({ copy }: { copy: HomeCopy["faqSection"] }) {
  const { cta } = useCommon();
  const withLocale = useLocalePath();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <div className="sh-head">
          <span className="sh-eyebrow">{copy.eyebrow}</span>
          <h2 className="sh-title">{copy.title}</h2>
        </div>
        <div className="faq-grid">
          {copy.items.map((f, i) => (
            <div className={`faq-item${open === i ? " open" : ""}`} key={f.question}>
              <button
                type="button"
                className="faq-question"
                aria-expanded={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {f.question}
                <span className="faq-chev">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
              <div className="faq-answer">
                <p>
                  {f.answer}{" "}
                  <Link className="faq-more" href={withLocale(FAQ_LINKS[i])}>
                    {cta.readFullAnswer}
                  </Link>
                </p>
              </div>
            </div>
          ))}
          <Link className="faq-item faq-cta" href={withLocale("/faq")}>
            {cta.moreQuestions}
            <span className="faq-ctaArrow">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
