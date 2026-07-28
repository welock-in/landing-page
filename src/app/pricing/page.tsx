import type { Metadata } from "next";
import Link from "next/link";

import "@/components/content/content.css";
import { CtaBand } from "@/components/content/CtaBand";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { product } from "@/config/site";
import {
  competitorPath,
  competitors,
  PRICING_VERIFIED_ON,
  recurringLabel,
  usd,
} from "@/content/competitors";
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
  description: `WeLockIn costs $${product.price} once. No subscription, no renewal. See how that compares to five years of Freedom, Opal, Forest, BlockSite and Cold Turkey.`,
  path: "/pricing",
  keywords: [
    "WeLockIn price",
    "one-time payment app blocker",
    "cheapest app blocker",
    "focus app without subscription",
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

/** Cheapest-first, so the table does not read as though it were rigged. */
const byFiveYearCost = [...competitors].sort(
  (a, b) => a.pricing.fiveYearTotal - b.pricing.fiveYearTotal,
);

export default function PricingPage() {
  const pricingFaq = findFaqCategory("pricing");

  return (
    <>
      <Navbar />
      <main>
        <div className="cp">
          <div className="cp-wrap-wide">
            <Breadcrumbs trail={TRAIL} />

            <p className="cp-eyebrow">Pricing</p>
            <h1 className="cp-h1">${product.price} once. Yours for life.</h1>

            <div className="cp-answer">
              WeLockIn costs ${product.price} as a single payment. There is no
              subscription, no renewal and no higher tier — the one price buys
              every feature, on {product.deviceSlots} devices, for as long as you
              use it. Five years of most focus apps costs between five and
              twenty-five times that.
            </div>

            <h2 className="cp-h2">What the ${product.price} includes</h2>
            <ul className="cp-list">
              {INCLUDED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2 className="cp-h2">What five years actually costs</h2>
            <p className="cp-p">
              Subscription pricing hides its real total. Below is the cheapest
              plan each competitor offers, multiplied out over five years, next
              to a single WeLockIn purchase. Every figure was read off the
              vendor&rsquo;s own pricing page or checkout on {PRICING_VERIFIED_ON}.
            </p>

            <div className="cp-table-scroll">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th scope="col">App</th>
                    <th scope="col">Cheapest ongoing price</th>
                    <th scope="col">One-time option</th>
                    <th scope="col">5-year total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="cp-row-us">
                    <th scope="row" className="cp-us">
                      WeLockIn
                    </th>
                    <td>None — no subscription</td>
                    <td className="cp-us">{usd(product.price)}</td>
                    <td className="cp-us">{usd(product.price)}</td>
                  </tr>
                  {byFiveYearCost.map((c) => (
                    <tr key={c.slug}>
                      <th scope="row">
                        <Link href={competitorPath(c.slug)}>{c.name}</Link>
                      </th>
                      <td>{recurringLabel(c) ?? "None"}</td>
                      <td>
                        {c.pricing.oneTime !== null
                          ? usd(c.pricing.oneTime)
                          : c.pricing.fiveYearTotal === 0
                            ? "Free"
                            : "—"}
                      </td>
                      <td>
                        {c.pricing.fiveYearTotal === 0
                          ? "Free"
                          : usd(c.pricing.fiveYearTotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/*
              Stating the one thing a price-comparison page is tempted to leave
              out. A reader who discovers ScreenZen elsewhere and finds it
              missing here stops trusting every other number on the page.
            */}
            <p className="cp-note">
              Two honest caveats. ScreenZen is genuinely free, so WeLockIn is not
              the cheapest blocker in existence — it is the cheapest one you buy
              once and own outright, and we would rather say so than have you
              find out later. And prices move: Forest declines to publish USD
              figures, and BlockSite varies its lifetime price depending on where
              you arrive from. Each comparison page below spells out its own
              caveat.
            </p>

            <h2 className="cp-h2">Compared with each alternative</h2>
            <div className="cp-cards">
              {byFiveYearCost.map((c) => (
                <Link
                  key={c.slug}
                  className="cp-card"
                  href={competitorPath(c.slug)}
                >
                  <span className="cp-card-title">WeLockIn vs {c.name}</span>
                  <span className="cp-card-meta">
                    {c.pricing.fiveYearTotal === 0
                      ? "Free · and worth trying first"
                      : `${usd(c.pricing.fiveYearTotal)} over 5 years`}
                  </span>
                </Link>
              ))}
            </div>

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
                  More in{" "}
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
