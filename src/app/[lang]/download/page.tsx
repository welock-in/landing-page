import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { metadataFor, type LangParams } from "@/i18n/metadata";

import "@/components/content/content.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqCategoryPath, faqEntryPath } from "@/content/faqPage";
import { platformDownloads } from "@/content/platformDownloads";
import {
  breadcrumbJsonLd,
  jsonLdGraph,
  softwareApplicationJsonLd,
} from "@/lib/seo";
import styles from "./download.module.css";

export function generateMetadata({ params }: LangParams) {
  return metadataFor(params, (d) => ({
    ...d.pages.download.meta,
    path: "/download",
    keywords: [
    "download Welockin",
    "app blocker for mac",
    "app blocker for windows",
    "website blocker iphone",
    "focus app download",
    ],
  }));
}

const TRAIL: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Download", path: "/download" },
];

const STATUS_LABEL: Record<string, string> = {
  available: "Available now",
  "coming-soon": "Coming soon",
  "not-planned": "Not planned",
};

export default async function DownloadPage({ params }: LangParams) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = (await getDictionary(lang)).pages.download;

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
              A blocker that covers your laptop but not your phone is a blocker
              with a door in it, so cover everything before your first hard lock.
            </p>

            <h2 className="cp-h2">{t.pickPlatform}</h2>
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

            <h2 className="cp-h2">{t.settingUp}</h2>
            <ol className={styles.steps}>
              <li>
                Install Welockin on every device you actually get distracted on.
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

            <h2 className="cp-h2">{t.beforeYouInstall}</h2>
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
