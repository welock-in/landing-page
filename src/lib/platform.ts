/** Platforms the download CTA can advertise. Anything else falls back to macOS. */
export type DownloadOs = "macos" | "ios" | "windows";

/**
 * Runs inline, before first paint, and stamps `data-os` on <html> so the
 * download button can pick its label in CSS.
 *
 * Doing this in a client effect instead would flash the wrong label after
 * hydration, and reading the User-Agent header on the server would opt the
 * whole marketing page out of static generation — neither is worth it for a
 * three-way label swap.
 *
 * iPadOS reports itself as a Mac, so the touch-point count is what separates
 * an iPad from a MacBook.
 */
export const OS_DETECT_SCRIPT = `(function(){try{var n=navigator,p=(n.userAgentData&&n.userAgentData.platform)||"",u=n.userAgent||"",o="macos";if(/Windows/i.test(p)||/Windows|Win32|Win64/i.test(u)){o="windows"}else if(/iPhone|iPad|iPod/i.test(u)||(/Mac/i.test(u)&&n.maxTouchPoints>1)){o="ios"}document.documentElement.dataset.os=o}catch(e){}})()`;
