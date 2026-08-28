/**
 * The platforms `/download` advertises.
 *
 * `href` stays null until a platform genuinely has somewhere to send people:
 * inventing a URL would ship a broken primary conversion path that looks like it
 * works. Filling one in turns that card into a working button with no other
 * change. Windows is live; the rest are still waiting on a real URL.
 *
 * This file is also what the site-wide download CTA fires at, through
 * `directDownloadHref` at the bottom. That is deliberate: there is one list of
 * download URLs, not two, so a card on `/download` and the button in the navbar
 * cannot end up pointing at different builds.
 */

import type { DownloadOs } from "@/lib/platform";

export type PlatformDownload = {
  slug: string;
  name: string;
  /** Short line under the name: what a visitor needs to know before clicking. */
  requirement: string;
  /** The real download or store URL, once there is one. */
  href: string | null;
  status: "available" | "coming-soon" | "not-planned";
  /**
   * The `data-os` value the inline detection script writes for this platform.
   * Typed against that script's own union rather than restated, so a card can
   * never claim to match a platform the detection cannot produce.
   */
  detects?: DownloadOs;
  note: string;
};

export const platformDownloads: PlatformDownload[] = [
  {
    slug: "macos",
    name: "macOS",
    // Stated on the card rather than discovered in the browser, though the
    // stakes are now low: the build is universal (arm64 + x86_64), so one DMG
    // serves every Mac and there is nothing left to get wrong. Detection would
    // still be the wrong instinct — a Mac's User-Agent reports Intel whatever
    // silicon is underneath — but today both answers lead to the same file.
    requirement: "For Apple Silicon and Intel Macs",
    // Same reasoning as Windows below, plus the platform: the API answers with
    // whichever build is currently live, and it hands a browser the .dmg rather
    // than the .app.tar.gz the updater consumes. Those are different files and
    // the tarball, expanded by a browser, produces an app that installs and then
    // silently blocks nothing.
    href: "https://app.connect.welock.in/api/updates/download/macos",
    status: "available",
    detects: "macos",
    note: "Blocks apps, websites and notifications system-wide, and holds through a restart.",
  },
  {
    slug: "ios",
    name: "iPhone & iPad",
    requirement: "For iOS and iPadOS",
    href: null,
    status: "available",
    detects: "ios",
    note: "The device most worth covering. A blocker that stops at your laptop leaves the door open.",
  },
  {
    slug: "windows",
    name: "Windows",
    requirement: "For Windows 10 and 11",
    // Deliberately not the storage URL the file actually sits at: that one
    // carries the version number, so it would be wrong the day the next build
    // ships. This link redirects to whichever release is currently live, which
    // also means a build pulled after a bad release stops being handed out here
    // without anyone editing the site.
    href: "https://app.connect.welock.in/api/updates/download/windows",
    status: "available",
    detects: "windows",
    note: "Full desktop blocking with the same five unlock difficulty levels. Windows may warn about an unknown publisher the first time you run it. Choose More info, then Run anyway.",
  },
  {
    slug: "android",
    name: "Android",
    requirement: "In development",
    href: null,
    status: "coming-soon",
    note: "Not shipped yet. If Android is your main phone, it is worth waiting rather than buying now.",
  },
  {
    slug: "linux",
    name: "Linux",
    requirement: "Not currently planned",
    href: null,
    status: "not-planned",
    note: "No Linux build exists and none is on the roadmap today.",
  },
];

/**
 * Where a visitor on `os` should be sent when they click the download CTA
 * without going through `/download` first, or null when there is nowhere yet.
 *
 * The whole point is that this reads the table above and nothing else. Fill in
 * an `href` and the CTA starts firing at it on the next deploy; blank it out
 * and the CTA falls back to `/download` on its own. Nobody has to remember that
 * a second copy of the URL exists somewhere in the components, because it does
 * not.
 *
 * It also stays out of the argument about what the URL does. The two live ones
 * are the release endpoints, which answer with whichever build is currently
 * published, so the browser gets a file and installs; a store URL would answer
 * with a page, and the same click would navigate there instead. Which of the
 * two happens is decided by what sits at the end of the link, which is exactly
 * where the release and publishing setup already decides everything else.
 *
 * `null` in, `null` out, so a caller can hand over an undetected platform
 * without checking first.
 */
export function directDownloadHref(os: DownloadOs | null): string | null {
  if (os === null) return null;
  return platformDownloads.find((platform) => platform.detects === os)?.href ?? null;
}
