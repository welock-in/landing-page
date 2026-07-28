import type { Metadata } from "next";
import Link from "next/link";

import "@/components/content/content.css";
import { CtaBand } from "@/components/content/CtaBand";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { product } from "@/config/site";
import { faqCategoryPath, faqEntryPath, findFaqCategory } from "@/content/faqPage";
import {
  breadcrumbJsonLd,
  buildMetadata,
  faqPageJsonLd,
  jsonLdGraph,
  softwareApplicationJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: `WeLockIn pricing — $${product.price} once, for life`,
  description: `WeLockIn costs $${product.price} once. No subscription, no renewal, no higher tier — every feature on ${product.deviceSlots} devices, for as long as you use it.`,
  path: "/pricing",
  keywords: [
    "WeLockIn price",
    "one-time payment app blocker",
    "app blocker without subscription",
    "lifetime app blocker licence",
  ],
});

const TRAIL: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
];

const INCLUDED = [
  "Block any app, website or notification",
  "One-tap categories: adult content, gambling, dating apps, mature games",
  "All five unlock difficulty levels, Nuclear Mode included",
  `${product.deviceSlots} device slots — ${product.deviceSlotsLabel} — locking together`,
  "Recurring schedules and reusable blocklist bundles",
  "Focus sounds, timed breaks and a settings password lock",
  "On-device filtering, with no log of the sites you visit",
  "Every future update, for life",
];

/**
 * What a one-time price actually changes, beyond the number.
 *
 * These are the second-order consequences a reader works out only after
 * buying — worth stating up front, because they are the part a subscription
 * competitor cannot match at any price.
 */
const WHY_ONE_TIME = [
  {
    title: "Nothing lapses",
    body: "A subscription blocker stops protecting you when a card expires. There is no renewal here, so there is no failed-renewal state that can quietly unlock a Nuclear Mode you were relying on.",
  },
  {
    title: "Nothing to cancel",
    body: "There is no card kept on file and no cancellation flow to find later. You are not signing up for anything — you are buying something.",
  },
  {
    title: "Nothing held back",
    body: "There is no higher tier. The hardest lock we make is not an upsell, which matters when the people who most need Nuclear Mode are the least able to justify a recurring bill for it.",
  },
];

export default function PricingPage() {
  const pricingFaq = findFaqCategory("pricing");

  return (
    <>
      <Navbar />
      <main>
        <div className="cp">
          <div className="cp-wrap">
            <Breadcrumbs trail={TRAIL} />

            <p className="cp-eyebrow">Pricing</p>
            <h1 className="cp-h1">${product.price} once. Yours for life.</h1>

            <div className="cp-answer">
              WeLockIn costs ${product.price} as a single payment. There is no
              subscription, no renewal and no higher tier — the one price buys
              every feature, on {product.deviceSlots} devices, for as long as you
              use it. Focus apps typically charge somewhere between $20 and $100
              every year; this is ${product.price}, once.
            </div>

            <h2 className="cp-h2">What the ${product.price} includes</h2>
            <ul className="cp-list">
              {INCLUDED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 className="cp-h2">Why one payment, not a subscription</h2>
            {WHY_ONE_TIME.map((point) => (
              <section key={point.title}>
                <h3 className="cp-h3">{point.title}</h3>
                <p className="cp-p">{point.body}</p>
              </section>
            ))}

            <h2 className="cp-h2">What it does not include</h2>
            <ul className="cp-list">
              <li>
                No free tier, and no trial that converts into a subscription —
                the ${product.price} is the only transaction.
              </li>
              <li>
                <Link href={faqEntryPath("devices-and-platforms", "android-support")}>
                  No Android build yet
                </Link>
                . If Android is your main phone, waiting is the honest advice.
              </li>
              <li>No Linux build, and none currently planned.</li>
              <li>
                {product.deviceSlots} device slots, not unlimited —{" "}
                {product.deviceSlotsLabel}.
              </li>
            </ul>

            {pricingFaq ? (
              <>
                <h2 className="cp-h2">Pricing questions</h2>
                {pricingFaq.items.map((entry) => (
                  <section key={entry.slug}>
                    <h3 className="cp-h3">
                      <Link href={faqEntryPath("pricing", entry.slug)}>
                        {entry.question}
                      </Link>
                    </h3>
                    <p className="cp-p">{entry.answer}</p>
                  </section>
                ))}
                <p className="cp-sub">
                  More in the{" "}
                  <Link href={faqCategoryPath("pricing")}>pricing FAQ</Link>, or
                  the <Link href="/faq">full FAQ</Link>.
                </p>
              </>
            ) : null}

            <CtaBand
              title={`Lock in for $${product.price}`}
              subtitle="One payment. Every feature. Three devices. No renewal, ever."
            />
          </div>
        </div>
      </main>
      <Footer />

      <JsonLd
        graph={jsonLdGraph(
          softwareApplicationJsonLd(),
          breadcrumbJsonLd(TRAIL),
          ...(pricingFaq
            ? [
                faqPageJsonLd(
                  pricingFaq.items.map((e) => ({
                    question: e.question,
                    answer: e.answer,
                  })),
                  "/pricing",
                ),
              ]
            : []),
        )}
      />
    </>
  );
}
