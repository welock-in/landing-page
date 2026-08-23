/**
 * The `.md` twin of a page URL, and back again.
 *
 * Its own module, and deliberately import-free, because the proxy needs these
 * two functions on every request and nothing else from `lib/agentDocs.ts`.
 * Importing them from there would pull the whole FAQ corpus and every message
 * catalog into a bundle that runs before each page is even chosen.
 */

/**
 * `/faq` -> `/faq.md`, and the home page -> `/index.md`.
 *
 * The root is spelled `index.md` rather than `.md` for the same reason a
 * static host does: `/.md` is a dotfile, and half the tooling that will ever
 * fetch it treats dotfiles as hidden.
 */
export function markdownPath(path: string): string {
  const bare = stripTrailingSlash(path);
  return bare === "/" || bare === "" ? "/index.md" : `${bare}.md`;
}

/**
 * `/faq.md` -> `/faq`, `/index.md` -> `/`, anything else -> null.
 *
 * Null doubles as the test for "was this a Markdown URL at all", so callers
 * do not need to check the suffix and then convert it separately.
 */
export function pagePathFromMarkdown(path: string): string | null {
  if (!path.endsWith(".md")) return null;
  const bare = path.slice(0, -".md".length);
  if (bare === "/index" || bare === "") return "/";
  return bare;
}

function stripTrailingSlash(path: string): string {
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}
