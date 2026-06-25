import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { defaultPlan, planFeatures, plans } from "@/content/pricing";
import styles from "./Pricing.module.css";

export function Pricing() {
  const plan = plans[defaultPlan];

  return (
    <section className={styles.pricing} id="pricing">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Pricing"
          description="Start free. Pay only once."
        />

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
