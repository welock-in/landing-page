"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import type { Locale } from "@/i18n/config";

type PostHogClient = Awaited<typeof import("posthog-js")>["default"];

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

/** Configured means both halves are present — a key without a host reaches the wrong region. */
const enabled = Boolean(KEY && HOST);

/**
 * The library is fetched on demand, once, after hydration.
 *
 * A plain `import posthog from "posthog-js"` would put ~500 kB of unminified
 * SDK into the bundle every page loads before it can paint. This site already
 * refuses to preload a 63 kB font for that reason, so analytics does not get a
 * pass: the import lives inside a promise that nothing awaits until the page is
 * interactive, and never resolves at all when the keys are unset.
 */
let clientPromise: Promise<PostHogClient | null> | null = null;

function load(): Promise<PostHogClient | null> {
  if (!enabled || typeof window === "undefined") return Promise.resolve(null);

  clientPromise ??= import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.init(KEY!, {
        api_host: HOST,
        /**
         * The whole privacy posture, in one option: no cookies, no
         * localStorage, nothing written to the visitor's device. It is what
         * lets the site run analytics across the EU without a consent banner,
         * because the rule that bites here governs storing or reading
         * information on someone's equipment.
         *
         * The cost is real and worth stating plainly: identity does not
         * survive a reload, so "unique visitors" counts sessions rather than
         * people, and a funnel only holds together within one page visit.
         *
         * Undoing this trade means `persistence: "localStorage+cookie"` AND a
         * consent banner gating this component — one without the other is the
         * broken configuration, not an intermediate step.
         */
        persistence: "memory",
        /**
         * Anonymous visitors get events but no person profile. Without it,
         * memory persistence would mint one throwaway person per page load —
         * every one of them stored, billed, and impossible to ever recognise
         * again.
         */
        person_profiles: "identified_only",
        /**
         * Pageviews come from the tracker below instead. App Router navigation
         * changes the URL without a document load, so automatic capture only
         * ever sees the first page of a visit.
         */
        capture_pageview: false,
      });
      return posthog;
    })
    .catch(() => {
      // An analytics script that fails to load is not an outage. Swallow it so
      // a blocked or slow CDN cannot take an unhandled rejection to the
      // console on every page of the site.
      return null;
    });

  return clientPromise;
}

/**
 * Sends a `$pageview` on every route change, including client-side ones.
 *
 * Split out and wrapped in Suspense below because `useSearchParams()` makes the
 * nearest boundary bail out of prerendering. Without that boundary this would
 * quietly turn a fully static marketing site into a dynamically rendered one —
 * the exact regression the rest of the codebase is built to avoid.
 */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Read the URL now, not inside the promise: by the time the SDK resolves
    // the visitor may already be on the next page, and this event belongs to
    // the one that triggered it.
    const query = searchParams.toString();
    const url = `${window.location.origin}${pathname}${query ? `?${query}` : ""}`;

    let cancelled = false;
    void load().then((posthog) => {
      if (posthog && !cancelled) posthog.capture("$pageview", { $current_url: url });
    });

    // A route change before the SDK arrives drops this event on purpose — the
    // effect for the new route is already queued behind its own load().
    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams]);

  return null;
}

/**
 * Wraps the app so analytics initialise once per visit.
 *
 * A no-op when `NEXT_PUBLIC_POSTHOG_KEY` / `NEXT_PUBLIC_POSTHOG_HOST` are
 * unset — which is every local checkout and preview until someone sets them,
 * so nothing here can send a stray event from a laptop into production numbers.
 */
export function PostHogProvider({ locale }: { locale: Locale }) {
  useEffect(() => {
    // The site serves six languages from one domain, so every event has to say
    // which one it came from. Without this the numbers are one undifferentiated
    // blob and the translations cannot be judged against each other.
    void load().then((posthog) => posthog?.register({ locale }));
  }, [locale]);

  if (!enabled) return null;

  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
