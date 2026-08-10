
import { notFound } from "next/navigation";

import { ThanksCard } from "@/components/checkout/ThanksCard";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { metadataFor, type LangParams } from "@/i18n/metadata";
import styles from "@/components/checkout/Thanks.module.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/ui/Container";

export function generateMetadata({ params }: LangParams) {
  return metadataFor(params, (d) => ({
    ...d.pages.thanks.meta,
    path: "/thanks",
    noIndex: true,
  }));
}

/**
 * The post-checkout bridge. Lemon Squeezy's confirmation button and the
 * receipt email both point here (cloud-backend sets `product_options` on every
 * checkout it mints), with `?order_id=[order_id]` substituted by their link
 * variables; this page hands both the visitor and that order id back to the
 * desktop app via its `welockin://` deep link, and the app has the backend
 * verify the order at the source.
 */
export default async function ThanksPage({
  params,
  searchParams,
}: LangParams & {
  searchParams: Promise<{ order_id?: string | string[] }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { thanks } = (await getDictionary(lang)).pages;
  const { order_id } = await searchParams;
  const orderId = Array.isArray(order_id) ? order_id[0] : order_id;

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <Container>
          <ThanksCard orderId={orderId} copy={thanks} />
        </Container>
      </main>
      <Footer />
    </>
  );
}
