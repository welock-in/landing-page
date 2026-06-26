import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { DownloadIcon } from "@/components/ui/icons";
import { PeepIllustration } from "@/components/ui/PeepIllustration";
import styles from "./Hero.module.css";

const AVATAR_TINTS = ["#f3d9cd", "#E9B4AE", "#F0CFAA", "#D8C2B0", "#EBC6C0"];

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
        <div className={styles.text}>
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
            WeLockIn blocks the apps that steal your attention. Once and for
            all. For $20.
          </p>

          <div className={styles.ctaRow}>
            <button className={styles.btnPrimary} type="button">
              <span className={styles.dl}>
                <DownloadIcon />
              </span>
              Download for macOS, free for 7 days
            </button>
          </div>

          <div className={styles.socialProof}>
            <div className={styles.avatars}>
              {AVATAR_TINTS.map((tint) => (
                <span
                  key={tint}
                  className={styles.av}
                  style={{ background: tint }}
                />
              ))}
            </div>
            <span>
              <b>1,200+</b> students focused every day
            </span>
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.laptop}>
            <div className={styles.screen}>
              <Image
                src="/images/app-dashboard.jpeg"
                alt="WeLockIn app dashboard showing focus sessions and blocklists"
                fill
                sizes="(max-width: 920px) 90vw, 440px"
                className={styles.shot}
                priority
              />
            </div>
            <div className={styles.base}>
              <span className={styles.notch} />
            </div>
          </div>
          <PeepIllustration className={styles.peep} />
        </div>
      </Container>
    </header>
  );
}
