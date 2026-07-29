import { Container } from "@/components/ui/Container";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { StarIcon } from "@/components/ui/icons";
import { HeroVideo } from "./HeroVideo";
import { Peep } from "./Peep";
import styles from "./Hero.module.css";

/**
 * Overlapping social-proof avatars (warm tints to match the brand palette).
 *
 * Generated once with DiceBear and committed, rather than fetched from
 * api.dicebear.com on every visit — they sit above the fold, so a third-party
 * DNS + TLS handshake stood between the visitor and the first screen.
 */
const AVATARS = [
  "/images/avatars/mira.svg",
  "/images/avatars/theo.svg",
  "/images/avatars/lina.svg",
  "/images/avatars/omar.svg",
  "/images/avatars/yuki.svg",
];

// Word-by-word stagger. Delays are static so the hero stays a server component.
const HEADLINE: { text: string; em?: boolean; breakAfter?: boolean }[] = [
  { text: "Block" },
  { text: "distractions", breakAfter: true },
  { text: "before" },
  { text: "they" },
  { text: "block", breakAfter: true },
  { text: "your" },
  { text: "future.", em: true },
];

export function Hero() {
  return (
    <header className={styles.hero}>
      <Container className={styles.grid}>
        <div>
          <h1 className={styles.headline}>
            {HEADLINE.map((word, i) => (
              <span key={i}>
                <span
                  className={styles.word}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {word.em ? <em>{word.text}</em> : word.text}
                </span>
                {word.breakAfter ? <br /> : " "}
              </span>
            ))}
          </h1>

          <p className={styles.subtitle}>
            WeLockIn shuts out the apps that hijack your focus, so the deep work
            finally happens.
          </p>

          <div className={styles.ctaRow}>
            <DownloadButton />
          </div>

          <div className={styles.socialProof}>
            <div className={styles.avatars}>
              {AVATARS.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element -- decorative fixed-size SVGs
                <img key={src} className={styles.av} src={src} alt="" width={44} height={44} />
              ))}
            </div>
            <div className={styles.spText}>
              <div className={styles.spStars} aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} width={20} height={20} />
                ))}
              </div>
              <div className={styles.spLine}>17,335 locked in</div>
            </div>
          </div>
        </div>

        <div className={styles.visual}>
          <HeroVideo />
          <Peep />
        </div>
      </Container>
    </header>
  );
}
