/* eslint-disable @next/next/no-img-element -- avatar bubbles are plain <img>, matching the design byte-for-byte */

import { DownloadButton } from "@/components/ui/DownloadButton";
import type { HomeCopy } from "./HomePage";

/**
 * The closing dark share card with drifting orbs and the "Lock in for life"
 * CTA. Static markup: all motion is pure CSS.
 */
export function ShareBand({ copy }: { copy: HomeCopy["shareBand"] }) {
  return (
    <section className="vs">
      <div className="wrap">
        <div className="share-card">
          <span className="share-orb share-o1" aria-hidden="true" />
          <span className="share-orb share-o2" aria-hidden="true" />
          <span className="share-orb share-o3" aria-hidden="true" />
          <div className="share-inner">
            <div className="share-bubbles" aria-hidden="true">
              <img
                className="share-bub"
                src="/images/avatars/mira.svg"
                alt=""
                width={46}
                height={46}
                loading="lazy"
                decoding="async"
              />
              <span className="share-lock">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="11" width="14" height="9" rx="2.2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              </span>
              <img
                className="share-bub"
                src="/images/avatars/theo.svg"
                alt=""
                width={46}
                height={46}
                loading="lazy"
                decoding="async"
              />
            </div>
            <h2 className="share-title">{copy.title}</h2>
            <p className="share-sub">{copy.subtitle}</p>
            <DownloadButton
              className="home-dl-lg home-share-cta"
              size="lg"
              tone="onDark"
              icon="lock"
              label="lockInForLife"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
