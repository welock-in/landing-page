import { AppleIcon, ArrowRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import styles from "./DownloadButton.module.css";

/**
 * The single primary call-to-action used across the site: a hover-slide
 * "Download for macOS" button. `className` lets callers add layout/reveal
 * styles from their own section's module.
 */
export function DownloadButton({ className }: { className?: string }) {
  return (
    <button className={cn(styles.btn, className)} type="button">
      <span className={styles.main}>
        <AppleIcon width={24} height={24} />
        <span>Download for macOS</span>
      </span>
      <span className={styles.hover} aria-hidden="true">
        <AppleIcon width={24} height={24} />
        <span>Download for macOS</span>
        <ArrowRightIcon width={18} height={18} strokeWidth={2.4} />
      </span>
    </button>
  );
}
