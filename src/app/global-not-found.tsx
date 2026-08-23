/* eslint-disable @next/next/no-html-link-for-pages -- this page renders its own
   <html> outside the app tree, so there is no router for next/link to hook
   into. Every link here is a plain document navigation, which is also what a
   visitor arriving at a dead URL wants: a clean load of a page that exists. */

import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";

import { siteConfig, siteUrl } from "@/config/site";
import enPages from "@/i18n/messages/en/pages.json";
import "./globals.css";

/**
 * The 404 for a URL that matches no route at all.
 *
 * It has to be `global-not-found` rather than `not-found`: this app's only
 * root layout is `app/[lang]/layout.tsx`, so an unmatched URL never reaches a
 * layout that could wrap a 404 page. Next's own default filled that gap with
 * an unstyled "This page could not be found", which is a correct status code
 * attached to a dead end. Every visitor who lands here arrived from a link
 * that promised something, and the only useful response is where to go
 * instead.
 *
 * English only, deliberately: this renders before routing has established a
 * locale, and inventing one from `Accept-Language` here would mean the page
 * could not be statically served.
 *
 * Agents that ask for Markdown never see this. `proxy.ts` sends them to
 * `/api/markdown/...`, which answers 404 with the same map in Markdown.
 */

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const copy = enPages.notFound;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${copy.meta.title} · ${siteConfig.name}`,
  description: copy.meta.description,
  robots: { index: false, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f5f0e8",
  width: "device-width",
  initialScale: 1,
};

/** Where a visitor who wanted a page can plausibly find it instead. */
const PAGES: { href: string; label: string; hint: string }[] = [
  { href: "/", label: "Home", hint: "What Welockin does and who it is for." },
  { href: "/download", label: "Download", hint: "macOS, iPhone, iPad and Windows." },
  {
    href: "/protection",
    label: "Protection",
    hint: "Adult content, gambling, dating apps and mature games.",
  },
  { href: "/faq", label: "FAQ", hint: "Every question, each on its own page." },
  { href: "/help", label: "Help", hint: "Setup, account and purchases." },
  { href: "/support", label: "Support", hint: "Fixes, and a way to reach a human." },
];

/** The same map, for anything reading the site rather than looking at it. */
const MACHINE: { href: string; label: string; hint: string }[] = [
  { href: "/sitemap.xml", label: "/sitemap.xml", hint: "Every URL, in every language." },
  { href: "/llms.txt", label: "/llms.txt", hint: "Index, and when to reach for Welockin." },
  {
    href: "/llms-full.txt",
    label: "/llms-full.txt",
    hint: "Every answer inline, in one request.",
  },
];

export default function GlobalNotFound() {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <style>{CSS}</style>
        <main className="nf">
          <p className="nf-eyebrow">{copy.eyebrow}</p>
          <h1 className="nf-title">{copy.title}</h1>
          <p className="nf-lead">{copy.lead}</p>

          <h2 className="nf-h2">Pages</h2>
          <ul className="nf-list">
            {PAGES.map((page) => (
              <li key={page.href}>
                <a href={page.href}>{page.label}</a>
                <span className="nf-hint">{page.hint}</span>
              </li>
            ))}
          </ul>

          <h2 className="nf-h2">Machine-readable</h2>
          <ul className="nf-list">
            {MACHINE.map((file) => (
              <li key={file.href}>
                <a href={file.href}>{file.label}</a>
                <span className="nf-hint">{file.hint}</span>
              </li>
            ))}
          </ul>
          <p className="nf-note">
            Every page on this site also answers in Markdown. Send{" "}
            <code>Accept: text/markdown</code>, or append <code>.md</code> to the
            path.
          </p>

          <p className="nf-back">
            <a className="nf-cta" href="/">
              {copy.backHome}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}

/**
 * Inlined rather than a CSS module, because this page bypasses the app's
 * layout: no module stylesheet is guaranteed to be linked from it.
 */
const CSS = `
body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--font-figtree), system-ui, sans-serif; }
.nf { max-width: 640px; margin: 0 auto; padding: 96px 28px 120px; }
.nf-eyebrow { margin: 0 0 12px; font-size: 13px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--red); }
.nf-title { margin: 0 0 16px; font-size: clamp(30px, 6vw, 44px); line-height: 1.08; font-weight: 700; letter-spacing: -0.02em; }
.nf-lead { margin: 0 0 40px; font-size: 18px; line-height: 1.55; color: var(--muted); }
.nf-h2 { margin: 32px 0 12px; font-size: 13px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.nf-list { margin: 0; padding: 0; list-style: none; }
.nf-list li { padding: 10px 0; border-bottom: 1px solid var(--border); }
.nf-list a { color: var(--ink); font-weight: 600; text-decoration: none; }
.nf-list a:hover { color: var(--red); text-decoration: underline; }
.nf-hint { display: block; margin-top: 2px; font-size: 14px; color: var(--muted); }
.nf-note { margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: var(--muted); }
.nf-note code { font-size: 13px; background: var(--card); border: 1px solid var(--border); border-radius: 5px; padding: 1px 5px; }
.nf-back { margin: 40px 0 0; }
.nf-cta { display: inline-block; background: var(--red); color: #fff; font-weight: 600; text-decoration: none; padding: 13px 22px; border-radius: 999px; }
.nf-cta:hover { background: var(--red-hover); }
`;
