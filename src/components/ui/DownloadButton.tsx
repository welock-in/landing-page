import {
  AppleIcon,
  ArrowRightIcon,
  LockIcon,
  WindowsIcon,
} from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import styles from "./DownloadButton.module.css";

type DownloadButtonProps = {
  className?: string;
  /**
   * Fixed label, e.g. "Lock in for life". Omit it to get the download CTA,
   * which names the visitor's own platform.
   */
  label?: string;
  /** "compact" trims height/padding for tight spots like the navbar; "lg" is the share-card CTA. */
  size?: "default" | "compact" | "lg";
  /** Leading glyph for a fixed label: the Apple mark, or a padlock for "lock in" CTAs. */
  icon?: "apple" | "lock";
  /** "onDark" swaps the cream fill in for use on the dark share card. */
  tone?: "default" | "onDark";
};

/**
 * The single primary call-to-action used across the site: a hover-slide
 * button. `className` lets callers add layout/reveal styles from their own
 * section's module.
 *
 * With no `label` it becomes the adaptive download CTA. All three platform
 * wordings ship in the markup and CSS reveals the one matching `data-os` on
 * <html>, so the page stays static and nothing flickers after hydration.
 * macOS is the default, which is also what visitors on Android, Linux or a
 * browser without JS see.
 */
export function DownloadButton({
  className,
  label,
  size = "default",
  icon = "apple",
  tone = "default",
}: DownloadButtonProps) {
  const appleSize = size === "compact" ? 18 : 24;

  const content = label ? (
    <>
      {icon === "lock" ? (
        <LockIcon className={styles.lockIcon} width={20} height={20} />
      ) : (
        <AppleIcon className={styles.appleIcon} width={appleSize} height={appleSize} />
      )}
      <span>{label}</span>
    </>
  ) : (
    <>
      <AppleIcon
        className={cn(styles.appleIcon, styles.glyphApple)}
        width={appleSize}
        height={appleSize}
      />
      <WindowsIcon
        className={cn(styles.appleIcon, styles.glyphWindows)}
        width={appleSize}
        height={appleSize}
      />
      <span className={styles.forMac}>Download for macOS</span>
      <span className={styles.forIos}>Download for iPhone</span>
      <span className={styles.forWin}>Download for Windows</span>
    </>
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
      <span className={styles.main}>{content}</span>
      <span className={styles.hover} aria-hidden="true">
        {content}
        <ArrowRightIcon width={16} height={16} strokeWidth={2.4} />
      </span>
    </button>
  );
}
