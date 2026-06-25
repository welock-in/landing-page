"use client";

import { useState } from "react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ChevronIcon } from "@/components/ui/icons";
import { faqs } from "@/content/faqs";
import { cn } from "@/lib/utils";
import styles from "./Faq.module.css";

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.section} id="faq">
      <Container>
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
        <div className={styles.grid}>
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={faq.question}
                className={cn(styles.item, isOpen && styles.itemOpen)}
              >
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {faq.question}
                  <span className={styles.chev}>
                    <ChevronIcon />
                  </span>
                </button>
                <div className={styles.answer}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
