import type { NextRequest } from "next/server";

import { proxyPost } from "@/lib/apiProxy";

/**
 * `{ source }` in, `204` out — where a printed link sent this visitor.
 *
 * Same-origin like the contact and reset handlers next door, for the same
 * reason: the browser never talks to the API directly, so nothing has to be
 * added to the backend's CORS allow-list and nothing breaks the day
 * `CORS_ORIGIN` is narrowed.
 *
 * The API answers 204 whether or not it counted anything — an unrecognised
 * campaign is discarded there rather than refused, so an old flyer is a no-op
 * and not an error in a stranger's browser console.
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/referrals/hit");
}
