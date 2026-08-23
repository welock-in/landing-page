"use client";

import { useEffect, type RefObject } from "react";

/** How long the drift stays out of the way after someone scrolls by hand. */
const RESUME_DELAY_MS = 1200;
/** Past this much travel the press was a drag, so the click it lands on is swallowed. */
const DRAG_SLOP_PX = 5;

/**
 * A steady pace, or one lap of the list per N seconds. A long row reads better
 * at a fixed speed; a short one at a fixed cadence.
 */
export type MarqueeSpeed = { pxPerSecond: number } | { loopSeconds: number };

/**
 * Endless horizontal drift, driven by `scrollLeft` on a real scroll container
 * rather than an animated transform. That is what makes the row swipeable and
 * draggable for free, and it is also what keeps the page from panning sideways
 * on iOS: a scroll container owns its own overflow, so a 6000px track can never
 * widen the document the way a composited translateX layer could. Ported from
 * the legacy landing, which shipped this exact mechanism.
 *
 * `viewport` is the scroll container; `loopStart` is the first element of the
 * second copy of the list, whose offset is one lap — measured rather than
 * computed, because scrollWidth / copies falls a flex gap short and jogs.
 *
 * Setting `data-hold="true"` on the viewport holds the row still for as long
 * as it is there. That is a DOM attribute rather than an argument on purpose:
 * the effect below wires up a dozen listeners, and re-running all of it every
 * time a card opens would reset the drift's position mid-read.
 */
export function useMarquee<V extends HTMLElement, L extends HTMLElement>(
  viewport: RefObject<V | null>,
  loopStart: RefObject<L | null>,
  speed: MarqueeSpeed,
) {
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = false;
    let last = performance.now();
    let idleUntil = 0;
    let hovering = false;
    let focused = false;
    let dragging = false;
    let pos = 0;
    // Lets the scroll handler tell our own writes from the user's.
    let lastWritten = -1;
    let dragStartX = 0;
    let dragStartScroll = 0;
    let swallowClick = false;

    const loopWidth = () => loopStart.current?.offsetLeft ?? 0;

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

      // Reduced motion stops the drift but not the loop: the wrap below is
      // what keeps a hand-dragged row endless in both directions.
      const drifting =
        !reduce &&
        !hovering &&
        !focused &&
        !dragging &&
        el.dataset.hold !== "true" &&
        now >= idleUntil;
      if (drifting) {
        pos += ("pxPerSecond" in speed ? speed.pxPerSecond : width / speed.loopSeconds) * dt;
      }

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
    // Tabbing to a link inside the row scrolls it into view; holding still
    // while it has focus is what keeps it from sliding out again.
    const onFocusIn = () => {
      focused = true;
    };
    const onFocusOut = () => {
      focused = false;
    };

    // Touch and trackpads scroll the container natively; only a mouse needs
    // click-and-drag wired up by hand.
    //
    // The gesture deliberately runs without setPointerCapture: capturing
    // retargets the pointer events at the row, and with them the click that
    // follows, so a plain press on a link inside would never reach it. The
    // move and release listeners sit on the window instead, which is what
    // keeps a drag alive when the cursor leaves the row mid-swipe.
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dragging = true;
      swallowClick = false;
      dragStartX = e.clientX;
      dragStartScroll = el.scrollLeft;
      el.classList.add("mq-dragging");
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const dx = e.clientX - dragStartX;
      if (Math.abs(dx) > DRAG_SLOP_PX) swallowClick = true;
      el.scrollLeft = dragStartScroll - dx;
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      pos = el.scrollLeft;
      idleUntil = performance.now() + RESUME_DELAY_MS;
      el.classList.remove("mq-dragging");
    };
    // The click lands after pointerup, so a drag that ends on a link would
    // open it. Swallowing that one click is what keeps the two apart.
    const onClickCapture = (e: MouseEvent) => {
      if (!swallowClick) return;
      swallowClick = false;
      e.preventDefault();
      e.stopPropagation();
    };
    // Links and images are draggable by default, which would start a native
    // drag-and-drop halfway through a swipe.
    const onDragStart = (e: Event) => e.preventDefault();

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    el.addEventListener("click", onClickCapture, true);
    el.addEventListener("dragstart", onDragStart);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      el.removeEventListener("click", onClickCapture, true);
      el.removeEventListener("dragstart", onDragStart);
    };
  }, [viewport, loopStart, speed]);
}
