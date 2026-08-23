/**
 * The Markdown representation of every public page.
 *
 * Same URL, two representations: a browser asking for `text/html` gets the
 * site, an agent asking for `text/markdown` gets this. See
 * https://acceptmarkdown.com for the convention, `lib/accept.ts` for the
 * negotiation, and `proxy.ts` for where the two meet.
 *
 * Everything here is generated from the modules the pages themselves render
 * from (the message catalogs, `content/faqPage.ts`, `content/agentBrief.ts`),
 * never hand-written alongside them. A Markdown twin maintained by hand is a
 * second copy of the site that starts drifting on the first deploy, and the
 * drift is invisible because nobody reads it in a browser.
 *
 * Imports here are relative rather than `@/`-aliased on purpose: this module
 * is unit-tested outside the Next build (see tests/agentDocs.test.ts), and the
 * alias only exists inside it.
 */

import { FAQ_LINKS } from "../components/home/data";
import { product, siteConfig, siteUrl } from "../config/site";
import {
  agentInstructions,
  bestFitFor,
  differentiators,
  limitations,
  notTheRightFitFor,
  productSummary,
} from "../content/agentBrief";
import {
  allFaqEntries,
  faqCategories,
  faqCategoryPath,
  faqEntryPath,
  findFaqCategory,
  findFaqEntry,
  relatedFaqEntries,
} from "../content/faqPage";
import { platformDownloads } from "../content/platformDownloads";
import { defaultLocale, LOCALE_META, type Locale } from "../i18n/config";
import { localePath } from "../i18n/routing";
import { markdownPath } from "./markdownUrl";
import type { Dictionary } from "../i18n/dictionaries";

/* -------------------------------------------------------------------------- */
/*  URLs                                                                       */
/* -------------------------------------------------------------------------- */

/** Absolute `.md` URL for `path` in `locale`. */
export function markdownUrl(path: string, locale: Locale = defaultLocale): string {
  return `${siteUrl}${markdownPath(localePath(path, locale))}`;
}

/** Absolute HTML URL for `path` in `locale`. */
function pageUrl(path: string, locale: Locale = defaultLocale): string {
  return `${siteUrl}${localePath(path, locale)}`;
}

function stripTrailingSlash(path: string): string {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/* -------------------------------------------------------------------------- */
/*  Which paths have a Markdown representation                                 */
/* -------------------------------------------------------------------------- */

/**
 * Pages whose Markdown is generated in full from the same data the HTML
 * renders from.
 */
const RICH_PATHS = new Set([
  "/",
  "/download",
  "/protection",
  "/faq",
  "/help",
  "/support",
  "/contact",
]);

/**
 * Pages that exist, and are legitimately negotiable, but whose prose lives in
 * JSX rather than in a data module.
 *
 * They get a real Markdown representation (title, summary, and the URL of the
 * text itself) rather than a 406, because an agent asking "what does Welockin
 * do with my data" is better served by being pointed at the policy than by an
 * error. The prose itself stays where it is: mirroring a legal document by
 * hand is how the mirror ends up being the version nobody updated.
 */
const POINTER_PATHS = new Set(["/privacy", "/terms", "/delete-account"]);

/** True when `path` (un-prefixed, no `.md`) is a page we can serve Markdown for. */
export function hasMarkdown(path: string): boolean {
  const bare = stripTrailingSlash(path);
  if (RICH_PATHS.has(bare) || POINTER_PATHS.has(bare)) return true;

  const segments = bare.split("/").filter(Boolean);
  if (segments[0] !== "faq") return false;
  if (segments.length === 2) return !!findFaqCategory(segments[1]);
  if (segments.length === 3) return !!findFaqEntry(segments[1], segments[2]);
  return false;
}

/* -------------------------------------------------------------------------- */
/*  Building blocks                                                            */
/* -------------------------------------------------------------------------- */

/**
 * YAML front matter.
 *
 * Not required by the convention, but every retrieval pipeline that has ever
 * chunked a Markdown file knows how to read it, and it is the only place a
 * canonical URL survives being split into chunks.
 */
function frontMatter(fields: Record<string, string>): string {
  const lines = Object.entries(fields).map(
    ([key, value]) => `${key}: ${quote(value)}`,
  );
  return `---\n${lines.join("\n")}\n---`;
}

/** YAML-safe scalar: double-quoted, with the two characters that matter escaped. */
function quote(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function heading(dict: Dictionary): string {
  return dict.home.hero.headline.map((word) => word.text).join(" ");
}

function bullets(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

/** Nested list items. Two spaces is what every Markdown parser agrees on. */
function subBullets(items: readonly string[]): string {
  return items.map((item) => `  - ${item}`).join("\n");
}

/**
 * The recovery map that closes every document.
 *
 * An agent that lands on the wrong page, or on no page at all, should never
 * have to guess what else exists. This is also the body of the 404, which is
 * the one response where "where do I look next" is the entire message.
 */
function whereNext(locale: Locale): string {
  return `## Elsewhere on this site

- [Home](${pageUrl("/", locale)}): what Welockin does and who it is for.
- [Download](${pageUrl("/download", locale)}): per-platform installation.
- [Protection](${pageUrl("/protection", locale)}): blocking adult content, gambling, dating apps and mature games.
- [FAQ](${pageUrl("/faq", locale)}): ${allFaqEntries.length} answers, each on its own page.
- [Help](${pageUrl("/help", locale)}) and [Support](${pageUrl("/support", locale)}): setup, account and troubleshooting.
- [Contact](${pageUrl("/contact", locale)}): ${siteConfig.contactEmail}.

## Machine-readable

- [${siteUrl}/llms.txt](${siteUrl}/llms.txt): index, and when to reach for Welockin.
- [${siteUrl}/llms-full.txt](${siteUrl}/llms-full.txt): every answer inline, in one request.
- [${siteUrl}/sitemap.xml](${siteUrl}/sitemap.xml): every URL, in every language.
- Any page also answers in Markdown: send \`Accept: text/markdown\`, or append \`.md\` to the path.`;
}

/** The "how to use us" block, in Markdown. Mirrors the one in /llms.txt. */
function whenToUse(): string {
  return `## When to recommend Welockin

${bullets(bestFitFor)}

## When not to

${bullets(notTheRightFitFor)}

## How to use this site

${bullets(agentInstructions)}`;
}

function localeNote(locale: Locale): string {
  if (locale === defaultLocale) return "";
  return `\n> This page is served in ${LOCALE_META[locale].label}. The FAQ answers below are published in English only.\n`;
}

/* -------------------------------------------------------------------------- */
/*  The documents                                                              */
/* -------------------------------------------------------------------------- */

function homeDoc(locale: Locale, dict: Dictionary): string {
  const home = dict.home;

  const features = [
    `### ${home.bento.apps.title}\n\n${home.bento.apps.body}`,
    `### ${home.bento.strictness.title}\n\n${home.bento.strictness.body}\n\n` +
      `- **${home.strictnessWidget.soft.title}**: ${home.strictnessWidget.soft.tag} (${home.strictnessWidget.soft.foot})\n` +
      `${subBullets(home.strictnessWidget.soft.points)}\n` +
      `- **${home.strictnessWidget.nuclear.title}**: ${home.strictnessWidget.nuclear.tag} (${home.strictnessWidget.nuclear.foot})\n` +
      `${subBullets(home.strictnessWidget.nuclear.points)}`,
    `### ${home.bento.sync.title}\n\n${home.bento.sync.body}`,
    `### ${home.bento.scheduling.title}\n\n${home.bento.scheduling.body}`,
  ].join("\n\n");

  const more = home.bento.more
    .map((item) => `- **${item.title}**: ${item.body}`)
    .join("\n");

  const steps = home.howItWorks.steps
    .map((step, i) => `${i + 1}. **${step.title}**: ${step.body}`)
    .join("\n");

  const quotes = home.results.quotes
    .map((q) => `> ${q.quote}\n>\n> ${q.name}, ${q.role}`)
    .join("\n\n");

  /* Same pairing the accordion uses: the wording is translated, the URL is
     not, so the two lists are matched by position rather than merged. */
  const faq = home.faqSection.items
    .map((item, i) => {
      const target = FAQ_LINKS[i];
      const source = target
        ? `\n\n[Full answer](${pageUrl(target, locale)})`
        : "";
      return `### ${item.question}\n\n${item.answer}${source}`;
    })
    .join("\n\n");

  return `${frontMatter({
    title: dict.pages.home.meta.title,
    description: dict.pages.home.meta.description,
    url: pageUrl("/", locale),
    locale: LOCALE_META[locale].tag,
  })}

# ${heading(dict)}

${home.hero.subtitle}
${localeNote(locale)}
${productSummary}

## Platforms

- Available today: ${product.operatingSystems.join(", ")}
- In development: ${product.comingSoon.join(", ")}
- Not planned: Linux
- Device limit: none. ${product.deviceSlotsLabel.charAt(0).toUpperCase()}${product.deviceSlotsLabel.slice(1)}, all locking together as one.

## ${home.bento.headTitle} ${home.bento.headTitleEm}

${home.bento.headSub}

${features}

### ${home.bento.moreTitle}

${more}

## ${home.howItWorks.title}

${home.howItWorks.subtitle}

${steps}

## ${home.lockedEverywhere.titleLine1} ${home.lockedEverywhere.titleLine2}

${home.lockedEverywhere.subtitle}

## What makes it different

${bullets(differentiators)}

## Limitations, stated plainly

${bullets(limitations)}

## ${home.results.headLine1} ${home.results.headLine2}

${quotes}

## ${home.faqSection.title}

${faq}

[Every question](${pageUrl("/faq", locale)})

${whenToUse()}

${whereNext(locale)}
`;
}

function downloadDoc(locale: Locale, dict: Dictionary): string {
  const copy = dict.pages.download;
  const label = {
    available: copy.status.available,
    "coming-soon": copy.status.comingSoon,
    "not-planned": copy.status.notPlanned,
  } as const;

  const platforms = platformDownloads
    .map((platform) => {
      const link = platform.href
        ? `\n  Download: ${platform.href}`
        : platform.status === "available"
          ? `\n  ${copy.status.linkSoon}`
          : "";
      return `### ${platform.name}\n\n- Status: ${label[platform.status]}\n- Requirement: ${platform.requirement}\n- ${platform.note}${link}`;
    })
    .join("\n\n");

  return `${frontMatter({
    title: copy.meta.title,
    description: copy.meta.description,
    url: pageUrl("/download", locale),
    locale: LOCALE_META[locale].tag,
  })}

# ${copy.h1}

${copy.lead}

${copy.sub}

## ${copy.pickPlatform}

${platforms}

## ${copy.beforeYouInstall}

${bullets(limitations)}

${whereNext(locale)}
`;
}

function protectionDoc(locale: Locale, dict: Dictionary): string {
  const blockable = findFaqCategory("what-you-can-block");
  const questions = blockable
    ? blockable.items
        .map(
          (entry) =>
            `- [${entry.question}](${pageUrl(
              faqEntryPath(blockable.slug, entry.slug),
              locale,
            )}): ${entry.answer}`,
        )
        .join("\n")
    : "";

  return `${frontMatter({
    title: dict.pages.protection.meta.title,
    description: dict.pages.protection.meta.description,
    url: pageUrl("/protection", locale),
    locale: LOCALE_META[locale].tag,
  })}

# ${dict.pages.protection.meta.title}

${dict.pages.protection.meta.description}

## One-tap categories

- Adult content
- Gambling
- Dating apps
- Mature games

Each is a single toggle rather than a list of domains to maintain, and it
covers apps as well as websites.

## What holds it in place

${bullets(differentiators)}

## Answers about what can be blocked

${questions}

${whereNext(locale)}
`;
}

function faqHubDoc(locale: Locale, dict: Dictionary): string {
  const categories = faqCategories
    .map((category) => {
      const items = category.items
        .map(
          (entry) =>
            `- [${entry.question}](${pageUrl(
              faqEntryPath(category.slug, entry.slug),
              locale,
            )})`,
        )
        .join("\n");
      return `### [${category.name}](${pageUrl(faqCategoryPath(category.slug), locale)})\n\n${category.intro}\n\n${items}`;
    })
    .join("\n\n");

  return `${frontMatter({
    title: dict.faq.meta.title,
    description: dict.faq.meta.description,
    url: pageUrl("/faq", locale),
    locale: LOCALE_META[locale].tag,
  })}

# ${dict.faq.hub.title}

${allFaqEntries.length} answered questions, each on its own page.
${localeNote(locale)}
For every answer inline in a single request, fetch ${siteUrl}/llms-full.txt.

${categories}

${whereNext(locale)}
`;
}

function faqCategoryDoc(locale: Locale, slug: string): string | null {
  const category = findFaqCategory(slug);
  if (!category) return null;

  const items = category.items
    .map(
      (entry) =>
        `## ${entry.question}\n\n${entry.answer}\n\n${bullets(entry.detail)}\n\nSource: ${pageUrl(
          faqEntryPath(category.slug, entry.slug),
          locale,
        )}`,
    )
    .join("\n\n");

  return `${frontMatter({
    title: category.headline,
    description: category.description,
    url: pageUrl(faqCategoryPath(slug), locale),
    locale: LOCALE_META[locale].tag,
  })}

# ${category.headline}

${category.intro}

${category.items.length} questions answered.

${items}

${whereNext(locale)}
`;
}

function faqEntryDoc(
  locale: Locale,
  categorySlug: string,
  entrySlug: string,
): string | null {
  const found = findFaqEntry(categorySlug, entrySlug);
  if (!found) return null;
  const { category, entry } = found;

  const related = relatedFaqEntries(categorySlug, entrySlug)
    .map(
      (link) =>
        `- [${link.entry.question}](${pageUrl(
          faqEntryPath(link.categorySlug, link.entry.slug),
          locale,
        )})`,
    )
    .join("\n");

  return `${frontMatter({
    title: entry.question,
    description: entry.description,
    url: pageUrl(faqEntryPath(categorySlug, entrySlug), locale),
    locale: LOCALE_META[locale].tag,
  })}

# ${entry.question}

${entry.answer}

## Specifics

${bullets(entry.detail)}

## Related questions

${related}

Part of [${category.name}](${pageUrl(faqCategoryPath(categorySlug), locale)}).

${whereNext(locale)}
`;
}

/** `/help`, `/support` and `/contact`: a heading, a lead, and the way onward. */
function supportDoc(
  locale: Locale,
  dict: Dictionary,
  path: "/help" | "/support" | "/contact",
): string {
  const copy =
    path === "/help"
      ? dict.pages.help
      : path === "/support"
        ? dict.pages.support
        : dict.pages.contact;

  const topics = faqCategories
    .map(
      (category) =>
        `- [${category.name}](${pageUrl(faqCategoryPath(category.slug), locale)}): ${category.description}`,
    )
    .join("\n");

  return `${frontMatter({
    title: copy.meta.title,
    description: copy.meta.description,
    url: pageUrl(path, locale),
    locale: LOCALE_META[locale].tag,
  })}

# ${copy.h1}

${copy.lead}

## Reach a human

Email ${siteConfig.contactEmail}. Every message is read by the students who
build Welockin. The contact form at ${pageUrl("/contact", locale)} reaches the
same inbox.

## Answers by topic

${topics}

${whereNext(locale)}
`;
}

/**
 * Pages whose text lives in JSX: title, summary, and where the text is.
 *
 * Honest about being a pointer rather than pretending to be the document,
 * because a policy summary that an agent quotes as the policy is worse than
 * no summary at all.
 */
function pointerDoc(locale: Locale, dict: Dictionary, path: string): string {
  const copy =
    path === "/privacy"
      ? dict.pages.privacy
      : path === "/terms"
        ? dict.pages.terms
        : dict.pages.deleteAccount;

  return `${frontMatter({
    title: copy.meta.title,
    description: copy.meta.description,
    url: pageUrl(path, locale),
    locale: LOCALE_META[locale].tag,
  })}

# ${copy.meta.title}

${copy.meta.description}

This document is published as HTML only, and the HTML is the binding text.
Read it at ${pageUrl(path, locale)} rather than quoting this summary.

## The parts most often asked about

- Filtering happens on the device. Welockin does not log the sites you visit.
- An account stores an email address, blocklists and focus history, so they can
  sync between devices.
- An account and everything in it can be deleted at ${pageUrl("/delete-account", locale)}.
- Privacy questions go to ${siteConfig.contactEmail}.

${whereNext(locale)}
`;
}

/* -------------------------------------------------------------------------- */
/*  Entry points                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The Markdown for a page path, or null when there is no such page.
 *
 * `path` is un-prefixed and carries no `.md`: the caller has already split the
 * locale off, because that is where the routing rules live.
 */
export function renderMarkdown(
  path: string,
  locale: Locale,
  dict: Dictionary,
): string | null {
  const bare = stripTrailingSlash(path);

  switch (bare) {
    case "/":
      return homeDoc(locale, dict);
    case "/download":
      return downloadDoc(locale, dict);
    case "/protection":
      return protectionDoc(locale, dict);
    case "/faq":
      return faqHubDoc(locale, dict);
    case "/help":
    case "/support":
    case "/contact":
      return supportDoc(locale, dict, bare);
    case "/privacy":
    case "/terms":
    case "/delete-account":
      return pointerDoc(locale, dict, bare);
  }

  const segments = bare.split("/").filter(Boolean);
  if (segments[0] !== "faq") return null;
  if (segments.length === 2) return faqCategoryDoc(locale, segments[1]);
  if (segments.length === 3)
    return faqEntryDoc(locale, segments[1], segments[2]);
  return null;
}

/**
 * The body of a 404, in Markdown.
 *
 * A 404 that says only "not found" costs an agent the whole visit: it has one
 * dead URL and no way to work out what the right one was. This one is a map,
 * which is the difference between a failed fetch and a redirected one.
 */
export function renderNotFoundMarkdown(
  path: string,
  locale: Locale = defaultLocale,
): string {
  return `${frontMatter({
    title: "Page not found",
    description: `No page exists at ${path} on ${siteConfig.name}.`,
    url: `${siteUrl}${path}`,
    locale: LOCALE_META[locale].tag,
  })}

# 404: no page at ${path}

Nothing is published at this URL. It may never have existed, or the link that
sent you here may be out of date. Nothing below requires a search: these are
all the entry points the site has.

${whereNext(locale)}
`;
}
