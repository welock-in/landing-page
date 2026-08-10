"use client";

import Link from "next/link";

import {
  AppleIcon,
  ArrowRightIcon,
  LockIcon,
  WindowsIcon,
} from "@/components/ui/icons";
import {
  useCommon,
  useLocalePath,
  type CommonDictionary,
} from "@/i18n/LocaleContext";
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
   * Fixed label, as a key into `common.cta` — e.g. "lockInForLife". Omit it to
   * get the download CTA, which names the visitor's own platform instead.
   *
   * A key rather than a string because most callers are server components,
   * which cannot read the catalog from context and would otherwise have to be
   * handed the finished wording from three levels up.
   */
  label?: keyof CommonDictionary["cta"] | { text: string };
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
  const { downloadButton, cta } = useCommon();
  const withLocale = useLocalePath();
  const appleSize = size === "compact" ? 18 : 24;
  const labelText =
    label === undefined ? undefined : typeof label === "string" ? cta[label] : label.text;

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

  const content = labelText ? (
    <>
      {glyph}
      <span>{labelText}</span>
    </>
  ) : (
    <>
      {platformGlyphs}
      <span className={styles.forMac}>{downloadButton.forMacOS}</span>
      <span className={styles.forIos}>{downloadButton.forIphone}</span>
      <span className={styles.forWin}>{downloadButton.forWindows}</span>
    </>
  );

  /**
   * The hover layer is a decorative second copy of the label that slides in
   * from the left. It looks identical, but it doubled every wording in the
   * document — and for the adaptive CTA that meant six "Download for …"
   * strings per button, before any of the page's actual content.
   *
   * For the adaptive CTA the wording is therefore drawn from CSS `content`
   * instead: it renders the same pixels, keyed off the same `data-os`, but a
   * generated string is not part of the document text, so a crawler reading
   * the HTML sees the label once rather than twice. Fixed labels are passed in
   * by the caller and cannot come from a stylesheet, so those still duplicate.
   */
  const hoverContent = labelText ? (
    <>
      {glyph}
      <span>{labelText}</span>
    </>
  ) : (
    <>
      {platformGlyphs}
      <span className={styles.hoverLabel} />
    </>
  );

  /**
   * The hover layer's wording comes from CSS `content`, which cannot read a
   * React prop — so the three translations are handed to the stylesheet as
   * custom properties instead. `JSON.stringify` is what makes them valid CSS
   * strings: `content` needs the quotes, and an apostrophe in "Télécharger
   * pour l'iPhone" would otherwise end the value early.
   */
  const labelVars = labelText
    ? undefined
    : ({
        "--dl-mac": JSON.stringify(downloadButton.forMacOS),
        "--dl-ios": JSON.stringify(downloadButton.forIphone),
        "--dl-win": JSON.stringify(downloadButton.forWindows),
      } as React.CSSProperties);

  return (
    <Link
      href={withLocale(href)}
      style={labelVars}
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
        {hoverContent}
        <ArrowRightIcon width={16} height={16} strokeWidth={2.4} />
      </span>
    </Link>
  );
}
