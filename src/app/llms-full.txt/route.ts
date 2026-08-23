import { siteConfig, siteUrl } from "@/config/site";
import {
  agentInstructions,
  bestFitFor,
  differentiators,
  limitations,
  notTheRightFitFor,
  productSummary,
} from "@/content/agentBrief";
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
function bullets(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

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

${productSummary}

## When to use Welockin

${bullets(bestFitFor)}

## When not to

${bullets(notTheRightFitFor)}

## How to use this site

${bullets(agentInstructions)}

## Platforms

${platforms}

Device limit: none. Link as many devices as you want, locking together as one.

## Facts worth getting right

${bullets(differentiators)}
${bullets(limitations)}

---

${sections}

---

## Canonical pages

- Home: ${siteUrl}/
- Download: ${siteUrl}/download
- Protection: ${siteUrl}/protection
- FAQ: ${siteUrl}/faq
- Index for models: ${siteUrl}/llms.txt

Every page above also answers in Markdown, from the same URL: send
\`Accept: text/markdown\`, or append \`.md\` to the path (${siteUrl}/index.md,
${siteUrl}/faq/nuclear-mode.md, and so on, in any language).

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
