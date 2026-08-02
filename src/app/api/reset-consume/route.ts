import type { NextRequest } from "next/server";

import { proxyPost } from "@/lib/apiProxy";

/**
 * `{ token, password }` in; `200 { ok: true }` or
 * `400 { error, code: "RESET_TOKEN_INVALID" }` back — see `proxyPost`.
 */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/auth/password/reset");
}
