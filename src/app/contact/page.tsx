import type { Metadata } from "next";
import Link from "next/link";

import "@/components/content/content.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ContactForm } from "@/components/support/ContactForm";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { breadcrumbJsonLd, buildMetadata, jsonLdGraph } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact us",
  description:
    "Reach the WeLockIn team — support, billing, privacy or press. Send the form or email hello@welock.in; a real person reads every message.",
  path: "/contact",
});

const TRAIL: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="cp">
          <div className="cp-wrap">
            <Breadcrumbs trail={TRAIL} />

            <p className="cp-eyebrow">Contact</p>
            <h1 className="cp-h1">Get in touch</h1>
            <p className="cp-lead">
              A question, a bug, a billing hiccup or a press enquiry — send it
              over. Every message is read by the students who build WeLockIn,
              usually between lectures.
            </p>
            <p className="cp-sub">
              Before you write: many questions are already answered in the{" "}
              <Link href="/help">help hub</Link> and the{" "}
              <Link href="/faq">FAQ</Link> — checking there first is often the
              fastest fix.
            </p>

            <ContactForm />

            <h2 className="cp-h2">Other ways to reach us</h2>
            <ul className="cp-list">
              <li>
                Email us directly at{" "}
                <a href={`mailto:${siteConfig.contactEmail}`}>
                  {siteConfig.contactEmail}
                </a>{" "}
                — the form and the address land in the same inbox.
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
