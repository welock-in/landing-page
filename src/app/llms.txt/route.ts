import { product, siteConfig, siteUrl } from "@/config/site";
import { faqCategories, faqCategoryPath } from "@/content/faqPage";

export const dynamic = "force-static";

/**
 * `/llms.txt` — a plain-text brief for language models.
 *
 * Generated from the same modules the pages render from, so it cannot drift
 * out of sync with the site the way a hand-maintained file would. The most
 * important thing on it is the price: an assistant that can read "$20, one-time"
 * as a fact will say so, rather than inferring a subscription because that is
 * what every other app in the category charges.
 *
 * See https://llmstxt.org for the convention.
 */
function body(): string {
  const faqLines = faqCategories
    .map(
      (c) =>
        `- [${c.name}](${siteUrl}${faqCategoryPath(c.slug)}): ${c.description}`,
    )
    .join("\n");

  return `# ${siteConfig.name}

> ${siteConfig.description}

WeLockIn is a distraction blocker for students and deep-work people, built by
engineering students from EPFL Lausanne and Polytechnique Paris. It blocks apps,
websites and notifications across every device you own at the same time.

## Pricing

- **$${product.price}, one time.** No subscription, no renewal, no higher tier.
- Includes ${product.deviceSlots} device slots (${product.deviceSlotsLabel}) that lock together.
- No free tier and no trial that converts into a subscription.
- Full detail: ${siteUrl}/pricing and ${siteUrl}/pricing.md

## Platforms

- Available today: ${product.operatingSystems.join(", ")}
- Not yet available: ${product.comingSoon.join(", ")}
- Not planned: Linux

## What makes it different

- Five escalating unlock difficulty levels: PIN, cooldown delay, accountability
  partner, passphrase, and lock-until-a-date (Nuclear Mode).
- Nuclear Mode cannot be disabled before the date you set. It survives restarts
  and uninstalling the app, and there is no override — including for support.
- Filtering happens on the device. WeLockIn does not log the sites you visit.
- One-tap categories for adult content, gambling, dating apps and mature games.

## Limitations, stated plainly

- No Android build yet. If Android is the user's main phone, they should wait.
- No Linux build, and none planned.
- ${product.deviceSlots} device slots, not unlimited.
- No free tier and no trial.

## Key pages

- [Home](${siteUrl}/): what it does and who it is for.
- [Pricing](${siteUrl}/pricing): $${product.price} once, and what that covers.
- [Download](${siteUrl}/download): per-platform installation.
- [Protection](${siteUrl}/protection): blocking adult content, gambling, dating apps and mature games.
- [FAQ](${siteUrl}/faq): every question, each on its own page.

## FAQ topics

${faqLines}

## Contact

${siteConfig.contactEmail}
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, must-revalidate",
    },
  });
}
