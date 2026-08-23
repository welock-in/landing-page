import assert from "node:assert/strict";
import test from "node:test";

import {
  appendVary,
  HTML,
  MARKDOWN,
  negotiate,
  parseAccept,
} from "../src/lib/accept";

/**
 * The ranking rules, as a table.
 *
 * Every row here is either a vector published at
 * https://acceptmarkdown.com/guides/accept-parsing or a header a real client
 * sends. The Chrome and Safari rows are the ones that matter most: they are
 * what a substring check gets wrong, and getting them wrong means serving raw
 * Markdown to a person in a browser.
 */
const VECTORS: [name: string, accept: string | null, expected: string | null][] = [
  ["no Accept header at all", null, HTML],
  ["an empty Accept header", "", HTML],
  ["*/*", "*/*", HTML],
  ["text/html", "text/html", HTML],
  ["text/markdown", "text/markdown", MARKDOWN],
  ["markdown ahead of html at equal q", "text/markdown, text/html", MARKDOWN],
  ["html ahead of markdown at equal q", "text/html, text/markdown", HTML],
  ["markdown outranking html by q", "text/markdown, text/html;q=0.8", MARKDOWN],
  ["html outranking markdown by q", "text/markdown;q=0.4, text/html;q=0.9", HTML],
  ["markdown explicitly refused", "text/markdown;q=0, text/html", HTML],
  [
    "html refused, markdown available",
    "text/html;q=0, text/markdown",
    MARKDOWN,
  ],
  [
    "a specific q=0 beats a permissive wildcard",
    "text/html;q=0, */*",
    MARKDOWN,
  ],
  [
    "an Accept that only excludes leaves the choice open",
    "text/markdown;q=0",
    HTML,
  ],
  ["everything refused", "application/pdf", null],
  ["a positive range for something we do not produce", "text/markdown;q=0, application/pdf", null],
  ["everything excluded by wildcard", "*/*;q=0", null],
  ["everything refused, explicitly", "text/html;q=0, text/markdown;q=0", null],
  ["a subtype wildcard is ambiguous, so: default", "text/*", HTML],
  [
    "Chrome",
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    HTML,
  ],
  [
    "Safari",
    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    HTML,
  ],
  ["curl", "*/*", HTML],
  ["an agent naming both, markdown first", "text/markdown,text/plain,*/*", MARKDOWN],
  ["whitespace and casing", "  TEXT/MARKDOWN ;  Q=1.0 ", MARKDOWN],
  ["a media type with parameters", "text/markdown;variant=CommonMark", MARKDOWN],
  ["a malformed q is ignored, not read as a refusal", "text/markdown;q=banana", MARKDOWN],
];

for (const [name, accept, expected] of VECTORS) {
  test(`negotiate: ${name}`, () => {
    assert.equal(negotiate(accept), expected);
  });
}

test("negotiate: 406 only when the one representation on offer is refused", () => {
  assert.equal(negotiate("text/markdown;q=0", [MARKDOWN]), null);
  assert.equal(negotiate("text/markdown;q=0", [HTML, MARKDOWN]), HTML);
});

test("parseAccept: q defaults to 1 and is clamped", () => {
  assert.deepEqual(parseAccept("text/html"), [
    { range: "text/html", q: 1, specificity: 2 },
  ]);
  assert.equal(parseAccept("text/html;q=5")[0].q, 1);
  assert.equal(parseAccept("text/html;q=-1")[0].q, 0);
});

test("parseAccept: specificity ranks full type over subtype over catch-all", () => {
  const entries = parseAccept("text/markdown, text/*, */*");
  assert.deepEqual(
    entries.map((e) => e.specificity),
    [2, 1, 0],
  );
});

test("parseAccept: empty entries are dropped, not counted", () => {
  assert.deepEqual(parseAccept(",, ,"), []);
  // …and an Accept made entirely of noise still means "no constraint".
  assert.equal(negotiate(",, ,"), HTML);
});

test("appendVary: sets Vary when there is none", () => {
  const headers = new Headers();
  appendVary(headers);
  assert.equal(headers.get("Vary"), "Accept");
});

test("appendVary: keeps what is already there", () => {
  const headers = new Headers({ Vary: "RSC, Next-Router-State-Tree" });
  appendVary(headers);
  assert.equal(headers.get("Vary"), "RSC, Next-Router-State-Tree, Accept");
});

test("appendVary: does not repeat a token, whatever its casing", () => {
  const headers = new Headers({ Vary: "accept, Accept-Encoding" });
  appendVary(headers);
  assert.equal(headers.get("Vary"), "accept, Accept-Encoding");
});
