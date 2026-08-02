import Link from "next/link";

/**
 * The red "Lock in" CTA with the looping shackle-snap animation.
 * A real link to /download — the design's dead <button> made clickable.
 */
export function LockInLink({ label }: { label: string }) {
  return (
    <Link className="li-btn" href="/download">
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
      {label}
    </Link>
  );
}
