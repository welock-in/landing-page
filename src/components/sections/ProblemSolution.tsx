import { Container } from "@/components/ui/Container";
import { problems, solutions } from "@/content/marketing";
import { cn } from "@/lib/utils";
import styles from "./ProblemSolution.module.css";

export function ProblemSolution() {
  return (
    <section className={styles.ps}>
      <Container className={styles.grid}>
        <div className={styles.col}>
          <h2 className={styles.title}>Your attention has a price.</h2>
          {problems.map((line) => (
            <div key={line} className={styles.line}>
              <span className={cn(styles.ico, styles.x)}>✕</span>
              {line}
            </div>
          ))}
        </div>

        <div className={styles.rule} />

        <div className={styles.col}>
          <h2 className={cn(styles.title, styles.red)}>WeLockIn does.</h2>
          {solutions.map((line) => (
            <div key={line} className={styles.line}>
              <span className={cn(styles.ico, styles.c)}>✓</span>
              {line}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
