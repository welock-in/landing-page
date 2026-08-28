"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

import { LOCALE_META } from "@/i18n/config";
import { useCommon, useLocale } from "@/i18n/LocaleContext";
import type { InstallPlatform } from "./installPlatforms";
import styles from "./InstallDemo.module.css";

/**
 * What each platform's install film is: the sources, the pixel size the
 * aspect box is derived from, and the frame's fallback colour, sampled from
 * that film's own first frame so the moment before it decodes shows the
 * film's corner rather than black.
 *
 * macOS is a .dmg that opens on a window waiting for a drag; Windows is an
 * .exe that greets the visitor with a SmartScreen warning. Both hand over a
 * file whose next step the site never used to show. Which platforms these
 * are is declared in `installPlatforms.ts`, which the server can import;
 * this module is client-only.
 */
const FILMS: Record<
  InstallPlatform,
  { webm: string; mp4: string; vtt: string; width: number; height: number }
> = {
  macos: {
    webm: "/videos/install-macos.webm",
    mp4: "/videos/install-macos.mp4",
    vtt: "/videos/install-macos.",
    width: 960,
    height: 760,
  },
  windows: {
    webm: "/videos/install-windows.webm",
    mp4: "/videos/install-windows.mp4",
    vtt: "/videos/install-windows.",
    width: 960,
    height: 960,
  },
};

/**
 * One scroll lock shared by every panel instance, counted rather than saved
 * per instance.
 *
 * The panel mounts from several hosts per page (the navbar CTA plus a card,
 * the hero or a band), and a keyboard user can tab out of one open panel and
 * open a second. Two instances each saving `document.body.style.overflow` on
 * mount would deadlock the page: the second saves "hidden", the first restores
 * "", the second then "restores" hidden onto a page with nothing open. The
 * counter makes the last close the one that unlocks, whatever the order.
 */
let scrollLocks = 0;
let scrollOverflowBefore = "";

function lockScroll() {
  if (scrollLocks++ === 0) {
    scrollOverflowBefore = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
}

function unlockScroll() {
  if (--scrollLocks === 0) {
    document.body.style.overflow = scrollOverflowBefore;
  }
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const motionAllowed = () => !window.matchMedia(MOTION_QUERY).matches;
/* Never reached: the panel only ever mounts from a click. Required by the
   hook's signature, and `false` is the honest answer for a render with no
   media queries to read. */
const motionAllowedOnServer = () => false;

/**
 * A download link on `/download`, plus the film showing what to do with the
 * file it hands over.
 *
 * The click is deliberately **not** intercepted. `href` still points at the
 * release endpoint, the browser still gets the file, and the panel opens
 * alongside it rather than instead of it. Swapping the download for a video
 * would trade the site's primary conversion for an explanation, and the
 * explanation is worthless on its own: each film opens on a window that only
 * appears once you have the file.
 *
 * Because nothing is prevented, the modifier keys have to be read. A
 * cmd-click, a middle-click or a right-click means "not here, not now", and
 * none of them should put a modal over the page.
 */
export function InstallAction({
  platform,
  href,
  label,
  className,
}: {
  platform: InstallPlatform;
  href: string;
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <a
        className={className}
        href={href}
        onClick={(e) => {
          const plain =
            e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
          if (plain) setOpen(true);
        }}
      >
        {label}
      </a>
      {open && <InstallPanel platform={platform} onClose={close} />}
    </>
  );
}

/**
 * The modal itself, exported on its own for the site-wide download CTA: that
 * button already routes a plain click straight at the visitor's own build, so
 * it opens this panel alongside the download exactly as the `/download` cards
 * do, without also being an `<a>` from this file.
 *
 * Copy comes from `common.installDemo` rather than a prop. The panel can open
 * from the navbar of any page, and `common` is precisely the catalog slice
 * that ships everywhere.
 */
export function InstallPanel({
  platform,
  onClose,
}: {
  platform: InstallPlatform;
  onClose: () => void;
}) {
  const locale = useLocale();
  const { installDemo } = useCommon();
  const copy = installDemo[platform];
  const film = FILMS[platform];
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  /* The film is a gesture and it loops. That is motion nobody asked for
     twice, so a visitor who has asked for less of it gets a still first frame
     and a play button instead. `controls` is on either way, which is what
     keeps the looping version pausable. */
  const motion = useSyncExternalStore(
    subscribeMotion,
    motionAllowed,
    motionAllowedOnServer,
  );

  /* Opening, and putting it all back on the way out: the scroll lock, the
     Escape handler, and the focus, which belongs on the link that opened this
     rather than back at the top of the document. */
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    lockScroll();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll();
      opener?.focus?.();
    };
  }, [onClose]);

  /* `aria-modal` is a promise that the rest of the page is out of reach, and
     the attribute alone keeps that promise only for assistive tech. For the
     keyboard it has to be kept here: Tab past the last control wraps to the
     first, Shift-Tab off the first wraps to the last, and focus never lands
     on the dimmed page behind, where an Enter on another download CTA would
     stack a second panel over this one. */
  const trapTab = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
      'button, video, [href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusables?.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || !panelRef.current?.contains(active))) {
      e.preventDefault();
      first.focus();
    }
  };

  /* Portaled to <body> rather than rendered where the trigger sits. The
     trigger can be anywhere in the site's chrome, and two of those homes
     defeat `position: fixed` from the inside: the share card's
     `contain: paint` and the navbar pill's `backdrop-filter` each make the
     ancestor the containing block for fixed descendants, which pins the
     "full-screen" overlay inside a card or a 66px bar and clips the close
     button out of reach. From <body> there is no ancestor to be captured by,
     and z-index 200 clears the navbar's 100 on its own. */
  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
      onKeyDown={trapTab}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          className={styles.close}
          type="button"
          aria-label={installDemo.close}
          onClick={onClose}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <h2 id={titleId} className={styles.title}>
          {copy.title}
        </h2>
        <p className={styles.step}>{copy.step}</p>

        <div className={styles.frame} data-platform={platform}>
          <video
            className={styles.video}
            width={film.width}
            height={film.height}
            controls
            autoPlay={motion}
            loop={motion}
            muted
            playsInline
            preload="auto"
          >
            {/* WebM first: same picture, fewer bytes. The macOS floor now
                reaches back to Intel Macs on Monterey (the build is universal),
                and Safari there still decodes VP9 — in software, which is fine
                for a short demo film. The MP4 fallback stays for everything
                older; do not drop it to save bandwidth without re-checking the
                real support floor. */}
            <source src={film.webm} type="video/webm" />
            <source src={film.mp4} type="video/mp4" />
            {/* Offered in the captions menu, not `default`: each film's own
                words are burned into the picture for its whole length, so a
                forced track would print a second sentence over the first.
                These cues describe the clicks, in the reader's language. */}
            <track
              kind="captions"
              srcLang={LOCALE_META[locale].tag}
              label={installDemo.captionsLabel}
              src={`${film.vtt}${locale}.vtt`}
            />
          </video>
        </div>
      </div>
    </div>,
    document.body,
  );
}
