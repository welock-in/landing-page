/**
 * URL <-> locale plumbing.
 *
 * Deliberately dependency-free and side-effect-free: the proxy runs this in the
 * edge runtime, server components run it during prerender, and the language
 * switcher runs it in the browser. Nothing here may import React, `next/*` or
 * the message catalogs.
 */

import { defaultLocale, isLocale, locales, type Locale } from "./config";

/**
 * Splits a pathname into its locale segment and the rest.
 *
 * `/fr/faq` -> `{ locale: "fr", path: "/faq" }`
 * `/faq`    -> `{ locale: "en", path: "/faq" }`  (default locale is implicit)
 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const [, first = "", ...rest] = pathname.split("/");
  if (isLocale(first)) {
    const path = "/" + rest.join("/");
    return { locale: first, path: path === "/" ? "/" : stripTrailingSlash(path) };
  }
  return { locale: defaultLocale, path: pathname === "" ? "/" : pathname };
}

/**
 * Builds the public URL for `path` in `locale`.
 *
 * The default locale gets no prefix, which is the whole point of the scheme:
 * see `defaultLocale` in config.ts. Hash and query survive, because half the
 * site's internal links are anchors like `/#how` and `/download#macos`.
 */
export function localePath(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  // Keep `#how` / `?x=1` out of the segment arithmetic, then re-attach.
  const marker = normalized.search(/[#?]/);
  const bare = marker === -1 ? normalized : normalized.slice(0, marker);
  const suffix = marker === -1 ? "" : normalized.slice(marker);

  const { path: withoutLocale } = splitLocale(bare);
  if (locale === defaultLocale) return `${withoutLocale}${suffix}`;

  const base = withoutLocale === "/" ? "" : withoutLocale;
  return `/${locale}${base}${suffix}`;
}

/** True when the path already carries an explicit locale segment. */
export function hasLocalePrefix(pathname: string): boolean {
  const [, first = ""] = pathname.split("/");
  return isLocale(first);
}

function stripTrailingSlash(path: string): string {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/**
 * Picks the best locale for an `Accept-Language` header.
 *
 * A deliberately small negotiator rather than `@formatjs/intl-localematcher` +
 * `negotiator`: the docs reach for those two packages, but they are ~30 kB of
 * dependency in the proxy (which runs on every request) to choose between
 * four languages. The rules that actually matter here are quality ordering and
 * matching `pt-BR` from a bare `pt`, and both fit in the loop below.
 *
 * Returns `undefined` rather than the default when nothing matches, so callers
 * can tell "asked for English" apart from "asked for something we don't have".
 */
export function matchLocale(acceptLanguage: string | null): Locale | undefined {
  if (!acceptLanguage) return undefined;

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      const quality = q === undefined ? 1 : Number.parseFloat(q);
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(quality) ? 0 : quality };
    })
    .filter((entry) => entry.tag && entry.q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    // Exact match first: "pt-br" beats the generic "pt" branch below.
    const exact = locales.find((l) => l === tag);
    if (exact) return exact;

    // "fr-CH" -> "fr". Also lets a bare "pt" reach "pt-br", which is the only
    // Portuguese the site has and certainly closer than falling through to
    // English.
    const base = tag.split("-")[0];
    const loose = locales.find((l) => l === base || l.split("-")[0] === base);
    if (loose) return loose;
  }

  return undefined;
}

/** Cookie the switcher writes so a manual choice outranks `Accept-Language`. */
export const LOCALE_COOKIE = "welockin_locale";
