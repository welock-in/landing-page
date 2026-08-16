"use client";

import { useEffect, useRef, useState } from "react";

import type { HomeCopy } from "./HomePage";
import { LockInLink } from "./LockInLink";

/** The three mac screenshots, one per step, with the design's per-slot fit. */
const SHOT_STYLES: React.CSSProperties[] = [
  {
    backgroundImage: "url(/images/hiw-1.webp)",
    backgroundSize: "cover",
    backgroundPosition: "top center",
    width: "100%",
    height: "100%",
  },
  {
    backgroundImage: "url(/images/hiw-2.webp)",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundOrigin: "content-box",
    padding: "10px",
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
  },
  {
    backgroundImage: "url(/images/hiw-3.webp)",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundOrigin: "content-box",
    padding: "10px",
    boxSizing: "border-box",
    width: "100%",
    height: "100%",
  },
];

/**
 * "How it works": sticky mac + scroll-spied steps. The active step is
 * whichever `.hiw-step` center sits closest to the viewport center, same
 * rule on desktop (side rail) and mobile (sticky stage with swapped text).
 */
export function HowItWorks({ copy }: { copy: HomeCopy["howItWorks"] }) {
  const steps = copy.steps;
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stepEls = Array.from(stepsRef.current?.querySelectorAll(".hiw-step") ?? []);
    if (!stepEls.length) return;
    const update = () => {
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      stepEls.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      if (best !== activeRef.current) {
        activeRef.current = best;
        setActive(best);
      }
    };
    window.addEventListener("scroll", update, { passive: true });
    const t = window.setTimeout(update, 100);
    return () => {
      window.removeEventListener("scroll", update);
      clearTimeout(t);
    };
  }, []);

  return (
    <section className="hiw" id="how">
      <div className="wrap">
        <div className="hiw-head">
          <span className="hiw-eyebrow">{copy.eyebrow}</span>
          <h2 className="hiw-headTitle">{copy.title}</h2>
          <p className="hiw-headSub">{copy.subtitle}</p>
        </div>
        <div className="hiw-grid">
          <div className="hiw-stage">
            <div className="hiw-mobileHead" aria-hidden="true">
              <span className="hiw-eyebrow">{copy.eyebrow}</span>
              <h2>{copy.title}</h2>
            </div>
            <div className="hiw-rail" aria-hidden="true">
              {steps.flatMap((s, i) => [
                ...(i > 0 ? [<span className="hiw-tie" key={`tie-${s.title}`} />] : []),
                <span
                  className={`hiw-dot${active === i ? " hiw-dotActive" : ""}`}
                  key={`dot-${s.title}`}
                />,
              ])}
            </div>
            <div className="hiw-mac">
              <div className="hiw-macScreen skel">
                {SHOT_STYLES.map((style, i) => (
                  <div
                    key={steps[i].shotLabel}
                    className={`hiw-macShot${active === i ? " hiw-macShotActive" : ""}`}
                  >
                    <div style={style} role="img" aria-label={steps[i].shotLabel} />
                  </div>
                ))}
              </div>
              <div className="hiw-macBase" />
            </div>
            <div className="hiw-mobileText" aria-hidden="true">
              {/* keyed remount so the mtext entrance replays on every step change */}
              <div className="hiw-mobileTextInner" key={active}>
                <span className="hiw-stepMark" />
                <h3>{steps[active].title}</h3>
                <p>{steps[active].body}</p>
              </div>
            </div>
          </div>
          <div className="hiw-steps" ref={stepsRef}>
            {steps.map((s, i) => (
              <div
                key={s.title}
                className={`hiw-step${active === i ? " hiw-stepActive" : ""}`}
                data-step={i}
              >
                <div className="hiw-stepBody">
                  <span className="hiw-stepMark" />
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="cta-row">
          <LockInLink label="lockInNow" />
        </div>
      </div>
    </section>
  );
}
