"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * The page's signature: a serpentine tea stream poured from a teapot at the
 * top of the page, revealed by scroll all the way down to the share band,
 * with animated flow streaks, a three-dot tip, splashes and a final puddle.
 *
 * The geometry is rebuilt from the live section positions (catmull-rom
 * through per-section anchors, then "wavified"), so it survives any layout —
 * a ResizeObserver on <main> rebuilds it whenever content reflows. Direct
 * imperative port of the design's `setupTeaStream`.
 */
export function TeaStream({ mainRef }: { mainRef: RefObject<HTMLElement | null> }) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const main = mainRef.current;
    if (!layer || !main) return;
    const pot = main.querySelector<HTMLImageElement>(".tea-pot");
    const paths = [".tea-base", ".tea-mid", ".tea-core"].map((c) =>
      layer.querySelector<SVGPathElement>(c),
    );
    const midP = paths[1];
    const coreP = paths[2];
    const tips = [".tea-tip1", ".tea-tip2", ".tea-tip3"].map((c) =>
      layer.querySelector<SVGCircleElement>(c),
    );
    const pourSvg = main.querySelector<SVGSVGElement>(".tea-poursvg");
    const puddle = layer.querySelector<SVGEllipseElement>(".tea-puddle");
    const flowP = layer.querySelector<SVGPathElement>(".tea-flow");
    const maskP = layer.querySelector<SVGPathElement>(".tea-maskpath");
    const spls = [".tea-spl1", ".tea-spl2", ".tea-spl3", ".tea-spl4"].map((c) =>
      layer.querySelector<SVGCircleElement>(c),
    );
    let lastKey = "";
    let L = 0;
    let lut: [number, number][] = [];
    let cur = 0;
    let target = 0;
    let running = false;
    let rafId = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setReveal = (len: number) => {
      if (!L || !midP) return;
      len = Math.max(0, Math.min(len, L));
      // body trails the core: tapered tip instead of stacked caps
      midP.style.strokeDashoffset = `${L - Math.max(0, len - 12)}px`;
      if (coreP) coreP.style.strokeDashoffset = `${L - len}px`;
      // flow streaks only on the revealed part
      if (maskP) maskP.style.strokeDashoffset = `${L - len}px`;
      const offs = [0, -20, -42];
      tips.forEach((el, i) => {
        if (!el) return;
        if (len >= L - 4 || len < 8) {
          el.style.display = "none";
          return;
        }
        el.style.display = "";
        const p = midP.getPointAtLength(Math.max(0, len + offs[i]));
        el.setAttribute("cx", p.x.toFixed(1));
        el.setAttribute("cy", p.y.toFixed(1));
      });
      spls.forEach((el) => {
        if (!el) return;
        if (len >= L - 4 || len < 8) {
          el.style.display = "none";
          return;
        }
        el.style.display = "";
        const p = midP.getPointAtLength(Math.max(0, len - 2));
        el.setAttribute("cx", p.x.toFixed(1));
        el.setAttribute("cy", p.y.toFixed(1));
      });
      if (puddle) {
        const t = Math.max(0, Math.min(1, (len - (L - 200)) / 200));
        puddle.setAttribute("rx", (34 * t).toFixed(1));
        puddle.setAttribute("ry", (9 * t).toFixed(1));
        puddle.style.opacity = (0.38 * t).toFixed(3);
      }
    };

    const targetLen = () => {
      if (!lut.length) return 0;
      const y = window.scrollY + window.innerHeight * 0.62;
      let best = 0;
      for (let i = 0; i < lut.length; i++) {
        if (lut[i][1] <= y) best = lut[i][0];
        else if (lut[i][1] > y + 500) break;
      }
      return best;
    };

    const tick = () => {
      cur += (target - cur) * (reduceMotion ? 1 : 0.13);
      if (Math.abs(target - cur) < 0.5) {
        cur = target;
        running = false;
      }
      setReveal(cur);
      if (running) rafId = requestAnimationFrame(tick);
    };

    const kick = () => {
      target = targetLen();
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const rel = (el: Element) => {
      const r = el.getBoundingClientRect();
      const m = main.getBoundingClientRect();
      return {
        top: r.top - m.top,
        bottom: r.bottom - m.top,
        left: r.left - m.left,
        w: r.width,
        h: r.height,
      };
    };

    const catmull = (pts: [number, number][]) => {
      let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
      }
      return d;
    };

    // subdivide long runs and push alternate points sideways — serpentine flow
    const wavify = (pts: [number, number][], amp: number) => {
      const out: [number, number][] = [pts[0]];
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i];
        const b = pts[i + 1];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const seg = Math.hypot(dx, dy) || 1;
        const n = Math.max(1, Math.round(seg / 130));
        for (let k = 1; k < n; k++) {
          const t = k / n;
          const s = ((i + k) % 2 ? 1 : -1) * (amp || 13);
          out.push([a[0] + dx * t - (dy / seg) * s, a[1] + dy * t + (dx / seg) * s]);
        }
        out.push(b);
      }
      return out;
    };

    const build = () => {
      const W = main.clientWidth;
      const gut = Math.max(14, Math.min(64, (W - 1320) / 4 + 14));
      const LX = gut;
      const R = W - gut;
      const C = W / 2;
      const secs: Record<string, ReturnType<typeof rel>> = {};
      (
        [
          ["lc", ".lc"],
          ["bf", ".bento-features"],
          ["rs", ".results"],
          ["hiw", ".hiw"],
          ["le", ".le"],
          ["faq", ".faq"],
          ["vs", ".vs"],
        ] as const
      ).forEach(([k, s]) => {
        const el = main.querySelector(s);
        if (el) secs[k] = rel(el);
      });
      if (!secs.lc || !secs.vs || !pot) return;
      const pr = rel(pot);
      // same test as the CSS — pot position, lanes and grid flip together
      const mob = window.matchMedia("(max-width:920px)").matches;
      const sx = pr.left + pr.w * (mob ? 0.87 : 0.13);
      const sy = pr.top + pr.h * 0.52;
      const pts: [number, number][] = mob
        ? [
            [sx, sy],
            [sx + 8, sy + 62],
            [R - 4, sy + 170],
            [R, secs.lc.top - 300],
          ]
        : [
            [sx, sy],
            [sx - 8, sy + 62],
            [LX + 4, sy + 170],
          ];
      const push = (x: number, y: number) => pts.push([x, y]);
      push(LX, secs.lc.top - 150);
      push(LX, secs.lc.top - 60);
      push(C * 0.7, secs.lc.top + 24);
      push(R, secs.lc.top + 110);
      if (secs.bf) {
        push(R, secs.bf.top + secs.bf.h * 0.45);
        push(R, secs.bf.bottom - 160);
        push(R, secs.bf.bottom - 60);
      }
      if (secs.rs) {
        push(C, secs.rs.top - 20);
        push(LX, secs.rs.top + 120);
        push(LX, secs.rs.bottom - 160);
        push(LX, secs.rs.bottom - 60);
      }
      if (secs.hiw) {
        push(C, secs.hiw.top - 16);
        push(R, secs.hiw.top + 140);
        push(R, secs.hiw.top + secs.hiw.h * 0.6);
        push(R, secs.hiw.bottom - 160);
        push(R, secs.hiw.bottom - 60);
      }
      if (secs.le) {
        push(C, secs.le.top - 12);
        push(LX, secs.le.top + 130);
        push(LX, secs.le.bottom - 160);
        push(LX, secs.le.bottom - 70);
      }
      if (secs.faq) {
        push(C, secs.faq.top + 16);
        push(LX, secs.faq.top + 160);
        push(LX, secs.faq.bottom - 160);
        push(LX, secs.faq.bottom - 70);
      }
      push(C, secs.vs.top - 26);
      push(R, secs.vs.top + 140);
      push(R, secs.vs.bottom - 170);
      push(C + 70, secs.vs.bottom - 62);
      const end: [number, number] = [C, secs.vs.bottom - 46];
      pts.push(end);
      const key = `${W}x${Math.round(secs.vs.bottom)}`;
      if (key === lastKey) return;
      lastKey = key;
      // stream starts right at the teapot spout, with extra undulation
      const d = catmull(wavify(pts, mob ? 8 : 13));
      paths.forEach((p) => p && p.setAttribute("d", d));
      if (flowP) flowP.setAttribute("d", d);
      if (maskP) maskP.setAttribute("d", d);
      if (midP) {
        L = midP.getTotalLength();
        midP.style.strokeDasharray = `${L}px`;
        if (coreP) coreP.style.strokeDasharray = `${L}px`;
        if (maskP) maskP.style.strokeDasharray = `${L}px`;
        lut = [];
        for (let s = 0; s <= L; s += 14) {
          const p = midP.getPointAtLength(s);
          lut.push([s, p.y]);
        }
        lut.push([L, midP.getPointAtLength(L).y]);
      }
      // no separate pour overlay — the stream itself starts at the spout
      if (pourSvg) pourSvg.style.display = "none";
      if (puddle) {
        puddle.setAttribute("cx", String(end[0]));
        puddle.setAttribute("cy", String(end[1] + 6));
      }
      cur = Math.min(cur, L);
      setReveal(cur);
      kick();
      layer.classList.add("tea-ready");
      main.classList.add("tea-on");
    };

    build();
    const t1 = window.setTimeout(build, 400);
    const t2 = window.setTimeout(build, 1600);
    const onScroll = () => kick();
    window.addEventListener("scroll", onScroll, { passive: true });
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(build);
    });
    ro.observe(main);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mainRef]);

  return (
    <>
      <div className="tea-layer" aria-hidden="true" ref={layerRef}>
        <svg className="tea-svg">
          <defs>
            <mask id="teaRevealMask" maskUnits="userSpaceOnUse">
              <path
                className="tea-maskpath"
                d=""
                fill="none"
                stroke="#ffffff"
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </mask>
          </defs>
          <path className="tea-base" d="" />
          <path className="tea-mid" d="" />
          <path className="tea-core" d="" />
          <path className="tea-flow" d="" mask="url(#teaRevealMask)" />
          <ellipse className="tea-puddle" rx="0" ry="0" />
          <circle className="tea-spl tea-spl1" r="3.2" />
          <circle className="tea-spl tea-spl2" r="2.6" />
          <circle className="tea-spl tea-spl3" r="2.2" />
          <circle className="tea-spl tea-spl4" r="2.8" />
          <circle className="tea-tip3" r="3.6" />
          <circle className="tea-tip2" r="5" />
          <circle className="tea-tip1" r="7.5" />
        </svg>
      </div>
      <svg
        className="tea-poursvg"
        aria-hidden="true"
        width="360"
        height="420"
        style={{ display: "none" }}
      >
        <path className="tea-pour" d="" />
      </svg>
      {/* eslint-disable-next-line @next/next/no-img-element -- decorative teapot, positioned by the stream geometry */}
      <img className="tea-pot" src="/images/teapot-small.png" alt="" aria-hidden="true" />
    </>
  );
}
