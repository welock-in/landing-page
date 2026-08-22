/**
 * Which platforms have an install film of their own.
 *
 * A module of its own, with no "use client" on it, because both sides need
 * it: the server-rendered `/download` page decides with it which cards get
 * the film-opening link, and the client components in `InstallDemo.tsx`
 * decide with it which panel a click can open. A function exported from a
 * client module cannot be *called* on the server, only rendered, so the guard
 * cannot live next to the panel it guards.
 */
export type InstallPlatform = "macos" | "windows";

export function isInstallPlatform(slug: string): slug is InstallPlatform {
  return slug === "macos" || slug === "windows";
}
