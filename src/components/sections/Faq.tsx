"use client";

import Link from "next/link";
import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { CtaRow } from "@/components/ui/CtaRow";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRightIcon, ChevronIcon } from "@/components/ui/icons";
import { homeFaqs } from "@/content/faqs";
import { faqEntryPath } from "@/content/faqPage";
import { cn } from "@/lib/utils";
import styles from "./Faq.module.css";

/**
 * The landing page's FAQ teaser.
 *
 * The five questions are pulled from the same source as the FAQ pages rather
 * than kept as a separate copy — the copy had already drifted, so the homepage
 * and `/faq` were answering the same question two different ways. Each answer
 * now also links to its own page, which is five crawlable links into the FAQ
 * cluster from the site's strongest page.
 */
export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.section} id="faq">
      <Container>
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className={styles.grid}>
          {homeFaqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.entry.slug}
                className={cn(styles.item, isOpen && styles.itemOpen)}
              >
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {faq.entry.question}
                  <span className={styles.chev}>
                    <ChevronIcon />
                  </span>
                </button>
                <div className={styles.answer}>
                  <p>
                    {faq.entry.answer}{" "}
                    <Link
                      className={styles.more}
                      href={faqEntryPath(faq.categorySlug, faq.entry.slug)}
                    >
                      More on this
                    </Link>
                  </p>
                </div>
              </div>
            );
          })}

          {/* Sixth tile: the escape hatch to the full FAQ page. */}
          <Link href="/faq" className={cn(styles.item, styles.cta)}>
            More questions
            <span className={styles.ctaArrow}>
              <ArrowRightIcon width={18} height={18} strokeWidth={2.4} />
            </span>
          </Link>
        </div>

        <CtaRow>
          <DownloadButton icon="lock" label="Enough questions — lock in" />
        </CtaRow>
      </Container>
    </section>
  );
}
