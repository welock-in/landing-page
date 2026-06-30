"use client";

import { useEffect, useRef } from "react";

import "./Results.css";

type StatCard = {
  kind: "stat";
  target: number;
  format: "int" | "time";
  suffix?: string;
  label: string;
  bg: string;
  mark: { src: string; alt: string; height?: number };
};

type QuoteCard = {
  kind: "quote";
  quote: string;
  avatar: string;
  name: string;
  role: string;
  mark: { src: string; alt: string; height?: number };
};

type Card = StatCard | QuoteCard;

const LOGO = (file: string) => `/images/logos/${file}`;
const POLY = "/images/polytechnique.png";

// Order matches the design grid (4-col rows of stat/stat/quote, quote/stat/stat, …).
const CARDS: Card[] = [
  {
    kind: "stat",
    target: 2,
    format: "time",
    label: "hours focused daily",
    bg: "#f9e94f",
    mark: { src: LOGO("22_EPFL.png"), alt: "EPFL" },
  },
  {
    kind: "stat",
    target: 150,
    format: "int",
    suffix: "+",
    label: "sessions this month",
    bg: "#bce9b2",
    mark: { src: LOGO("07_ETH.png"), alt: "ETH Zürich" },
  },
  {
    kind: "quote",
    quote:
      "WeLockIn got me through my finals. I finish what I start now, and the doomscrolling is just gone.",
    avatar: "https://i.pravatar.cc/80?img=5",
    name: "Camille Beguin",
    role: "MSc Life Sciences",
    mark: { src: LOGO("22_EPFL.png"), alt: "EPFL" },
  },
  {
    kind: "quote",
    quote:
      "I set a hard lock for two hours and my phone disappears. Best 20 bucks I have spent as a student.",
    avatar: "https://i.pravatar.cc/80?img=12",
    name: "Theo Marchand",
    role: "Prepa MP*",
    mark: { src: POLY, alt: "Polytechnique", height: 26 },
  },
  {
    kind: "stat",
    target: 92,
    format: "int",
    suffix: "%",
    label: "sessions completed",
    bg: "#f9e94f",
    mark: { src: POLY, alt: "Polytechnique", height: 38 },
  },
  {
    kind: "stat",
    target: 5,
    format: "int",
    label: "day streak",
    bg: "#f8cde7",
    mark: { src: LOGO("04_Oxford.png"), alt: "University of Oxford" },
  },
  {
    kind: "stat",
    target: 4,
    format: "int",
    suffix: "x",
    label: "more deep work",
    bg: "#dbd8f6",
    mark: { src: LOGO("23_TUM.png"), alt: "TU Munich" },
  },
  {
    kind: "stat",
    target: 37,
    format: "int",
    suffix: "%",
    label: "less screen time",
    bg: "#f8cde7",
    mark: { src: LOGO("06_Cambridge.png"), alt: "University of Cambridge" },
  },
  {
    kind: "quote",
    quote:
      "My focus sessions went from a nice idea to a daily habit. My screen time dropped, my grades climbed.",
    avatar: "https://i.pravatar.cc/80?img=47",
    name: "Lina Haddad",
    role: "MSc Management",
    mark: { src: LOGO("07_ETH.png"), alt: "ETH Zürich" },
  },
];

function fmt(format: "int" | "time", v: number, suffix = "") {
  if (format === "time") {
    let h = Math.floor(v);
    let m = Math.round((v - h) * 60);
    if (m === 60) {
      h += 1;
      m = 0;
    }
    return `${h}:${m < 10 ? `0${m}` : m}`;
  }
  return `${Math.round(v)}${suffix}`;
}

// ~cubic-bezier(.16,1,.3,1)
const ease = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));

export function Results() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const nums = Array.from(grid.querySelectorAll<HTMLElement>(".rs-num"));
    if (!nums.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    let started = false;

    type Counter = {
      el: HTMLElement;
      target: number;
      format: "int" | "time";
      suffix: string;
      delay: number;
      lastText: string;
    };

    const run = () => {
      if (started) return;
      started = true;

      if (reduce) {
        nums.forEach((el) => {
          const target = parseFloat(el.dataset.target ?? "0");
          const format = (el.dataset.format as "int" | "time") ?? "int";
          const suffix = el.dataset.suffix ?? "";
          el.textContent = fmt(format, target, suffix);
        });
        return;
      }

      const dur = 1100;
      const counters: Counter[] = nums.map((el, i) => ({
        el,
        target: parseFloat(el.dataset.target ?? "0"),
        format: (el.dataset.format as "int" | "time") ?? "int",
        suffix: el.dataset.suffix ?? "",
        delay: i * 80,
        lastText: el.textContent ?? "",
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

        <div className="rs-annot" aria-hidden="true">
          <span>watch it climb!</span>
          <svg width="118" height="70" viewBox="0 0 118 70" fill="none">
            <path
              d="M14 8 C30 30, 44 44, 70 52 C80 55, 90 56, 100 56"
              stroke="#a42b1b"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M90 49 L101 56 L91 63"
              stroke="#e07856"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        <div className="rs-grid" ref={gridRef}>
          {CARDS.map((card, i) =>
            card.kind === "stat" ? (
              <article className="rs-card" style={{ background: card.bg }} key={i}>
                <div
                  className="rs-num"
                  data-target={card.target}
                  data-format={card.format}
                  data-suffix={card.suffix}
                >
                  {card.format === "time" ? "0:00" : `0${card.suffix ?? ""}`}
                </div>
                <div className="rs-label">{card.label}</div>
                <div style={{ flex: 1 }} />
                <div className="rs-mark">
                  {/* eslint-disable-next-line @next/next/no-img-element -- variable-ratio crest */}
                  <img
                    src={card.mark.src}
                    alt={card.mark.alt}
                    loading="lazy"
                    style={card.mark.height ? { height: card.mark.height } : undefined}
                  />
                </div>
              </article>
            ) : (
              <article
                className="rs-card span2"
                style={{ background: "#faf7f1" }}
                key={i}
              >
                <p className="rs-quote">&ldquo;{card.quote}&rdquo;</p>
                <div style={{ flex: 1 }} />
                <div className="rs-foot">
                  <div className="rs-who">
                    {/* eslint-disable-next-line @next/next/no-img-element -- remote avatar */}
                    <img className="rs-av" src={card.avatar} alt="" loading="lazy" />
                    <div>
                      <b>{card.name}</b>
                      <em>{card.role}</em>
                    </div>
                  </div>
                  <div className="rs-mark">
                    {/* eslint-disable-next-line @next/next/no-img-element -- variable-ratio crest */}
                    <img
                      src={card.mark.src}
                      alt={card.mark.alt}
                      loading="lazy"
                      style={card.mark.height ? { height: card.mark.height } : undefined}
                    />
                  </div>
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
