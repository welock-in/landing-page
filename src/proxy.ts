import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { LOCALE_COOKIE, matchLocale } from "@/i18n/routing";

/** The one canonical spelling of the FAQ route. */
const CANONICAL_FAQ = "/faq";

/** The uppercase spellings that have to land on it. */
const FAQ_ALIASES = new Set(["/FAQ", "/Faq"]);

/**
 * Routing that has to happen before a route is picked: FAQ case-folding, then
 * language.
 *
 * ## FAQ spellings
 *
 * Two different layers match paths case-insensitively, and both have already
 * caused a redirect loop on the live site:
 *   - `redirects()` in next.config matches `/faq` against a `/FAQ` rule.
 *   - Vercel's routing layer does the same with the matcher below, even though
 *     `next dev` treats it as case-sensitive — so this looked fine locally and
 *     still took the page down in production.
 *
 * Hence the guard: whatever invokes this function, it can never redirect the
 * canonical path to itself. The redirect is temporary so a future mistake here
 * cannot get cached in anyone's browser for good.
 *
 * ## Language
 *
 * English is served un-prefixed and every other language carries a prefix, so
 * there are three cases:
 *   - `/fr/faq`  — already addressed, pass it through.
 *   - `/en/faq`  — a second URL for a page that already has one. Redirected to
 *                  `/faq` permanently, because duplicate content is the one SEO
 *                  problem this whole scheme exists to avoid.
 *   - `/faq`     — English by default, but a visitor who reads French should
 *                  land on French. If a preference says so, redirect once;
 *                  otherwise rewrite to `/en/faq` internally so the app sees a
 *                  locale segment and the address bar does not.
 *
 * An explicit choice from the switcher (the cookie) always outranks the
 * browser's `Accept-Language`, so picking English on a French laptop sticks.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (FAQ_ALIASES.has(pathname) && pathname !== CANONICAL_FAQ) {
    const url = request.nextUrl.clone();
    url.pathname = CANONICAL_FAQ;
    return NextResponse.redirect(url, 307);
  }

  const [, first = "", ...rest] = pathname.split("/");

  if (isLocale(first)) {
    if (first !== defaultLocale) return NextResponse.next();

    // `/en/...` -> `/...`
    const url = request.nextUrl.clone();
    const stripped = "/" + rest.join("/");
    url.pathname = stripped === "/" ? "/" : stripped.replace(/\/$/, "");
    return NextResponse.redirect(url, 308);
  }

  const preferred = preferredLocale(request);

  if (preferred && preferred !== defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${preferred}${pathname === "/" ? "" : pathname}`;
    // Temporary: the visitor's language is a property of the visitor, not of
    // the URL, and a permanent redirect would pin one person's browser
    // preference into everyone else's cache.
    return NextResponse.redirect(url, 307);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

/** Explicit choice first, browser preference second, no opinion third. */
function preferredLocale(request: NextRequest) {
  const chosen = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(chosen)) return chosen;
  return matchLocale(request.headers.get("accept-language"));
}

export const config = {
  /**
   * Everything except Next's internals, the API routes, and any path with a
   * file extension — `sitemap.xml`, `robots.txt`, `llms.txt` and the icons are
   * single-language resources and must not acquire a locale prefix.
   */
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
