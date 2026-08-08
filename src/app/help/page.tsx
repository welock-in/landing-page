import type { Metadata } from "next";
import Link from "next/link";

import "@/components/content/content.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqCategoryPath, faqEntryPath, findFaqCategory } from "@/content/faqPage";
import {
  breadcrumbJsonLd,
  buildMetadata,
  jsonLdGraph,
  softwareApplicationJsonLd,
} from "@/lib/seo";
import styles from "./help.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Help — Getting started, your account, purchases and fixes",
  description:
    "Everything in one place: setting up WeLockIn, managing your account, the trial and lifetime licence, and fixes when something isn't working.",
  path: "/help",
});

const TRAIL: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Help", path: "/help" },
];

/** Question count for a category card's meta line, straight from the data. */
function categoryMeta(slug: string): string {
  const count = findFaqCategory(slug)?.items.length ?? 0;
  return `${count} answered question${count === 1 ? "" : "s"}`;
}

export default function HelpPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="cp">
          <div className="cp-wrap">
            <Breadcrumbs trail={TRAIL} />

            <p className="cp-eyebrow">Help</p>
            <h1 className="cp-h1">How can we help?</h1>
            <p className="cp-lead">
              Everything in one place: setting WeLockIn up, managing your
              account, sorting out a purchase, and fixing things when they
              don&rsquo;t behave.
            </p>
            <p className="cp-sub">
              The <Link href="/faq">FAQ</Link> answers most questions in
              depth; this page is the map to the right one.
            </p>

            <h2 className="cp-h2">Getting started</h2>
            <div className="cp-cards">
              <Link className="cp-card" href={faqCategoryPath("getting-started")}>
                <span className="cp-card-title">Getting started guide</span>
                <span className="cp-card-meta">
                  {categoryMeta("getting-started")}
                </span>
              </Link>
              <Link
                className="cp-card"
                href={faqEntryPath("getting-started", "first-time-setup")}
              >
                <span className="cp-card-title">Set up your first session</span>
                <span className="cp-card-meta">
                  From install to locked in, under a minute
                </span>
              </Link>
              <Link className="cp-card" href="/download">
                <span className="cp-card-title">Download WeLockIn</span>
                <span className="cp-card-meta">
                  macOS, iPhone, iPad and Windows
                </span>
              </Link>
              <Link
                className="cp-card"
                href={faqCategoryPath("unlock-difficulty-levels")}
              >
                <span className="cp-card-title">
                  Choose an unlock difficulty
                </span>
                <span className="cp-card-meta">
                  {categoryMeta("unlock-difficulty-levels")}
                </span>
              </Link>
              <Link className="cp-card" href={faqCategoryPath("what-you-can-block")}>
                <span className="cp-card-title">What you can block</span>
                <span className="cp-card-meta">
                  {categoryMeta("what-you-can-block")}
                </span>
              </Link>
              <Link className="cp-card" href={faqCategoryPath("nuclear-mode")}>
                <span className="cp-card-title">Nuclear Mode, explained</span>
                <span className="cp-card-meta">
                  {categoryMeta("nuclear-mode")}
                </span>
              </Link>
            </div>

            <h2 className="cp-h2">Your account</h2>
            <div className="cp-cards">
              <Link className="cp-card" href="/reset-password">
                <span className="cp-card-title">Reset your password</span>
                <span className="cp-card-meta">
                  We email you a link to set a new one
                </span>
              </Link>
              <Link className="cp-card" href="/delete-account">
                <span className="cp-card-title">Delete your account</span>
                <span className="cp-card-meta">
                  Permanent, and everything goes with it
                </span>
              </Link>
            </div>
            <h3 className="cp-h3">Verifying your email</h3>
            <p className="cp-p">
              When you create an account, we email a short verification code to
              the address you signed up with — enter it in the app to confirm
              the address is yours. If it hasn&rsquo;t arrived after a couple
              of minutes, check your spam folder, then request a fresh code
              from the same screen in the app; codes expire, so always use the
              most recent one.
            </p>

            <h2 className="cp-h2">Purchases &amp; licence</h2>
            <ul className="cp-list">
              <li>
                <strong>The free trial.</strong> Every new device gets 14 days
                of the full product, no card required. It is one trial per
                device, checked on our side — reinstalling doesn&rsquo;t
                restart it.
              </li>
              <li>
                <strong>The lifetime licence.</strong> WeLockIn is a one-time
                purchase, not a subscription. Buy it once and it covers all your
                devices for good, updates included.
              </li>
              <li>
                <strong>Refunds.</strong> Handled through the store you bought
                from, and a full refund revokes the licence — the details are
                in the <Link href="/terms">Terms of Service</Link>.
              </li>
              <li>
                <strong>Purchase not showing up?</strong> The{" "}
                <Link href="/support">support page</Link> walks through the
                usual causes.
              </li>
            </ul>

            <h2 className="cp-h2">Troubleshooting</h2>
            <div className="cp-cards">
              <Link className="cp-card" href={faqCategoryPath("troubleshooting")}>
                <span className="cp-card-title">Troubleshooting FAQ</span>
                <span className="cp-card-meta">
                  {categoryMeta("troubleshooting")}
                </span>
              </Link>
              <Link
                className="cp-card"
                href={faqEntryPath("troubleshooting", "site-not-being-blocked")}
              >
                <span className="cp-card-title">
                  A site or app isn&rsquo;t being blocked
                </span>
                <span className="cp-card-meta">
                  Usually an unsynced device — here&rsquo;s how to check
                </span>
              </Link>
              <Link
                className="cp-card"
                href={faqEntryPath("troubleshooting", "devices-not-syncing")}
              >
                <span className="cp-card-title">
                  Devices aren&rsquo;t syncing
                </span>
                <span className="cp-card-meta">
                  Get every device locking together again
                </span>
              </Link>
              <Link className="cp-card" href="/support">
                <span className="cp-card-title">Support</span>
                <span className="cp-card-meta">
                  Common issues, fixes, and how to report a bug
                </span>
              </Link>
            </div>

            <aside className="cp-cta">
              <p className="cp-cta-title">Still stuck? Contact us</p>
              <p className="cp-cta-sub">
                Tell us what&rsquo;s happening and a real person will pick it
                up — usually between two lectures.
              </p>
              <Link href="/contact" className={styles.ctaBtn}>
                Contact us
              </Link>
              <p className="cp-cta-fine">
                Or email <a href="mailto:hello@welock.in">hello@welock.in</a>
              </p>
            </aside>
          </div>
        </div>
      </main>
      <Footer />

      <JsonLd
        graph={jsonLdGraph(softwareApplicationJsonLd(), breadcrumbJsonLd(TRAIL))}
      />
    </>
  );
}
