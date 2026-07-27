import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Sends the uppercase FAQ spellings to the canonical lowercase route.
 *
 * A `redirects()` rule in next.config can't do this: its matching is
 * case-insensitive, so a `/FAQ` -> `/faq` rule matches `/faq` too and loops
 * forever. The proxy matcher is case-sensitive, so it can target the aliases
 * without catching the destination.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/faq";
  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: ["/FAQ", "/Faq"],
};
