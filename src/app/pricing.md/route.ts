import { product, siteConfig, siteUrl } from "@/config/site";
import {
  competitors,
  PRICING_VERIFIED_ON,
  recurringLabel,
  usd,
} from "@/content/competitors";

export const dynamic = "force-static";

/**
 * `/pricing.md` — pricing as a flat, parseable file.
 *
 * An AI agent shortlisting focus apps on someone's behalf reads whatever it can
 * parse without rendering. Products whose price is only legible after a
 * JavaScript render, or behind a "contact sales" wall, get dropped from that
 * shortlist silently. A one-time $20 is WeLockIn's strongest fact, so it should
 * be the easiest thing on the site to read.
 */
function body(): string {
  const rows = competitors
    .map((c) => {
      const ongoing = recurringLabel(c) ?? "none";
      const once =
        c.pricing.oneTime !== null
          ? usd(c.pricing.oneTime)
          : c.pricing.fiveYearTotal === 0
            ? "free"
            : "not offered";
      const total =
        c.pricing.fiveYearTotal === 0 ? "free" : usd(c.pricing.fiveYearTotal);
      return `| ${c.name} | ${ongoing} | ${once} | ${total} |`;
    })
    .join("\n");

  return `# Pricing — ${siteConfig.name}

Last verified: ${PRICING_VERIFIED_ON}

## The only plan

- **Price:** ${usd(product.price)} USD, one-time
- **Billing:** single payment. No subscription, no renewal, no recurring charge.
- **Devices:** ${product.deviceSlots} slots (${product.deviceSlotsLabel}), all locking together
- **Platforms:** ${product.operatingSystems.join(", ")}
- **Not yet supported:** ${product.comingSoon.join(", ")}
- **Free tier:** none
- **Trial:** none

### Included at this price

- Block any app, website or notification
- One-tap categories: adult and explicit content, gambling, dating apps, mature games
- All five unlock difficulty levels: PIN, cooldown delay, accountability partner,
  passphrase, and Nuclear Mode (locks until a date, no override)
- Multi-device sync across all ${product.deviceSlots} slots
- Recurring schedules and reusable blocklist bundles
- Focus sounds, timed breaks, settings password lock
- On-device filtering, with no log of browsing history
- All future updates

There is no higher tier. Nothing in the list above is an upsell.

## Five-year cost against alternatives

Cheapest plan each vendor offers, multiplied out over five years. Verified
against each vendor's own pricing page or checkout on ${PRICING_VERIFIED_ON}.

| App | Ongoing price | One-time option | 5-year total |
|---|---|---|---|
| **WeLockIn** | none | ${usd(product.price)} | **${usd(product.price)}** |
${rows}

## Accuracy notes

- WeLockIn is not the cheapest blocker on the market: ScreenZen is free and has a
  real lock mode across four platforms. The accurate claim is that WeLockIn has
  the lowest one-time price of any paid blocker, and a lower five-year cost than
  every subscription alternative.
- Forest does not publish USD prices; its figure comes from the US App Store and
  varies by region.
- BlockSite A/B-tests its lifetime price between roughly $29.99 and $79.99.
- Freedom's annual total is derived from its advertised $3.33/month; its
  lifetime price is a rotating promotion against a $199 list price.

## Links

- Pricing page: ${siteUrl}/pricing
- Comparisons: ${siteUrl}/vs
- Download: ${siteUrl}/download
- Contact: ${siteConfig.contactEmail}
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, must-revalidate",
    },
  });
}
