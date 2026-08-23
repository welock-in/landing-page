import assert from "node:assert/strict";
import test from "node:test";

import { markdownPath, pagePathFromMarkdown } from "../src/lib/markdownUrl";

test("markdownPath: the home page is /index.md, not /.md", () => {
  assert.equal(markdownPath("/"), "/index.md");
  assert.equal(markdownPath(""), "/index.md");
});

test("markdownPath: every other page just gains the suffix", () => {
  assert.equal(markdownPath("/download"), "/download.md");
  assert.equal(markdownPath("/faq/nuclear-mode"), "/faq/nuclear-mode.md");
  assert.equal(markdownPath("/fr/faq"), "/fr/faq.md");
});

test("markdownPath: a trailing slash is not a different page", () => {
  assert.equal(markdownPath("/download/"), "/download.md");
});

test("pagePathFromMarkdown: reverses markdownPath", () => {
  for (const path of ["/", "/download", "/faq/nuclear-mode", "/fr/faq"]) {
    assert.equal(pagePathFromMarkdown(markdownPath(path)), path);
  }
});

test("pagePathFromMarkdown: null for anything that is not a .md URL", () => {
  assert.equal(pagePathFromMarkdown("/download"), null);
  assert.equal(pagePathFromMarkdown("/sitemap.xml"), null);
  assert.equal(pagePathFromMarkdown("/llms.txt"), null);
  // Not a Markdown URL either, whatever it looks like: `.md` has to end it.
  assert.equal(pagePathFromMarkdown("/faq.md/extra"), null);
});
