import assert from "node:assert/strict";
import test from "node:test";

import {
  allFaqEntries,
  faqCategories,
  faqCategoryPath,
  faqEntryPath,
} from "../src/content/faqPage";
import { siteUrl } from "../src/config/site";
import type { Dictionary } from "../src/i18n/dictionaries";
import {
  hasMarkdown,
  markdownUrl,
  renderMarkdown,
  renderNotFoundMarkdown,
} from "../src/lib/agentDocs";
import enCommon from "../src/i18n/messages/en/common.json";
import enFaq from "../src/i18n/messages/en/faq.json";
import enHome from "../src/i18n/messages/en/home.json";
import enPages from "../src/i18n/messages/en/pages.json";
import frHome from "../src/i18n/messages/fr/home.json";

/**
 * The real English catalog, not a fixture.
 *
 * A hand-written stub would keep passing after someone renamed a key in
 * `home.json`, which is the exact failure this file exists to catch: the
 * Markdown is generated from the catalogs, so the catalogs are the input.
 */
const dict: Dictionary = {
  common: enCommon,
  home: enHome,
  pages: enPages,
  faq: enFaq,
};

/** Every page the site publishes, as the sitemap enumerates them. */
const PAGE_PATHS = [
  "/",
  "/download",
  "/protection",
  "/faq",
  "/help",
  "/support",
  "/contact",
  "/terms",
  "/privacy",
  "/delete-account",
  ...faqCategories.map((c) => faqCategoryPath(c.slug)),
  ...allFaqEntries.map(({ category, entry }) =>
    faqEntryPath(category.slug, entry.slug),
  ),
];

test("every published page has a Markdown representation", () => {
  for (const path of PAGE_PATHS) {
    assert.ok(hasMarkdown(path), `${path} has no Markdown`);
    assert.ok(
      renderMarkdown(path, "en", dict),
      `${path} claims Markdown but renders none`,
    );
  }
});

test("a path that is not a page has no Markdown", () => {
  for (const path of [
    "/nope",
    "/faq/not-a-category",
    "/faq/nuclear-mode/not-a-question",
    "/faq/nuclear-mode/is-it-really-permanent/extra",
  ]) {
    assert.equal(hasMarkdown(path), false, `${path} should not have Markdown`);
    assert.equal(renderMarkdown(path, "en", dict), null, path);
  }
});

test("every document opens with front matter and exactly one H1", () => {
  for (const path of PAGE_PATHS) {
    const body = renderMarkdown(path, "en", dict)!;
    assert.match(body, /^---\n/, `${path} has no front matter`);
    assert.match(
      body,
      /^---\n(?:.*\n)+?---\n/,
      `${path} has unterminated front matter`,
    );

    const h1s = body.split("\n").filter((line) => /^# \S/.test(line));
    assert.equal(h1s.length, 1, `${path} has ${h1s.length} H1s`);
  }
});

test("front matter carries the canonical URL of the HTML page, not the .md", () => {
  const body = renderMarkdown("/download", "en", dict)!;
  assert.ok(body.includes(`url: "${siteUrl}/download"`), body.slice(0, 200));
  assert.ok(!body.includes(`url: "${siteUrl}/download.md"`));
});

test("front matter quoting survives a title containing a quote mark", () => {
  // Several FAQ questions are phrased with apostrophes and quotes; a bare
  // YAML scalar would break the block for whichever one gets there first.
  for (const path of PAGE_PATHS) {
    const front = renderMarkdown(path, "en", dict)!.split("\n---\n")[0];
    for (const line of front.split("\n").slice(1)) {
      assert.match(line, /^\w+: ".*"$/, `${path}: unquotable front matter ${line}`);
    }
  }
});

test("the home page Markdown carries the page's own content", () => {
  const body = renderMarkdown("/", "en", dict)!;
  assert.ok(body.includes(dict.home.hero.subtitle));
  assert.ok(body.includes(dict.home.bento.apps.body));
  assert.ok(body.includes(dict.home.howItWorks.steps[0].body));
  assert.ok(body.includes(dict.home.faqSection.items[0].answer));
  assert.ok(body.includes(dict.home.results.quotes[0].name));
  // The headline, reassembled from the word-by-word catalog entry.
  assert.ok(body.includes("# Block distractions before they block your future."));
});

test("the home page Markdown tells an agent when to reach for the product", () => {
  const body = renderMarkdown("/", "en", dict)!;
  assert.match(body, /## When to recommend Welockin/);
  assert.match(body, /## When not to/);
  assert.match(body, /## How to use this site/);
});

test("no document states a price, because the site does not", () => {
  for (const path of PAGE_PATHS) {
    const body = renderMarkdown(path, "en", dict)!;
    const claim = body.match(/(?:^|[^\w])(?:[$€£]\s?\d|\d+\s?(?:USD|EUR|CHF))/);
    // One testimonial says "Best 20 bucks I have spent", which is a quote from
    // a student rather than the site quoting a price. Anything that looks like
    // a currency figure is not.
    assert.equal(claim, null, `${path} appears to state a price: ${claim?.[0]}`);
  }
});

test("a translated page renders in its own language and says so", () => {
  const french: Dictionary = { ...dict, home: frHome as Dictionary["home"] };
  const body = renderMarkdown("/", "fr", french)!;

  assert.ok(body.includes(frHome.hero.subtitle), "French subtitle missing");
  assert.ok(body.includes('locale: "fr"'), "front matter locale is wrong");
  assert.ok(body.includes(`url: "${siteUrl}/fr"`), "canonical is not the French URL");
  // Links inside a French document must stay inside the French site.
  assert.ok(body.includes(`${siteUrl}/fr/download`), "links leave the locale");
  assert.match(body, /published in English only/, "no note about the FAQ language");
});

test("markdownUrl is locale-aware", () => {
  assert.equal(markdownUrl("/", "en"), `${siteUrl}/index.md`);
  assert.equal(markdownUrl("/faq", "fr"), `${siteUrl}/fr/faq.md`);
});

test("the 404 body is a map, not an apology", () => {
  const body = renderNotFoundMarkdown("/nope");

  assert.match(body, /^---\n/);
  assert.match(body, /\n# 404: no page at \/nope/);
  for (const target of [
    `${siteUrl}/sitemap.xml`,
    `${siteUrl}/llms.txt`,
    `${siteUrl}/llms-full.txt`,
    `${siteUrl}/faq`,
    `${siteUrl}/download`,
  ]) {
    assert.ok(body.includes(target), `404 does not point at ${target}`);
  }
});

test("every link in a document points at a URL this site serves", () => {
  const known = new Set([
    `${siteUrl}/`,
    `${siteUrl}/llms.txt`,
    `${siteUrl}/llms-full.txt`,
    `${siteUrl}/sitemap.xml`,
    ...PAGE_PATHS.map((path) => `${siteUrl}${path === "/" ? "/" : path}`),
  ]);

  for (const path of PAGE_PATHS) {
    const body = renderMarkdown(path, "en", dict)!;
    for (const [, href] of body.matchAll(/\]\((https:\/\/[^)]+)\)/g)) {
      if (!href.startsWith(siteUrl)) continue; // outbound download URLs
      assert.ok(known.has(href), `${path} links to ${href}, which is not a page`);
    }
  }
});
