"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import "./Features.css";

type Mode = "soft" | "nuclear";

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const STRICTNESS_COPY: Record<Mode, { title: string; tag: string; foot: string }> = {
  soft: {
    title: "Soft Lock",
    tag: "Stay focused, bail if you really must.",
    foot: "For daily deep work",
  },
  nuclear: {
    title: "Nuclear Lock",
    tag: "No pause. No stop. No way out.",
    foot: "For the deadlines that matter",
  },
};

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const NoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
  </svg>
);

function StrictnessWidget() {
  const [mode, setMode] = useState<Mode>("soft");
  const [copy, setCopy] = useState<Mode>("soft");
  const [swapping, setSwapping] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode>("soft");
  const stopped = useRef(false);
  const hovering = useRef(false);
  const visible = useRef(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const swapT = useRef<ReturnType<typeof setTimeout> | null>(null);

  const apply = useCallback((next: Mode) => {
    if (modeRef.current === next) return;
    modeRef.current = next;
    setMode(next);
    if (reduced()) {
      setCopy(next);
      return;
    }
    setSwapping(true);
    if (swapT.current) clearTimeout(swapT.current);
    swapT.current = setTimeout(() => {
      setCopy(next);
      setSwapping(false);
    }, 180);
  }, []);

  const cycle = useCallback(() => {
    apply(modeRef.current === "nuclear" ? "soft" : "nuclear");
  }, [apply]);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timer.current || stopped.current || hovering.current || !visible.current || reduced()) return;
    timer.current = setInterval(cycle, 5000);
  }, [cycle]);

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
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [start, stop]);

  return (
    <div
      className={`sw${swapping ? " swapping" : ""}`}
      data-mode={mode}
      role="group"
      aria-label="Lock intensity"
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
      <div className="sw-seg">
        <span className="sw-pill" aria-hidden="true" />
        <button
          type="button"
          className="sw-soft"
          onClick={() => {
            stopped.current = true;
            stop();
            apply("soft");
          }}
        >
          Soft Lock
        </button>
        <button
          type="button"
          className="sw-nuc"
          onClick={() => {
            stopped.current = true;
            stop();
            apply("nuclear");
          }}
        >
          Nuclear Lock
        </button>
      </div>

      <div className="sw-head">
        <span className="sw-ico">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2.2" />
            <path className="sw-shackle" d="M8 11 V8 a4 4 0 0 1 8 0 V11" />
          </svg>
        </span>
        <span className="sw-title">{STRICTNESS_COPY[copy].title}</span>
        <span className="sw-badge">Recommended</span>
      </div>

      <p className="sw-tag">{STRICTNESS_COPY[copy].tag}</p>

      <div className="sw-stack">
        <div className="sw-list sw-soft-list">
          {["Pause when life happens", "Stop the session early", "Good for everyday focus"].map(
            (row) => (
              <div className="sw-row" key={row}>
                <span className="sw-rico">
                  <CheckIcon />
                </span>
                <span>{row}</span>
              </div>
            ),
          )}
        </div>
        <div className="sw-list sw-nuc-list">
          {["Pausing disabled", "Can't stop until the timer ends", "Survives restarts & uninstall"].map(
            (row) => (
              <div className="sw-row" key={row}>
                <span className="sw-rico">
                  <NoIcon />
                </span>
                <span>{row}</span>
              </div>
            ),
          )}
        </div>
      </div>

      <p className="sw-foot">{STRICTNESS_COPY[copy].foot}</p>
    </div>
  );
}

const DEVICES = [
  {
    name: "MacBook de Hedi",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="5" width="16" height="10.5" rx="1.7" />
        <path d="M2 19.5h20" />
      </svg>
    ),
  },
  {
    name: "iPhone de Hedi",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2.5" width="10" height="19" rx="2.6" />
        <line x1="10.6" y1="18.4" x2="13.4" y2="18.4" />
      </svg>
    ),
  },
  {
    name: "iPad de Hedi",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2.8" width="14" height="18.4" rx="2.4" />
        <line x1="10.4" y1="18.4" x2="13.6" y2="18.4" />
      </svg>
    ),
  },
];

const SYNC_STATES: boolean[][] = [
  [true, true, true],
  [true, true, false],
  [true, false, false],
  [true, false, true],
  [true, true, true],
];

function SyncWidget() {
  const [pressed, setPressed] = useState<boolean[]>([true, true, true]);

  const ref = useRef<HTMLDivElement>(null);
  const stopped = useRef(false);
  const hovering = useRef(false);
  const visible = useRef(false);
  const idx = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (timer.current || stopped.current || hovering.current || !visible.current || reduced()) return;
    timer.current = setInterval(() => {
      const s = SYNC_STATES[idx.current % SYNC_STATES.length];
      setPressed([...s]);
      idx.current += 1;
    }, 2000);
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
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, [start, stop]);

  return (
    <div className="bc-sync">
      <p className="sync-label">Devices</p>
      <div className="sync-list" role="group" aria-label="Synced devices" ref={ref}
        onMouseEnter={() => {
          hovering.current = true;
          stop();
        }}
        onMouseLeave={() => {
          hovering.current = false;
          start();
        }}
      >
        {DEVICES.map((d, n) => (
          <button
            key={d.name}
            type="button"
            className="sync-row"
            aria-pressed={pressed[n] ? "true" : "false"}
            onClick={() => {
              stopped.current = true;
              stop();
              setPressed((prev) => prev.map((v, i) => (i === n ? !v : v)));
            }}
          >
            <span className="sync-ico" aria-hidden="true">
              {d.icon}
            </span>
            <span className="sync-name">{d.name}</span>
            <span className="sync-mark" aria-hidden="true">
              <svg className="sync-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6.5 9.5 17 4 11.5" />
              </svg>
              <svg className="sync-empty" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
              </svg>
            </span>
          </button>
        ))}
      </div>
      <button type="button" className="sync-add">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add a device
      </button>
    </div>
  );
}

const MORE_FEATURES = [
  {
    title: "Focus sounds",
    body: "Rain, lo-fi or forest while you work.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="5" y2="12" />
        <line x1="8" y1="6" x2="8" y2="18" />
        <line x1="12" y1="3" x2="12" y2="21" />
        <line x1="16" y1="7" x2="16" y2="17" />
        <line x1="20" y1="10" x2="20" y2="14" />
      </svg>
    ),
  },
  {
    title: "Block adult sites",
    body: "Keep it clean, automatically.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: "Ad breaks",
    body: "Short timed breaks inside a session.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h13v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" />
        <path d="M17 10h2a2.5 2.5 0 0 1 0 5h-2" />
        <line x1="8" y1="3" x2="8" y2="6" />
        <line x1="12" y1="3" x2="12" y2="6" />
      </svg>
    ),
  },
  {
    title: "Password lock",
    body: "Lock your settings behind a password.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="10" rx="2.2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        <circle cx="12" cy="16" r="1.2" />
      </svg>
    ),
  },
];

export function Features() {
  const gridRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveal = (parent: HTMLElement | null, childSel: string, step: number) => {
      if (!parent) return () => {};
      const children = Array.from(parent.querySelectorAll<HTMLElement>(childSel));
      if (reduced()) {
        children.forEach((c) => c.classList.add("in"));
        return () => {};
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            children.forEach((c, i) => setTimeout(() => c.classList.add("in"), i * step));
            io.unobserve(e.target);
          });
        },
        { threshold: 0.15 },
      );
      io.observe(parent);
      return () => io.disconnect();
    };

    const cleanGrid = reveal(gridRef.current, ".bento-card", 110);
    const cleanMore = reveal(moreRef.current, ".more-item", 90);
    // Failsafe: reveal everything shortly after load even if observers never fire.
    const t = setTimeout(() => {
      gridRef.current?.querySelectorAll(".bento-card").forEach((c) => c.classList.add("in"));
      moreRef.current?.querySelectorAll(".more-item").forEach((c) => c.classList.add("in"));
    }, 1500);
    return () => {
      cleanGrid();
      cleanMore();
      clearTimeout(t);
    };
  }, []);

  return (
    <section className="bento-features" id="features">
      <div className="bf-wrap">
        <div className="bf-head">
          <h2>
            Everything you need to <em>lock in.</em>
          </h2>
          <p>Block the noise across every device, your way.</p>
        </div>

        <div className="bento-grid" ref={gridRef}>
          <article className="bento-card grad-1 card-apps">
            <div className="bc-text">
              <h3>Apps &amp; websites</h3>
              <p>Block any app or site. Bundle them for work, study or sleep.</p>
            </div>
            <div className="bc-shot bc-apps-shot">
              <div className="apps-compose">
                {/* eslint-disable-next-line @next/next/no-img-element -- absolutely-composed mockup */}
                <img className="apps-phone" src="/images/phone-select-apps.png" alt="WeLockIn select-apps screen" loading="lazy" />
                {/* eslint-disable-next-line @next/next/no-img-element -- absolutely-composed mockup */}
                <img className="apps-card" src="/images/card-websites.png" alt="Websites blocklist with Instagram and Reddit blocked" loading="lazy" />
              </div>
            </div>
          </article>

          <article className="bento-card grad-2 card-strict">
            <div className="bc-text">
              <h3>Your strictness</h3>
              <p>From a gentle nudge to the nuclear lock. You choose how hard.</p>
            </div>
            <div className="bc-widget">
              <StrictnessWidget />
            </div>
          </article>

          <article className="bento-card grad-3 card-sync">
            <div className="bc-text">
              <h3>Sync all devices</h3>
              <p>One session locks your Mac, iPhone and iPad at once.</p>
            </div>
            <SyncWidget />
          </article>

          <article className="bento-card grad-4 card-sched">
            <div className="bc-text">
              <h3>Scheduling</h3>
              <p>Recurring focus blocks. Lock in automatically, every day.</p>
            </div>
            <div className="bc-sched-mac">
              <div className="mac" aria-hidden="true">
                <div className="mac-screen">
                  <iframe className="sched-frame" src="/focus-week-drag.html" title="Focus week schedule" scrolling="no" loading="lazy" />
                </div>
                <div className="mac-base" />
              </div>
            </div>
          </article>
        </div>

        <h3 className="more-title">More features</h3>
        <div className="more-row" ref={moreRef}>
          {MORE_FEATURES.map((f) => (
            <div className="more-item" key={f.title}>
              <span className="mi-ico" aria-hidden="true">
                {f.icon}
              </span>
              <h4>{f.title}</h4>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
