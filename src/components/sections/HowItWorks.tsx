"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/Container";
import { howSteps } from "@/content/howItWorks";
import { cn } from "@/lib/utils";
import styles from "./HowItWorks.module.css";

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.step);
            setActive(i);
          }
        });
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );

    stepRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const stage = (
    <div className={styles.stage}>
      <div className={styles.mobileHead} aria-hidden="true">
        <span className={styles.eyebrow}>How it works</span>
        <h2>Get started in three steps.</h2>
      </div>

      <div className={styles.rail} aria-hidden="true">
        {howSteps.map((_, i) => (
          <Fragment key={i}>
            {i > 0 && <span className={styles.tie} />}
            <span className={cn(styles.dot, active === i && styles.dotActive)} />
          </Fragment>
        ))}
      </div>

      <div className={styles.mac}>
        <div className={styles.macScreen}>
          {howSteps.map((step, i) => (
            <div
              key={i}
              className={cn(styles.macShot, active === i && styles.macShotActive)}
            >
              <Image
                src={step.image}
                alt={step.alt}
                fill
                sizes="(max-width: 1024px) 74vw, 540px"
                className={styles.shotImg}
              />
            </div>
          ))}
        </div>
        <div className={styles.macBase} />
      </div>

      {/* mobile: single text block that swaps with the active step */}
      <div className={styles.mobileText} aria-hidden="true">
        <div key={active} className={styles.mobileTextInner}>
          <span className={styles.stepMark} />
          <h3>{howSteps[active].title}</h3>
          <p>{howSteps[active].body}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className={styles.hiw} id="how">
      <Container>
        <div className={cn(styles.head)}>
          <span className={styles.eyebrow}>How it works</span>
          <h2 className={styles.headTitle}>Get started in three steps.</h2>
          <p className={styles.headSub}>
            From install to locked&#8209;in in under a minute.
          </p>
        </div>

        <div className={styles.grid}>
          {stage}

          <div className={styles.steps}>
            {howSteps.map((step, i) => (
              <div
                key={i}
                data-step={i}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className={cn(styles.step, active === i && styles.stepActive)}
              >
                <div className={styles.stepBody}>
                  <span className={styles.stepMark} />
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
