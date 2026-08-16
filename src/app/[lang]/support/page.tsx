import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { metadataFor, type LangParams } from "@/i18n/metadata";
import type { ReactNode } from "react";

import "@/components/content/content.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ContactForm } from "@/components/support/ContactForm";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { faqCategoryPath, faqEntryPath } from "@/content/faqPage";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  jsonLdGraph,
} from "@/lib/seo";

export function generateMetadata({ params }: LangParams) {
  return metadataFor(params, (d) => ({
    ...d.pages.support.meta,
    path: "/support",
  }));
}

const TRAIL: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Support", path: "/support" },
];

/**
 * The common issues, as literal question/answer pairs. The same array renders
 * the visible page and feeds the FAQPage structured data, so the two can
 * never disagree. `more` carries the linked follow-ups that belong on the
 * page but not in the schema text.
 */
const ISSUES: { question: string; answer: string; more?: ReactNode }[] = [
  {
    question: "The app won't unblock after my session ended",
    answer:
      "First check the session has genuinely ended: a hard lock runs to its timer and a Nuclear lock to its date, and neither lifts early. If it has ended, give the devices a moment to sync, then restart the Welockin app on the device that is still blocking. If it stays locked past its end time, that is a bug. Contact us with your device, OS version and the session's end time, and we will sort it out.",
    more: (
      <p className="cp-p">
        Not sure which lock you started?{" "}
        <Link href={faqEntryPath("unlock-difficulty-levels", "soft-lock-vs-nuclear-lock")}>
          Soft Lock vs Nuclear Lock
        </Link>{" "}
        explains the difference.
      </p>
    ),
  },
  {
    question: "I forgot my password",
    answer:
      "Reset it yourself: enter the email address on your account and we send a link to set a new password. The new password applies on every device the next time you sign in.",
    more: (
      <p className="cp-p">
        Head to <Link href="/reset-password">reset your password</Link>. It
        takes about a minute. No email after a few minutes? Check spam, then
        try again with the exact address you signed up with.
      </p>
    ),
  },
  {
    question: "My purchase isn't showing up",
    answer:
      "Make sure you are signed in with the same email address you used at checkout. The licence is tied to your account, and a different address is the cause in most cases. Desktop purchases go through Lemon Squeezy, so look for their receipt email to confirm which address you bought under; app-store purchases can be restored from the store on the device you bought with. Still missing? Send us the receipt and the email on your account, and we will connect the two.",
    more: (
      <p className="cp-p">
        How the trial, licence and refunds work is laid out in the{" "}
        <Link href="/terms">Terms of Service</Link>.
      </p>
    ),
  },
  {
    question: "How do I report a bug?",
    answer:
      "Use the form below or email us, and include: your device and OS version, what you did, what you expected, and what happened instead. If something isn't being blocked, the exact app name or URL is the single most useful thing you can send. It is what turns a report into a fix rather than a back-and-forth. Screenshots help too.",
    more: (
      <p className="cp-p">
        For blocking issues, run through{" "}
        <Link href={faqEntryPath("troubleshooting", "site-not-being-blocked")}>
          the blocking checklist
        </Link>{" "}
        first. Most reports turn out to be a device that was never synced.
      </p>
    ),
  },
];

export default async function SupportPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).pages.support;

  return (
    <>
      <Navbar />
      <main>
        <div className="cp">
          <div className="cp-wrap">
            <Breadcrumbs trail={TRAIL} />

            <p className="cp-eyebrow">{t.eyebrow}</p>
            <h1 className="cp-h1">{t.h1}</h1>
            <p className="cp-lead">{t.lead}</p>
            <p className="cp-sub">
              More general questions live in the{" "}
              <Link href="/help">help hub</Link> and the{" "}
              <Link href={faqCategoryPath("troubleshooting")}>
                troubleshooting FAQ
              </Link>
              .
            </p>

            <h2 className="cp-h2">Common issues</h2>
            {ISSUES.map((issue) => (
              <section key={issue.question}>
                <h3 className="cp-h3">{issue.question}</h3>
                <p className="cp-p">{issue.answer}</p>
                {issue.more}
              </section>
            ))}

            <h2 className="cp-h2">Is the service down?</h2>
            <p className="cp-p">
              We don&rsquo;t run a public status page yet. Blocking itself
              happens on your device, so it keeps working even if our servers
              have a bad moment. Sync and sign-in are what would be affected.
              If either seems down for more than a few minutes, email{" "}
              <a href={`mailto:${siteConfig.contactEmail}`}>
                {siteConfig.contactEmail}
              </a>{" "}
              and we will tell you honestly what is going on.
            </p>

            <h2 className="cp-h2">Send us a message</h2>
            <p className="cp-p">
              Describe the problem below and it lands with the students who
              wrote the code, usually answered between two lectures.
            </p>
            <ContactForm defaultTopic="Support" />
          </div>
        </div>
      </main>
      <Footer />

      <JsonLd
        graph={jsonLdGraph(
          breadcrumbJsonLd(TRAIL),
          faqPageJsonLd(
            ISSUES.map(({ question, answer }) => ({ question, answer })),
            "/support",
          ),
        )}
      />
    </>
  );
}
