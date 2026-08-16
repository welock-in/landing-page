"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { locales, LOCALE_META, type Locale } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleContext";
import { localePath, LOCALE_COOKIE } from "@/i18n/routing";
import styles from "./LanguageSwitcher.module.css";

/**
 * Remembers an explicit language choice for a year.
 *
 * This is what stops the proxy from second-guessing the visitor: without it, a
 * French browser that deliberately switched to English would be redirected
 * back to French on the very next navigation. `SameSite=Lax` because the only
 * thing reading it is our own proxy on a top-level navigation.
 */
function remember(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export function LanguageSwitcher({ label }: { label: string }) {
  const active = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // A dropdown that survives a click anywhere else on the page is a dropdown
  // that ends up stuck open behind the mobile menu.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /**
   * `usePathname` returns the URL the visitor sees, which for English has no
   * locale segment, exactly what `localePath` expects, in every language.
   */
  const current = pathname || "/";

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${label}: ${LOCALE_META[active].label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
        </svg>
        <span>{LOCALE_META[active].short}</span>
      </button>

      {open && (
        <ul className={styles.menu} role="listbox" aria-label={label}>
          {locales.map((locale) => (
            <li key={locale}>
              {/*
                A plain <a>, not next/link: switching language changes the
                document's `lang`, its fonts and its entire text, and a
                client-side transition would leave the old tree in place while
                React reconciled it. A real navigation is both simpler and what
                a screen reader needs in order to re-announce the language.
              */}
              <a
                className={styles.item}
                href={localePath(current, locale)}
                lang={LOCALE_META[locale].tag}
                hrefLang={LOCALE_META[locale].tag}
                aria-current={locale === active ? "true" : undefined}
                onClick={() => remember(locale)}
              >
                <span>{LOCALE_META[locale].label}</span>
                {locale === active && (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6.5 9.5 17 4 11.5" />
                  </svg>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
