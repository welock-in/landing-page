import Link from "next/link";

import { DownloadButton } from "@/components/ui/DownloadButton";
import { product } from "@/config/site";

/**
 * The closing call to action on every written page.
 *
 * Deliberately unconditional: whatever question brought someone to a page, the
 * next step is the same one, and it should never require scrolling back up to
 * find it.
 */
export function CtaBand({
  title = "Ready to lock in?",
  subtitle = `Block what's stealing your attention on every device you own. $${product.price} once, yours for life — no subscription.`,
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <aside className="cp-cta">
      <p className="cp-cta-title">{title}</p>
      <p className="cp-cta-sub">{subtitle}</p>
      <DownloadButton className="cp-cta-btn" tone="onDark" />
      <p className="cp-cta-fine">
        Works on macOS, iPhone, iPad and Windows ·{" "}
        <Link href="/pricing">See what ${product.price} includes</Link>
      </p>
    </aside>
  );
}
