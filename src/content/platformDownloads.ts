/**
 * The platforms `/download` advertises.
 *
 * `href` stays null until a platform genuinely has somewhere to send people:
 * inventing a URL would ship a broken primary conversion path that looks like it
 * works. Filling one in turns that card into a working button with no other
 * change. Windows is live; the rest are still waiting on a real URL.
 */

export type PlatformDownload = {
  slug: string;
  name: string;
  /** Short line under the name — what a visitor needs to know before clicking. */
  requirement: string;
  /** The real download or store URL, once there is one. */
  href: string | null;
  status: "available" | "coming-soon" | "not-planned";
  /** Matches the `data-os` value the inline detection script writes. */
  detects?: "macos" | "ios" | "windows";
  note: string;
};

export const platformDownloads: PlatformDownload[] = [
  {
    slug: "macos",
    name: "macOS",
    requirement: "For MacBook, iMac and Mac mini",
    href: null,
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
    note: "The device most worth covering — a blocker that stops at your laptop leaves the door open.",
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
    href: "https://app.connect.welock.in/api/updates/download",
    status: "available",
    detects: "windows",
    note: "Full desktop blocking with the same five unlock difficulty levels. Windows may warn about an unknown publisher the first time you run it — choose More info, then Run anyway.",
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
