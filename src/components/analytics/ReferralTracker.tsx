"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

/**
 * Counts arrivals from a printed link — today, the QR code on the flyers, which
 * points at `welock.in/?ref=qrcode`.
 *
 * PostHog next door already records the pageview with its query string and is
 * the better tool for anything shaped like a funnel. This exists so the admin
 * console can answer "did the flyers do anything" without a second login to a
 * second product, so it is one number and stays one number.
 *
 * The parameter survives everything between the scan and this component:
 * `welock.in` 308s to `www.welock.in` keeping the query, and proxy.ts clones
 * the URL when it rewrites `/` to `/en` or redirects a French visitor to `/fr`,
 * so the search params ride along in all three cases. Worth knowing, because
 * the failure mode of getting that wrong is a counter that reads zero forever
 * and looks exactly like a campaign nobody scanned.
 */

/** The keys a campaign can arrive under, in order of preference. */
const PARAMS = ["ref", "utm_source"] as const;

/**
 * Which campaign names are real is the BACKEND's decision, not this file's —
 * it holds the allow-list and discards the rest. Keeping one list rather than
 * two is the point: a second copy here would eventually disagree with it, and
 * the visible symptom would be a campaign that silently counts nothing.
 *
 * All this does is refuse to send something the API would reject outright,
 * which its schema caps at 40 characters.
 */
function readSource(params: URLSearchParams): string | null {
  for (const key of PARAMS) {
    const raw = params.get(key)?.trim();
    if (raw && raw.length <= 40) return raw;
  }
  return null;
}

/**
 * Production builds only, like the analytics next door — and here it matters
 * more: `npm run dev` talks to the PRODUCTION API by default, so without this
 * every hot reload on someone's laptop would be a scan on the real counter.
 *
 * Checking a change locally therefore needs a production build pointed at a
 * local API (`NEXT_PUBLIC_API_BASE_URL`), which is the honest cost of not
 * letting development write into a number someone will make decisions from.
 */
const enabled = process.env.NODE_ENV === "production";

function Beacon() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const source = readSource(new URLSearchParams(searchParams.toString()));
    if (!source) return;

    /**
     * Once per tab session, so one person reading the page and pressing back
     * twice is one arrival rather than three. That is what makes the number
     * closer to "people who scanned" than to "page loads" — an approximation,
     * and deliberately the cheap one: the alternative is an identifier that
     * outlives the visit, which is a consent question this does not need to
     * open for a flyer counter.
     */
    const key = `wl:ref:${source}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // Storage can be unavailable (private mode, a locked-down browser). Fall
      // through and send: over-counting one visitor beats a counter that stops
      // working for a whole class of them.
    }

    void fetch("/api/referral", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ source }),
      // The scan often lands on a page the visitor leaves quickly. `keepalive`
      // lets the request outlive the document rather than being cancelled on
      // navigation, which is the difference between counting the impatient
      // half of a campaign and not.
      keepalive: true,
    }).catch(() => {
      // A counter that fails is not an outage. Swallow it rather than take an
      // unhandled rejection to the console of a stranger's browser.
    });
  }, [searchParams]);

  return null;
}

/**
 * Split and wrapped in Suspense for the same reason as the pageview tracker:
 * `useSearchParams()` makes the nearest boundary bail out of prerendering, and
 * without a boundary this would quietly turn a fully static marketing site into
 * a dynamically rendered one.
 */
export function ReferralTracker() {
  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <Beacon />
    </Suspense>
  );
}
