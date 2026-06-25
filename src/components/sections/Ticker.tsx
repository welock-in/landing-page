import { tickerItems } from "@/content/marketing";
import styles from "./Ticker.module.css";

function Row() {
  return (
    <span className={styles.row}>
      {tickerItems.map((item) => (
        <span key={item} className={styles.item}>
          <i className={styles.star}>✦</i>
          {item}
        </span>
      ))}
    </span>
  );
}

export function Ticker() {
  return (
    <div className={styles.ticker} aria-hidden="true">
      <div className={styles.track}>
        {/* Duplicated for a seamless loop. */}
        <Row />
        <Row />
      </div>
    </div>
  );
}
