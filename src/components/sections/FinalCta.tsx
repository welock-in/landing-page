import { Container } from "@/components/ui/Container";
import { DownloadIcon } from "@/components/ui/icons";
import styles from "./FinalCta.module.css";

export function FinalCta() {
  return (
    <section className={styles.fcta}>
      <Container>
        <h2 className={styles.title}>
          One hour less on TikTok.
          <br />
          <em>One hour more on what matters.</em>
        </h2>
        <button className={styles.btnWhite} type="button">
          <span className={styles.dl}>
            <DownloadIcon />
          </span>
          Download free — 7-day trial
        </button>
      </Container>
    </section>
  );
}
