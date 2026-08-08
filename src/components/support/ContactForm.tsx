"use client";

import { useState, type FormEvent } from "react";

import { siteConfig } from "@/config/site";
import styles from "./ContactForm.module.css";

export const CONTACT_TOPICS = [
  "Support",
  "Billing",
  "Privacy",
  "Press",
  "Other",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

/** Mirror the backend's rules. They save a round trip; the API is the authority. */
const NAME_MAX = 80;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 4000;

/**
 * Shown when our own infrastructure fails (network down, proxy 5xx). It never
 * pretends the message went through — the mailto fallback rendered alongside
 * it is the way that always works.
 */
const UNREACHABLE =
  "Something went wrong on our side and your message was not sent. " +
  "Please try again in a moment, or email us directly at ";

type ContactFormProps = {
  /** Pre-selects the topic — the support page opens on "Support". */
  defaultTopic?: ContactTopic;
};

/**
 * The contact form used on /contact and /support. Posts to the local
 * /api/contact route, which relays to the Welockin API. Three honest states:
 * sending, sent, and failed — a failure always shows the direct email address,
 * and never claims the message was delivered.
 */
export function ContactForm({ defaultTopic = "Support" }: ContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<ContactTopic>(defaultTopic);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (name.trim().length > NAME_MAX) {
      setError(`Please keep your name under ${NAME_MAX} characters.`);
      return;
    }
    if (trimmedMessage.length < MESSAGE_MIN) {
      setError(
        `Please write at least ${MESSAGE_MIN} characters so we have something to go on.`,
      );
      return;
    }
    if (trimmedMessage.length > MESSAGE_MAX) {
      setError(
        `Please keep your message under ${MESSAGE_MAX} characters — currently ${trimmedMessage.length}.`,
      );
      return;
    }

    setError(null);
    setBusy(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(name.trim() ? { name: name.trim() } : {}),
          email: email.trim(),
          topic,
          message: trimmedMessage,
        }),
      });
      const body = (await response.json().catch(() => null)) as {
        error?: string;
        code?: string;
      } | null;

      if (response.ok) {
        setSent(true);
      } else if (body?.code === "CONTACT_DELIVERY_FAILED") {
        setError(
          "We couldn't deliver your message — nothing was sent. " +
            "Please email us directly at ",
        );
      } else if (body?.error) {
        setError(`${body.error} If it keeps failing, email us directly at `);
      } else {
        setError(UNREACHABLE);
      }
    } catch {
      setError(UNREACHABLE);
    } finally {
      setBusy(false);
    }
  }

  function startOver() {
    setSent(false);
    setError(null);
    setMessage("");
  }

  if (sent) {
    return (
      <div className={styles.card}>
        <p className={styles.notice} role="status">
          <strong>Message sent.</strong> We read every message ourselves and
          will reply to {email.trim() || "the address you gave"} — usually
          within a day or two.
        </p>
        <button
          type="button"
          className={`${styles.submit} ${styles.restart}`}
          onClick={startOver}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {/* `method="post"` only matters if hydration never happens: it stops the
          browser falling back to a GET that would put the message in the URL. */}
      <form className={styles.form} method="post" onSubmit={submit}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-name">
              Name <span aria-hidden="true">(optional)</span>
            </label>
            <input
              id="contact-name"
              className={styles.input}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              maxLength={NAME_MAX}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="contact-email">
              Email address
            </label>
            <input
              id="contact-email"
              className={styles.input}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-topic">
            Topic
          </label>
          <select
            id="contact-topic"
            className={styles.select}
            value={topic}
            onChange={(event) => setTopic(event.target.value as ContactTopic)}
          >
            {CONTACT_TOPICS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="contact-message">
            Message
          </label>
          <textarea
            id="contact-message"
            className={styles.textarea}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={MESSAGE_MAX}
            aria-describedby="contact-message-hint"
            required
          />
          <p className={styles.hint} id="contact-message-hint">
            The more specific, the faster we can help — device, OS version, and
            the exact app or URL if something isn&rsquo;t blocking.
          </p>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
            <a href={`mailto:${siteConfig.contactEmail}`}>
              {siteConfig.contactEmail}
            </a>
            .
          </p>
        )}

        <button type="submit" className={styles.submit} disabled={busy}>
          {busy ? "Sending…" : "Send message"}
        </button>
      </form>

      <p className={styles.footnote}>
        Prefer plain email? Write to{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>
          {siteConfig.contactEmail}
        </a>{" "}
        — it reaches the same inbox.
      </p>
    </div>
  );
}
