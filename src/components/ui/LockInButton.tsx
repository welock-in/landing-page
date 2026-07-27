"use client";

import { useEffect, useRef, useState } from "react";

import { LockIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import styles from "./LockInButton.module.css";

type LockInButtonProps = {
  /** Visible label, e.g. "Lock in now". */
  label: string;
  className?: string;
};

/**
 * The playful section CTA: a pill with Peep hiding behind it. Clicking snaps
 * the padlock shut and shakes the button — a wink, not a navigation.
 */
export function LockInButton({ label, className }: LockInButtonProps) {
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const snap = () => {
    // Restart the animation even on rapid repeat clicks.
    setLocked(false);
    requestAnimationFrame(() => setLocked(true));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLocked(false), 1300);
  };

  return (
    <span className={cn(styles.pcta, className)}>
      <span className={styles.peep} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- hand-drawn mascot */}
        <img src="/images/peep-fez.png" alt="" />
      </span>
      <button
        className={cn(styles.btn, locked && styles.locked)}
        type="button"
        onClick={snap}
      >
        <LockIcon
          className={styles.lock}
          shackleClassName={styles.shackle}
          width={20}
          height={20}
        />
        {label}
      </button>
    </span>
  );
}
