"use client";

/* eslint-disable @next/next/no-img-element -- university marks and avatars are plain <img>, matching the design byte-for-byte */

import { useEffect, useRef } from "react";

import { LockInLink } from "./LockInLink";
import { reducedMotion } from "./motion";

/**
 * "Real results from real students" — stat counters animate the first time
 * the grid is 30% visible: 1.1s exponential ease-out, 80ms stagger per card,
 * `data-format="time"` renders h:mm. Written to the DOM imperatively, as in
 * the design, so the tick never re-renders React. Reduced motion jumps
 * straight to the final values.
 */
export function Results() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const nums = Array.from(grid.querySelectorAll<HTMLElement>(".rs-num"));
    if (!nums.length) return;
    const reduce = reducedMotion();
    const fmt = (format: string, v: number, suffix: string) => {
      if (format === "time") {
        let h = Math.floor(v);
        let m = Math.round((v - h) * 60);
        if (m === 60) {
          h += 1;
          m = 0;
        }
        return `${h}:${m < 10 ? "0" + m : m}`;
      }
      return `${Math.round(v)}${suffix || ""}`;
    };
    const ease = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
    let started = false;
    let rafId = 0;
    const run = () => {
      if (started) return;
      started = true;
      if (reduce) {
        nums.forEach((el) => {
          el.textContent = fmt(
            el.dataset.format || "int",
            parseFloat(el.dataset.target || "0"),
            el.dataset.suffix || "",
          );
        });
        return;
      }
      const dur = 1100;
      const counters = nums.map((el, i) => ({
        el,
        target: parseFloat(el.dataset.target || "0"),
        format: el.dataset.format || "int",
        suffix: el.dataset.suffix || "",
        delay: i * 80,
        lastText: el.textContent || "",
      }));
      let t0: number | null = null;
      const tick = (now: number) => {
        if (t0 === null) t0 = now;
        let running = false;
        for (const c of counters) {
          const elapsed = now - t0 - c.delay;
          if (elapsed < 0) {
            running = true;
            continue;
          }
          const p = Math.min(elapsed / dur, 1);
          const text = fmt(c.format, c.target * ease(p), c.suffix);
          if (text !== c.lastText) {
            c.el.textContent = text;
            c.lastText = text;
          }
          if (p < 1) running = true;
        }
        if (running) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(grid);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="results" id="stats">
      <div className="rs-wrap">
        <h2 className="rs-head">
          Real results from
          <br />
          real students
        </h2>
        <div className="rs-grid" ref={gridRef}>
          <article className="rs-card" style={{ background: "#e7f2f9" }}>
            <div className="rs-num" data-target="2" data-format="time" data-suffix="">
              0:00
            </div>
            <div className="rs-label">hours focused daily</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/logos/22_EPFL.png" alt="EPFL" />
            </div>
          </article>
          <article className="rs-card" style={{ background: "#e9f7e5" }}>
            <div className="rs-num" data-target="150" data-format="int" data-suffix="+">
              0+
            </div>
            <div className="rs-label">sessions this month</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/logos/07_ETH.png" alt="ETH Zürich" />
            </div>
          </article>
          <article className="rs-card span2" style={{ background: "#faf7f1" }}>
            <p className="rs-quote">
              “Welockin got me through my finals. I finish what I start now, and the
              doomscrolling is just gone.”
            </p>
            <div style={{ flex: 1 }} />
            <div className="rs-foot">
              <a
                className="rs-who"
                href="https://www.linkedin.com/in/hedi-fourati-816304218/"
                target="_blank"
                rel="noopener"
              >
                <img className="rs-av" src="/images/people/hedi-fourati.png" alt="Hedi Fourati" />
                <div>
                  <b>Hedi Fourati</b>
                  <em>BSc Computer Science</em>
                </div>
              </a>
              <div className="rs-mark">
                <img src="/images/logos/22_EPFL.png" alt="EPFL" />
              </div>
            </div>
          </article>
          <article className="rs-card span2" style={{ background: "#faf7f1" }}>
            <p className="rs-quote">
              “I set a hard lock for two hours and my phone disappears. Best 20 bucks I
              have spent as a student.”
            </p>
            <div style={{ flex: 1 }} />
            <div className="rs-foot">
              <div className="rs-who">
                <img className="rs-av" src="/images/avatars/theo.svg" alt="" />
                <div>
                  <b>Theo Marchand</b>
                  <em>Prepa MP*</em>
                </div>
              </div>
              <div className="rs-mark">
                <img src="/images/polytechnique.png" alt="Polytechnique" style={{ height: "26px" }} />
              </div>
            </div>
          </article>
          <article className="rs-card" style={{ background: "#e7f2f9" }}>
            <div className="rs-num" data-target="92" data-format="int" data-suffix="%">
              0%
            </div>
            <div className="rs-label">sessions completed</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/polytechnique.png" alt="Polytechnique" style={{ height: "38px" }} />
            </div>
          </article>
          <article className="rs-card" style={{ background: "#fceef6" }}>
            <div className="rs-num" data-target="5" data-format="int" data-suffix="">
              0
            </div>
            <div className="rs-label">day streak</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/logos/04_Oxford.png" alt="University of Oxford" />
            </div>
          </article>
          <article className="rs-card" style={{ background: "#f0effb" }}>
            <div className="rs-num" data-target="4" data-format="int" data-suffix="x">
              0x
            </div>
            <div className="rs-label">more deep work</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/logos/23_TUM.png" alt="TU Munich" />
            </div>
          </article>
          <article className="rs-card" style={{ background: "#fceef6" }}>
            <div className="rs-num" data-target="37" data-format="int" data-suffix="%">
              0%
            </div>
            <div className="rs-label">less screen time</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/logos/06_Cambridge.png" alt="University of Cambridge" />
            </div>
          </article>
          <article className="rs-card span2" style={{ background: "#faf7f1" }}>
            <p className="rs-quote">
              “My focus sessions went from a nice idea to a daily habit. My screen time
              dropped, my grades climbed.”
            </p>
            <div style={{ flex: 1 }} />
            <div className="rs-foot">
              <a
                className="rs-who"
                href="https://www.linkedin.com/in/karim-assaf-9a82a4223/"
                target="_blank"
                rel="noopener"
              >
                <img className="rs-av" src="/images/people/karim-assaf.png" alt="Karim Assaf" />
                <div>
                  <b>Karim Assaf</b>
                  <em>MSc Nuclear Engineering</em>
                </div>
              </a>
              <div className="rs-mark">
                <img src="/images/logos/07_ETH.png" alt="ETH Zürich" />
              </div>
            </div>
          </article>
        </div>
        <div className="cta-row">
          <LockInLink label="Lock in now" />
        </div>
      </div>
    </section>
  );
}
