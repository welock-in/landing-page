"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

import { useLocalePath } from "@/i18n/LocaleContext";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  /** Un-prefixed, site-relative path: "/privacy", not "/fr/privacy". */
  href: string;
};

/**
 * `next/link` that stays inside the visitor's language.
 *
 * For prose that lives inside a server component (the legal pages, mostly)
 * where reaching for `useLocalePath` directly is not an option. A bare
 * `<a href="/privacy">` in a page rendered at `/fr/privacy` sends the reader
 * to the English site and silently ends their French session, which is the
 * failure this exists to make impossible.
 */
export function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const withLocale = useLocalePath();
  return <Link href={withLocale(href)} {...props} />;
}
