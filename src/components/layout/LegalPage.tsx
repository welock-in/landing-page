import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import styles from "./LegalPage.module.css";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
};

/**
 * Shared shell for policy pages (Privacy, Account deletion): the site's
 * Navbar + Footer around a centered prose column. Content lives in the
 * page files so each policy owns its own copy.
 */
export function LegalPage({ eyebrow, title, updated, children }: LegalPageProps) {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <Container>
          <header className={styles.header}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.updated}>Last updated: {updated}</p>
          </header>
          <div className={styles.prose}>{children}</div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
