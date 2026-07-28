import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
  findCompetitor,
  PRICING_VERIFIED_ON,
  recurringLabel,
  usd,
} from "@/content/competitors";
import { faqEntryPath } from "@/content/faqPage";
import {
  breadcrumbJsonLd,
  buildMetadata,
  comparisonJsonLd,
  jsonLdGraph,
  softwareApplicationJsonLd,
} from "@/lib/seo";

type Params = { competitor: string };

export function generateStaticParams(): Params[] {
  return competitors.map((c) => ({ competitor: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { competitor: slug } = await params;
  const c = findCompetitor(slug);
  if (!c) return {};

  return buildMetadata({
    title: `WeLockIn vs ${c.name} — price, locks and platforms compared`,
    description: c.description,
    path: competitorPath(slug),
    keywords: c.searchTerms,
  });
}

export default async function ComparisonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { competitor: slug } = await params;
  const c = findCompetitor(slug);
  if (!c) notFound();

  const path = competitorPath(slug);
  const trail: Crumb[] = [
    { name: "Home", path: "/" },
    { name: "Compare", path: "/vs" },
    { name: `vs ${c.name}`, path },
  ];

  const others = competitors.filter((x) => x.slug !== slug);
  const isFree = c.pricing.fiveYearTotal === 0;
  const cheaperOverFive = c.pricing.fiveYearTotal > product.price;

  return (
    <>
      <Navbar />
      <main>
        <article className="cp">
          <div className="cp-wrap-wide">
            <Breadcrumbs trail={trail} />

            <p className="cp-eyebrow">Comparison</p>
            <h1 className="cp-h1">WeLockIn vs {c.name}</h1>

            {/* The verdict goes first. A comparison page that makes you read to
                the bottom to find the answer is not answering anything. */}
            <div className="cp-answer">
              {c.name} is {c.summary.charAt(0).toLowerCase() + c.summary.slice(1)}{" "}
              WeLockIn costs {usd(product.price)} once and locks across macOS,
              iOS, iPadOS and Windows with a Nuclear Mode that survives
              uninstalling the app.{" "}
              {isFree
                ? `${c.name} is free, so it is genuinely cheaper — the question is whether it does what you need.`
                : cheaperOverFive
                  ? `Over five years ${c.name} costs ${usd(c.pricing.fiveYearTotal)} against ${usd(product.price)}.`
                  : `${c.name} costs ${usd(c.pricing.fiveYearTotal)}.`}
            </div>

            <h2 className="cp-h2">Price, side by side</h2>
            <div className="cp-table-scroll">
              <table className="cp-table">
                <thead>
                  <tr>
                    <th scope="col" />
                    <th scope="col">WeLockIn</th>
                    <th scope="col">{c.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Ongoing price</th>
                    <td className="cp-us">None</td>
                    <td>{recurringLabel(c) ?? "None"}</td>
                  </tr>
                  <tr>
                    <th scope="row">One-time price</th>
                    <td className="cp-us">{usd(product.price)}</td>
                    <td>
                      {c.pricing.oneTime !== null
                        ? usd(c.pricing.oneTime)
                        : isFree
                          ? "Free"
                          : "Not offered"}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Five-year total</th>
                    <td className="cp-us">{usd(product.price)}</td>
                    <td>{isFree ? "Free" : usd(c.pricing.fiveYearTotal)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Free tier</th>
                    <td>No</td>
                    <td>{c.pricing.freeTier ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <th scope="row">Un-bypassable lock</th>
                    <td className="cp-us">Yes — Nuclear Mode</td>
                    <td>
                      {c.hardLock.offered
                        ? `Yes${c.hardLock.name ? ` — ${c.hardLock.name}` : ""}`
                        : "No"}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Platforms</th>
                    <td>macOS, iOS, iPadOS, Windows</td>
                    <td>{c.platforms.join(", ")}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="cp-note">
              Verified against {c.name}&rsquo;s own pricing page on{" "}
              {PRICING_VERIFIED_ON}.
              {c.pricing.note ? ` ${c.pricing.note}` : ""}
            </p>

            <h2 className="cp-h2">How {c.name} locks</h2>
            <p className="cp-p">{c.hardLock.detail}</p>
            <p className="cp-p">
              WeLockIn&rsquo;s{" "}
              <Link href={faqEntryPath("nuclear-mode", "what-is-nuclear-mode")}>
                Nuclear Mode
              </Link>{" "}
              runs to a calendar date and{" "}
              <Link
                href={faqEntryPath("nuclear-mode", "bypass-by-deleting-the-app")}
              >
                survives restarting and uninstalling the app
              </Link>
              . There is no override, including for our own support team.
            </p>

            <h2 className="cp-h2">Where {c.name} is the better choice</h2>
            <ul className="cp-list">
              {c.competitorWins.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="cp-p">
              <strong>Choose {c.name} if:</strong> {c.chooseThemIf}
            </p>

            <h2 className="cp-h2">Where WeLockIn is the better choice</h2>
            <ul className="cp-list">
              {c.welockinWins.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <h2 className="cp-h2">Other comparisons</h2>
            <div className="cp-cards">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  className="cp-card"
                  href={competitorPath(other.slug)}
                >
                  <span className="cp-card-title">
                    WeLockIn vs {other.name}
                  </span>
                  <span className="cp-card-meta">
                    {other.pricing.fiveYearTotal === 0
                      ? "Free"
                      : `${usd(other.pricing.fiveYearTotal)} over 5 years`}
                  </span>
                </Link>
              ))}
            </div>

            <p className="cp-sub">
              See <Link href="/vs">every blocker side by side</Link> or{" "}
              <Link href="/pricing">what ${product.price} includes</Link>. Vendor
              site:{" "}
              <a href={c.url} rel="nofollow noopener" target="_blank">
                {c.name}
              </a>
              .
            </p>

            <CtaBand />
          </div>
        </article>
      </main>
      <Footer />

      <JsonLd
        graph={jsonLdGraph(
          softwareApplicationJsonLd(),
          breadcrumbJsonLd(trail),
          comparisonJsonLd({
            path,
            headline: `WeLockIn vs ${c.name}`,
            description: c.description,
            competitor: c.name,
          }),
        )}
      />
    </>
  );
}
