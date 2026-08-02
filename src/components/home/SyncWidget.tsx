"use client";

import { useEffect, useRef, useState } from "react";

import { reducedMotion, runSeq } from "./motion";

const DEVICES = [
  {
    name: "MacBook de Hedi",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="4" y="5" width="16" height="10.5" rx="1.7" />
        <path d="M2 19.5h20" />
      </svg>
    ),
  },
  {
    name: "iPhone de Hedi",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="7" y="2.5" width="10" height="19" rx="2.6" />
        <line x1="10.6" y1="18.4" x2="13.4" y2="18.4" />
      </svg>
    ),
  },
  {
    name: "iPad de Hedi",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2.8" width="14" height="18.4" rx="2.4" />
        <line x1="10.4" y1="18.4" x2="13.6" y2="18.4" />
      </svg>
    ),
  },
];

/** The two poses the widget alternates between once the demo has played. */
const SYNC_IDLE: boolean[][] = [
  [true, true, false],
  [true, true, true],
];

/**
 * "Sync all devices" demo widget. On first view: hint pulse on the last row,
 * uncheck iPad, uncheck iPhone, re-check, all on — then idles between two
 * poses every 3s. Hover pauses, clicking a row stops the show for good and
 * lets the visitor toggle. Reduced motion: everything stays checked.
 */
export function SyncWidget() {
  const [pressed, setPressed] = useState<boolean[]>([true, true, true]);
  const [hint, setHint] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const stopped = useRef(false);
  const hovering = useRef(false);
  const visible = useRef(false);
  const demoPlayed = useRef(false);
  const seqCleanup = useRef<(() => void) | null>(null);
  const idle = useRef<number | null>(null);
  const idleIdx = useRef(0);

  const cancel = () => {
    if (seqCleanup.current) {
      seqCleanup.current();
      seqCleanup.current = null;
    }
    if (idle.current) {
      clearInterval(idle.current);
      idle.current = null;
    }
  };

  const startIdle = () => {
    if (idle.current || stopped.current || hovering.current || !visible.current || reducedMotion())
      return;
    idle.current = window.setInterval(() => {
      const s = SYNC_IDLE[idleIdx.current % SYNC_IDLE.length];
      setPressed([...s]);
      idleIdx.current += 1;
    }, 3000);
  };

  const playDemo = () => {
    if (demoPlayed.current || stopped.current || reducedMotion()) return;
    cancel();
    seqCleanup.current = runSeq([
      { ms: 600, fn: () => setHint(true) },
      {
        ms: 950,
        fn: () => {
          setHint(false);
          setPressed([true, true, false]);
        },
      },
      { ms: 1700, fn: () => setPressed([true, false, false]) },
      { ms: 2450, fn: () => setPressed([true, true, false]) },
      { ms: 3200, fn: () => setPressed([true, true, true]) },
      {
        ms: 4300,
        fn: () => {
          demoPlayed.current = true;
          if (!stopped.current && !hovering.current && visible.current) startIdle();
        },
      },
    ]);
  };

  useEffect(() => {
    const el = listRef.current;
    if (!el || reducedMotion()) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            visible.current = true;
            if (!demoPlayed.current) playDemo();
            else startIdle();
          } else {
            visible.current = false;
            setHint(false);
            cancel();
            if (!demoPlayed.current) setPressed([true, true, true]);
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel();
    };
    // The choreography helpers only touch refs and state setters — stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (n: number) => {
    stopped.current = true;
    cancel();
    setHint(false);
    setPressed((st) => st.map((v, i) => (i === n ? !v : v)));
  };

  return (
    <div className="bc-sync">
      <p className="sync-label">Devices</p>
      <div
        ref={listRef}
        className={`sync-list${hint ? " sync-hint" : ""}`}
        role="group"
        aria-label="Synced devices"
        onMouseEnter={() => {
          hovering.current = true;
          cancel();
        }}
        onMouseLeave={() => {
          hovering.current = false;
          if (visible.current && demoPlayed.current) startIdle();
        }}
      >
        {DEVICES.map((d, i) => (
          <button
            key={d.name}
            type="button"
            className="sync-row"
            aria-pressed={pressed[i]}
            onClick={() => toggle(i)}
          >
            <span className="sync-ico" aria-hidden="true">
              {d.icon}
            </span>
            <span className="sync-name">{d.name}</span>
            <span className="sync-mark" aria-hidden="true">
              <svg
                className="sync-check"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6.5 9.5 17 4 11.5" />
              </svg>
              <svg
                className="sync-empty"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
              </svg>
            </span>
          </button>
        ))}
      </div>
      <button type="button" className="sync-add">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add a device
      </button>
    </div>
  );
}
