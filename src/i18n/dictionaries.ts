import "server-only";

import { defaultLocale, type Locale } from "./config";

/**
 * Message catalogs, one folder per locale.
 *
 * English is imported eagerly because it is both the default locale and the
 * fallback for every other one: it is needed on every render regardless.
 * The rest are dynamic imports so a French page never pulls the Hindi
 * catalog into the build's module graph.
 *
 * Catalogs are split by surface rather than kept in one file: a translator
 * working on the landing page opens `home.json` and sees only the landing
 * page, and a diff on the FAQ never collides with a diff on the navbar.
 */
import enCommon from "./messages/en/common.json";
import enFaq from "./messages/en/faq.json";
import enHome from "./messages/en/home.json";
import enPages from "./messages/en/pages.json";

/**
 * The English catalog defines the shape of every other one.
 *
 * This is what makes a missing translation a type error rather than a blank
 * space on the page: `fr.json` is checked against these types on every build.
 */
export type Dictionary = {
  common: typeof enCommon;
  home: typeof enHome;
  pages: typeof enPages;
  faq: typeof enFaq;
};

const en: Dictionary = {
  common: enCommon,
  home: enHome,
  pages: enPages,
  faq: enFaq,
};

const loaders: Record<Exclude<Locale, "en">, () => Promise<PartialDeep<Dictionary>>> = {
  fr: async () => ({
    common: (await import("./messages/fr/common.json")).default,
    home: (await import("./messages/fr/home.json")).default,
    pages: (await import("./messages/fr/pages.json")).default,
    faq: (await import("./messages/fr/faq.json")).default,
  }),
  es: async () => ({
    common: (await import("./messages/es/common.json")).default,
    home: (await import("./messages/es/home.json")).default,
    pages: (await import("./messages/es/pages.json")).default,
    faq: (await import("./messages/es/faq.json")).default,
  }),
  de: async () => ({
    common: (await import("./messages/de/common.json")).default,
    home: (await import("./messages/de/home.json")).default,
    pages: (await import("./messages/de/pages.json")).default,
    faq: (await import("./messages/de/faq.json")).default,
  }),
  "pt-br": async () => ({
    common: (await import("./messages/pt-br/common.json")).default,
    home: (await import("./messages/pt-br/home.json")).default,
    pages: (await import("./messages/pt-br/pages.json")).default,
    faq: (await import("./messages/pt-br/faq.json")).default,
  }),
  hi: async () => ({
    common: (await import("./messages/hi/common.json")).default,
    home: (await import("./messages/hi/home.json")).default,
    pages: (await import("./messages/hi/pages.json")).default,
    faq: (await import("./messages/hi/faq.json")).default,
  }),
};

/**
 * Every key optional, all the way down.
 *
 * A translation catalog is allowed to be incomplete (that is the point of the
 * fallback), so the loaders are typed against this rather than `Dictionary`.
 * What a catalog may NOT do is invent keys or change a string into an object;
 * that still fails the build.
 */
type PartialDeep<T> = T extends readonly unknown[]
  ? T
  : T extends object
    ? { [K in keyof T]?: PartialDeep<T[K]> }
    : T;

/**
 * Overlays a translation onto English, key by key.
 *
 * Anything the translation omits keeps the English string, so a half-finished
 * catalog renders a half-translated page instead of a broken one. Arrays are
 * replaced wholesale, never merged element-wise: a French FAQ with three
 * bullets where English has five is a legitimate translation, not three
 * translated bullets followed by two English ones.
 */
function withFallback<T>(base: T, override: PartialDeep<T> | undefined): T {
  if (override === undefined || override === null) return base;
  if (Array.isArray(base) || typeof base !== "object" || base === null) {
    return override as T;
  }

  const out = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
    if (value === undefined) continue;
    out[key] = withFallback(
      (base as Record<string, unknown>)[key],
      value as PartialDeep<unknown>,
    );
  }
  return out as T;
}

/**
 * Built catalogs, memoised per locale.
 *
 * Pages prerender per locale and several of them render the same catalog, so
 * without this the merge would run once per page rather than once per language.
 */
const cache = new Map<Locale, Promise<Dictionary>>();

/** Loads the full message catalog for `locale`, English-filled. */
export function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === defaultLocale) return Promise.resolve(en);

  const cached = cache.get(locale);
  if (cached) return cached;

  const built: Promise<Dictionary> = loaders[locale as Exclude<Locale, "en">]()
    .then((translated) => withFallback<Dictionary>(en, translated))
    .catch(() => {
      // A catalog that fails to load must not take the page down with it:
      // English is always a correct answer, just not the requested one.
      console.error(`[i18n] falling back to "${defaultLocale}": ${locale} failed to load`);
      return en;
    });

  cache.set(locale, built);
  return built;
}
