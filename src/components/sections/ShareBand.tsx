import { Container } from "@/components/ui/Container";
import { DownloadButton } from "@/components/ui/DownloadButton";
import styles from "./ShareBand.module.css";

const BUBBLES = [
  "https://api.dicebear.com/10.x/notionists/svg?seed=Mira&backgroundColor=dce8f3&radius=50",
  "https://api.dicebear.com/10.x/notionists/svg?seed=Theo&backgroundColor=ddefdc&radius=50",
];

/** Closing band: a warm, dark card that nudges you to pass WeLockIn on. */
export function ShareBand() {
  return (
    <section className={styles.band}>
      <Container>
        <div className={styles.card}>
          <span className={`${styles.orb} ${styles.o1}`} aria-hidden="true" />
          <span className={`${styles.orb} ${styles.o2}`} aria-hidden="true" />
          <span className={`${styles.orb} ${styles.o3}`} aria-hidden="true" />

          <div className={styles.inner}>
            <div className={styles.bubbles} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative remote avatar */}
              <img className={styles.bub} src={BUBBLES[0]} alt="" width={46} height={46} />
              <span className={styles.lock}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="11" width="14" height="9" rx="2.2" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                </svg>
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element -- decorative remote avatar */}
              <img className={styles.bub} src={BUBBLES[1]} alt="" width={46} height={46} />
            </div>

            <h2 className={styles.title}>Focus is contagious.</h2>
            <p className={styles.sub}>
              Send WeLockin to the friend who needs it most.
            </p>

            <DownloadButton
              size="lg"
              tone="onDark"
              icon="lock"
              label="Lock in for life"
              className={styles.cta}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
