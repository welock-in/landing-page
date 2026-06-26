import { universities } from "@/content/universities";
import { cn } from "@/lib/utils";
import styles from "./LogoCloud.module.css";

export function LogoCloud() {
  // Render the list twice for a seamless -50% marquee loop.
  const rows = [false, true];

  return (
    <section className={styles.logos}>
      <p className={styles.label}>Used by students at</p>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {rows.map((isDupe) =>
            universities.map((u) => (
              <span
                key={`${isDupe ? "dupe-" : ""}${u.file}`}
                className={cn(
                  styles.logo,
                  u.wide && styles.wide,
                  isDupe && styles.dupe,
                )}
                aria-hidden={isDupe}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- variable-ratio crests in a decorative marquee */}
                <img src={`/images/logos/${u.file}`} alt={isDupe ? "" : u.name} />
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
