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
          <article className="rs-card" style={{ background: "#f9e94f" }}>
            <div className="rs-num" data-target="2" data-format="time" data-suffix="">
              0:00
            </div>
            <div className="rs-label">hours focused daily</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/logos/22_EPFL.webp" alt="EPFL" width={236} height={80} loading="lazy" decoding="async" />
            </div>
          </article>
          <article className="rs-card" style={{ background: "#bce9b2" }}>
            <div className="rs-num" data-target="150" data-format="int" data-suffix="+">
              0+
            </div>
            <div className="rs-label">sessions this month</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/logos/07_ETH.webp" alt="ETH Zürich" width={240} height={54} loading="lazy" decoding="async" />
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
                href="https://www.linkedin.com/in/sarah-fourati-7784b9293/"
                target="_blank"
                rel="noopener"
              >
                <img className="rs-av" src="/images/people/sarah-fourati.webp" alt="Sarah Fourati" width={96} height={96} loading="lazy" decoding="async" />
                <div>
                  <b>Sarah Fourati</b>
                  <em>MSc Business and Management</em>
                </div>
              </a>
              <div className="rs-mark">
                <img src="/images/logos/27_HEC.webp" alt="HEC Paris" width={240} height={108} loading="lazy" decoding="async" />
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
                <img className="rs-av" src="/images/avatars/theo.svg" alt="" width={96} height={96} loading="lazy" decoding="async" />
                <div>
                  <b>Theo Marchand</b>
                  <em>Prepa MP*</em>
                </div>
              </div>
              <div className="rs-mark">
                <img src="/images/polytechnique.webp" alt="Polytechnique" width={68} height={96} loading="lazy" decoding="async" style={{ height: "26px" }} />
              </div>
            </div>
          </article>
          <article className="rs-card" style={{ background: "#f9e94f" }}>
            <div className="rs-num" data-target="92" data-format="int" data-suffix="%">
              0%
            </div>
            <div className="rs-label">sessions completed</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/polytechnique.webp" alt="Polytechnique" width={68} height={96} loading="lazy" decoding="async" style={{ height: "38px" }} />
            </div>
          </article>
          <article className="rs-card" style={{ background: "#f8cde7" }}>
            <div className="rs-num" data-target="5" data-format="int" data-suffix="">
              0
            </div>
            <div className="rs-label">day streak</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/logos/04_Oxford.webp" alt="University of Oxford" width={114} height={136} loading="lazy" decoding="async" />
            </div>
          </article>
          <article className="rs-card" style={{ background: "#dbd8f6" }}>
            <div className="rs-num" data-target="4" data-format="int" data-suffix="x">
              0x
            </div>
            <div className="rs-label">more deep work</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/logos/23_TUM.webp" alt="TU Munich" width={136} height={77} loading="lazy" decoding="async" />
            </div>
          </article>
          <article className="rs-card" style={{ background: "#f8cde7" }}>
            <div className="rs-num" data-target="37" data-format="int" data-suffix="%">
              0%
            </div>
            <div className="rs-label">less screen time</div>
            <div style={{ flex: 1 }} />
            <div className="rs-mark">
              <img src="/images/logos/06_Cambridge.webp" alt="University of Cambridge" width={110} height={136} loading="lazy" decoding="async" />
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
                <img className="rs-av" src="/images/people/karim-assaf.webp" alt="Karim Assaf" width={96} height={96} loading="lazy" decoding="async" />
                <div>
                  <b>Karim Assaf</b>
                  <em>MSc Nuclear Engineering</em>
                </div>
              </a>
              <div className="rs-mark">
                <img src="/images/logos/07_ETH.webp" alt="ETH Zürich" width={240} height={54} loading="lazy" decoding="async" />
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
