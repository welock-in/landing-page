"use client";

import { useEffect, useRef } from "react";

import { stats } from "@/content/stats";
import styles from "./Stats.module.css";

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export function Stats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const header = headerRef.current;
    if (!container || !card || !header) return;

    const isMobile = () => window.innerWidth <= 768;
    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = container.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      let p = total > 0 ? -rect.top / total : 0;
      p = Math.max(0, Math.min(1, p));

      const rotate = lerp(20, 0, p);
      const scale = isMobile() ? lerp(0.7, 0.9, p) : lerp(1.05, 1, p);
      const translate = lerp(0, -100, p);

      card.style.transform = `rotateX(${rotate.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      header.style.transform = `translateY(${translate.toFixed(1)}px)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", update);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className={styles.section} id="stats">
      <div className={styles.container} ref={containerRef}>
        <div className={styles.inner}>
          <div className={styles.header} ref={headerRef}>
            <span className={styles.eyebrow}>By the numbers</span>
            <h2 className={styles.title}>Focus that adds up.</h2>
          </div>

          <div className={styles.card} ref={cardRef}>
            <div className={styles.cardInner}>
              {stats.map((stat) => (
                <div className={styles.stat} key={stat.label}>
                  <div className={styles.num}>
                    {stat.value}
                    {stat.unit ? (
                      <span className={styles.unit}>{stat.unit}</span>
                    ) : null}
                  </div>
                  <div className={styles.label}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
