import { cn } from "@/lib/utils";
import "./blocked.css";

/** Generic stand-in when the app doesn't pass the blocked site's name. */
const FALLBACK = "This website";

export function BlockedScreen({
  siteName,
  className,
}: {
  siteName?: string;
  className?: string;
}) {
  return (
    <div className={cn("blk", className)}>
      <svg
        className="blk-lock"
        width="120"
        height="120"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#a42b1b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
        <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
      </svg>

      <div className="blk-text">
        <h1 className="blk-title">{siteName || FALLBACK}</h1>
        <p className="blk-sub">
          is blocked by <span className="blk-brand">WeLockin</span>
        </p>
      </div>
    </div>
  );
}
