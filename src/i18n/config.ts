/**
 * Locale registry: the single source of truth for what languages exist.
 *
 * Adding a language is meant to be a three-step job and nothing more:
 *   1. add its code to `locales` below and describe it in `LOCALE_META`,
 *   2. copy `src/i18n/messages/en` to `src/i18n/messages/<code>` and translate,
 *   3. register the loader in `src/i18n/dictionaries.ts`.
 * Everything else (routing, the switcher, hreflang, the sitemap) reads from
 * here and picks the new language up on its own.
 *
 * Codes are lowercase because they are URL segments, and a URL that differs
 * only by case is a second URL for the same page. The properly-cased BCP-47
 * tag lives in `LOCALE_META.tag` and is what goes into `<html lang>` and
 * hreflang, where case carries meaning.
 */

export const locales = ["en", "fr", "es", "de", "pt-br", "hi"] as const;

export type Locale = (typeof locales)[number];

/**
 * The language served at the root of the site.
 *
 * English is deliberately un-prefixed: every URL indexed today (`/faq`,
 * `/protection`, …) is English, and moving them under `/en` would turn the
 * site's entire search footprint into redirects overnight. The proxy rewrites
 * `/faq` to `/en/faq` internally so the app still sees a locale segment, while
 * the address bar (and Google) keep the URL they already know.
 */
export const defaultLocale: Locale = "en";

type LocaleMeta = {
  /** BCP-47 tag for `<html lang>`, hreflang and `Intl` formatting. */
  tag: string;
  /** Language name in that language: a switcher should never patronise. */
  label: string;
  /** Short form for the collapsed switcher button. */
  short: string;
  /** Writing direction. All six are LTR today; RTL languages would set "rtl". */
  dir: "ltr" | "rtl";
  /** `og:locale` value. */
  ogLocale: string;
};

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: { tag: "en", label: "English", short: "EN", dir: "ltr", ogLocale: "en_US" },
  fr: { tag: "fr", label: "Français", short: "FR", dir: "ltr", ogLocale: "fr_FR" },
  /**
   * Neutral Spanish rather than es-ES or es-MX.
   *
   * One catalog that reads naturally in both Spain and Latin America is worth
   * more here than two that split the audience, and the wording avoids the
   * handful of words that would pick a side. Add `es-mx` later if the traffic
   * justifies it; the fallback chain means it would only need the strings that
   * actually differ.
   */
  es: { tag: "es", label: "Español", short: "ES", dir: "ltr", ogLocale: "es_ES" },
  de: { tag: "de", label: "Deutsch", short: "DE", dir: "ltr", ogLocale: "de_DE" },
  "pt-br": {
    tag: "pt-BR",
    label: "Português (Brasil)",
    short: "PT",
    dir: "ltr",
    ogLocale: "pt_BR",
  },
  hi: { tag: "hi", label: "हिन्दी", short: "HI", dir: "ltr", ogLocale: "hi_IN" },
};

/** Type guard that also narrows an arbitrary route param to a known locale. */
export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Every locale except the default, i.e. the ones that carry a URL prefix. */
export const prefixedLocales: Locale[] = locales.filter((l) => l !== defaultLocale);
