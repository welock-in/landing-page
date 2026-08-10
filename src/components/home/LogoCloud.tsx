"use client";

import { useEffect, useRef } from "react";

import { UNIVERSITIES } from "./data";
import type { HomeCopy } from "./HomePage";

/** The drift moves one full copy of the list past the viewport in 90s. */
const LOOP_SECONDS = 90;
/** How long the drift stays out of the way after someone scrolls by hand. */
const RESUME_DELAY_MS = 1200;

/**
 * "Used by students at" marquee, driven by `scrollLeft` on a real scroll
 * container rather than an animated transform. That makes it swipeable and
 * draggable — and it is also what keeps the page from panning sideways on
 * iOS: a scroll container owns its own overflow, so the 6000px track can
 * never widen the document the way a composited translateX layer could.
 * Ported from the legacy landing, which shipped this exact mechanism.
 */
export function LogoCloud({ copy }: { copy: HomeCopy["logoCloud"] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const loopStartRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    let last = performance.now();
    let idleUntil = 0;
    let hovering = false;
    let dragging = false;
    let pos = 0;
    // Lets the scroll handler tell our own writes from the user's.
    let lastWritten = -1;
    let dragStartX = 0;
    let dragStartScroll = 0;

    /**
     * Width of one copy of the list, measured to where the duplicate starts.
     * scrollWidth / 2 would fall half a flex gap short and jog every lap.
     */
    const loopWidth = () => loopStartRef.current?.offsetLeft ?? 0;

    const write = (value: number) => {
      lastWritten = value;
      el.scrollLeft = value;
    };

    const frame = (now: number) => {
      // A frame can already be queued when the observer stops us; this makes
      // the stop stick instead of letting that frame reschedule the loop.
      if (!running) return;
      raf = requestAnimationFrame(frame);
      // Clamped so returning to a backgrounded tab does not jump a whole lap.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const width = loopWidth();
      if (width <= 0) return;

      const drifting = !hovering && !dragging && now >= idleUntil;
      if (drifting) pos += (width / LOOP_SECONDS) * dt;

      // Keep the position inside the first copy so neither end is reachable.
      // Only with the pointer up: rewriting scrollLeft mid-gesture would fight
      // the browser's own momentum.
      if (!dragging) {
        if (pos >= width) pos -= width;
        else if (pos < 0) pos += width;
        if (drifting || Math.abs(el.scrollLeft - pos) >= 1) write(pos);
      }
    };
    // Only animate while the row is actually on screen.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (!running) {
              running = true;
              last = performance.now();
              raf = requestAnimationFrame(frame);
            }
          } else {
            running = false;
            cancelAnimationFrame(raf);
          }
        });
      },
      { rootMargin: "120px 0px", threshold: 0 },
    );
    io.observe(el);

    const onScroll = () => {
      if (Math.abs(el.scrollLeft - lastWritten) < 1) return; // our own write
      idleUntil = performance.now() + RESUME_DELAY_MS;
      pos = el.scrollLeft;
    };

    const onEnter = () => {
      hovering = true;
    };
    const onLeave = () => {
      hovering = false;
    };

    // Touch and trackpads scroll the container natively; only a mouse needs
    // click-and-drag wired up by hand.
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      dragStartX = e.clientX;
      dragStartScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.classList.add("lc-dragging");
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      el.scrollLeft = dragStartScroll - (e.clientX - dragStartX);
    };
    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      pos = el.scrollLeft;
      idleUntil = performance.now() + RESUME_DELAY_MS;
      el.classList.remove("lc-dragging");
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  // The list is rendered twice so the drift can wrap without a visible seam.
  const rows = [false, true];

  return (
    <section className="lc">
      <p className="lc-label">{copy.label}</p>
      <div
        className="lc-marquee"
        ref={viewportRef}
        role="group"
        aria-label={copy.ariaLabel}
      >
        <div className="lc-track">
          {rows.map((isDupe) =>
            UNIVERSITIES.map((u, i) => (
              <span
                key={`${isDupe ? "dupe-" : ""}${u.file}`}
                // The duplicate's first item marks where one lap ends.
                ref={isDupe && i === 0 ? loopStartRef : undefined}
                className={`lc-logo${u.wide ? " lc-wide" : ""}`}
                aria-hidden={isDupe || undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- variable-ratio crests in a decorative marquee */}
                <img
                  src={`/images/logos/${u.file}`}
                  alt={isDupe ? "" : u.name}
                  width={120}
                  height={u.wide ? 34 : 68}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
