#!/usr/bin/env node
/**
 * End-to-end check of everything on this site that a machine reads.
 *
 * Run it against a local production server or against production itself:
 *
 *   npm run build && npm start &
 *   node scripts/check-agent-endpoints.mjs http://localhost:3000
 *   node scripts/check-agent-endpoints.mjs https://www.welock.in
 *
 * Unit tests cover the rules (`tests/`); this covers the wiring, which is
 * where content negotiation actually goes wrong: a proxy matcher that skips a
 * path, a header a CDN strips, a `.md` URL nobody generated. It walks
 * `sitemap.xml` rather than a list written here, so a page added to the site
 * without a Markdown representation fails the run instead of going unnoticed.
 */

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const CONCURRENCY = 12;

let failures = 0;
let checks = 0;

function ok(name, detail = "") {
  checks++;
  console.log(`  ok   ${name}${detail ? ` ${detail}` : ""}`);
}

function fail(name, detail) {
  checks++;
  failures++;
  console.log(`  FAIL ${name}\n       ${detail}`);
}

function assert(condition, name, detail) {
  if (condition) ok(name);
  else fail(name, detail);
}

function section(title) {
  console.log(`\n${title}`);
}

/** Never follow redirects: a redirect is a result, not a detour. */
function get(path, headers = {}) {
  return fetch(`${base}${path}`, { headers, redirect: "manual" });
}

/* -------------------------------------------------------------------------- */

async function sitemapPaths() {
  const res = await get("/sitemap.xml");
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return urls.map((url) => new URL(url).pathname);
}

/** Text a crawler would read: no scripts, no styles, no markup. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function checkHomepageHtml() {
  section("Home page, without JavaScript");
  const res = await get("/", { accept: "text/html" });
  const html = await res.text();

  assert(res.status === 200, "home answers 200", `got ${res.status}`);

  const h1 = html.match(/<h1[\s\S]*?<\/h1>/i);
  assert(!!h1, "raw HTML contains an <h1>", "no <h1> in the served markup");

  if (h1) {
    const text = visibleText(h1[0]);
    assert(
      text.length >= 10,
      "the <h1> carries text",
      `<h1> extracted as ${JSON.stringify(text)}`,
    );
    // The failure this guards: an <h1> whose first child is markup reads as
    // empty to extractors that take the element's leading text node.
    const leading = h1[0].match(/<h1[^>]*>\s*(?:<span[^>]*>)?([^<]{5,})/i);
    assert(
      !!leading,
      "the <h1> text survives a naive extractor",
      "no text within the first child of <h1>",
    );
  }

  const text = visibleText(html);
  assert(
    text.length >= 500,
    "500+ characters of text in raw HTML",
    `only ${text.length} characters`,
  );
  ok("text length", `${text.length} characters`);

  const jsonLd = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => JSON.parse(m[1]));
  const nodes = jsonLd.flatMap((block) => block["@graph"] ?? [block]);
  const org = nodes.find((n) => n["@type"] === "Organization");
  assert(!!org, "Organization JSON-LD present", "no Organization node");
  if (org) {
    assert(
      org.address?.["@type"] === "PostalAddress",
      "Organization has a PostalAddress",
      `address is ${JSON.stringify(org.address)}`,
    );
    assert(
      !!org.contactPoint?.contactType &&
        !!(org.contactPoint.email || org.contactPoint.telephone),
      "Organization has a contactPoint with contactType and email",
      `contactPoint is ${JSON.stringify(org.contactPoint)}`,
    );
    assert(
      Array.isArray(org.sameAs) && org.sameAs.length > 0,
      "Organization claims its profiles elsewhere (sameAs)",
      `sameAs is ${JSON.stringify(org.sameAs)}`,
    );
    for (const profile of org.sameAs ?? []) {
      assert(
        /^https:\/\//.test(profile) && !profile.includes("?"),
        `sameAs entry is a bare https profile URL (${profile})`,
        "must be absolute https with no query string (share links carry utm_*)",
      );
    }
  }

  assert(
    /rel="alternate"[^>]*type="text\/markdown"|type="text\/markdown"[^>]*rel="alternate"/.test(
      html,
    ),
    "head advertises the Markdown alternate",
    "no <link rel=alternate type=text/markdown>",
  );

  const link = res.headers.get("link") ?? "";
  assert(
    link.includes('type="text/markdown"'),
    "Link header advertises the Markdown alternate",
    `Link: ${link || "(absent)"}`,
  );
}

async function checkNegotiation() {
  section("Markdown content negotiation (acceptmarkdown.com)");

  const md = await get("/", { accept: "text/markdown" });
  assert(md.status === 200, "Accept: text/markdown answers 200", `got ${md.status}`);
  assert(
    (md.headers.get("content-type") ?? "").startsWith("text/markdown"),
    "Content-Type is text/markdown",
    `got ${md.headers.get("content-type")}`,
  );
  assert(
    /(^|,\s*)accept(\s*,|$)/i.test(md.headers.get("vary") ?? ""),
    "Vary names Accept",
    `Vary: ${md.headers.get("vary")}`,
  );
  const body = await md.text();
  assert(body.startsWith("---\n"), "Markdown opens with front matter", body.slice(0, 40));
  assert(/\n# .+/.test(body), "Markdown has an H1", "no `# ` heading");
  assert(body.length > 2000, "Markdown is substantial", `${body.length} bytes`);
  ok("home Markdown", `${body.length} bytes`);

  const html = await get("/", {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  });
  assert(
    (html.headers.get("content-type") ?? "").startsWith("text/html"),
    "a browser's Accept still gets HTML",
    `got ${html.headers.get("content-type")}`,
  );

  const bare = await get("/");
  assert(
    (bare.headers.get("content-type") ?? "").startsWith("text/html"),
    "no Accept header gets HTML",
    `got ${bare.headers.get("content-type")}`,
  );

  const wildcard = await get("/", { accept: "*/*" });
  assert(
    (wildcard.headers.get("content-type") ?? "").startsWith("text/html"),
    "Accept: */* gets HTML",
    `got ${wildcard.headers.get("content-type")}`,
  );

  const qRanked = await get("/", { accept: "text/markdown, text/html;q=0.8" });
  assert(
    (qRanked.headers.get("content-type") ?? "").startsWith("text/markdown"),
    "q-values are honoured (markdown preferred)",
    `got ${qRanked.headers.get("content-type")}`,
  );

  const refused = await get("/", { accept: "text/markdown;q=0, text/html" });
  assert(
    (refused.headers.get("content-type") ?? "").startsWith("text/html"),
    "q=0 on markdown falls back to HTML",
    `got ${refused.headers.get("content-type")}`,
  );

  const excludeOnly = await get("/", { accept: "text/markdown;q=0" });
  assert(
    (excludeOnly.headers.get("content-type") ?? "").startsWith("text/html"),
    "an Accept that only excludes Markdown still gets HTML, not 406",
    `${excludeOnly.status} ${excludeOnly.headers.get("content-type")}`,
  );

  const unsatisfiable = await get("/", { accept: "application/pdf" });
  assert(
    unsatisfiable.status === 406,
    "an Accept we cannot satisfy answers 406",
    `got ${unsatisfiable.status}`,
  );
  assert(
    /(^|,\s*)accept(\s*,|$)/i.test(unsatisfiable.headers.get("vary") ?? ""),
    "the 406 names Accept in Vary",
    `Vary: ${unsatisfiable.headers.get("vary")}`,
  );

  const suffix = await get("/index.md");
  assert(
    suffix.status === 200 &&
      (suffix.headers.get("content-type") ?? "").startsWith("text/markdown"),
    "/index.md serves Markdown without an Accept header",
    `${suffix.status} ${suffix.headers.get("content-type")}`,
  );

  const french = await get("/fr/faq.md");
  assert(
    french.status === 200 &&
      (french.headers.get("content-type") ?? "").startsWith("text/markdown"),
    "/fr/faq.md serves the French Markdown",
    `${french.status} ${french.headers.get("content-type")}`,
  );

  const enPrefixed = await get("/en/faq.md");
  assert(
    enPrefixed.status === 308 &&
      enPrefixed.headers.get("location")?.endsWith("/faq.md"),
    "/en/faq.md redirects to /faq.md",
    `${enPrefixed.status} -> ${enPrefixed.headers.get("location")}`,
  );

  const image = await get("/en/opengraph-image", { accept: "image/png" });
  assert(
    image.status === 200 || image.status === 308,
    "metadata routes are never negotiated away",
    `got ${image.status}`,
  );
}

async function checkNotFound() {
  section("404s");

  const html = await get("/some-path-that-does-not-exist", { accept: "text/html" });
  assert(html.status === 404, "unknown path answers 404", `got ${html.status}`);
  const body = await html.text();
  const text = visibleText(body);
  assert(text.length > 200, "the 404 has a body", `${text.length} characters`);
  for (const needle of ["/sitemap.xml", "/llms.txt", "/faq"]) {
    assert(
      body.includes(needle),
      `the 404 points at ${needle}`,
      "not linked from the 404",
    );
  }

  const md = await get("/some-path-that-does-not-exist", {
    accept: "text/markdown",
  });
  assert(md.status === 404, "unknown path answers 404 in Markdown too", `got ${md.status}`);
  assert(
    (md.headers.get("content-type") ?? "").startsWith("text/markdown"),
    "the Markdown 404 is text/markdown",
    `got ${md.headers.get("content-type")}`,
  );
  const mdBody = await md.text();
  assert(/\n# /.test(mdBody), "the Markdown 404 has an H1", "no heading");
  for (const needle of ["/sitemap.xml", "/llms.txt", "/llms-full.txt", "/faq"]) {
    assert(
      mdBody.includes(needle),
      `the Markdown 404 points at ${needle}`,
      "missing from the body",
    );
  }

  const suffix = await get("/nope.md");
  assert(suffix.status === 404, "/nope.md answers 404", `got ${suffix.status}`);
}

async function checkMachineFiles() {
  section("Machine-readable files");

  const llms = await get("/llms.txt");
  const llmsBody = await llms.text();
  assert(llms.status === 200, "/llms.txt answers 200", `got ${llms.status}`);
  assert(
    (llms.headers.get("content-type") ?? "").startsWith("text/plain"),
    "/llms.txt is text/plain",
    `got ${llms.headers.get("content-type")}`,
  );
  assert(
    /##\s*When to use/i.test(llmsBody),
    "/llms.txt has a when-to-use section",
    "no 'When to use' heading",
  );
  assert(
    /##\s*When not to/i.test(llmsBody),
    "/llms.txt says when NOT to use it",
    "no 'When not to' heading",
  );
  assert(
    /##\s*How to use this site/i.test(llmsBody),
    "/llms.txt tells an agent how to call the site",
    "no 'How to use this site' heading",
  );
  assert(
    llmsBody.includes("Accept: text/markdown"),
    "/llms.txt documents Markdown negotiation",
    "no mention of Accept: text/markdown",
  );

  const full = await get("/llms-full.txt");
  const fullBody = await full.text();
  assert(full.status === 200, "/llms-full.txt answers 200", `got ${full.status}`);
  assert(
    /##\s*When to use/i.test(fullBody),
    "/llms-full.txt has a when-to-use section",
    "no 'When to use' heading",
  );

  for (const path of ["/robots.txt", "/sitemap.xml", "/manifest.webmanifest"]) {
    const res = await get(path);
    assert(res.status === 200, `${path} answers 200`, `got ${res.status}`);
  }
}

/** Every URL the sitemap advertises must have a Markdown representation. */
async function checkSitemapCoverage() {
  section("Markdown coverage of every sitemap URL");

  const paths = await sitemapPaths();
  ok("sitemap URLs", `${paths.length}`);

  const queue = [...paths];
  const bad = [];

  async function worker() {
    for (;;) {
      const path = queue.shift();
      if (!path) return;
      const res = await get(path, { accept: "text/markdown" });
      const type = res.headers.get("content-type") ?? "";
      if (res.status !== 200 || !type.startsWith("text/markdown")) {
        bad.push(`${path} -> ${res.status} ${type}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  assert(
    bad.length === 0,
    "every sitemap URL answers in Markdown",
    `${bad.length} did not:\n       ${bad.slice(0, 10).join("\n       ")}`,
  );
}

async function main() {
  console.log(`Checking ${base}`);
  await checkHomepageHtml();
  await checkNegotiation();
  await checkNotFound();
  await checkMachineFiles();
  await checkSitemapCoverage();

  console.log(
    `\n${checks - failures}/${checks} checks passed${failures ? `, ${failures} FAILED` : ""}`,
  );
  process.exit(failures ? 1 : 0);
}

await main();
