import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { LOCALE_COOKIE, matchLocale } from "@/i18n/routing";
import { appendVary, MARKDOWN, negotiate } from "@/lib/accept";
import { markdownPath, pagePathFromMarkdown } from "@/lib/markdownUrl";

/** The one canonical spelling of the FAQ route. */
const CANONICAL_FAQ = "/faq";

/** The uppercase spellings that have to land on it. */
const FAQ_ALIASES = new Set(["/FAQ", "/Faq"]);

/**
 * Pages that are HTML and only HTML.
 *
 * All three render something that is true for one visitor for one minute: the
 * site a lock just blocked, the state of a checkout, a reset token from an
 * email. A Markdown twin of any of them would be a static file claiming to
 * describe a page that is different every time it is opened, so they are left
 * out of negotiation entirely and answer in HTML whatever is asked for.
 */
const HTML_ONLY = new Set(["/thanks", "/blocked", "/reset-password"]);

/**
 * The `Vary` tokens Next sets on every app-router response, restated.
 *
 * Restated because they have to be: `app-page.js` ends its Vary handling with
 * `res.setHeader('Vary', ...)`, which overwrites rather than appends, so a
 * value this proxy sets is discarded on any request the page function
 * actually renders. Where the proxy's headers do survive (a prerendered page
 * served straight from the CDN, which is most of this site), setting only
 * `Accept` would drop these four and break client-side navigation caching.
 * Setting the union is correct whichever way the merge falls.
 *
 * If a future Next changes this list, the symptom is a stale prefetch, not a
 * broken page: compare against the `vary` on any response from the live site.
 */
const RSC_VARY =
  "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch";

/**
 * Last segments that belong to Next's metadata file conventions.
 *
 * These live under `/[lang]/`, so they look exactly like pages to the matcher
 * below, but they answer with a PNG. Negotiating them would mean answering a
 * social crawler's `Accept: image/png` with a 406 and stripping the site of
 * its preview images, which is a spectacular way to lose a launch.
 */
const METADATA_ROUTES = new Set([
  "opengraph-image",
  "twitter-image",
  "icon",
  "apple-icon",
  "favicon",
  "manifest",
  "sitemap",
  "robots",
]);

/**
 * Routing that has to happen before a route is picked: FAQ case-folding,
 * language, then representation.
 *
 * ## FAQ spellings
 *
 * Two different layers match paths case-insensitively, and both have already
 * caused a redirect loop on the live site:
 *   - `redirects()` in next.config matches `/faq` against a `/FAQ` rule.
 *   - Vercel's routing layer does the same with the matcher below, even though
 *     `next dev` treats it as case-sensitive, so this looked fine locally and
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
 *   - `/fr/faq`:   already addressed, pass it through.
 *   - `/en/faq`:   a second URL for a page that already has one. Redirected to
 *                  `/faq` permanently, because duplicate content is the one SEO
 *                  problem this whole scheme exists to avoid.
 *   - `/faq`:      English by default, but a visitor who reads French should
 *                  land on French. If a preference says so, redirect once;
 *                  otherwise rewrite to `/en/faq` internally so the app sees a
 *                  locale segment and the address bar does not.
 *
 * An explicit choice from the switcher (the cookie) always outranks the
 * browser's `Accept-Language`, so picking English on a French laptop sticks.
 *
 * ## Representation
 *
 * Every page answers in HTML for a browser and in Markdown for an agent, from
 * the same URL, chosen by `Accept`. See `lib/accept.ts` for the ranking and
 * `lib/agentDocs.ts` for what gets served. Language is settled first: a
 * French speaker asking for Markdown should get the French page's Markdown,
 * not English Markdown at a French URL.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (FAQ_ALIASES.has(pathname) && pathname !== CANONICAL_FAQ) {
    const url = request.nextUrl.clone();
    url.pathname = CANONICAL_FAQ;
    return NextResponse.redirect(url, 307);
  }

  /* `/faq.md` and `/faq` are the same page. Everything below routes the page,
     and the suffix is re-attached to any redirect at the end so an agent that
     asked for Markdown is never bounced onto the HTML. */
  const explicitMarkdown = pagePathFromMarkdown(pathname);
  const routingPath = explicitMarkdown ?? pathname;

  const [, first = "", ...rest] = routingPath.split("/");

  if (isLocale(first)) {
    const withoutLocale = normalize("/" + rest.join("/"));

    if (first !== defaultLocale) {
      return represent(request, first, withoutLocale, explicitMarkdown !== null);
    }

    // `/en/...` -> `/...`
    return redirectTo(request, withoutLocale, explicitMarkdown !== null, 308);
  }

  const path = normalize(routingPath);
  const preferred = preferredLocale(request);

  if (preferred && preferred !== defaultLocale) {
    // Temporary: the visitor's language is a property of the visitor, not of
    // the URL, and a permanent redirect would pin one person's browser
    // preference into everyone else's cache.
    return redirectTo(
      request,
      `/${preferred}${path === "/" ? "" : path}`,
      explicitMarkdown !== null,
      307,
    );
  }

  return represent(request, defaultLocale, path, explicitMarkdown !== null);
}

/** `""` and `"/x/"` both mean `"/x"`. */
function normalize(path: string): string {
  if (path === "" || path === "/") return "/";
  return path.endsWith("/") ? path.slice(0, -1) : path;
}

/** A redirect that keeps the `.md` suffix if the request carried one. */
function redirectTo(
  request: NextRequest,
  path: string,
  markdown: boolean,
  status: 307 | 308,
) {
  const url = request.nextUrl.clone();
  url.pathname = markdown ? markdownPath(path) : path;
  return NextResponse.redirect(url, status);
}

/**
 * Serves `path` in `locale`, as HTML or as Markdown.
 *
 * `path` is un-prefixed and carries no suffix: the locale and the `.md` have
 * both been resolved by the caller.
 */
function represent(
  request: NextRequest,
  locale: Locale,
  path: string,
  explicitMarkdown: boolean,
) {
  if (explicitMarkdown) return rewriteToMarkdown(request, locale, path);

  if (!negotiable(request, path)) return passThrough(request, locale, path, false);

  const chosen = negotiate(request.headers.get("accept"));

  if (chosen === null) {
    // Every representation this URL has was explicitly refused (`q=0`, or an
    // Accept naming only types the site does not produce). RFC 9110 §15.5.7
    // says say so rather than guessing, and list what is on offer.
    return new Response(
      `406 Not Acceptable\n\n` +
        `${request.nextUrl.pathname} is available as:\n` +
        `- text/html\n` +
        `- text/markdown\n\n` +
        `Requested: ${request.headers.get("accept") ?? "(no Accept header)"}\n`,
      {
        status: 406,
        headers: {
          "content-type": "text/plain; charset=utf-8",
          vary: "Accept",
          // Accept is request-specific, and the same URL answers 200 to the
          // next client. Caching this would poison the URL for everyone.
          "cache-control": "no-store",
        },
      },
    );
  }

  if (chosen === MARKDOWN) return rewriteToMarkdown(request, locale, path);

  return passThrough(request, locale, path, true);
}

/**
 * Is this a request where HTML and Markdown are both real answers?
 *
 * Note what is NOT excluded here: React Server Component payloads. They are a
 * third representation of the same URL, but there is no way to recognise one
 * from inside the proxy. Next deletes the `RSC` and router headers, and strips
 * `_rsc` out of `nextUrl`, before this function is reached (verified against
 * 16.2.9; the headers arriving here are accept, host, user-agent and the
 * x-forwarded set, and nothing else). It does not matter: `fetchServerResponse`
 * sets no `Accept` at all, so an RSC fetch arrives as the browser default
 * `Accept: *\/*`, ranks to HTML, and takes the same rewrite it always did.
 */
function negotiable(request: NextRequest, path: string): boolean {
  // Server Actions POST to the page's own URL. There is one representation of
  // an action result, and `Accept` has no say in it.
  if (request.method !== "GET" && request.method !== "HEAD") return false;

  const last = path.split("/").pop() ?? "";
  if (METADATA_ROUTES.has(last)) return false;
  if (HTML_ONLY.has(path)) return false;

  return true;
}

function rewriteToMarkdown(request: NextRequest, locale: Locale, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = `/api/markdown/${locale}${path === "/" ? "" : path}`;
  // No Vary here: the route handler at the other end sets its own, and it is
  // a function response, so nothing overwrites it.
  return NextResponse.rewrite(url);
}

/**
 * The HTML answer: the internal rewrite that gives the app its locale segment,
 * plus the two headers that make the other representation discoverable and
 * cacheable.
 */
function passThrough(
  request: NextRequest,
  locale: Locale,
  path: string,
  negotiated: boolean,
) {
  const needsRewrite = !request.nextUrl.pathname.startsWith(`/${locale}`);
  const response = needsRewrite
    ? NextResponse.rewrite(rewriteUrl(request, locale, path))
    : NextResponse.next();

  if (negotiated) {
    response.headers.set("Vary", RSC_VARY);
    appendVary(response.headers);
    // RFC 8288. Advertises the Markdown twin to anything reading headers
    // rather than parsing the document; `<link rel="alternate">` in the head
    // (see lib/seo.ts) covers the ones that parse it. Advertised even on a
    // path that turns out not to exist: `/nope.md` answers 404 with the site
    // map, which is more use to an agent than the HTML 404 it is looking at.
    response.headers.append(
      "Link",
      `<${markdownPath(request.nextUrl.pathname)}>; rel="alternate"; type="text/markdown"`,
    );
  }

  return response;
}

function rewriteUrl(request: NextRequest, locale: Locale, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${path === "/" ? "" : path}`;
  return url;
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
   * file extension: `sitemap.xml`, `robots.txt`, `llms.txt` and the icons are
   * single-language resources and must not acquire a locale prefix.
   *
   * `.md` is the one extension that has to come back in: it is not a file, it
   * is the second representation of a page, and it needs the same language and
   * redirect handling every page gets.
   */
  matcher: ["/((?!_next/|api/|.*\\.).*)", "/(.*\\.md)"],
};
