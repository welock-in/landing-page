import Image from "next/image";

import { Container } from "@/components/ui/Container";
import { AppleIcon, ArrowRightIcon, StarIcon } from "@/components/ui/icons";
import styles from "./Hero.module.css";

// Overlapping social-proof avatars (warm tints to match the brand palette).
const AVATARS = [
  "https://api.dicebear.com/10.x/notionists/svg?seed=Mira&backgroundColor=dce8f3&radius=50",
  "https://api.dicebear.com/10.x/notionists/svg?seed=Theo&backgroundColor=ddefdc&radius=50",
  "https://api.dicebear.com/10.x/notionists/svg?seed=Lina&backgroundColor=ede3f0&radius=50",
  "https://api.dicebear.com/10.x/notionists/svg?seed=Omar&backgroundColor=fbe4e0&radius=50",
  "https://api.dicebear.com/10.x/notionists/svg?seed=Yuki&backgroundColor=fdf7d2&radius=50",
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
            WeLockIn shuts out the apps that hijack your focus, so the deep work
            finally happens.
          </p>

          <div className={styles.ctaRow}>
            <button className={styles.btnPrimary} type="button">
              <span className={styles.ihbMain}>
                <AppleIcon width={18} height={18} />
                <span>Download for macOS</span>
              </span>
              <span className={styles.ihbHover} aria-hidden="true">
                <AppleIcon width={18} height={18} />
                <span>Download for macOS</span>
                <ArrowRightIcon width={18} height={18} strokeWidth={2.4} />
              </span>
            </button>
          </div>

          <div className={styles.socialProof}>
            <div className={styles.avatars}>
              {AVATARS.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element -- decorative remote avatars
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
          {/* eslint-disable-next-line @next/next/no-img-element -- hand-drawn mascot, no layout shift concern */}
          <img className={styles.peep} src="/images/peep-fez.png" alt="WeLockIn mascot" />
        </div>
      </Container>
    </header>
  );
}
