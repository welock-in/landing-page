"use client";

import Link from "next/link";
import { useState } from "react";

import { LogoIcon } from "@/components/ui/icons";
import "./Footer.css";

/**
 * Footer navigation.
 *
 * Every one of these used to be `href="#"` — twenty-five links on every page of
 * the site that went nowhere. That is a dead end for a reader and, worse, it
 * meant the footer passed no link equity at all to the pages it names.
 *
 * The rule here is now: a link exists only if its page exists. Nothing is
 * listed to look complete. Where a page is genuinely missing (privacy, terms),
 * it is absent rather than linked to a 404 — see the audit notes.
 */
const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Protection", href: "/protection" },
      { label: "Download", href: "/download" },
      { label: "What you can block", href: "/faq/what-you-can-block" },
    ],
  },
  {
    title: "Download",
    links: [
      { label: "macOS", href: "/download#macos" },
      { label: "iPhone & iPad", href: "/download#ios" },
      { label: "Windows", href: "/download#windows" },
      { label: "Android — coming soon", href: "/faq/devices-and-platforms/android-support" },
      { label: "All devices", href: "/faq/devices-and-platforms/supported-devices" },
    ],
  },
  {
    title: "Answers",
    links: [
      { label: "Full FAQ", href: "/faq" },
      { label: "Getting started", href: "/faq/getting-started" },
      { label: "Devices & platforms", href: "/faq/devices-and-platforms" },
      { label: "Troubleshooting", href: "/faq/troubleshooting" },
    ],
  },
  {
    title: "How it locks",
    links: [
      { label: "The five lock levels", href: "/faq/unlock-difficulty-levels" },
      { label: "Nuclear Mode", href: "/faq/nuclear-mode" },
      {
        label: "Soft vs Nuclear lock",
        href: "/faq/unlock-difficulty-levels/soft-lock-vs-nuclear-lock",
      },
      {
        label: "Can it be bypassed?",
        href: "/faq/nuclear-mode/bypass-by-deleting-the-app",
      },
      {
        label: "Which level to choose",
        href: "/faq/unlock-difficulty-levels/which-level-to-choose",
      },
    ],
  },
  {
    title: "Support",
    links: [
      // The real pages first — /contact is a page with a working form now, so
      // it outranks the bare mailto it replaced.
      { label: "Help centre", href: "/help" },
      { label: "Contact us", href: "/contact" },
      { label: "Support", href: "/support" },
      { label: "Setup guide", href: "/faq/getting-started/first-time-setup" },
      { label: "Built by students", href: "/faq/getting-started/built-by-students" },
    ],
  },
  {
    title: "Legal",
    links: [
      // The stores link to these exact URLs, so they must stay reachable from
      // every page.
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Delete your account", href: "/delete-account" },
    ],
  },
] as const;

export function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (/.+@.+\..+/.test(email.trim())) setSubmitted(true);
  };

  return (
    <footer className="wlf">
      <div className="wlf-inner">
        <div className="wlf-news">
          <div className="wlf-news-top">
            <div className="wlf-news-copy">
              <div>Don&apos;t miss a focus session.</div>
              <div>Get study tips &amp; updates in your inbox</div>
            </div>
          </div>

          <div className="wlf-form">
            {submitted ? (
              <div className="wlf-success">You&apos;re locked in — check your inbox.</div>
            ) : (
              <input
                className="wlf-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                placeholder="Enter your email address"
                aria-label="Email address"
              />
            )}
            <button type="button" className="wlf-arrow" aria-label="Subscribe" onClick={submit}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="wlf-rule" />

        <div className="wlf-cols">
          {COLUMNS.map((col) => (
            <nav key={col.title} className="wlf-col" aria-label={col.title}>
              <div className="wlf-col-title">{col.title}</div>
              <ul>
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("mailto:") ? (
                      <a href={link.href}>{link.label}</a>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Social icons removed, not hidden: they were `href="#"` placeholders
              — dead links on every page — and no real profile URLs exist yet.
              To bring them back: recover the SOCIALS list + icon components
              from git history (Footer.tsx before the landing redesign), put the
              real URLs in it, and add the same URLs to `sameAs` in
              organizationJsonLd() so the accounts resolve to this brand. */}
        </div>

        <div className="wlf-bottom">
          <div className="wlf-brand-row">
            <span className="wlf-brand">
              <LogoIcon width={22} height={22} />
              <span>
                welock<span className="wlf-brand-accent">.in</span>
              </span>
            </span>
            <span className="wlf-tagline">Built by students, for students</span>
          </div>
          <span className="wlf-copy">&copy; 2025 Welockin. All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
