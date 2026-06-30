"use client";

import { useState } from "react";

import { LogoIcon } from "@/components/ui/icons";
import "./Footer.css";

const COLUMNS = [
  {
    title: "Product",
    links: ["How it works", "Features", "All devices", "Pricing", "FAQ"],
  },
  {
    title: "Download",
    links: ["macOS", "iPhone & iPad", "Windows", "Android", "Linux"],
  },
  {
    title: "Support",
    links: ["Help center", "Contact us", "Setup guide", "Report a bug", "System status"],
  },
  {
    title: "Company",
    links: ["Our story", "The students behind it", "Student reviews", "Press kit", "Affiliates"],
  },
  {
    title: "Legal",
    links: ["Privacy policy", "Terms of use", "Cookie policy", "Cookie settings", "Refund policy"],
  },
] as const;

const DEVICES = [
  { id: "macos", label: "macOS" },
  { id: "windows", label: "Windows" },
] as const;

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.2 2.5h3.3l-7.2 8.2L23 21.5h-6.6l-5.2-6.8-5.9 6.8H1.9l7.7-8.8L1.2 2.5h6.8l4.7 6.2zm-1.2 17h1.8L7.1 4.4H5.2z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 2.5c.3 2.2 1.6 3.9 3.8 4.2v2.7c-1.4.1-2.7-.3-3.9-1v6.1c0 3.5-2.6 6.1-6 6.1-3.3 0-5.7-2.7-5.4-6 .3-2.7 2.5-4.8 5.2-4.8.4 0 .8 0 1.2.1v2.9c-.4-.1-.7-.2-1.1-.2-1.4 0-2.6 1.2-2.5 2.7.1 1.4 1.2 2.4 2.6 2.4 1.5 0 2.6-1.1 2.6-2.7V2.5z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.5 7.2a2.8 2.8 0 0 0-1.9-2C18.9 4.7 12 4.7 12 4.7s-6.9 0-8.6.5a2.8 2.8 0 0 0-1.9 2C1 8.9 1 12 1 12s0 3.1.5 4.8a2.8 2.8 0 0 0 1.9 2c1.7.5 8.6.5 8.6.5s6.9 0 8.6-.5a2.8 2.8 0 0 0 1.9-2c.5-1.7.5-4.8.5-4.8s0-3.1-.5-4.8zM9.8 15.3V8.7l5.7 3.3z" />
    </svg>
  );
}

const SOCIALS = [
  { name: "Instagram", icon: InstagramIcon },
  { name: "X", icon: XIcon },
  { name: "TikTok", icon: TikTokIcon },
  { name: "YouTube", icon: YouTubeIcon },
] as const;

export function Footer() {
  const [device, setDevice] = useState<(typeof DEVICES)[number]["id"]>("macos");
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
            <div className="wlf-devices">
              <span className="wlf-devices-label">I&apos;m on:</span>
              {DEVICES.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`wlf-device-btn${device === d.id ? " on" : ""}`}
                  onClick={() => setDevice(d.id)}
                >
                  <span className="wlf-device-dot" aria-hidden="true" />
                  {d.label}
                </button>
              ))}
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
            <nav key={col.title} className="wlf-col">
              <div className="wlf-col-title">{col.title}</div>
              <ul>
                {col.links.map((label) => (
                  <li key={label}>
                    <a href="#">{label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav className="wlf-social-col">
            <div className="wlf-col-title">Follow us</div>
            <div className="wlf-socials">
              {SOCIALS.map(({ name, icon: Icon }) => (
                <a key={name} href="#" className="wlf-social" aria-label={name}>
                  <Icon />
                </a>
              ))}
            </div>
            <p className="wlf-price-note">$20 once. Yours for life. No subscription.</p>
          </nav>
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
          <span className="wlf-copy">&copy; 2025 WeLockIn. All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
