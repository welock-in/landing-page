import type { Metadata } from "next";

import { LegalPage } from "@/components/layout/LegalPage";
import legal from "@/components/layout/LegalPage.module.css";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbJsonLd, buildMetadata, jsonLdGraph } from "@/lib/seo";

const UPDATED = "2 August 2026";
const CONTACT = "hello@welock.in";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms for using WeLockIn: the 14-day free trial, the one-time lifetime licence, refunds, acceptable use, and why the lock is built to hold.",
  path: "/terms",
});

const TRAIL: Crumb[] = [
  { name: "Home", path: "/" },
  { name: "Terms of Service", path: "/terms" },
];

export default function TermsPage() {
  return (
    <>
      <LegalPage eyebrow="Legal" title="Terms of Service" updated={UPDATED}>
        <Breadcrumbs trail={TRAIL} />

        <p>
          These terms are the agreement between you and WeLockIn
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;) for the WeLockIn apps and the
          account service behind them. By creating an account or using the
          apps, you accept them. We have tried to keep them short and in plain
          English — the unusual parts are the trial, the lifetime licence, and
          the fact that the lock is deliberately hard to remove. Those get
          their own sections below.
        </p>

        <div className={legal.callout}>
          <p>
            <strong>The short version.</strong> You get a 14-day free trial,
            then a one-time lifetime licence — not a subscription. Refunds
            follow the store you bought through, and a full refund revokes the
            licence. The app intentionally resists being disabled during a
            session you started; that is the product, not a bug. Don&rsquo;t
            try to break the enforcement, and don&rsquo;t abuse the trial.
          </p>
        </div>

        <h2>The service</h2>
        <p>
          WeLockIn blocks distracting apps and websites at the device level
          during focus sessions and protection periods you set up. An account
          is required: it is what syncs your blocklists, sessions and licence
          across your devices. The blocking itself runs on your device — see
          the <a href="/privacy">Privacy Policy</a> for what data we do and do
          not handle.
        </p>
        <p>
          Blocking is best-effort by nature. We work hard to make the lock
          hold, but no software can guarantee that every site, app or
          workaround is covered on every configuration. The service is a tool
          to support your own decision, not a guarantee of abstinence.
        </p>

        <h2>Your account</h2>
        <ul>
          <li>
            You must give a working email address — it is how you verify,
            recover and manage your account.
          </li>
          <li>
            Keep your password to yourself. You are responsible for what
            happens under your account.
          </li>
          <li>
            WeLockIn is not directed to children under 13 (or under 16 in the
            EEA/UK), and you must be at least that old to create an account.
          </li>
        </ul>

        <h2>The 14-day free trial</h2>
        <p>
          New devices get a 14-day free trial with the full product. The trial
          is controlled server-side and limited to one per device. Creating
          accounts, resetting devices or otherwise manipulating identifiers to
          obtain repeated trials is trial abuse, and we may end the trial or
          suspend the accounts involved.
        </p>

        <h2>The lifetime licence</h2>
        <p>
          WeLockIn is sold as a <strong>one-time purchase</strong>, not a
          subscription. A lifetime licence covers the device slots included
          with the product for as long as we operate the service, including
          updates we ship to it. It is personal to your account and not
          transferable or resellable.
        </p>
        <p>
          On desktop, purchases are processed by{" "}
          <strong>Lemon Squeezy as merchant of record</strong> — they are the
          seller of record for the transaction, handle payment and applicable
          taxes, and their own terms apply to the purchase itself. On mobile,
          purchases are handled by the app store you bought through (Google
          Play or the Apple App Store) under that store&rsquo;s terms. We never
          receive or store your card number.
        </p>

        <h2>Refunds</h2>
        <p>
          Refunds for desktop purchases are handled through Lemon Squeezy under
          their refund terms; refunds for app-store purchases follow that
          store&rsquo;s refund policy. Nothing here limits any refund rights
          you have under mandatory consumer law where you live. One consequence
          worth stating plainly: <strong>a full refund revokes the
          licence</strong> — the product returns to its unlicensed state on
          your devices.
        </p>

        <h2>Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            circumvent, disable, tamper with or reverse engineer the blocking
            and enforcement mechanisms, or help others do so;
          </li>
          <li>
            abuse the free trial as described above, or share, resell or
            sublicense your licence;
          </li>
          <li>
            use the service to break the law, or probe, overload or disrupt
            our infrastructure.
          </li>
        </ul>
        <p>
          Studying how the lock holds up out of curiosity is human; building or
          distributing bypasses defeats the product for people who depend on
          it, and that is where the line is.
        </p>

        <h2>The lock is meant to hold</h2>
        <div className={legal.callout}>
          <p>
            <strong>Read this before your first hard lock.</strong> WeLockIn
            intentionally resists being disabled during a session you started.
            Hard and Nuclear locks survive restarting your device and
            uninstalling the app, and nobody — including our support team —
            can lift a Nuclear lock before the date you set. That is the
            product working as designed, and by starting such a session you
            accept it. Never block anything you might need in an emergency:
            keep your phone app, messages, maps, banking and anything
            health-related off your blocklist.
          </p>
        </div>

        <h2>Termination</h2>
        <p>
          You can stop using WeLockIn and{" "}
          <a href="/delete-account">delete your account</a> at any time —
          though, as described above, neither uninstalling the app nor leaving
          it lifts a hard lock before it ends. We may suspend or terminate
          accounts that materially breach
          these terms (for example enforcement circumvention or trial abuse).
          If we terminate your account for breach, the licence tied to it ends
          with it. If we ever had to discontinue the service entirely, we would
          give reasonable notice.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The apps, the site and the WeLockIn name and artwork are ours or our
          licensors&rsquo;. Your licence is a right to use the product as
          intended; it does not transfer any ownership to you.
        </p>

        <h2>Disclaimers</h2>
        <p>
          The service is provided <strong>&ldquo;as is&rdquo;</strong> and
          &ldquo;as available&rdquo;, without warranties beyond those that
          cannot be excluded by law. In particular, we do not warrant that
          every distracting app or site will be blocked in every situation, or
          that the service will be uninterrupted or error-free. WeLockIn is a
          productivity tool, not a medical or therapeutic service — for a
          serious compulsion it can be one part of a plan, but it is not a
          substitute for professional help.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, we are not liable for
          indirect, incidental or consequential damages, and our total
          liability for claims arising out of the service is limited to the
          amount you paid for your licence. Nothing in these terms excludes
          liability that cannot be excluded by law, or limits rights you have
          under mandatory consumer law where you live.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these terms from time to time. When we do, we&rsquo;ll
          revise the &ldquo;Last updated&rdquo; date above and, for material
          changes, provide additional notice. Continuing to use the service
          after a change takes effect means you accept the updated terms.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws applicable at our seat of
          business, except where the mandatory consumer law of your country of
          residence applies instead — nothing in these terms takes those
          protections away.
        </p>

        <p className={legal.contact}>
          Questions about these terms? Email{" "}
          <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
        </p>
      </LegalPage>

      <JsonLd graph={jsonLdGraph(breadcrumbJsonLd(TRAIL))} />
    </>
  );
}
