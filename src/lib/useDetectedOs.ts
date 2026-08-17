"use client";

import { useSyncExternalStore } from "react";

import { isDownloadOs, type DownloadOs } from "./platform";

/**
 * `data-os` is written once, inline, before first paint, and never touched
 * again. There is no change to hear about, so subscribing is a formality the
 * hook below has to satisfy and nothing more.
 */
const subscribe = () => () => {};

/** What the detection script decided, or null if it decided nothing usable. */
function readDetectedOs(): DownloadOs | null {
  const detected = document.documentElement.dataset.os;
  return isDownloadOs(detected) ? detected : null;
}

/** No <html> on the server, and no visitor to read it for. */
const noDetection = () => null;

/**
 * The visitor's platform, read back from the `data-os` attribute the inline
 * detection script stamped on <html> before first paint.
 *
 * Reading that attribute rather than sniffing the User-Agent again is the point
 * of this hook. The button's wording is chosen from the same attribute in CSS,
 * so a second, independent detection could disagree with it, and a button that
 * reads "Download for macOS" while handing over a .exe is worse than no
 * detection at all. One detection, one answer, used by both.
 *
 * Null on the server and through hydration, and null afterwards too for a
 * platform with no build of its own or a browser that never ran the script.
 * That is what `useSyncExternalStore`'s third argument buys: the first render
 * is identical to the server's, so the pages stay static and hydrate clean,
 * and the real answer arrives in the render straight after. Callers read null
 * as "no direct link" and fall back to `/download`, which is also exactly what
 * a visitor with JS off is left with.
 */
export function useDetectedOs(): DownloadOs | null {
  return useSyncExternalStore(subscribe, readDetectedOs, noDetection);
}
