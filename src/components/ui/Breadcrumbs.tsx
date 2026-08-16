"use client";

import Link from "next/link";

import { useCommon, useLocalePath } from "@/i18n/LocaleContext";
import styles from "./Breadcrumbs.module.css";

export type Crumb = { name: string; path: string };

/**
 * The visible trail. Its `BreadcrumbList` counterpart is emitted by the page,
 * from the same array: the two must never be able to disagree, which is why
 * pages build one `trail` and pass it to both.
 *
 * Every crumb is a link except the last, which is the current page.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const { breadcrumbs } = useCommon();
  const withLocale = useLocalePath();

  return (
    <nav className={styles.wrap} aria-label={breadcrumbs.label}>
      <ol className={styles.list}>
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          // "Home" is the one crumb every trail shares, so it is the one whose
          // wording the catalog owns; the rest name a page and come from it.
          const name = crumb.path === "/" ? breadcrumbs.home : crumb.name;
          return (
            <li key={crumb.path} className={styles.item}>
              {isLast ? (
                <span aria-current="page">{name}</span>
              ) : (
                <>
                  <Link href={withLocale(crumb.path)}>{name}</Link>
                  <span className={styles.sep} aria-hidden="true">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
