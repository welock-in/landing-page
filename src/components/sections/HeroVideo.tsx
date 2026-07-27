"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./Hero.module.css";

const VIDEO_SRC = "/videos/welock-draft.mp4";
const POSTER = "/images/app-dashboard.jpeg";

/**
 * The hero demo video in a clean rounded frame. Plays a muted, looping ambient
 * preview; clicking it opens the clip full-screen with sound. The expand chip
 * in the corner is the only affordance — the design dropped the hand-drawn cue.
 */
export function HeroVideo() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLVideoElement>(null);
  // Only we may restart the preview — on first paint the `autoplay` attribute
  // owns it, so a browser (or user) that declined autoplay stays declined.
  const wasOpen = useRef(false);

  useEffect(() => {
    const ambient = ambientRef.current;
    if (!open) {
      // Resume the ambient preview once the lightbox closes.
      if (wasOpen.current) ambient?.play().catch(() => {});
      return;
    }
    wasOpen.current = true;
    // Pause the in-Mac preview while the full-screen clip is playing.
    ambient?.pause();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <div className={styles.stage}>
        <button
          className={styles.frame}
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Play the WeLockIn demo video"
        >
          <video
            ref={ambientRef}
            className={styles.shot}
            src={VIDEO_SRC}
            poster={POSTER}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
          <span className={styles.expandChip}>
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3" />
              <path d="M16 3h3a2 2 0 0 1 2 2v3" />
              <path d="M8 21H5a2 2 0 0 1-2-2v-3" />
              <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </span>
        </button>
      </div>

      {open && (
        <div
          ref={dialogRef}
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-label="WeLockIn demo video"
          tabIndex={-1}
          onClick={() => setOpen(false)}
        >
          <button
            className={styles.modalClose}
            type="button"
            aria-label="Close video"
            onClick={() => setOpen(false)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className={styles.modalInner} onClick={(e) => e.stopPropagation()}>
            <video
              className={styles.modalVideo}
              src={VIDEO_SRC}
              poster={POSTER}
              controls
              autoPlay
              loop
              playsInline
            />
          </div>
        </div>
      )}
    </>
  );
}
