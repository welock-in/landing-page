import type { NextRequest } from "next/server";

import { proxyPost } from "@/lib/apiProxy";

/** `{ email }` in, always `200 { ok: true }` back; see `proxyPost`. */
export async function POST(request: NextRequest) {
  return proxyPost(request, "/auth/password/reset-request");
}
