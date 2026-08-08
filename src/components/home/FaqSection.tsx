"use client";

import Link from "next/link";
import { useState } from "react";

import { FAQS } from "./data";

/**
 * FAQ accordion — one item open at a time, answers animate via the CSS
 * `grid-template-rows: 0fr → 1fr` trick. The last cell links to /faq.
 */
export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <div className="sh-head">
          <span className="sh-eyebrow">FAQ</span>
          <h2 className="sh-title">Frequently asked questions</h2>
        </div>
        <div className="faq-grid">
          {FAQS.map((f, i) => (
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
                  <Link className="faq-more" href={f.more}>
                    Read the full answer
                  </Link>
                </p>
              </div>
            </div>
          ))}
          <Link className="faq-item faq-cta" href="/faq">
            More questions
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
