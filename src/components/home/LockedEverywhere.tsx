"use client";

/* eslint-disable @next/next/no-img-element -- the devices cutout is a plain <img>, matching the design byte-for-byte */

import { useEffect, useRef, useState } from "react";

import { PLATFORMS } from "./data";
import type { HomeCopy } from "./HomePage";
import { LockInLink } from "./LockInLink";

/**
 * "Block it once. Locked everywhere." — the whole section rises in staggered
 * `.le-reveal` steps the first time 18% of it is visible, with a 1.2s
 * fallback so it can never stay hidden.
 */
export function LockedEverywhere({ copy }: { copy: HomeCopy["lockedEverywhere"] }) {
  const [isIn, setIsIn] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setIsIn(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    const t = window.setTimeout(() => setIsIn(true), 1200);
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <section className={`le${isIn ? " isIn" : ""}`} id="download" ref={ref}>
      <div className="le-inner">
        <h2 className="le-title le-reveal">
          {copy.titleLine1}
          <br />
          {copy.titleLine2}
        </h2>
        <p className="le-sub le-reveal">{copy.subtitle}</p>
        <div className="le-visual le-reveal">
          <img
            src="/images/devices-cutout.webp"
            alt={copy.visualAlt}
            width={1536}
            height={1024}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="le-avail le-reveal">
          <span className="le-availLabel">{copy.availableOn}</span>
          <div className="le-platforms">
            {PLATFORMS.map((p) => (
              <div className="le-platform" key={p.name}>
                <span
                  className={`le-icon${p.wordmark ? " le-wordmark" : ""}`}
                  style={{
                    backgroundImage: `url(/images/platforms/${p.file})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    width: "100%",
                    height: "100%",
                    filter: "brightness(0) saturate(0)",
                  }}
                  role="img"
                  aria-label={p.name}
                />
                <span className="le-platformName">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="le-cta le-reveal">
          <LockInLink label="lockEveryDevice" />
        </div>
      </div>
    </section>
  );
}
