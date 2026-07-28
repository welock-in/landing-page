import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { siteUrl } from "@/config/site";

/**
 * Merge Tailwind class names, resolving conflicts (last one wins).
 * The standard `cn` helper used across all UI components.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Build an absolute URL from a site-relative path.
 *
 * Deliberately derives from `siteUrl` rather than reading the env var again.
 * This function used to carry its own fallback host, which drifted from the
 * one in site.ts — so `sitemap.ts` and `robots.ts` (the only two callers)
 * spent production advertising a domain that does not resolve, while every
 * canonical tag pointed somewhere else. One source of truth, no drift.
 */
export function absoluteUrl(path = ""): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
