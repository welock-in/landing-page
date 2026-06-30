"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DownloadButton } from "@/components/ui/DownloadButton";
import "./Protection.css";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MOCK_DEVICES = [
  { name: "MacBook de Hedi", icon: "laptop" },
  { name: "iPhone de Hedi", icon: "phone" },
  { name: "iPad de Hedi", icon: "tablet" },
] as const;

const METHODS = [
  {
    badge: "EASY",
    bars: [6, 8, 10],
    title: "Unlock with a PIN",
    body: "Set a PIN, disable anytime you enter it.",
  },
  {
    badge: "MEDIUM",
    bars: [6, 10, 14],
    title: "Cooldown delay",
    body: "Turning off only takes effect after a wait.",
  },
  {
    badge: "HARD",
    bars: [8, 12, 16],
    title: "Ask an accountability partner",
    body: "A trusted person must approve unblocking.",
  },
  {
    badge: "HARD",
    bars: [10, 14, 18],
    title: "Type a passphrase",
    body: "Type a long random phrase to disable.",
  },
] as const;

const CATEGORIES = [
  "Adult & explicit sites",
  "Gambling",
  "Dating apps",
  "Mature games",
] as const;

const STEPS = [
  { title: "Choose what to block", body: "Pick your categories." },
  { title: "Set how hard it is to quit", body: "From a simple PIN to a date you can't undo." },
  { title: "Stay protected everywhere", body: "Always on, across all your devices." },
] as const;

const NUKE_CHIPS = [
  "Can't be disabled early",
  "No emergency unlock",
  "Locked on every device",
  "You set the date — then it's out of your hands",
] as const;

function DeviceIcon({ type }: { type: (typeof MOCK_DEVICES)[number]["icon"] }) {
  if (type === "laptop") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5" width="16" height="10.5" rx="1.7" />
        <path d="M2 19.5h20" />
      </svg>
    );
  }
  if (type === "phone") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2.5" width="10" height="19" rx="2.6" />
        <line x1="10.6" y1="18.4" x2="13.4" y2="18.4" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2.8" width="14" height="18.4" rx="2.4" />
      <line x1="10.4" y1="18.4" x2="13.6" y2="18.4" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="prot-mock-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function HeroMockup() {
  const [selected, setSelected] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hovering = useRef(false);
  const visible = useRef(false);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timer.current || hovering.current || !visible.current || reduced()) return;
    timer.current = setInterval(() => {
      setSelected((i) => (i + 1) % MOCK_DEVICES.length);
    }, 2200);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visible.current = e.isIntersecting;
          if (e.isIntersecting) start();
          else stop();
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [start, stop]);

  return (
    <div
      className="prot-mock"
      ref={ref}
      onMouseEnter={() => {
        hovering.current = true;
        stop();
      }}
      onMouseLeave={() => {
        hovering.current = false;
        start();
      }}
    >
      <div className="prot-mock-bar" aria-hidden="true">
        <span className="prot-mock-dot" />
        <span className="prot-mock-dot" />
        <span className="prot-mock-dot" />
      </div>
      <div className="prot-mock-status">
        <div className="prot-mock-status-left">
          <span className="prot-shield">
            <ShieldIcon />
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Protected</div>
            <div style={{ fontSize: 12, color: "var(--prot-muted)" }}>
              2 devices · always on, 24/7
            </div>
          </div>
        </div>
        <span className="prot-live">• LIVE</span>
      </div>
      <div className="prot-mock-rows">
        {MOCK_DEVICES.map((d, i) => (
          <div
            key={d.name}
            className={`prot-mock-row${selected === i ? " selected" : ""}`}
          >
            <span className="prot-mock-ico">
              <DeviceIcon type={d.icon} />
            </span>
            <span className="prot-mock-name">{d.name}</span>
            <CheckIcon />
          </div>
        ))}
      </div>
    </div>
  );
}

function MethodCards() {
  const [selected, setSelected] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hovering = useRef(false);
  const visible = useRef(false);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timer.current || hovering.current || !visible.current || reduced()) return;
    timer.current = setInterval(() => {
      setSelected((i) => (i + 1) % METHODS.length);
    }, 2200);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          visible.current = e.isIntersecting;
          if (e.isIntersecting) start();
          else stop();
        });
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [start, stop]);

  return (
    <div
      className="prot-methods"
      ref={ref}
      onMouseEnter={() => {
        hovering.current = true;
        stop();
      }}
      onMouseLeave={() => {
        hovering.current = false;
        start();
      }}
    >
      {METHODS.map((m, i) => (
        <div
          key={m.title}
          className={`prot-method${selected === i ? " selected" : ""}`}
          role="button"
          tabIndex={0}
          onClick={() => setSelected(i)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setSelected(i);
          }}
        >
          <svg className="prot-method-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div className="prot-badge">
            <span className="prot-bars" aria-hidden="true">
              {m.bars.map((h, bi) => (
                <span key={bi} className="prot-bar" style={{ height: h }} />
              ))}
            </span>
            {m.badge}
          </div>
          <h3>{m.title}</h3>
          <p>{m.body}</p>
        </div>
      ))}
    </div>
  );
}

function NuclearBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const [snapped, setSnapped] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setSnapped(true);
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="prot-nuclear" ref={ref}>
      <p className="prot-nuclear-eyebrow">NUCLEAR MODE</p>
      <h2>Set it once. There&apos;s no going back.</h2>
      <p className="prot-nuclear-body">
        Pick a date, and until that day comes, nothing turns it off. No PIN. No override.
        No &ldquo;just five minutes.&rdquo; Once it&apos;s armed, the door is sealed — and the
        addiction doesn&apos;t get a second chance.
      </p>
      <div className="prot-chips">
        {NUKE_CHIPS.map((c) => (
          <span className="prot-chip" key={c}>
            {c}
          </span>
        ))}
      </div>
      <p className="prot-nuclear-close">
        The point of no return — exactly what quitting takes.
      </p>
      <svg
        className={`prot-nuke-lock${snapped ? " snapped" : ""}`}
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="5" y="11" width="14" height="10" rx="2.2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    </div>
  );
}

function StatsBand() {
  const ref = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState([0, 0, 0, 0]);
  const targets = [24, 5, 100, 1];
  const labels = ["always-on protection", "unlock difficulty levels", "on-device & private", "your devices, synced"];
  const display = ["24/7", "5", "100%", "All"];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      setVals([1, 1, 1, 1]);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - t0) / 900, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setVals(targets.map((t, i) => (i === 0 ? (ease >= 1 ? 1 : 0) : Math.round(t * ease))));
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
          io.disconnect();
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="prot-stats" ref={ref}>
      <div className="prot-wrap">
        <div className="prot-stats-grid">
          {display.map((d, i) => (
            <div key={d}>
              <div className="prot-stat-num">{vals[i] >= 1 || i === 0 ? d : "0"}</div>
              <div className="prot-stat-label">{labels[i]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProtectionPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(".prot-reveal");
    if (reduced()) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="prot" ref={rootRef}>
      <section className="prot-hero">
        <div className="prot-wrap prot-hero-grid">
          <div>
            <p className="prot-eyebrow">Protection</p>
            <h1>Block it for good.</h1>
            <p className="prot-hero-sub">
              Adult content, gambling, dating apps, mature games — locked across all your
              devices, for as long as you decide. No willpower required.
            </p>
            <div className="prot-hero-cta">
              <DownloadButton label="Get Protected" />
              <a className="prot-link" href="#how-protection-works">
                See how it works
              </a>
            </div>
          </div>
          <HeroMockup />
        </div>
      </section>

      <StatsBand />

      <section className="prot-section">
        <div className="prot-wrap">
          <h2 className="prot-reveal">What you can block</h2>
          <div className="prot-cats">
            {CATEGORIES.map((c) => (
              <div className="prot-cat prot-reveal" key={c}>
                <div className="prot-cat-ico">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>
                <div className="prot-cat-label">{c}</div>
                <div className="prot-cat-lock" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="prot-section" id="how-protection-works">
        <div className="prot-wrap">
          <h2 className="prot-reveal">How it works</h2>
          <div className="prot-steps">
            {STEPS.map((s, i) => (
              <div className="prot-step prot-reveal" key={s.title}>
                <div className="prot-step-num">{String(i + 1).padStart(2, "0")}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="prot-section">
        <div className="prot-wrap">
          <div className="prot-ladder-head prot-reveal">
            <h2 style={{ margin: 0 }}>Make quitting as hard as you need.</h2>
            <p>From a simple PIN to a date you can&apos;t undo — pick how hard it is to turn protection off.</p>
          </div>
          <MethodCards />
          <NuclearBlock />
        </div>
      </section>

      <section className="prot-section">
        <div className="prot-wrap">
          <div className="prot-privacy prot-reveal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
              <line x1="2" y1="2" x2="22" y2="22" />
            </svg>
            We never log which sites you visit. Filtering happens on your device, privately.
          </div>
        </div>
      </section>

      <section className="prot-final">
        <div className="prot-wrap prot-reveal">
          <h2>Take back control.</h2>
          <DownloadButton label="Get Protected" />
        </div>
      </section>
    </div>
  );
}
