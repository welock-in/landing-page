/**
 * Proactive content negotiation over the `Accept` header.
 *
 * Deliberately dependency-free and side-effect-free, for the same reason
 * `i18n/routing.ts` is: the proxy runs this on every request, and pulling
 * `negotiator` or `accepts` into that path is ~30 kB of dependency to choose
 * between two media types.
 *
 * The rules implemented here are RFC 9110 §12.5.1, and they are the ones a
 * naive `header.includes("text/markdown")` gets wrong. Chrome sends
 *
 *   Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*\/*;q=0.8
 *
 * which contains no markdown at all, but a substring check against `text/*`
 * or a careless wildcard rule will still hand a browser a wall of raw
 * markdown. Ranking properly is what keeps humans on the HTML.
 *
 * See https://acceptmarkdown.com/guides/accept-parsing for the convention
 * this implements, and its test vectors, which live in tests/accept.test.ts.
 */

/** The two representations every negotiable page on this site can produce. */
export const HTML = "text/html";
export const MARKDOWN = "text/markdown";

/**
 * HTML first, and the order matters: it is the answer to a request that
 * expresses no preference (`Accept: *\/*`, or no header at all), which is
 * every browser that predates the convention and every crawler that has not
 * adopted it.
 */
export const PAGE_REPRESENTATIONS = [HTML, MARKDOWN] as const;

type AcceptEntry = {
  /** Lower-cased media range, e.g. `text/markdown`, `text/*`, `*\/*`. */
  range: string;
  /** Quality factor, 0..1. Absent means 1. */
  q: number;
  /** 2 for a full type, 1 for a subtype wildcard, 0 for `*\/*`. */
  specificity: number;
};

/**
 * Splits an `Accept` header into ranked entries, in the order they appear.
 *
 * Position is kept (the array is not sorted) because it is the tie-breaker:
 * `Accept: text/markdown, text/html` states a preference that q-values alone
 * cannot express, both being q=1.
 */
export function parseAccept(header: string): AcceptEntry[] {
  const entries: AcceptEntry[] = [];

  for (const part of header.split(",")) {
    const [rawRange = "", ...params] = part.trim().split(";");
    const range = rawRange.trim().toLowerCase();
    if (!range) continue;

    let q = 1;
    for (const param of params) {
      const [name = "", value = ""] = param.split("=");
      if (name.trim().toLowerCase() !== "q") continue;
      const parsed = Number.parseFloat(value.trim());
      // A malformed q is not a rejection: RFC 9110 says a recipient that
      // cannot parse a parameter should ignore it, and treating `q=banana`
      // as q=0 would 406 a client that merely has a sloppy HTTP library.
      if (!Number.isNaN(parsed)) q = Math.min(1, Math.max(0, parsed));
    }

    const specificity = range === "*/*" ? 0 : range.endsWith("/*") ? 1 : 2;
    entries.push({ range, q, specificity });
  }

  return entries;
}

/** Does `range` cover `mediaType`? */
function matches(range: string, mediaType: string): boolean {
  if (range === "*/*") return true;
  if (range.endsWith("/*")) return mediaType.startsWith(range.slice(0, -1));
  return range === mediaType;
}

/**
 * Picks the representation to serve, or `null` when the client has ruled all
 * of them out (which is the one case that earns a 406).
 *
 * Two rules do the real work:
 *
 *   - A more specific range wins over a less specific one *regardless of q*.
 *     `text/html;q=0, *\/*` means "anything but HTML", not "HTML is fine
 *     because the wildcard says so".
 *   - Across candidates, the highest q wins; equal q is broken by the order
 *     the client wrote them in.
 *
 * A missing or empty header means "no constraint", which is not the same as
 * "nothing works": serve the default rather than 406.
 */
export function negotiate(
  header: string | null | undefined,
  produces: readonly string[] = PAGE_REPRESENTATIONS,
): string | null {
  const fallback = produces[0] ?? null;
  if (!header || !header.trim()) return fallback;

  const entries = parseAccept(header);
  if (entries.length === 0) return fallback;

  let best: string | null = null;
  let bestQ = -1;
  let bestPosition = Number.POSITIVE_INFINITY;

  for (const candidate of produces) {
    let matched: AcceptEntry | null = null;
    let matchedPosition = Number.POSITIVE_INFINITY;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!matches(entry.range, candidate)) continue;
      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && i < matchedPosition)
      ) {
        matched = entry;
        matchedPosition = i;
      }
    }

    // No range covers this candidate, or the client explicitly refused it.
    if (matched === null || matched.q <= 0) continue;

    if (
      matched.q > bestQ ||
      (matched.q === bestQ && matchedPosition < bestPosition)
    ) {
      best = candidate;
      bestQ = matched.q;
      bestPosition = matchedPosition;
    }
  }

  if (best !== null) return best;

  /* Nothing matched positively. There are two ways to arrive here and they
     deserve different answers:

       Accept: application/pdf          asked for something real that this
                                        site does not produce. That is a 406.

       Accept: text/markdown;q=0        asked for anything except Markdown.
                                        It named no positive preference at
                                        all, so HTML is not merely allowed,
                                        it is the obvious answer.

     Telling them apart is the difference between a spec-correct 406 and a
     406 served to a client that would have been perfectly happy. */
  const onlyExclusions = entries.every((entry) => entry.q <= 0);
  if (onlyExclusions) {
    for (const candidate of produces) {
      const refused = entries.some((entry) => matches(entry.range, candidate));
      if (!refused) return candidate;
    }
  }

  return null;
}

/**
 * Adds `Accept` to a `Vary` header without disturbing what is already there.
 *
 * Next sets `Vary: rsc, next-router-state-tree, …` on every app-router
 * response, so this cannot simply assign. Losing those values would make a
 * CDN serve an RSC flight payload to a browser navigating to the same URL.
 */
export function appendVary(headers: Headers, value = "Accept"): void {
  const existing = headers.get("Vary");
  if (!existing) {
    headers.set("Vary", value);
    return;
  }
  const present = existing.split(",").map((token) => token.trim().toLowerCase());
  if (present.includes(value.toLowerCase())) return;
  headers.set("Vary", `${existing}, ${value}`);
}
