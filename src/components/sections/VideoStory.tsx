import { Container } from "@/components/ui/Container";
import { DownloadButton } from "@/components/ui/DownloadButton";
import styles from "./VideoStory.module.css";

export function VideoStory() {
  return (
    <section className={styles.videostory}>
      <Container>
        <figure className={styles.video}>
          {/* Drop a real demo clip in /public and add a <source> here. */}
          <video
            className={styles.player}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          />
          {/* Looping ambient scene shown until a real video source is added. */}
          <div className={styles.scene} aria-hidden="true">
            <span className={`${styles.orb} ${styles.o1}`} />
            <span className={`${styles.orb} ${styles.o2}`} />
            <span className={`${styles.orb} ${styles.o3}`} />
          </div>
          <div className={styles.scrim} aria-hidden="true" />
          <figcaption className={styles.overlay}>
            <p className={styles.kicker}>
              Thousands have taken back their focus.
            </p>
            <h2 className={styles.headline}>
              Now it&rsquo;s <em>your turn.</em>
            </h2>
            <DownloadButton />
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
