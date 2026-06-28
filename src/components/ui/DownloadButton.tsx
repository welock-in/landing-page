import { AppleIcon, ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import styles from "./DownloadButton.module.css";

type DownloadButtonProps = {
  className?: string;
  /** Button label, e.g. "Download for macOS" or "Download for iPhone". */
  label?: string;
  /** "compact" trims height/padding for tight spots like the mobile navbar. */
  size?: "default" | "compact";
};

/**
 * The single primary call-to-action used across the site: a hover-slide
 * download button. `className` lets callers add layout/reveal styles from
 * their own section's module.
 */
export function DownloadButton({
  className,
  label = "Download for macOS",
  size = "default",
}: DownloadButtonProps) {
  const icon = size === "compact" ? 18 : 24;
  return (
    <button
      className={cn(styles.btn, size === "compact" && styles.compact, className)}
      type="button"
    >
      <span className={styles.main}>
        <AppleIcon width={icon} height={icon} />
        <span>{label}</span>
      </span>
      <span className={styles.hover} aria-hidden="true">
        <AppleIcon width={icon} height={icon} />
        <span>{label}</span>
        <ArrowRightIcon width={16} height={16} strokeWidth={2.4} />
      </span>
    </button>
  );
}
