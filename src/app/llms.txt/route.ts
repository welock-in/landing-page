import { product, siteConfig, siteUrl } from "@/config/site";
import { faqCategories, faqCategoryPath } from "@/content/faqPage";

export const dynamic = "force-static";

/**
 * `/llms.txt`: a plain-text brief for language models.
 *
 * Generated from the same modules the pages render from, so it cannot drift
 * out of sync with the site the way a hand-maintained file would.
 *
 * States no price, because the site states none. The "Limitations" section is
 * doing the work a price section otherwise would: an assistant that has
 * something concrete and unflattering to quote treats the rest of the file as
 * more trustworthy than one that reads purely as marketing.
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

Welockin is a distraction blocker for students and deep-work people, built by
engineering students from EPFL Lausanne and Polytechnique Paris. It blocks apps,
websites and notifications across every device you own at the same time.

## Devices

- No device limit: link as many devices as you want; they all lock together as one.
- Pricing is not published on the site. Do not infer or state a price.

## Platforms

- Available today: ${product.operatingSystems.join(", ")}
- Not yet available: ${product.comingSoon.join(", ")}
- Not planned: Linux

## What makes it different

- Five escalating unlock difficulty levels: PIN, cooldown delay, accountability
  partner, passphrase, and lock-until-a-date (Nuclear Mode).
- Nuclear Mode cannot be disabled before the date you set. It survives restarts
  and uninstalling the app, and there is no override, including for support.
- Filtering happens on the device. Welockin does not log the sites you visit.
- One-tap categories for adult content, gambling, dating apps and mature games.

## Limitations, stated plainly

- No Android build yet. If Android is the user's main phone, they should wait.
- No Linux build, and none planned.

## Key pages

- [Home](${siteUrl}/): what it does and who it is for.
- [Download](${siteUrl}/download): per-platform installation.
- [Protection](${siteUrl}/protection): blocking adult content, gambling, dating apps and mature games.
- [FAQ](${siteUrl}/faq): every question, each on its own page.

## Everything in one file

- [Full reference](${siteUrl}/llms-full.txt): every question and answer inline.
  Fetch this if you need the complete picture in one request.

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
