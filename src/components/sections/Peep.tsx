"use client";

import { useEffect, useRef } from "react";

import styles from "./Hero.module.css";

// Influence radius (px) and how far / how much the mascot dodges the cursor.
const RADIUS = 240;
const MAX_SHIFT_X = 32;
const MAX_SHIFT_Y = 18;
const MAX_ROT = 22;

/**
 * Hand-drawn mascot that leans and scoots away from the cursor as it gets
 * close — a playful "dodge" — then eases back to a gentle idle sway.
 */
export function Peep() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mouse = { x: 0, y: 0, inside: false };
    let curTx = 0;
    let curTy = 0;
    let curRot = 0;
    let raf = 0;
    let running = false;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.inside = true;
    };
    const onLeave = () => {
      mouse.inside = false;
    };

    const frame = (now: number) => {
      if (!running) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // Gentle idle breathing sway, always present.
      let targetRot = Math.sin(now / 900) * 2;
      let targetTx = 0;
      let targetTy = 0;

      if (mouse.inside) {
        const vx = cx - mouse.x; // vector pointing away from the cursor
        const vy = cy - mouse.y;
        const dist = Math.hypot(vx, vy) || 1;
        if (dist < RADIUS) {
          const s = Math.pow(1 - dist / RADIUS, 1.4); // 0..1, stronger when closer
          const nx = vx / dist;
          const ny = vy / dist;
          targetTx = nx * MAX_SHIFT_X * s;
          targetTy = ny * MAX_SHIFT_Y * s;
          targetRot = nx * MAX_ROT * s + targetRot * (1 - s);
        }
      }

      // Smoothly ease current values toward the target.
      curTx += (targetTx - curTx) * 0.12;
      curTy += (targetTy - curTy) * 0.12;
      curRot += (targetRot - curRot) * 0.12;

      el.style.transform = `translate(${curTx.toFixed(2)}px, ${curTy.toFixed(
        2,
      )}px) rotate(${curRot.toFixed(2)}deg)`;

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) start();
          else stop();
        });
      },
      { rootMargin: "80px 0px", threshold: 0 },
    );

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    io.observe(el);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- hand-drawn mascot, no layout shift concern
    <img
      ref={ref}
      className={styles.peep}
      src="/images/peep-fez.png"
      alt="WeLockIn mascot"
    />
  );
}
