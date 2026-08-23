"use client";

/* eslint-disable @next/next/no-img-element -- flipbook frames and mascot are plain <img>, matching the design byte-for-byte */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { DownloadButton } from "@/components/ui/DownloadButton";
import type { HomeCopy } from "./HomePage";

/** Milliseconds between one headline word starting to rise and the next. */
const WORD_STAGGER = 80;

/* Peep is a single animated image (peep-anim/peep.webp). The flipbook
   timeline is baked into the file itself, so no JS timer and no re-render
   is involved in animating the character. */

/**
 * The live-sessions figure.
 *
 * Randomised per visit rather than hardcoded, so the page does not claim the
 * same 87 people are focusing at three in the morning and at midday.
 *
 * It CANNOT simply be randomised during render: this page is prerendered at
 * build time, so the server would bake one number into the HTML and the client
 * would pick another. React calls that a hydration mismatch and, in a
 * production build, throws away the server's markup for the whole subtree.
 * `useSyncExternalStore` is the supported way to say "the server and the client
 * legitimately disagree here": the build's number ships in the HTML and the
 * drawn one replaces it at hydration, with no warning and no discarded tree.
 * It also reads correctly: a figure that ticks once as the page settles is
 * exactly what "active right now" is claiming.
 */
const SESSIONS_MIN = 77;
const SESSIONS_MAX = 110;
const SESSIONS_SEED = 87;

/* Drawn ONCE per page load and cached at module scope. `getSnapshot` must be
   stable. React calls it on every render and compares the result, so returning
   a fresh random number each time would loop forever. Caching also means a
   client-side navigation back to the home page keeps the figure it already
   showed, which is what a visitor would expect from a single visit. */
let drawnSessions: number | null = null;
const readSessions = () =>
  (drawnSessions ??=
    SESSIONS_MIN + Math.floor(Math.random() * (SESSIONS_MAX - SESSIONS_MIN + 1)));
/* Prerender gets the seed; the real figure arrives at hydration. */
const readSessionsOnServer = () => SESSIONS_SEED;
/* Nothing external ever changes this, so the subscription is a no-op. */
const subscribeNever = () => () => {};

/* Two cuts of the same 34.2 s film. The ambient thumbnail autoplays muted
   behind a poster, so it stays on the silent original and never pays to
   download an audio track it is forbidden from playing. The modal is the only
   place the narration is wanted, so it is the only place the heavier narrated
   file is fetched. Built by `scripts/build-vo.sh` from the ElevenLabs read;
   the script and the beat sheet it is timed to are in VOICEOVER.md. */
const FILM_SILENT = "/videos/welock-draft.mp4";
const FILM_NARRATED = "/videos/welock-draft-vo.mp4";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (onChange: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const motionAllowed = () => !window.matchMedia(MOTION_QUERY).matches;
/* Server render: no `src`, so the 902 KiB ambient clip is never in the
   initial HTML and never competes with the critical render. */
const motionAllowedOnServer = () => false;

export function Hero({ copy }: { copy: HomeCopy["hero"] }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const sessions = useSyncExternalStore(subscribeNever, readSessions, readSessionsOnServer);
  /* The ambient clip is 902 KiB and autoplays. It gets no `src` until the
     client has confirmed motion is welcome, so reduced-motion visitors never
     pay for it. The poster already fills the frame in both cases, so the
     only difference is whether it then starts moving. */
  const ambientOn = useSyncExternalStore(
    subscribeMotion,
    motionAllowed,
    motionAllowedOnServer,
  );
  const ambientRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLVideoElement>(null);
  /* `welock-draft-vo.mp4` is a build artefact: it only exists once someone has
     run scripts/build-vo.sh over an ElevenLabs read. Rather than let a missing
     file leave a broken player in the modal, the first load error drops back to
     the silent cut, which is always in the repo. A half-finished voice-over
     pass therefore costs the visitor nothing. */
  const [narrated, setNarrated] = useState(true);

  const openVideo = () => {
    const amb = ambientRef.current;
    if (amb) {
      try {
        amb.pause();
      } catch {}
    }
    document.body.style.overflow = "hidden";
    setVideoOpen(true);
  };

  const closeVideo = useCallback(() => {
    document.body.style.overflow = "";
    const amb = ambientRef.current;
    if (amb) {
      try {
        void amb.play()?.catch(() => {});
      } catch {}
    }
    setVideoOpen(false);
  }, []);

  /* `autoPlay` on its own is not enough now that the modal cut has sound:
     browsers grant unmuted playback off a user gesture, and some honour it only
     for an explicit play() made while that activation is still live. Clicking
     the thumbnail is a discrete event, so React commits this subtree inside the
     click's own task and the call below lands within the gesture. If it is
     refused regardless, `controls` is right there. */
  useEffect(() => {
    if (!videoOpen) return;
    const v = modalRef.current;
    if (!v) return;
    /* The fallback cut has no audio stream at all, so muting it costs nothing
       and buys back its autoplay: the remount that follows a load error happens
       outside the opening click, and no browser will start unmuted media there.
       Set on the element rather than as a prop, because React has never
       reliably reflected `muted` into the DOM. The narrated cut stays unmuted —
       that is the whole point of it. */
    v.muted = !narrated;
    try {
      void v.play()?.catch(() => {});
    } catch {}
  }, [videoOpen, narrated]);

  /* Escape closes the modal; the body scroll lock is released even if the
     page unmounts while the modal is open. */
  useEffect(() => {
    if (!videoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeVideo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [videoOpen, closeVideo]);

  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );

  return (
    <header className="hero">
      <div className="wrap hero-grid">
        <div className="hero-text">
          {/* The page's <h1>, twice over, and deliberately.

              The visible half is one <span> per word so each can rise on its
              own delay. The words and their line breaks come from the catalog:
              a translation is free to need four words where English needs
              seven, and the stagger is computed from position rather than
              written out.

              Split like that, the headline is seven text nodes wrapped in
              fourteen elements, which is fine for a browser and poor for
              everything else that reads it. Screen readers announce a split
              heading one fragment at a time, and the extraction step in front
              of a language model frequently comes up empty on an <h1> whose
              first child is markup rather than text. So the sentence is also
              carried once, unbroken, as the first thing in the heading; the
              animated copy is hidden from assistive tech so nobody hears it
              twice. Nothing about the rendering changes: `sr-only` takes the
              text out of flow. */}
          <h1 className="hero-headline">
            <span className="sr-only">
              {copy.headline.map((word) => word.text).join(" ")}
            </span>
            <span aria-hidden="true">
              {copy.headline.map((word, i) => (
                <span key={`${word.text}-${i}`}>
                  <span
                    className="hero-word"
                    style={{ animationDelay: `${i * WORD_STAGGER}ms` }}
                  >
                    {word.em ? <em>{word.text}</em> : word.text}
                  </span>
                  {word.br ? <br /> : " "}
                </span>
              ))}
            </span>
          </h1>
          <p className="hero-subtitle">{copy.subtitle}</p>
          <div className="hero-ctaRow">
            <DownloadButton className="home-dl" />
          </div>
          <div className="hero-socialProof">
            <div className="hero-spText">
              <div className="hero-spNow">
                <span className="hero-spDot" aria-hidden="true" />
                <span className="hero-spCount">{sessions}</span>
                <span className="hero-spUnit">{copy.sessionsUnit}</span>
              </div>
              <div className="hero-spLine">{copy.sessionsLine}</div>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-stage">
            <span className="hero-annot" aria-hidden="true"></span>
            <button
              className="hero-frame"
              type="button"
              onClick={openVideo}
              aria-label={copy.playVideo}
            >
              <video
                ref={ambientRef}
                className="hero-shot"
                src={ambientOn ? "/videos/welock-draft.mp4" : undefined}
                poster="/images/app-dashboard.jpeg"
                autoPlay={ambientOn}
                loop
                muted
                playsInline
                preload="metadata"
                /* Decoration: this silent loop is the button's thumbnail, and the
                   button already announces itself ("Play the Welockin demo
                   video"). Hiding it keeps screen readers from meeting a second,
                   nameless media element inside the same control. */
                aria-hidden="true"
              >
                {/* Not `default`: welock-draft.mp4 has no audio stream, the cues
                    only transcribe its burned-in title cards, and rendering them
                    would print that text twice over the frame. */}
                <track
                  kind="captions"
                  srcLang="en"
                  label={copy.captionsLabel}
                  src="/videos/welock-draft.vtt"
                />
              </video>
              <span className="hero-expandChip">
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
            <span className="hero-peep" aria-hidden="true">
              <img
                className="hero-peepImg"
                src="/images/peep-anim/peep.webp"
                alt=""
                width={372}
                height={288}
                decoding="async"
              />
            </span>
          </div>
        </div>
      </div>

      {videoOpen && (
        <div
          className="hero-modal"
          role="dialog"
          aria-modal="true"
          aria-label={copy.videoLabel}
          onClick={closeVideo}
        >
          <button
            className="hero-modalClose"
            type="button"
            aria-label={copy.closeVideo}
            onClick={closeVideo}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <div className="hero-modalInner" onClick={(e) => e.stopPropagation()}>
            <video
              ref={modalRef}
              /* Remounted on fallback rather than re-`src`ed, so the element
                 starts a clean load and `autoPlay` gets a second chance at the
                 replacement source. */
              key={narrated ? "narrated" : "silent"}
              className="hero-modalVideo"
              src={narrated ? FILM_NARRATED : FILM_SILENT}
              poster="/images/app-dashboard.jpeg"
              controls
              autoPlay
              playsInline
              /* Deliberately not `loop`, unlike the ambient thumbnail: this cut
                 is narrated, and restarting the read over a viewer who is still
                 watching the end card is worse than stopping. `controls` gives
                 them the replay. */
              onError={() => setNarrated(false)}
            >
              {/* Offered in the native captions menu, not forced on: hearing
                  visitors already have the burned-in title cards, and the cues
                  would print a second line of text over them. */}
              <track
                kind="captions"
                srcLang="en"
                label={copy.captionsLabel}
                src="/videos/welock-draft.vtt"
              />
            </video>
          </div>
        </div>
      )}
    </header>
  );
}
