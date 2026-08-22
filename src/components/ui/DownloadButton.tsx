"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { InstallPanel } from "@/components/download/InstallDemo";
import { isInstallPlatform } from "@/components/download/installPlatforms";
import {
  AppleIcon,
  ArrowRightIcon,
  LockIcon,
  WindowsIcon,
} from "@/components/ui/icons";
import { directDownloadHref } from "@/content/platformDownloads";
import {
  useCommon,
  useLocalePath,
  type CommonDictionary,
} from "@/i18n/LocaleContext";
import { useDetectedOs } from "@/lib/useDetectedOs";
import { cn } from "@/lib/utils";
import styles from "./DownloadButton.module.css";

/**
 * The one `href` that means "this button is the download CTA".
 *
 * Callers that pass something else are pointing somewhere specific and are left
 * alone; only the default is rerouted to the file itself.
 */
const DOWNLOAD_PAGE = "/download";

type DownloadButtonProps = {
  className?: string;
  /**
   * Where the CTA goes. Defaults to `/download`.
   *
   * This used to render a `<button>` with no handler, so the site's primary
   * call to action led nowhere at all: no conversion, and no internal link
   * from any page to the one page that matters most.
   *
   * Left at the default it is now a starting point rather than a destination:
   * see the note on the component about going straight to the build.
   */
  href?: string;
  /**
   * Fixed label, as a key into `common.cta`, e.g. "lockInForLife". Omit it to
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
 *
 * The button says "Download for Windows", so it downloads for Windows. Once
 * the page is interactive it points at that platform's own URL, taken from the
 * same table `/download` renders its cards from, and the visitor gets the
 * installer (or the store, for whatever ends up there) without a stop on the
 * way. Three things keep that honest:
 *
 * - The URL is never written here. `directDownloadHref` reads the table, and
 *   the two live entries are the release endpoints that already answer with
 *   whichever build is published, so shipping a new version stays a matter of
 *   publishing it. Nothing on the site names a version or a file.
 * - The platform comes from the attribute the label is chosen from, so the
 *   wording and the destination cannot disagree.
 * - Anything unresolved falls back to `/download`: no JS, a platform with no
 *   URL yet (iPhone today), a platform with no build at all (Android). The
 *   server renders that fallback, so the HTML a crawler reads still links to
 *   the page, and so does a visitor whose browser never ran the script.
 */
export function DownloadButton({
  className,
  href = DOWNLOAD_PAGE,
  label,
  size = "default",
  icon = "apple",
  tone = "default",
}: DownloadButtonProps) {
  const { downloadButton, cta } = useCommon();
  const withLocale = useLocalePath();
  const detectedOs = useDetectedOs();
  const [demoOpen, setDemoOpen] = useState(false);
  const closeDemo = useCallback(() => setDemoOpen(false), []);
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
   * document, and for the adaptive CTA that meant six "Download for …"
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
   * React prop, so the three translations are handed to the stylesheet as
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

  /**
   * The build's own URL where there is one, the download page otherwise.
   *
   * Null on the server and through hydration, so the first client render is the
   * one the server sent and only the `href` attribute is patched afterwards.
   * Swapping the element for a plain `<a>` would do the same job, at the cost
   * of throwing away the node React had just hydrated.
   *
   * `<Link>` handles both sides of the swap. It is only for same-origin routes,
   * and it knows it: an absolute URL somewhere else is left to the browser,
   * unprefetched and uncaptured, which is precisely the native click that lets
   * the file download without leaving the page. The page stays as it is, and
   * on a store URL the browser navigates instead. Whichever it does is decided
   * by what answers at the other end, not here.
   */
  const direct = href === DOWNLOAD_PAGE ? directDownloadHref(detectedOs) : null;

  /**
   * The platform whose install film should open alongside the click, or null
   * when the click is not handing over a build.
   *
   * The `/download` cards already open the film on the click that starts the
   * download; this button is the same click made from anywhere else on the
   * site, so it gets the same film. The gate is `direct`: only a click that
   * goes straight at a release endpoint has a file landing that needs
   * explaining. A click routed to `/download` reaches the cards, which show
   * the film themselves, and a platform without a film of its own
   * (`isInstallPlatform`) has nothing to open.
   */
  const demoPlatform =
    direct !== null && detectedOs !== null && isInstallPlatform(detectedOs)
      ? detectedOs
      : null;

  return (
    <>
      <Link
        href={direct ?? withLocale(href)}
        style={labelVars}
        onClick={
          demoPlatform
            ? (e) => {
                /* Same reading of the modifiers as the cards: nothing is
                   prevented, so a cmd-click, middle-click or right-click means
                   "not here, not now" and must not put a modal over the page. */
                const plain =
                  e.button === 0 &&
                  !e.metaKey &&
                  !e.ctrlKey &&
                  !e.shiftKey &&
                  !e.altKey;
                if (plain) setDemoOpen(true);
              }
            : undefined
        }
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
      {demoOpen && demoPlatform && (
        <InstallPanel platform={demoPlatform} onClose={closeDemo} />
      )}
    </>
  );
}
