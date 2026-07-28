import Link from "next/link";

import styles from "./Breadcrumbs.module.css";

export type Crumb = { name: string; path: string };

/**
 * The visible trail. Its `BreadcrumbList` counterpart is emitted by the page,
 * from the same array — the two must never be able to disagree, which is why
 * pages build one `trail` and pass it to both.
 *
 * Every crumb is a link except the last, which is the current page.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav className={styles.wrap} aria-label="Breadcrumb">
      <ol className={styles.list}>
        {trail.map((crumb, i) => {
          const isLast = i === trail.length - 1;
          return (
            <li key={crumb.path} className={styles.item}>
              {isLast ? (
                <span aria-current="page">{crumb.name}</span>
              ) : (
                <>
                  <Link href={crumb.path}>{crumb.name}</Link>
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
