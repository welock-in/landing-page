import type { NextRequest } from "next/server";

import { proxyPost } from "@/lib/apiProxy";

/**
 * `{ name?, email, topic?, message }` in; the API answers `200 { ok: true }`,
 * a `400` validation message, `429` when rate-limited, or `502` with
 * `code: "CONTACT_DELIVERY_FAILED"` when the email could not be delivered.
 * An unreachable API becomes the same graceful 5xx `proxyPost` gives the
 * reset handlers.
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/contact");
}
