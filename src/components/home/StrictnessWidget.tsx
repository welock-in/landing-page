"use client";

import { useEffect, useRef, useState } from "react";

import { type SwMode } from "./data";
import type { HomeCopy } from "./HomePage";
import { reducedMotion, runSeq } from "./motion";

/**
 * "Select your strictness" demo widget.
 *
 * Choreography (from the design): when it scrolls into view the pill pulses
 * (hint), snaps to Nuclear, back to Soft, then settles into an idle
 * alternation every 5s. Hovering cancels the show; clicking a segment stops
 * it permanently and hands the toggle to the visitor. Copy swaps ride a
 * 180ms fade (`swapping`). Reduced motion skips the whole performance.
 */
export function StrictnessWidget({ copy }: { copy: HomeCopy["strictnessWidget"] }) {
  const [mode, setMode] = useState<SwMode>("soft");
  const [copyKey, setCopyKey] = useState<SwMode>("soft");
  const [swapping, setSwapping] = useState(false);
  const [hint, setHint] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<SwMode>("soft");
  const stopped = useRef(false);
  const hovering = useRef(false);
  const visible = useRef(false);
  const demoPlayed = useRef(false);
  const seqCleanup = useRef<(() => void) | null>(null);
  const idle = useRef<number | null>(null);
  const swapT = useRef<number | null>(null);

  const apply = (next: SwMode) => {
    if (modeRef.current === next) return;
    modeRef.current = next;
    setMode(next);
    if (reducedMotion()) {
      setCopyKey(next);
      return;
    }
    setSwapping(true);
    if (swapT.current) clearTimeout(swapT.current);
    swapT.current = window.setTimeout(() => {
      setCopyKey(next);
      setSwapping(false);
    }, 180);
  };

  const cancel = () => {
    if (seqCleanup.current) {
      seqCleanup.current();
      seqCleanup.current = null;
    }
    if (idle.current) {
      clearInterval(idle.current);
      idle.current = null;
    }
  };

  const startIdle = () => {
    if (idle.current || stopped.current || hovering.current || !visible.current || reducedMotion())
      return;
    idle.current = window.setInterval(
      () => apply(modeRef.current === "nuclear" ? "soft" : "nuclear"),
      5000,
    );
  };

  const playDemo = () => {
    if (demoPlayed.current || stopped.current || reducedMotion()) return;
    cancel();
    seqCleanup.current = runSeq([
      { ms: 350, fn: () => setHint(true) },
      {
        ms: 750,
        fn: () => {
          setHint(false);
          apply("nuclear");
        },
      },
      { ms: 2400, fn: () => apply("soft") },
      {
        ms: 3800,
        fn: () => {
          demoPlayed.current = true;
          if (!stopped.current && !hovering.current && visible.current) startIdle();
        },
      },
    ]);
  };

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reducedMotion()) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            visible.current = true;
            if (!demoPlayed.current) playDemo();
            else startIdle();
          } else {
            visible.current = false;
            setHint(false);
            cancel();
            if (!demoPlayed.current) {
              modeRef.current = "soft";
              setMode("soft");
              setCopyKey("soft");
            }
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel();
      if (swapT.current) clearTimeout(swapT.current);
    };
    // The choreography helpers only touch refs and state setters, stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopAnd = (next: SwMode) => {
    stopped.current = true;
    cancel();
    setHint(false);
    apply(next);
  };

  const shown = copy[copyKey] ?? copy.soft;

  return (
    <div
      ref={rootRef}
      className={`sw${swapping ? " swapping" : ""}${hint ? " sw-hint" : ""}`}
      data-mode={mode}
      role="group"
      aria-label={copy.groupLabel}
      onMouseEnter={() => {
        hovering.current = true;
        cancel();
      }}
      onMouseLeave={() => {
        hovering.current = false;
        if (visible.current && demoPlayed.current) startIdle();
      }}
    >
      <div className="sw-seg">
        <span className="sw-pill" aria-hidden="true" />
        <button type="button" className="sw-soft" onClick={() => stopAnd("soft")}>
          {copy.soft.title}
        </button>
        <button type="button" className="sw-nuc" onClick={() => stopAnd("nuclear")}>
          {copy.nuclear.title}
        </button>
      </div>
      <div className="sw-head">
        <span className="sw-ico">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="11" width="14" height="10" rx="2.2" />
            <path className="sw-shackle" d="M8 11 V8 a4 4 0 0 1 8 0 V11" />
          </svg>
        </span>
        <span className="sw-title">{shown.title}</span>
        <span className="sw-badge">{copy.badge}</span>
      </div>
      <p className="sw-tag">{shown.tag}</p>
      <div className="sw-stack">
        <div className="sw-list sw-soft-list">
          {copy.soft.points.map(
            (t) => (
              <div className="sw-row" key={t}>
                <span className="sw-rico">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{t}</span>
              </div>
            ),
          )}
        </div>
        <div className="sw-list sw-nuc-list">
          {copy.nuclear.points.map(
            (t) => (
              <div className="sw-row" key={t}>
                <span className="sw-rico">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
                  </svg>
                </span>
                <span>{t}</span>
              </div>
            ),
          )}
        </div>
      </div>
      <p className="sw-foot">{shown.foot}</p>
    </div>
  );
}
