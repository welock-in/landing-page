"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import "./protection.css";

const ACCENT = "#a42b1b";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ease = (p: number) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));

function useInView(
  ref: RefObject<HTMLElement | null>,
  onEnter: () => void,
  onLeave?: () => void,
  threshold = 0.3,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) onEnter();
          else onLeave?.();
        });
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, onEnter, onLeave, threshold]);
}

function useAutoCycle(
  count: number,
  intervalMs: number,
  ref: RefObject<HTMLElement | null>,
) {
  const [selected, setSelected] = useState(0);
  const paused = useRef(false);
  const visible = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timer.current || paused.current || !visible.current || reduced()) return;
    timer.current = setInterval(() => {
      setSelected((s) => (s + 1) % count);
    }, intervalMs);
  }, [count, intervalMs]);

  const onEnter = useCallback(() => {
    visible.current = true;
    start();
  }, [start]);

  const onLeave = useCallback(() => {
    visible.current = false;
    stop();
  }, [stop]);

  useInView(ref, onEnter, onLeave);

  useEffect(() => () => stop(), [stop]);

  const bind = {
    onMouseEnter: () => {
      paused.current = true;
      stop();
    },
    onMouseLeave: () => {
      paused.current = false;
      start();
    },
    onFocus: () => {
      paused.current = true;
      stop();
    },
    onBlur: () => {
      paused.current = false;
      start();
    },
  };

  return { selected, setSelected, bind };
}

const HERO_METHODS = [
  {
    label: "Unlock with a PIN",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="9.5" rx="2.2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
  {
    label: "Cooldown delay",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12.5" r="8.5" />
        <path d="M12 8v4.5l3 2" />
      </svg>
    ),
  },
  {
    label: "Lock until a date",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5.5" width="16" height="15" rx="2.5" />
        <path d="M4 9.5h16M8 3v4M16 3v4" />
      </svg>
    ),
  },
];

const UNLOCK_METHODS = [
  {
    title: "Unlock with a PIN",
    desc: "Set a PIN, unlock anytime you enter it.",
    badge: "EASY",
    bars: [1, 0, 0, 0],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="9.5" rx="2.2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="15.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Cooldown delay",
    desc: "Turning off only takes effect after a wait.",
    badge: "MEDIUM",
    bars: [1, 1, 0, 0],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12.5" r="8.5" />
        <path d="M12 8v4.5l3 2" />
      </svg>
    ),
  },
  {
    title: "Accountability partner",
    desc: "A trusted person must approve unblocking.",
    badge: "HARD",
    bars: [1, 1, 1, 0],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="9.5" r="3.2" />
        <path d="M3.5 19c.6-3 2.8-4.6 5.5-4.6s4.9 1.6 5.5 4.6" />
        <path d="M16 6.2a3 3 0 0 1 0 6" />
        <path d="M17 14.6c2.2.4 3.8 1.9 4.3 4.4" />
      </svg>
    ),
  },
  {
    title: "Type a passphrase",
    desc: "Type a long random phrase to disable.",
    badge: "HARD",
    bars: [1, 1, 1, 0],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 7h14" />
        <path d="M12 7v11" />
      </svg>
    ),
  },
];

const CATEGORIES = [
  {
    title: "Adult & explicit sites",
    desc: "Pornography and explicit content.",
    icon: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
      </svg>
    ),
  },
  {
    title: "Gambling",
    desc: "Casinos, betting and lotteries.",
    icon: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
        <circle cx="8.5" cy="8.5" r="1.3" fill="currentColor" />
        <circle cx="15.5" cy="15.5" r="1.3" fill="currentColor" />
        <circle cx="15.5" cy="8.5" r="1.3" fill="currentColor" />
        <circle cx="8.5" cy="15.5" r="1.3" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Dating apps",
    desc: "Swipe and match apps.",
    icon: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20.5C7 17 3.5 13.8 3.5 9.6 3.5 7 5.4 5.2 7.8 5.2c1.6 0 3.2.9 4.2 2.4 1-1.5 2.6-2.4 4.2-2.4 2.4 0 4.3 1.8 4.3 4.4 0 4.2-3.5 7.4-8.5 10.9z" />
      </svg>
    ),
  },
  {
    title: "Mature games",
    desc: "Adult-rated game stores.",
    icon: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 8.5h10a4 4 0 0 1 4 4l-.5 4.2a2.4 2.4 0 0 1-4.3 1.1L14.5 16h-5l-1.7 1.8a2.4 2.4 0 0 1-4.3-1.1L3 12.5a4 4 0 0 1 4-4z" />
        <line x1="7" y1="11.5" x2="7" y2="14" />
        <line x1="5.8" y1="12.7" x2="8.2" y2="12.7" />
        <circle cx="15.5" cy="11.8" r="1" />
        <circle cx="17.8" cy="14" r="1" />
      </svg>
    ),
  },
];

function SignalBars({ bars }: { bars: number[] }) {
  const heights = [4, 6.5, 9, 11];
  const ys = [7, 4.5, 2, 0];
  return (
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
      {bars.map((on, i) => (
        <rect
          key={i}
          x={i * 4.2}
          y={ys[i]}
          width="2.6"
          height={heights[i]}
          rx="1"
          fill={on ? "var(--bar-on)" : "var(--bar-off)"}
          style={{ transition: "fill 0.5s cubic-bezier(0.65, 0, 0.35, 1)" }}
        />
      ))}
    </svg>
  );
}

function PadlockMini() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9.5" rx="2.2" />
      <path data-shackle d="M8 11V8a4 4 0 0 1 8 0v3" style={{ transform: "translateY(-3px) scaleY(1.18)" }} />
    </svg>
  );
}

function HeroMockup() {
  const ref = useRef<HTMLDivElement>(null);
  const { selected, bind } = useAutoCycle(HERO_METHODS.length, 2200, ref);

  return (
    <div className="prot-mockup-wrap">
      <div className="prot-mockup-float">
        <div className="prot-mockup">
          <div className="prot-mockup-bar">
            <span className="prot-mockup-dot" />
            <span className="prot-mockup-dot" />
            <span className="prot-mockup-dot" />
            <span className="prot-mockup-url">welock.in/protection</span>
          </div>
          <div className="prot-mockup-body">
            <div className="prot-status-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span className="prot-status-shield">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l7 3v5.5c0 4.4-3 7.4-7 8.5-4-1.1-7-4.1-7-8.5V6z" />
                    <polyline points="9 12 11 14 15 9.8" />
                  </svg>
                </span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>Protected</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: ACCENT }}>
                      <span className="prot-live-dot" />
                      LIVE
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#8a8175", marginTop: 2 }}>2 devices · always on</div>
                </div>
              </div>
              <span className="prot-toggle" aria-hidden="true">
                <span className="prot-toggle-knob" />
              </span>
            </div>

            <div className="prot-hero-methods" ref={ref} {...bind}>
              {HERO_METHODS.map((m, i) => (
                <div key={m.label} className={`prot-hero-method ${selected === i ? "sel" : "unsel"}`}>
                  <span className="prot-hero-chip">{m.icon}</span>
                  <div className="prot-hero-label">{m.label}</div>
                  <span className="prot-hero-mark" aria-hidden="true">
                    <svg className="prot-hero-check" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6.5 9.5 17 4 11.5" />
                    </svg>
                    <span className="prot-hero-radio" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsBand() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const nums = Array.from(grid.querySelectorAll<HTMLElement>("[data-count]"));
    if (!nums.length) return;

    const setFinal = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.target ?? "0");
      const suffix = el.dataset.suffix ?? "";
      el.textContent = `${Math.round(target)}${suffix}`;
    };

    if (reduced()) {
      nums.forEach(setFinal);
      return;
    }

    let rafId = 0;
    let started = false;
    const dur = 1100;

    const run = () => {
      if (started) return;
      started = true;
      let t0: number | null = null;
      const tick = (now: number) => {
        if (t0 === null) t0 = now;
        let running = false;
        nums.forEach((el, i) => {
          const target = parseFloat(el.dataset.target ?? "0");
          const suffix = el.dataset.suffix ?? "";
          const delay = i * 80;
          const elapsed = now - t0! - delay;
          if (elapsed < 0) {
            running = true;
            return;
          }
          const p = Math.min(elapsed / dur, 1);
          el.textContent = `${Math.round(target * ease(p))}${suffix}`;
          if (p < 1) running = true;
        });
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
      { threshold: 0.5 },
    );
    io.observe(grid);
    return () => {
      io.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="prot-stats">
      <div className="prot-wrap">
        <div className="prot-stats-grid" ref={gridRef}>
          <div className="prot-stat">
            <div className="prot-stat-num">24/7</div>
            <div className="prot-stat-label">ALWAYS-ON PROTECTION</div>
          </div>
          <div className="prot-stat">
            <div className="prot-stat-num" data-count data-target="5">0</div>
            <div className="prot-stat-label">UNLOCK DIFFICULTY LEVELS</div>
          </div>
          <div className="prot-stat">
            <div className="prot-stat-num" data-count data-target="100" data-suffix="%">0%</div>
            <div className="prot-stat-label">ON-DEVICE &amp; PRIVATE</div>
          </div>
          <div className="prot-stat">
            <div className="prot-stat-num">All</div>
            <div className="prot-stat-label">YOUR DEVICES, SYNCED</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UnlockLadder() {
  const ref = useRef<HTMLDivElement>(null);
  const { selected, setSelected, bind } = useAutoCycle(UNLOCK_METHODS.length, 2200, ref);

  return (
    <section className="prot-ladder-wrap">
      <div style={{ textAlign: "center", maxWidth: "40ch", margin: "0 auto 40px" }}>
        <h2 className="prot-section-title">Make quitting as hard as you need.</h2>
        <p className="prot-section-sub" style={{ marginTop: 14 }}>
          Five levels of resolve, from a quick tap to truly no way out.
        </p>
      </div>
      <div className="prot-methods" ref={ref} {...bind}>
        {UNLOCK_METHODS.map((m, i) => (
          <button
            key={m.title}
            type="button"
            className={`prot-method ${selected === i ? "sel" : "unsel"}`}
            onClick={() => setSelected(i)}
          >
            <span className="prot-method-chip">{m.icon}</span>
            <div className="prot-method-text">
              <div className="prot-method-title">{m.title}</div>
              <div className="prot-method-desc">{m.desc}</div>
            </div>
            <span className="prot-badge">
              <SignalBars bars={m.bars} />
              <span className="prot-badge-label">{m.badge}</span>
            </span>
            <span className="prot-method-check" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6.5 9.5 17 4 11.5" />
              </svg>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function NuclearBlock() {
  const ref = useRef<HTMLElement>(null);
  const shackleRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const block = ref.current;
    const shackle = shackleRef.current;
    if (!block || !shackle) return;

    const shut = () => shackle.classList.add("shut");
    if (reduced()) {
      shut();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setTimeout(shut, 360);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.45 },
    );
    io.observe(block);
    return () => io.disconnect();
  }, []);

  return (
    <section className="prot-nuke-section" ref={ref}>
      <div className="prot-nuke">
        <span className="prot-nuke-glow" aria-hidden="true" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span className="prot-nuke-eyebrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="9.5" rx="2.2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            NUCLEAR MODE
          </span>
          <h2 className="prot-nuke-title">Set it once. There&apos;s no going back.</h2>
          <p className="prot-nuke-body">
            Pick a date, and until that day comes, nothing turns it off. No PIN. No override. No
            &ldquo;just five minutes.&rdquo; Once it&apos;s armed, the door is sealed — and the
            addiction doesn&apos;t get a second chance.
          </p>
          <div className="prot-nuke-chips">
            {[
              "Can't be disabled early",
              "No emergency unlock",
              "Locked on every device",
              "You set the date — then it's out of your hands",
            ].map((chip) => (
              <span key={chip} className="prot-nuke-chip">
                {chip}
              </span>
            ))}
          </div>
          <p className="prot-nuke-close">
            The point of no return — exactly what quitting takes.
          </p>
        </div>
        <div className="prot-nuke-lock-wrap">
          <span className="prot-nuke-lock-glow" aria-hidden="true" />
          <span className="prot-nuke-lock">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4.5" y="10.8" width="15" height="10.4" rx="2.6" fill="#fff" />
              <path ref={shackleRef} className="prot-nuke-shackle" d="M7.5 10.8V7.5a4.5 4.5 0 0 1 9 0v3.3" />
              <circle cx="12" cy="15.3" r="1.5" fill="#141210" stroke="none" />
              <rect x="11" y="15.9" width="2" height="3.4" rx="1" fill="#141210" stroke="none" />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}

export function ProtectionPage() {
  return (
    <main className="prot-page">
      <section className="prot-hero">
        <div className="prot-wrap prot-hero-grid">
          <div>
            <span className="prot-eyebrow">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9.5" rx="2.2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              PROTECTION
            </span>
            <h1 className="prot-headline">
              Block it
              <br />
              for <span className="prot-accent">good.</span>
            </h1>
            <p className="prot-sub">
              Adult content, gambling, dating apps, mature games — locked across all your devices,
              for as long as you decide. No willpower required.
            </p>
            <div className="prot-cta-row">
              <button type="button" className="prot-btn-primary">
                Get Protected
              </button>
              <Link href="#how" className="prot-link">
                See how it works
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      <StatsBand />

      <section className="prot-section">
        <div className="prot-wrap">
          <div className="prot-section-head">
            <h2 className="prot-section-title">What you can block</h2>
            <p className="prot-section-sub">Pick a category and it&apos;s gone — everywhere, instantly.</p>
          </div>
          <div className="prot-cat-grid">
            {CATEGORIES.map((c) => (
              <article key={c.title} className="prot-cat-card">
                <span className="prot-cat-pad" aria-hidden="true">
                  <PadlockMini />
                </span>
                <span className="prot-cat-icon">{c.icon}</span>
                <div className="prot-cat-title">{c.title}</div>
                <div className="prot-cat-desc">{c.desc}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="prot-section">
        <div className="prot-wrap">
          <div style={{ textAlign: "center", margin: "0 auto 40px" }}>
            <span style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", color: "#9d9384" }}>
              HOW IT WORKS
            </span>
            <h2 className="prot-section-title" style={{ marginTop: 12 }}>
              Protected in three steps.
            </h2>
          </div>
          <div className="prot-steps">
            {[
              { n: "01", title: "Choose what to block", body: "Pick your categories — adult sites, gambling, dating, games." },
              { n: "02", title: "Set how hard it is to quit", body: "From a simple PIN to a date you can't undo." },
              { n: "03", title: "Stay protected everywhere", body: "Always on, synced across every device you own." },
            ].map((s) => (
              <article key={s.n} className="prot-step">
                <div className="prot-step-num">{s.n}</div>
                <div className="prot-step-title">{s.title}</div>
                <p className="prot-step-body">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <UnlockLadder />
      <NuclearBlock />

      <section className="prot-privacy">
        <div className="prot-wrap">
          <div className="prot-privacy-bar">
            <span className="prot-privacy-icon">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3l18 18" />
                <path d="M10.6 6.1A9.7 9.7 0 0 1 12 6c5 0 9 6 9 6a16 16 0 0 1-2.4 2.9" />
                <path d="M6.6 6.6A15.8 15.8 0 0 0 3 12s4 6 9 6a9.3 9.3 0 0 0 4.3-1" />
                <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
              </svg>
            </span>
            <span className="prot-privacy-text">
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}>
                We never log which sites you visit.
              </strong>{" "}
              Filtering happens on your device, privately.
            </span>
          </div>
        </div>
      </section>

      <section className="prot-cta-section">
        <div className="prot-wrap">
          <div className="prot-cta-card">
            <span className="prot-cta-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9.5" rx="2.2" />
                <path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </span>
            <h2 className="prot-cta-title">Take back control.</h2>
            <p className="prot-cta-sub">Set it once. Stay protected for as long as you decide.</p>
            <button type="button" className="prot-btn-primary prot-cta-btn">
              Get Protected
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
