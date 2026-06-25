"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import {
  defaultPlan,
  planFeatures,
  plans,
  type Plan,
} from "@/content/pricing";
import { cn } from "@/lib/utils";
import styles from "./Pricing.module.css";

const ORDER: Plan["id"][] = ["monthly", "lifetime"];

export function Pricing() {
  const [active, setActive] = useState<Plan["id"]>(defaultPlan);
  const toggleRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ left: 0, width: 0 });

  // Slide the knob under the active tab, recomputing on resize/font load.
  useLayoutEffect(() => {
    const toggle = toggleRef.current;
    if (!toggle) return;

    const position = () => {
      const el = toggle.querySelector<HTMLButtonElement>(
        `[data-plan="${active}"]`,
      );
      if (el) setKnob({ left: el.offsetLeft - 5, width: el.offsetWidth });
    };

    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [active]);

  const plan = plans[active];

  return (
    <section className={styles.pricing} id="pricing">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Pricing"
          description="Start free. Pay only once."
        />

        <div className={styles.toggleWrap}>
          <div className={styles.toggle} ref={toggleRef}>
            <span
              className={styles.knob}
              style={{
                width: knob.width,
                transform: `translateX(${knob.left}px)`,
              }}
            />
            {ORDER.map((id) => (
              <button
                key={id}
                type="button"
                data-plan={id}
                className={cn(styles.tab, active === id && styles.active)}
                onClick={() => setActive(id)}
              >
                {plans[id].tab}
                {plans[id].badge ? (
                  <span className={styles.badge}>{plans[id].badge}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <span className={styles.eyebrow}>{plan.eyebrow}</span>
          <h3 className={styles.planName}>WeLockIn Pro</h3>
          <div className={styles.amount}>
            <span>{plan.amount}</span>
            <small>{plan.cadence}</small>
          </div>
          <div className={styles.strike}>
            <s>$40/yr with Freedom</s> — you save <b>$20</b> in the first year.
          </div>
          <ul className={styles.features}>
            {planFeatures.map((feature) => (
              <li key={feature}>
                <span className={styles.check}>✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <button className={styles.buy} type="button">
            {plan.cta}
          </button>
          <div className={styles.madeBy}>🎓 {siteConfig.builtBy}</div>
        </div>
      </Container>
    </section>
  );
}
