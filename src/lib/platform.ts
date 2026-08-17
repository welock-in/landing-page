/** Platforms the download CTA can advertise. Anything else falls back to macOS. */
export type DownloadOs = "macos" | "ios" | "windows";

const DOWNLOAD_OS_VALUES = ["macos", "ios", "windows"] as const;

/**
 * Every value the script below can write. "other" is Android, Linux, ChromeOS
 * and anything unrecognised: a visitor whose platform has no build to hand out.
 */
export type DetectedOs = DownloadOs | "other";

/**
 * Narrows the raw `data-os` attribute to a platform there is actually a build
 * for. Anything else, including a missing attribute because the script was
 * blocked, is not a platform we can hand a file to, and the caller falls back
 * to `/download`.
 */
export function isDownloadOs(value: string | null | undefined): value is DownloadOs {
  return (DOWNLOAD_OS_VALUES as readonly string[]).includes(value ?? "");
}

/**
 * Runs inline, before first paint, and stamps `data-os` on <html> so the
 * download button can pick its label in CSS.
 *
 * Doing this in a client effect instead would flash the wrong label after
 * hydration, and reading the User-Agent header on the server would opt the
 * whole marketing page out of static generation; neither is worth it for a
 * three-way label swap.
 *
 * iPadOS reports itself as a Mac, so the touch-point count is what separates
 * an iPad from a MacBook.
 *
 * macOS used to be the starting value, so an Android phone was stamped "macos"
 * and read as a Mac by everything downstream. That was harmless while the CTA
 * only ever led to `/download`, but the CTA now hands out the file itself, and
 * a .dmg is not something to drop on a phone. So a Mac has to be recognised
 * rather than assumed, and everything left over is "other": the label still
 * says macOS, because that is the CSS default, but the click still goes to
 * `/download` where Android is listed honestly as not shipped.
 */
export const OS_DETECT_SCRIPT = `(function(){try{var n=navigator,p=(n.userAgentData&&n.userAgentData.platform)||"",u=n.userAgent||"",o="other";if(/Windows/i.test(p)||/Windows|Win32|Win64/i.test(u)){o="windows"}else if(/iPhone|iPad|iPod/i.test(u)||(/Mac/i.test(u)&&n.maxTouchPoints>1)){o="ios"}else if(/Mac/i.test(p)||/Mac/i.test(u)){o="macos"}document.documentElement.dataset.os=o}catch(e){}})()`;
