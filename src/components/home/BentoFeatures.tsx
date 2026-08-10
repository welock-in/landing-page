"use client";

/* eslint-disable @next/next/no-img-element -- composition shots are plain <img>, matching the design byte-for-byte */

import { useEffect, useRef } from "react";

import type { HomeCopy } from "./HomePage";
import { LockInLink } from "./LockInLink";
import { StrictnessWidget } from "./StrictnessWidget";
import { SyncWidget } from "./SyncWidget";
import type { SyncWidgetCopy } from "./SyncWidget";
import { reducedMotion } from "./motion";

const MORE_ICONS = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="5" y2="12" />
        <line x1="8" y1="6" x2="8" y2="18" />
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="16" y1="7" x2="16" y2="17" />
        <line x1="20" y1="10" x2="20" y2="14" />
      </svg>
    ),
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="5" width="18" height="16" rx="2.5" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="3" x2="8" y2="7" />
        <line x1="16" y1="3" x2="16" y2="7" />
        <path d="M8 15h3" />
        <path d="M13 18h3" />
      </svg>
    ),
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 9h13v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
        <path d="M17 10h2a2.5 2.5 0 0 1 0 5h-2" />
        <line x1="8" y1="3" x2="8" y2="6" />
        <line x1="12" y1="3" x2="12" y2="6" />
      </svg>
    ),
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="11" width="14" height="10" rx="2.2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="16" r="1.2" />
      </svg>
    ),
  },
];

/**
 * The bento features grid + "More features" row. Cards reveal with a
 * staggered rise when the grid enters the viewport (110ms / 90ms steps),
 * with a 1.5s fallback so nothing can stay invisible; reduced motion shows
 * everything at once. Direct port of the design's `setupBento`.
 */
export function BentoFeatures({
  copy,
  strictness,
  sync,
}: {
  copy: HomeCopy["bento"];
  strictness: HomeCopy["strictnessWidget"];
  sync: SyncWidgetCopy;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const reveal = (parent: HTMLElement | null, childSel: string, step: number) => {
      if (!parent) return;
      const children = Array.from(parent.querySelectorAll(childSel));
      if (reducedMotion()) {
        children.forEach((c) => c.classList.add("in"));
        return;
      }
      const timers: number[] = [];
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            children.forEach((c, i) =>
              timers.push(window.setTimeout(() => c.classList.add("in"), i * step)),
            );
            io.unobserve(e.target);
          });
        },
        { threshold: 0.15 },
      );
      io.observe(parent);
      cleanups.push(() => {
        io.disconnect();
        timers.forEach((t) => clearTimeout(t));
      });
    };
    reveal(gridRef.current, ".bento-card", 110);
    reveal(moreRef.current, ".more-item", 90);
    const t = window.setTimeout(() => {
      gridRef.current?.querySelectorAll(".bento-card").forEach((c) => c.classList.add("in"));
      moreRef.current?.querySelectorAll(".more-item").forEach((c) => c.classList.add("in"));
    }, 1500);
    cleanups.push(() => clearTimeout(t));
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section className="bento-features" id="features">
      <div className="bf-wrap">
        <div className="bf-head">
          <h2>
            {copy.headTitle} <em>{copy.headTitleEm}</em>
          </h2>
          <p>{copy.headSub}</p>
        </div>
        <div className="bento-grid" ref={gridRef}>
          <article className="bento-card grad-1 card-apps">
            <div className="bc-text">
              <h3>{copy.apps.title}</h3>
              <p>{copy.apps.body}</p>
            </div>
            <div className="bc-shot bc-apps-shot">
              <div className="apps-compose">
                <img
                  className="apps-phone"
                  src="/images/phone-select-apps.webp"
                  alt={copy.apps.phoneAlt}
                  width={540}
                  height={720}
                  loading="lazy"
                  decoding="async"
                  style={{ height: "360px" }}
                />
                <img
                  className="apps-card"
                  src="/images/card-websites.webp"
                  alt={copy.apps.cardAlt}
                  width={670}
                  height={381}
                  loading="lazy"
                  decoding="async"
                  style={{ margin: "0 0 38px 20px", width: "335px" }}
                />
              </div>
            </div>
          </article>
          <article className="bento-card grad-2 card-strict">
            <div className="bc-text">
              <h3>{copy.strictness.title}</h3>
              <p>{copy.strictness.body}</p>
            </div>
            <div className="bc-widget">
              <StrictnessWidget copy={strictness} />
            </div>
          </article>
          <article className="bento-card grad-3 card-sync">
            <div className="bc-text">
              <h3>{copy.sync.title}</h3>
              <p>{copy.sync.body}</p>
            </div>
            <SyncWidget copy={sync} />
          </article>
          <article className="bento-card grad-4 card-sched">
            <div className="bc-text">
              <h3>{copy.scheduling.title}</h3>
              <p>{copy.scheduling.body}</p>
            </div>
            <div className="bc-sched-mac">
              <div className="mac" aria-hidden="true">
                <div className="mac-screen skel">
                  <iframe
                    className="sched-frame"
                    src="/focus-week-drag.html"
                    title={copy.scheduling.frameTitle}
                    scrolling="no"
                    loading="lazy"
                  />
                </div>
                <div className="mac-base" />
              </div>
            </div>
          </article>
        </div>
        <h3 className="more-title">{copy.moreTitle}</h3>
        <div className="more-row" ref={moreRef}>
          {copy.more.map((f, i) => (
            <div className="more-item" key={f.title}>
              <span className="mi-ico" aria-hidden="true">
                {MORE_ICONS[i].icon}
              </span>
              <h4>{f.title}</h4>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
        <div className="cta-row">
          <LockInLink label="lockInNow" />
        </div>
      </div>
    </section>
  );
}
