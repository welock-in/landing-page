
import { LegalPage } from "@/components/layout/LegalPage";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { metadataFor, type LangParams } from "@/i18n/metadata";
import legal from "@/components/layout/LegalPage.module.css";

const UPDATED = "15 August 2026";
const CONTACT = "hello@welock.in";

export function generateMetadata({ params }: LangParams) {
  return metadataFor(params, (d) => ({
    ...d.pages.deleteAccount.meta,
    path: "/delete-account",
  }));
}

export default function DeleteAccountPage() {
  return (
    <LegalPage
      eyebrow="Account"
      title="Delete your account"
      updated={UPDATED}
    >
      <p>
        You can permanently delete your Welockin account and all of the data
        associated with it at any time. This page explains the two ways to do it,
        exactly what gets removed, and how long it takes.
      </p>

      <div className={legal.callout}>
        <p>
          <strong>Fastest way — in the app.</strong> Open Welockin and go to{" "}
          <strong>Profile</strong> (tap your avatar, top-right) →{" "}
          <strong>Delete account</strong> → confirm. Your account and its data
          are erased immediately and you are signed out.
        </p>
      </div>

      <h2>Option 1 — Delete in the app (immediate)</h2>
      <ul>
        <li>Open the Welockin app.</li>
        <li>
          Tap your avatar in the top-right corner to open{" "}
          <strong>Profile</strong>.
        </li>
        <li>
          Scroll to <strong>Account</strong> and tap{" "}
          <strong>Delete account</strong>.
        </li>
        <li>Confirm. The deletion is permanent and takes effect right away.</li>
      </ul>

      <h2>Option 2 — Request deletion by email</h2>
      <p>
        If you can no longer sign in or access the app, email{" "}
        <a href={`mailto:${CONTACT}?subject=Delete%20my%20account`}>{CONTACT}</a>{" "}
        <strong>from the email address on your account</strong>, with the subject
        &ldquo;Delete my account&rdquo;. We use the sending address to verify the
        request. We will delete the account and confirm by reply, normally within
        72 hours and always within 30 days.
      </p>

      <h2>What gets deleted</h2>
      <p>
        Deleting your account permanently removes all of the following:
      </p>
      <div className={legal.tableWrap}>
        <table className={legal.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Deleted?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Your email address and login credentials</td>
              <td>Yes — permanently</td>
            </tr>
            <tr>
              <td>Your blocklists (apps and websites you chose to block)</td>
              <td>Yes — permanently</td>
            </tr>
            <tr>
              <td>Your focus session history, streaks and stats</td>
              <td>Yes — permanently</td>
            </tr>
            <tr>
              <td>Your registered devices and sync data</td>
              <td>Yes — permanently</td>
            </tr>
            <tr>
              <td>Any feature requests or votes you submitted</td>
              <td>Yes — permanently</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>What may be retained</h2>
      <p>
        After deletion we retain <strong>nothing that identifies you</strong>,
        with two narrow exceptions:
      </p>
      <ul>
        <li>
          <strong>Legal &amp; transactional records.</strong> Where the law
          requires it (for example, records related to a purchase), we may keep
          the minimum required information for the mandated period, then delete
          it. Note that purchases are processed by Lemon Squeezy (on Windows
          and macOS) or the Apple App Store (on iPhone and iPad) — refunds and
          billing records are held by them under their own policies, not by us.
        </li>
        <li>
          <strong>Aggregated, anonymized statistics</strong> that can no longer
          be linked back to you may remain in our systems.
        </li>
      </ul>

      <h2>Cancel a purchase or subscription</h2>
      <p>
        Deleting your Welockin account does not by itself cancel an
        auto-renewing subscription — cancel it first. If you bought on Windows
        or macOS, cancel from the app&rsquo;s Settings; if you subscribed on
        iPhone or iPad, cancel in your Apple subscription settings. Cancelling
        stops the renewal, and access runs to the end of the period you paid
        for.
      </p>

      <p className={legal.contact}>
        Need help with deletion? Email{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. See also our{" "}
        <LocaleLink href="/privacy">Privacy Policy</LocaleLink>.
      </p>
    </LegalPage>
  );
}
