"use client";

import Link from "next/link";
import { useState } from "react";

import { LogoIcon } from "@/components/ui/icons";
import { useCommon, useLocalePath, type CommonDictionary } from "@/i18n/LocaleContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import switcher from "./LanguageSwitcher.module.css";
import "./Footer.css";

/**
 * Footer navigation.
 *
 * Every one of these used to be `href="#"`: twenty-five links on every page of
 * the site that went nowhere. That is a dead end for a reader and, worse, it
 * meant the footer passed no link equity at all to the pages it names.
 *
 * The rule here is now: a link exists only if its page exists. Nothing is
 * listed to look complete. Where a page is genuinely missing (privacy, terms),
 * it is absent rather than linked to a 404. See the audit notes.
 */
type CommonFooter = CommonDictionary["footer"];

/**
 * Structure only: every label is a key into `common.footer`, and every `href`
 * is the un-prefixed path that `useLocalePath` turns into a real URL for the
 * language being rendered.
 */
const COLUMNS = [
  {
    title: "product",
    links: [
      { label: "howItWorks", href: "/#how" },
      { label: "protection", href: "/protection" },
      { label: "download", href: "/download" },
      { label: "whatYouCanBlock", href: "/faq/what-you-can-block" },
    ],
  },
  {
    title: "download",
    links: [
      { label: "macos", href: "/download#macos" },
      { label: "iphoneIpad", href: "/download#ios" },
      { label: "windows", href: "/download#windows" },
      { label: "androidSoon", href: "/faq/devices-and-platforms/android-support" },
      { label: "allDevices", href: "/faq/devices-and-platforms/supported-devices" },
    ],
  },
  {
    title: "answers",
    links: [
      { label: "fullFaq", href: "/faq" },
      { label: "gettingStarted", href: "/faq/getting-started" },
      { label: "devicesPlatforms", href: "/faq/devices-and-platforms" },
      { label: "troubleshooting", href: "/faq/troubleshooting" },
    ],
  },
  {
    title: "howItLocks",
    links: [
      { label: "fiveLockLevels", href: "/faq/unlock-difficulty-levels" },
      { label: "nuclearMode", href: "/faq/nuclear-mode" },
      {
        label: "softVsNuclear",
        href: "/faq/unlock-difficulty-levels/soft-lock-vs-nuclear-lock",
      },
      {
        label: "canItBeBypassed",
        href: "/faq/nuclear-mode/bypass-by-deleting-the-app",
      },
      {
        label: "whichLevel",
        href: "/faq/unlock-difficulty-levels/which-level-to-choose",
      },
    ],
  },
  {
    title: "support",
    links: [
      // The real pages first: /contact is a page with a working form now, so
      // it outranks the bare mailto it replaced.
      { label: "helpCentre", href: "/help" },
      { label: "contactUs", href: "/contact" },
      { label: "support", href: "/support" },
      { label: "setupGuide", href: "/faq/getting-started/first-time-setup" },
      { label: "builtByStudents", href: "/faq/getting-started/built-by-students" },
    ],
  },
  {
    title: "legal",
    links: [
      // The stores link to these exact URLs, so they must stay reachable from
      // every page.
      { label: "terms", href: "/terms" },
      { label: "privacy", href: "/privacy" },
      { label: "deleteAccount", href: "/delete-account" },
    ],
  },
] as const satisfies readonly {
  title: keyof CommonFooter["columns"];
  links: readonly { label: keyof CommonFooter["links"]; href: string }[];
}[];

export function Footer() {
  const common = useCommon();
  const withLocale = useLocalePath();
  const t = common.footer;
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
              <div>{t.newsletter.line1}</div>
              <div>{t.newsletter.line2}</div>
            </div>
          </div>

          <div className="wlf-form">
            {submitted ? (
              <div className="wlf-success">{t.newsletter.success}</div>
            ) : (
              <input
                className="wlf-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                placeholder={t.newsletter.placeholder}
                aria-label={t.newsletter.emailLabel}
              />
            )}
            <button
              type="button"
              className="wlf-arrow"
              aria-label={t.newsletter.subscribe}
              onClick={submit}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div className="wlf-rule" />

        <div className="wlf-cols">
          {COLUMNS.map((col) => (
            <nav
              key={col.title}
              className="wlf-col"
              aria-label={t.columns[col.title]}
            >
              <div className="wlf-col-title">{t.columns[col.title]}</div>
              <ul>
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("mailto:") ? (
                      <a href={link.href}>{t.links[link.label]}</a>
                    ) : (
                      <Link href={withLocale(link.href)}>{t.links[link.label]}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* Social icons removed, not hidden: they were `href="#"` placeholders
              (dead links on every page), and no real profile URLs exist yet.
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
            <span className="wlf-tagline">{t.tagline}</span>
          </div>
          <div className="wlf-bottom-end">
            <div className={switcher.footerPlacement}>
              <LanguageSwitcher label={common.languageSwitcher.label} />
            </div>
            <span className="wlf-copy">{t.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
