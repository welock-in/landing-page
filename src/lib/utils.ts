import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names, resolving conflicts (last one wins).
 * The standard `cn` helper used across all UI components.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = ""): string {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://welockin.com"
  ).replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
