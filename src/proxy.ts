import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** The one canonical spelling of the FAQ route. */
const CANONICAL = "/faq";

/**
 * Sends the uppercase FAQ spellings to the canonical lowercase route.
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
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === CANONICAL) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = CANONICAL;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ["/FAQ", "/Faq"],
};
