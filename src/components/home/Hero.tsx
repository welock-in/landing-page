"use client";

/* eslint-disable @next/next/no-img-element -- flipbook frames and mascot are plain <img>, matching the design byte-for-byte */

import { useCallback, useEffect, useRef, useState } from "react";

import { DownloadButton } from "@/components/ui/DownloadButton";

/**
 * Peep's flipbook timeline — [frame, holdMs]; 3s pauses on the three gaze
 * poses (down, up-left, up-right), then a quick extra glance right.
 */
const PEEP_STEPS: [number, number][] = [
  [4, 300],
  [2, 200],
  [3, 3000], // looks down — pause
  [2, 200],
  [4, 260],
  [1, 3000], // looks up-left — pause
  [4, 220],
  [5, 200],
  [7, 200],
  [6, 3000], // looks up-right — pause
  [8, 240],
  [7, 200],
  [5, 220], // quick extra glance right, then back
];

export function Hero() {
  const [peepFrame, setPeepFrame] = useState(1);
  const [videoOpen, setVideoOpen] = useState(false);
  const ambientRef = useRef<HTMLVideoElement>(null);

  /* Flipbook runner — effect-scoped so StrictMode's mount→cleanup→mount
     never leaves a stray timer (the design used a window.__peepFlip global). */
  useEffect(() => {
    let pos = 0;
    let timer = window.setTimeout(step, PEEP_STEPS[0][1]);
    function step() {
      pos = (pos + 1) % PEEP_STEPS.length;
      setPeepFrame(PEEP_STEPS[pos][0]);
      timer = window.setTimeout(step, PEEP_STEPS[pos][1]);
    }
    return () => clearTimeout(timer);
  }, []);

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
          <h1 className="hero-headline">
            <span>
              <span className="hero-word" style={{ animationDelay: "0ms" }}>
                Block
              </span>{" "}
            </span>
            <span>
              <span className="hero-word" style={{ animationDelay: "80ms" }}>
                distractions
              </span>
              <br />
            </span>
            <span>
              <span className="hero-word" style={{ animationDelay: "160ms" }}>
                before
              </span>{" "}
            </span>
            <span>
              <span className="hero-word" style={{ animationDelay: "240ms" }}>
                they
              </span>{" "}
            </span>
            <span>
              <span className="hero-word" style={{ animationDelay: "320ms" }}>
                block
              </span>
              <br />
            </span>
            <span>
              <span className="hero-word" style={{ animationDelay: "400ms" }}>
                your
              </span>{" "}
            </span>
            <span>
              <span className="hero-word" style={{ animationDelay: "480ms" }}>
                <em>future.</em>
              </span>{" "}
            </span>
          </h1>
          <p className="hero-subtitle">
            Welockin shuts out the apps that hijack your focus, so the deep work
            finally happens.
          </p>
          <div className="hero-ctaRow">
            <DownloadButton className="home-dl" />
          </div>
          <div className="hero-socialProof">
            <img
              className="hero-spPeep"
              src="/images/peep-laptop.png"
              alt=""
              aria-hidden="true"
              width={72}
              height={73}
            />
            <div className="hero-spText">
              <div className="hero-spNow">
                <span className="hero-spDot" aria-hidden="true" />
                <span className="hero-spCount">87</span>
                <span className="hero-spUnit">focus sessions</span>
              </div>
              <div className="hero-spLine">active right now</div>
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
              aria-label="Play the Welockin demo video"
            >
              <video
                ref={ambientRef}
                className="hero-shot"
                src="/videos/welock-draft.mp4"
                poster="/images/app-dashboard.jpeg"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
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
            <span className="hero-peep" aria-hidden="true" data-frame={peepFrame}>
              <img className="hero-peepImg" src="/images/peep-anim/frame_01.png" alt="" />
              <img className="hero-peepImg" src="/images/peep-anim/frame_02.png" alt="" />
              <img className="hero-peepImg" src="/images/peep-anim/frame_03.png" alt="" />
              <img className="hero-peepImg" src="/images/peep-anim/frame_04.png" alt="" />
              <img className="hero-peepImg" src="/images/peep-anim/frame_05.png" alt="" />
              <img className="hero-peepImg" src="/images/peep-anim/frame_06.png" alt="" />
              <img className="hero-peepImg" src="/images/peep-anim/frame_07.png" alt="" />
              <img className="hero-peepImg" src="/images/peep-anim/frame_08.png" alt="" />
            </span>
          </div>
        </div>
      </div>

      {videoOpen && (
        <div
          className="hero-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Welockin demo video"
          onClick={closeVideo}
        >
          <button
            className="hero-modalClose"
            type="button"
            aria-label="Close video"
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
              className="hero-modalVideo"
              src="/videos/welock-draft.mp4"
              poster="/images/app-dashboard.jpeg"
              controls
              autoPlay
              loop
              playsInline
            />
          </div>
        </div>
      )}
    </header>
  );
}
