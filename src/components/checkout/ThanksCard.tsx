"use client";

import { useEffect } from "react";

import styles from "./Thanks.module.css";

/**
 * The deep link the desktop app registers on install. Opening it wakes the
 * running app (or cold-starts it) and triggers an immediate entitlement sync.
 *
 * It GRANTS nothing. The licence travels exclusively through the payment
 * provider's signed webhook and the server's signed receipt, so anyone opening
 * this link — or this page — without having paid causes one harmless refresh.
 */
const APP_DEEP_LINK = "welockin://checkout/success";

export function ThanksCard() {
  // Fire the deep link once on arrival, so the common case needs no click:
  // pay → Continue → the app is already in the foreground unlocking. The
  // browser will still ask "Open WeLockin?" the first time — that dialog is
  // the OS's, not ours, and the button below covers anyone who dismissed it.
  //
  // Never `window.open`: popup blockers eat it silently. Assigning `location`
  // on a page we own is the one navigation a blocker leaves alone, and when
  // the scheme is registered the browser stays on this page anyway.
  useEffect(() => {
    const t = window.setTimeout(() => {
      window.location.href = APP_DEEP_LINK;
    }, 400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className={styles.card}>
      <span className={styles.eyebrow}>Payment received</span>
      <h1 className={styles.title}>You&rsquo;re all set</h1>
      <p className={styles.lead}>
        WeLockin unlocks by itself within a few seconds. If it didn&rsquo;t come
        to the front on its own, the button below brings it back.
      </p>
      <a className={styles.open} href={APP_DEEP_LINK}>
        Open WeLockin
      </a>
      <p className={styles.fallback}>
        Nothing happening? Open WeLockin from your desktop or Start menu — it
        checks your licence every time it starts. You can close this tab.
      </p>
    </div>
  );
}
