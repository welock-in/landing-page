"use client";

/** Live check, same as the design's `reduced()` — read at call time, not cached. */
export function reducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Schedule a timed choreography; returns a cancel function.
 * Direct port of the design's `runSeq`.
 */
export function runSeq(steps: { ms: number; fn: () => void }[]): () => void {
  const ids = steps.map((s) => window.setTimeout(s.fn, s.ms));
  return () => ids.forEach((id) => clearTimeout(id));
}
