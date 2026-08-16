"use client";

import Link from "next/link";

import { useCommon, useLocalePath, type CommonDictionary } from "@/i18n/LocaleContext";

/**
 * The salmon "Lock in" CTA with the looping shackle-snap animation.
 * A real link to /download: the design's dead <button> made clickable.
 *
 * Takes the catalog key rather than the finished string: the wording is the
 * same on every page, so threading it through four sections as a prop would
 * only create four more places to forget to translate.
 */
export function LockInLink({ label }: { label: keyof CommonDictionary["cta"] }) {
  const { cta } = useCommon();
  const withLocale = useLocalePath();

  return (
    <Link className="li-btn" href={withLocale("/download")}>
      <svg
        className="li-lock"
        viewBox="0 0 28 28"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path className="li-shackle" d="M9.4 12.8V9.4a4.6 4.6 0 0 1 9.2 0v3.4" />
        <rect x="5.7" y="12.6" width="16.6" height="12.6" rx="3.4" />
        <circle cx="14" cy="18.9" r="1.35" fill="currentColor" stroke="none" />
      </svg>
      {cta[label]}
    </Link>
  );
}
