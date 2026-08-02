"use client";

import { UNIVERSITIES } from "./data";

/**
 * "Used by students at" marquee. The track holds two copies of the list so
 * the -50% translate loops seamlessly; the second copy is aria-hidden.
 * Logos render as background images on the sized cells, as in the design.
 */
export function LogoCloud() {
  return (
    <section className="lc">
      <p className="lc-label">Used by students at</p>
      <div className="lc-marquee">
        <div className="lc-track">
          {([0, 1] as const).map((r) =>
            UNIVERSITIES.map((u) => (
              <span
                key={`${r}-${u.file}`}
                className={`lc-logo${u.wide ? " lc-wide" : ""}`}
                style={{
                  backgroundImage: `url(/images/logos/${u.file})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                role={r === 0 ? "img" : undefined}
                aria-label={r === 0 ? u.name : undefined}
                aria-hidden={r === 1 || undefined}
              />
            )),
          )}
        </div>
      </div>
    </section>
  );
}
