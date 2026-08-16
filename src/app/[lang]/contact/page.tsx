import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { metadataFor, type LangParams } from "@/i18n/metadata";

import "@/components/content/content.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ContactForm } from "@/components/support/ContactForm";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, jsonLdGraph } from "@/lib/seo";

export function generateMetadata({ params }: LangParams) {
  return metadataFor(params, (d) => ({
    ...d.pages.contact.meta,
    path: "/contact",
  }));
}

const TRAIL: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default async function ContactPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).pages.contact;

  return (
    <>
      <Navbar />
      <main>
        <div className="cp">
          <div className="cp-wrap">
            <Breadcrumbs trail={TRAIL} />

            <p className="cp-eyebrow">{t.eyebrow}</p>
            <h1 className="cp-h1">{t.h1}</h1>
            <p className="cp-lead">{t.lead}</p>
            <p className="cp-sub">
              Before you write: many questions are already answered in the{" "}
              <Link href="/help">help hub</Link> and the{" "}
              <Link href="/faq">FAQ</Link>. Checking there first is often the
              fastest fix.
            </p>

            <ContactForm />

            <h2 className="cp-h2">{t.otherWays}</h2>
            <ul className="cp-list">
              <li>
                Email us directly at{" "}
                <a href={`mailto:${siteConfig.contactEmail}`}>
                  {siteConfig.contactEmail}
                </a>. The form and the address land in the same inbox.
              </li>
              <li>
                Something not working? The <Link href="/support">support
                page</Link> covers the most common issues with fixes you can
                try right now.
              </li>
              <li>
                Privacy questions are answered in the{" "}
                <Link href="/privacy">Privacy Policy</Link>; the legal fine
                print lives in the <Link href="/terms">Terms of Service</Link>.
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />

      {/* The Organization node (with its contactPoint) already ships from the
          root layout; only the trail is page-specific here. */}
      <JsonLd graph={jsonLdGraph(breadcrumbJsonLd(TRAIL))} />
    </>
  );
}
