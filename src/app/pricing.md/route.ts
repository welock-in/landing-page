import { product, siteConfig, siteUrl } from "@/config/site";

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
  return `# Pricing — ${siteConfig.name}

## The only plan

- **Price:** $${product.price} USD, one-time
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

### Not included

- No Android build yet
- No Linux build, and none planned
- ${product.deviceSlots} device slots, not unlimited
- No free tier and no trial

## Why one payment

- Blocks are not tied to a billing status, so a failed renewal cannot silently
  end your protection — there is no renewal.
- There is no card on file and nothing to cancel later.
- The strictest lock (Nuclear Mode) is included, not gated behind a higher tier.

## Links

- Pricing page: ${siteUrl}/pricing
- Download: ${siteUrl}/download
- FAQ: ${siteUrl}/faq
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
