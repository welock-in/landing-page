import type { Metadata } from "next";
import Link from "next/link";

import "@/components/content/content.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { product } from "@/config/site";
import { faqCategoryPath, faqEntryPath } from "@/content/faqPage";
import { platformDownloads } from "@/content/platformDownloads";
import {
  breadcrumbJsonLd,
  buildMetadata,
  jsonLdGraph,
  softwareApplicationJsonLd,
} from "@/lib/seo";
import styles from "./download.module.css";

export const metadata: Metadata = buildMetadata({
  title: "Download WeLockIn for Mac, iPhone, iPad and Windows",
  description:
    "Get WeLockIn on macOS, iPhone, iPad and Windows. Three device slots lock together as one. Android coming soon.",
  path: "/download",
  keywords: [
    "download WeLockIn",
    "app blocker for mac",
    "app blocker for windows",
    "website blocker iphone",
    "focus app download",
  ],
});

const TRAIL: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Download", path: "/download" },
];

const STATUS_LABEL: Record<string, string> = {
  available: "Available now",
  "coming-soon": "Coming soon",
  "not-planned": "Not planned",
};

export default function DownloadPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="cp">
          <div className="cp-wrap">
            <Breadcrumbs trail={TRAIL} />

            <p className="cp-eyebrow">Download</p>
            <h1 className="cp-h1">Download WeLockIn</h1>
            <p className="cp-lead">
              You get {product.deviceSlotsLabel} — {product.deviceSlots} devices
              that all lock at the same time. Install it on each one and a single
              session shuts everything down at once.
            </p>
            <p className="cp-sub">
              A blocker that covers your laptop but not your phone is a blocker
              with a door in it, so cover everything before your first hard lock.
            </p>

            <h2 className="cp-h2">Pick your platform</h2>
            <div className={styles.grid}>
              {platformDownloads.map((platform) => (
                <section
                  key={platform.slug}
                  className={styles.card}
                  data-status={platform.status}
                  {...(platform.detects
                    ? { "data-platform": platform.detects }
                    : {})}
                >
                  <div className={styles.cardHead}>
                    <h3 className={styles.cardName}>{platform.name}</h3>
                    <span className={styles.badge}>
                      {STATUS_LABEL[platform.status]}
                    </span>
                  </div>
                  <p className={styles.requirement}>{platform.requirement}</p>
                  <p className={styles.note}>{platform.note}</p>

                  {platform.href ? (
                    <a className={styles.action} href={platform.href}>
                      Download for {platform.name}
                    </a>
                  ) : (
                    <span className={styles.actionMuted}>
                      {platform.status === "available"
                        ? "Download link coming shortly"
                        : STATUS_LABEL[platform.status]}
                    </span>
                  )}
                </section>
              ))}
            </div>

            <h2 className="cp-h2">Setting it up</h2>
            <ol className={styles.steps}>
              <li>
                Install WeLockIn on every device you actually get distracted on.
                Covering your laptop but not your phone leaves the obvious way
                round it wide open.
              </li>
              <li>
                Bundle the apps and sites you want gone, or switch on a ready-made
                category for adult content, gambling, dating apps or mature games.
              </li>
              <li>
                Choose how hard it should be to quit — from a PIN up to{" "}
                <Link href={faqEntryPath("nuclear-mode", "what-is-nuclear-mode")}>
                  Nuclear Mode
                </Link>
                , which nothing lifts before the date you set.
              </li>
              <li>Start. Every synced device locks at the same moment.</li>
            </ol>

            <h2 className="cp-h2">Before you install</h2>
            <ul className="cp-list">
              <li>
                <Link href={faqEntryPath("devices-and-platforms", "android-support")}>
                  Android is not available yet
                </Link>{" "}
                — if it is your main phone, waiting is the honest advice.
              </li>
              <li>
                <Link
                  href={faqEntryPath("devices-and-platforms", "sync-across-devices")}
                >
                  Add every device before your first hard lock
                </Link>{" "}
                — an unsynced device is an unlocked one.
              </li>
              <li>
                <Link href={faqEntryPath("nuclear-mode", "emergency-access")}>
                  Never block anything you might need in an emergency
                </Link>
                . Nuclear Mode has no override, including for us.
              </li>
              <li>
                Full setup detail lives in{" "}
                <Link href={faqCategoryPath("getting-started")}>
                  Getting started
                </Link>
                .
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />

      <JsonLd
        graph={jsonLdGraph(softwareApplicationJsonLd(), breadcrumbJsonLd(TRAIL))}
      />
    </>
  );
}
