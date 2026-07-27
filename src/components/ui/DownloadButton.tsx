import { AppleIcon, ArrowRightIcon, LockIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import styles from "./DownloadButton.module.css";

type DownloadButtonProps = {
  className?: string;
  /** Button label, e.g. "Download for macOS" or "Lock in for life". */
  label?: string;
  /** "compact" trims height/padding for tight spots like the navbar; "lg" is the share-card CTA. */
  size?: "default" | "compact" | "lg";
  /** Leading glyph: the Apple mark for downloads, a padlock for "lock in" CTAs. */
  icon?: "apple" | "lock";
  /** "onDark" swaps the cream fill in for use on the dark share card. */
  tone?: "default" | "onDark";
};

/**
 * The single primary call-to-action used across the site: a hover-slide
 * button. `className` lets callers add layout/reveal styles from their own
 * section's module.
 */
export function DownloadButton({
  className,
  label = "Download for macOS",
  size = "default",
  icon = "apple",
  tone = "default",
}: DownloadButtonProps) {
  const appleSize = size === "compact" ? 18 : 24;
  const glyph =
    icon === "lock" ? (
      <LockIcon className={styles.lockIcon} width={20} height={20} />
    ) : (
      <AppleIcon className={styles.appleIcon} width={appleSize} height={appleSize} />
    );

  return (
    <button
      className={cn(
        styles.btn,
        size === "compact" && styles.compact,
        size === "lg" && styles.lg,
        tone === "onDark" && styles.onDark,
        className,
      )}
      type="button"
    >
      <span className={styles.main}>
        {glyph}
        <span>{label}</span>
      </span>
      <span className={styles.hover} aria-hidden="true">
        {glyph}
        <span>{label}</span>
        <ArrowRightIcon width={16} height={16} strokeWidth={2.4} />
      </span>
    </button>
  );
}
