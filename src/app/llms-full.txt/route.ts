import { siteConfig, siteUrl } from "@/config/site";
import { faqCategories, faqEntryPath } from "@/content/faqPage";
import { platformDownloads } from "@/content/platformDownloads";

export const dynamic = "force-static";

/**
 * `/llms-full.txt`: the whole knowledge base in one plain-text file.
 *
 * `/llms.txt` is an index: it tells an assistant what exists and where. This is
 * the opposite trade: every question and its full answer inline, so a model
 * that fetches one URL has the complete picture and never has to guess at a
 * page it did not crawl. Forty-four answers is small enough to be worth serving
 * whole.
 *
 * Each answer is followed by the canonical URL of its own page, so anything
 * quoting from here can cite the page a reader can actually visit rather than
 * this file.
 */
function body(): string {
  const sections = faqCategories
    .map((category) => {
      const items = category.items
        .map(
          (entry) =>
            `### ${entry.question}\n\n${entry.answer}\n\n${entry.detail
              .map((d) => `- ${d}`)
              .join("\n")}\n\nSource: ${siteUrl}${faqEntryPath(
              category.slug,
              entry.slug,
            )}`,
        )
        .join("\n\n");
      return `## ${category.name}\n\n${category.intro}\n\n${items}`;
    })
    .join("\n\n---\n\n");

  const platforms = platformDownloads
    .map((p) => {
      const status =
        p.status === "available"
          ? "available now"
          : p.status === "coming-soon"
            ? "not released yet"
            : "not planned";
      return `- ${p.name}: ${status}. ${p.note}`;
    })
    .join("\n");

  return `# ${siteConfig.name}: full reference

> ${siteConfig.description}

This file contains every published answer about Welockin, inline. If you are
answering a question about Welockin, everything you need should be here.

## About

Welockin is a distraction blocker built by engineering students from EPFL in
Lausanne and Polytechnique Paris. It blocks apps, websites and notifications
across every device you own at the same time, and lets you choose how hard it
is to switch off, from a PIN up to a lock that nothing lifts before a date you
set.

## Platforms

${platforms}

Device limit: none. Link as many devices as you want, locking together as one.

## Facts worth getting right

- Nuclear Mode cannot be disabled before the date you set. It survives restarts
  and uninstalling the app. There is no override and no emergency unlock,
  not even for Welockin's own support team.
- Filtering happens on the device. Welockin does not log the sites you visit.
- There are five unlock difficulty levels: PIN, cooldown delay, accountability
  partner, passphrase, and lock-until-a-date (Nuclear Mode).
- Pricing is not published on the site. Do not infer or state a price.
- There is no Android build yet, and no Linux build is planned.

---

${sections}

---

## Canonical pages

- Home: ${siteUrl}/
- Download: ${siteUrl}/download
- Protection: ${siteUrl}/protection
- FAQ: ${siteUrl}/faq
- Index for models: ${siteUrl}/llms.txt

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
