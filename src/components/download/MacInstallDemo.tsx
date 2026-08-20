"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { LOCALE_META } from "@/i18n/config";
import { useLocale } from "@/i18n/LocaleContext";
import styles from "./MacInstallDemo.module.css";

/** The strings the panel needs, handed down from `pages.download.installDemo`. */
export type MacInstallDemoCopy = {
  title: string;
  step: string;
  close: string;
  captionsLabel: string;
};

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
 * The macOS card's download link on `/download`, plus the four-second film
 * showing what to do with the file it hands over.
 *
 * The click is deliberately **not** intercepted. `href` still points at the
 * release endpoint, the browser still gets the .dmg, and the panel opens
 * alongside it rather than instead of it. Swapping the download for a video
 * would trade the site's primary conversion for an explanation, and the
 * explanation is worthless on its own: the film opens on the installer window
 * that only appears once you have the .dmg and double-click it.
 *
 * Because nothing is prevented, the modifier keys have to be read. A
 * cmd-click, a middle-click or a right-click means "not here, not now", and
 * none of them should put a modal over the page.
 */
export function MacInstallAction({
  href,
  label,
  className,
  copy,
}: {
  href: string;
  label: string;
  className?: string;
  copy: MacInstallDemoCopy;
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
      {open && <InstallPanel copy={copy} onClose={close} />}
    </>
  );
}

function InstallPanel({
  copy,
  onClose,
}: {
  copy: MacInstallDemoCopy;
  onClose: () => void;
}) {
  const locale = useLocale();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  /* The film is a gesture, four seconds long, and it loops. That is motion
     nobody asked for twice, so a visitor who has asked for less of it gets a
     still first frame and a play button instead. `controls` is on either way,
     which is what keeps the looping version pausable. */
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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <button
          ref={closeRef}
          className={styles.close}
          type="button"
          aria-label={copy.close}
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

        <div className={styles.frame}>
          <video
            className={styles.video}
            width={960}
            height={760}
            controls
            autoPlay={motion}
            loop={motion}
            muted
            playsInline
            preload="auto"
          >
            {/* WebM first: same picture, 10 kB less, and every Mac that meets
                this build's Apple Silicon requirement runs a Safari that
                decodes VP9. The MP4 is what everything older falls back to. */}
            <source src="/videos/install-macos.webm" type="video/webm" />
            <source src="/videos/install-macos.mp4" type="video/mp4" />
            {/* Offered in the captions menu, not `default`: the film's own
                words are burned into the picture for its whole length, so a
                forced track would print a second sentence over the first.
                These cues describe the gesture, in the reader's language. */}
            <track
              kind="captions"
              srcLang={LOCALE_META[locale].tag}
              label={copy.captionsLabel}
              src={`/videos/install-macos.${locale}.vtt`}
            />
          </video>
        </div>
      </div>
    </div>
  );
}
