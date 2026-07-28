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
import {
  breadcrumbJsonLd,
  buildMetadata,
  jsonLdGraph,
  softwareApplicationJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "WeLockIn compared with every other distraction blocker",
  description:
    "Honest, verified comparisons against Freedom, Cold Turkey, Opal, Forest, BlockSite, one sec, Focus and ScreenZen — including where they beat us.",
  path: "/vs",
  keywords: [
    "app blocker comparison",
    "best distraction blocker",
    "freedom alternative",
    "cold turkey alternative",
    "cheapest app blocker",
  ],
});

const TRAIL: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Compare", path: "/vs" },
];

const byFiveYearCost = [...competitors].sort(
  (a, b) => a.pricing.fiveYearTotal - b.pricing.fiveYearTotal,
);

export default function ComparisonHub() {
  return (
    <>
      <Navbar />
      <main>
        <div className="cp">
          <div className="cp-wrap-wide">
            <Breadcrumbs trail={TRAIL} />

            <p className="cp-eyebrow">Compare</p>
            <h1 className="cp-h1">
              WeLockIn compared with every other blocker
            </h1>

            <div className="cp-answer">
              WeLockIn is ${product.price} once, with five unlock difficulty
              levels and a Nuclear Mode that survives uninstalling the app. It is
              the cheapest blocker you buy once and own — but it is not the
              cheapest full stop, because ScreenZen is free, and it is not the
              strictest, because Cold Turkey&rsquo;s locks are harder than ours.
              Every page below says which is which.
            </div>

            <h2 className="cp-h2">The whole market, side by side</h2>
            <p className="cp-p">
              Prices verified against each vendor&rsquo;s own pricing page or
              checkout on {PRICING_VERIFIED_ON}. Sorted cheapest first over five
              years, not sorted to flatter us.
            </p>

            <div className="cp-table-scroll">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th scope="col">App</th>
                    <th scope="col">5-year cost</th>
                    <th scope="col">Un-bypassable lock</th>
                    <th scope="col">Platforms</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="cp-row-us">
                    <th scope="row" className="cp-us">
                      WeLockIn
                    </th>
                    <td className="cp-us">{usd(product.price)} once</td>
                    <td>Yes — Nuclear Mode</td>
                    <td>macOS, iOS, iPadOS, Windows</td>
                  </tr>
                  {byFiveYearCost.map((c) => (
                    <tr key={c.slug}>
                      <th scope="row">
                        <Link href={competitorPath(c.slug)}>{c.name}</Link>
                      </th>
                      <td>
                        {c.pricing.fiveYearTotal === 0
                          ? "Free"
                          : `${usd(c.pricing.fiveYearTotal)}${
                              recurringLabel(c) ? "" : " once"
                            }`}
                      </td>
                      <td>{c.hardLock.offered ? "Yes" : "No"}</td>
                      <td>{c.platforms.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="cp-note">
              &ldquo;Un-bypassable lock&rdquo; means a mode the vendor states
              cannot be switched off mid-session. It is not a measure of how
              strong that lock is: Cold Turkey&rsquo;s are the strongest here,
              and Forest&rsquo;s deterrent is social rather than technical.
            </p>

            <h2 className="cp-h2">Read the full comparison</h2>
            <div className="cp-cards">
              {byFiveYearCost.map((c) => (
                <Link
                  key={c.slug}
                  className="cp-card"
                  href={competitorPath(c.slug)}
                >
                  <span className="cp-card-title">WeLockIn vs {c.name}</span>
                  <span className="cp-card-meta">{c.summary}</span>
                </Link>
              ))}
            </div>

            <CtaBand />
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
