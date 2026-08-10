"use client";

import { useEffect, useMemo } from "react";

import styles from "./Thanks.module.css";

/**
 * The deep link the desktop app registers on install. Opening it wakes the
 * running app (or cold-starts it); the app hands the order id to the backend,
 * which verifies the purchase against Lemon Squeezy's own API and unlocks.
 *
 * The link GRANTS nothing. The order id is a claim the server checks at the
 * source — an order that is not yours, not paid, or not ours writes nothing —
 * so anyone opening this link, or this page, without having paid causes one
 * harmless verification at most.
 */
const APP_SCHEME = "welockin://checkout/success";

export type ThanksCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  open: string;
  fallback: string;
};

type ThanksCardProps = {
  /** Lemon Squeezy's numeric order id, substituted into `[order_id]` by their
   *  confirmation button. Undefined when someone lands here by hand. */
  orderId?: string;
  copy: ThanksCopy;
};

export function ThanksCard({ orderId, copy }: ThanksCardProps) {
  // Digits only, and dropped otherwise: this crossed a user-editable URL, and
  // the one thing worse than losing the id is forwarding an injected string
  // into a custom scheme. Without it the app still unlocks — the backend's
  // webhook and the app's own syncs are the belt to this braces.
  const deepLink = useMemo(() => {
    const clean = orderId && /^\d{1,20}$/.test(orderId) ? orderId : null;
    return clean ? `${APP_SCHEME}?order_id=${clean}` : APP_SCHEME;
  }, [orderId]);

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
      window.location.href = deepLink;
    }, 400);
    return () => window.clearTimeout(t);
  }, [deepLink]);

  return (
    <div className={styles.card}>
      <span className={styles.eyebrow}>{copy.eyebrow}</span>
      <h1 className={styles.title}>{copy.title}</h1>
      <p className={styles.lead}>{copy.lead}</p>
      <a className={styles.open} href={deepLink}>{copy.open}</a>
      <p className={styles.fallback}>{copy.fallback}</p>
    </div>
  );
}
