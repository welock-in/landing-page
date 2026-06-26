"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import { platforms } from "@/content/platforms";
import { cn } from "@/lib/utils";
import styles from "./LockedEverywhere.module.css";

export function LockedEverywhere() {
  const ref = useRef<HTMLElement>(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    // Reduced-motion users are revealed via CSS; no JS needed for that case.
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setIsIn(true);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18 },
    );
    obs.observe(el);
    // Failsafe: reveal even if the observer never fires.
    const t = setTimeout(() => setIsIn(true), 1200);
    return () => {
      obs.disconnect();
      clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="download"
      className={cn(styles.locked, isIn && styles.isIn)}
    >
      <div className={styles.inner}>
        <h2 className={cn(styles.title, styles.reveal)}>
          Block it once.
          <br />
          Locked everywhere.
        </h2>

        <p className={cn(styles.sub, styles.reveal)}>
          Start one focus session on welock.in and your distractions are locked
          across every device you own, at the same time.
        </p>

        <div className={cn(styles.visual, styles.reveal)}>
          <Image
            src="/images/devices-cutout.png"
            alt="A desktop, laptop, tablet and phone each showing an app blocked by welock.in"
            width={940}
            height={627}
            sizes="(max-width: 768px) 92vw, 940px"
          />
        </div>

        <div className={cn(styles.avail, styles.reveal)}>
          <span className={styles.availLabel}>welock.in is available on</span>
          <div className={styles.platforms}>
            {platforms.map((p) => (
              <div key={p.name} className={styles.platform}>
                <span
                  className={cn(styles.icon, p.wordmark && styles.wordmark)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- silhouetted OS logos, variable ratio */}
                  <img src={`/images/platforms/${p.file}`} alt="" />
                </span>
                <span className={styles.platformName}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <button className={cn(styles.cta, styles.reveal)} type="button">
          <ArrowRightIcon />
          Start focusing for free
        </button>
      </div>
    </section>
  );
}
