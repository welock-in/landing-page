import Link from "next/link";

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
   * Where the CTA goes. Defaults to `/download`.
   *
   * This used to render a `<button>` with no handler, so the site's primary
   * call to action led nowhere at all — no conversion, and no internal link
   * from any page to the one page that matters most.
   */
  href?: string;
  /**
   * Fixed label, e.g. "Lock in for life". Omit it to get the download CTA,
   * which names the visitor's own platform.
   */
  label?: string;
  /** "compact" trims height/padding for tight spots like the navbar; "lg" is the share-card CTA. */
  size?: "default" | "compact" | "lg";
  /**
   * Leading glyph for a fixed label: the Apple mark, a padlock for "lock in"
   * CTAs, or "auto" to follow the visitor's platform where the full adaptive
   * wording would not fit.
   */
  icon?: "apple" | "lock" | "auto";
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
  href = "/download",
  label,
  size = "default",
  icon = "apple",
  tone = "default",
}: DownloadButtonProps) {
  const appleSize = size === "compact" ? 18 : 24;

  /** Apple mark and Windows logo both ship; `data-os` shows one. */
  const platformGlyphs = (
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
    </>
  );

  const glyph =
    icon === "lock" ? (
      <LockIcon className={styles.lockIcon} width={20} height={20} />
    ) : icon === "auto" ? (
      platformGlyphs
    ) : (
      <AppleIcon className={styles.appleIcon} width={appleSize} height={appleSize} />
    );

  const content = label ? (
    <>
      {glyph}
      <span>{label}</span>
    </>
  ) : (
    <>
      {platformGlyphs}
      <span className={styles.forMac}>Download for macOS</span>
      <span className={styles.forIos}>Download for iPhone</span>
      <span className={styles.forWin}>Download for Windows</span>
    </>
  );

  return (
    <Link
      href={href}
      className={cn(
        styles.btn,
        size === "compact" && styles.compact,
        size === "lg" && styles.lg,
        tone === "onDark" && styles.onDark,
        className,
      )}
    >
      <span className={styles.main}>{content}</span>
      <span className={styles.hover} aria-hidden="true">
        {content}
        <ArrowRightIcon width={16} height={16} strokeWidth={2.4} />
      </span>
    </Link>
  );
}
