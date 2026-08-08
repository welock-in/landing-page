import type { Metadata } from "next";

import { ThanksCard } from "@/components/checkout/ThanksCard";
import styles from "@/components/checkout/Thanks.module.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Payment received",
  description: "Jump back into Welockin — your licence is on your account.",
  path: "/thanks",
  // Only ever reached from the checkout confirmation button or the receipt
  // email — an interstitial, not a landing page. Keep it out of search results.
  noIndex: true,
});

/**
 * The post-checkout bridge. Lemon Squeezy's confirmation button and the
 * receipt email both point here (cloud-backend sets `product_options` on every
 * checkout it mints), with `?order_id=[order_id]` substituted by their link
 * variables; this page hands both the visitor and that order id back to the
 * desktop app via its `welockin://` deep link, and the app has the backend
 * verify the order at the source.
 */
export default async function ThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string | string[] }>;
}) {
  const { order_id } = await searchParams;
  const orderId = Array.isArray(order_id) ? order_id[0] : order_id;

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <Container>
          <ThanksCard orderId={orderId} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
