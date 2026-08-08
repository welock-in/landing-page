import type { NextRequest } from "next/server";

/**
 * Headers the backend must see as the visitor's, not as ours.
 *
 * `x-forwarded-for` is the load-bearing one: every proxied request reaches the
 * API from the hosting platform, so without the caller's own chain the entire
 * internet lands in a single rate-limit bucket and the limiter protects
 * nothing. `user-agent` rides along so the API's logs stay worth reading.
 */
const RELAYED_HEADERS = ["x-forwarded-for", "user-agent"];

const UNAVAILABLE =
  "The service is temporarily unavailable. Please try again in a moment.";

/**
 * The backend, with a working default.
 *
 * This used to REQUIRE `NEXT_PUBLIC_API_BASE_URL` and answer 500 without it —
 * which is exactly what happened: the site deployed, the page rendered a clean
 * 200, and only the two proxy routes failed, so the reset flow looked healthy
 * and was not. `NEXT_PUBLIC_*` is inlined at BUILD time, so setting the variable
 * after a deploy silently changes nothing until the next build, which makes that
 * failure mode particularly easy to chase in the wrong direction.
 *
 * The value is a public constant — the same in every environment, and not a
 * secret — so demanding configuration for it bought no safety and cost an
 * outage. The override still exists for pointing a preview at a local backend.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://app.connect.welock.in/api";

/**
 * Forward a POST to the Welockin API and relay its answer verbatim.
 *
 * The browser talks to this route rather than to the API directly so the call
 * stays same-origin: nothing to add to the backend's CORS allow-list today,
 * and nothing that breaks the day `CORS_ORIGIN` is narrowed.
 */
export async function proxyPost(
  request: NextRequest,
  path: string,
): Promise<Response> {
  const base = API_BASE;

  const headers = new Headers({ "content-type": "application/json" });
  for (const name of RELAYED_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${base.replace(/\/$/, "")}${path}`, {
      method: "POST",
      headers,
      // Passed through as received. These payloads carry reset tokens and
      // passwords, so nothing here parses, widens or logs the body.
      body: await request.text(),
    });
  } catch (cause) {
    console.error(`API proxy could not reach ${path}:`, cause);
    return Response.json({ error: UNAVAILABLE }, { status: 502 });
  }

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
