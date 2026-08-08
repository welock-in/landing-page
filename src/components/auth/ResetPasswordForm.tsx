"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import { siteConfig } from "@/config/site";
import styles from "./ResetPassword.module.css";

/** Mirrors the backend rule. It saves a round trip; it is not the authority. */
const MIN_PASSWORD = 8;

/**
 * The only answer the request form ever gives.
 *
 * Confirming or denying an address here would turn the page into a free
 * account-existence oracle for anyone holding a list of email addresses, so
 * every backend outcome — found, not found, already pending — reads the same.
 */
const REQUEST_SENT =
  "If an account exists for this address, a reset link is on its way. Check your spam folder.";

/**
 * Shown only when our own infrastructure fails (network down, proxy 5xx).
 * Distinguishing that case leaks nothing about the account: the reset endpoint
 * answers 200 either way, so a 5xx is never correlated with existence.
 */
const UNREACHABLE =
  "Something went wrong on our side. Please try again in a moment.";

type Outcome = "sent" | "changed" | "dead-link";

type ResetPasswordFormProps = {
  /** Read from `?token=` by the page. Never written back to the URL. */
  token?: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  // A dead token drops the visitor back to the email form, so which form is on
  // screen is state, not a plain read of the prop.
  const [mode, setMode] = useState<"request" | "consume">(
    token ? "consume" : "request",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<Outcome | null>(null);

  async function requestLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const response = await fetch("/api/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (response.status >= 500) setError(UNREACHABLE);
      else setOutcome("sent");
    } catch {
      setError(UNREACHABLE);
    } finally {
      setBusy(false);
    }
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < MIN_PASSWORD) {
      setError(`Use at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirmation) {
      setError("The two passwords don't match.");
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const response = await fetch("/api/reset-consume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const body = (await response.json().catch(() => null)) as {
        error?: string;
        code?: string;
      } | null;

      setPassword("");
      setConfirmation("");

      if (response.ok) setOutcome("changed");
      else if (body?.code === "RESET_TOKEN_INVALID") setOutcome("dead-link");
      else setError(body?.error ?? UNREACHABLE);
    } catch {
      setError(UNREACHABLE);
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    setMode("request");
    setOutcome(null);
    setError(null);
  }

  function body(): ReactNode {
    if (outcome === "changed") {
      return (
        <p className={styles.notice} role="status">
          Password changed — reopen Welockin and sign in.
        </p>
      );
    }

    if (outcome === "sent") {
      return (
        <p className={styles.notice} role="status">
          {REQUEST_SENT}
        </p>
      );
    }

    if (outcome === "dead-link") {
      return (
        <>
          <p className={styles.alert} role="status">
            This link has expired or has already been used.
          </p>
          <button
            type="button"
            className={`${styles.submit} ${styles.restart}`}
            onClick={startOver}
          >
            Request a new link
          </button>
        </>
      );
    }

    if (mode === "consume") {
      return (
        <>
          <p className={styles.lead}>
            Pick a new password. You will sign in with it on every device.
          </p>
          {/* `method="post"` only matters if hydration never happens: it stops
              the browser falling back to a GET that would write the password
              into the address bar. */}
          <form className={styles.form} method="post" onSubmit={submitPassword}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="new-password">
                New password
              </label>
              <input
                id="new-password"
                className={styles.input}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                aria-describedby="new-password-hint"
                required
              />
              <p className={styles.hint} id="new-password-hint">
                At least {MIN_PASSWORD} characters.
              </p>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="confirm-password">
                Confirm new password
              </label>
              <input
                id="confirm-password"
                className={styles.input}
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button type="submit" className={styles.submit} disabled={busy}>
              {busy ? "Saving…" : "Change password"}
            </button>
          </form>
        </>
      );
    }

    return (
      <>
        <p className={styles.lead}>
          Enter the email address on your account and we&rsquo;ll send you a
          link to set a new password.
        </p>
        <form className={styles.form} method="post" onSubmit={requestLink}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="reset-email">
              Email address
            </label>
            <input
              id="reset-email"
              className={styles.input}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className={styles.submit} disabled={busy}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      </>
    );
  }

  return (
    <div className={styles.card}>
      <span className={styles.eyebrow}>Account</span>
      <h1 className={styles.title}>
        {mode === "consume" ? "Set a new password" : "Reset your password"}
      </h1>
      {body()}
      <p className={styles.footnote}>
        Trouble getting in? Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </div>
  );
}
