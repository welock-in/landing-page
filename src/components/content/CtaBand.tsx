"use client";

import { DownloadButton } from "@/components/ui/DownloadButton";
import { useCommon } from "@/i18n/LocaleContext";

/**
 * The closing call to action on every written page.
 *
 * Deliberately unconditional: whatever question brought someone to a page, the
 * next step is the same one, and it should never require scrolling back up to
 * find it. Copy comes from the catalog rather than props — every caller used
 * the defaults, and the two that might not can still override.
 */
export function CtaBand({
  title,
  subtitle,
}: {
  title?: string;
  subtitle?: string;
}) {
  const { ctaBand } = useCommon();

  return (
    <aside className="cp-cta">
      <p className="cp-cta-title">{title ?? ctaBand.title}</p>
      <p className="cp-cta-sub">{subtitle ?? ctaBand.subtitle}</p>
      <DownloadButton className="cp-cta-btn" tone="onDark" />
      <p className="cp-cta-fine">{ctaBand.fine}</p>
    </aside>
  );
}
