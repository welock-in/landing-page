"use client";

import { useRef } from "react";

import { UNIVERSITIES } from "./data";
import type { HomeCopy } from "./HomePage";
import { useMarquee, type MarqueeSpeed } from "./useMarquee";

/** The drift moves one full copy of the list past the viewport in 90s. */
const SPEED: MarqueeSpeed = { loopSeconds: 90 };

/**
 * "Used by students at" marquee: an endless row of university marks that
 * drifts on its own, pauses under the cursor, and can be dragged or swiped.
 */
export function LogoCloud({ copy }: { copy: HomeCopy["logoCloud"] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const loopStartRef = useRef<HTMLSpanElement>(null);

  useMarquee(viewportRef, loopStartRef, SPEED);

  // The list is rendered twice so the drift can wrap without a visible seam.
  const rows = [false, true];

  return (
    <section className="lc">
      <p className="lc-label">{copy.label}</p>
      <div
        className="lc-marquee"
        ref={viewportRef}
        role="group"
        aria-label={copy.ariaLabel}
      >
        <div className="lc-track">
          {rows.map((isDupe) =>
            UNIVERSITIES.map((u, i) => (
              <span
                key={`${isDupe ? "dupe-" : ""}${u.file}`}
                // The duplicate's first item marks where one lap ends.
                ref={isDupe && i === 0 ? loopStartRef : undefined}
                className={`lc-logo${u.wide ? " lc-wide" : ""}`}
                aria-hidden={isDupe || undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- variable-ratio crests in a decorative marquee */}
                <img
                  src={`/images/logos/${u.file}`}
                  alt={isDupe ? "" : u.name}
                  width={120}
                  height={u.wide ? 34 : 68}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
