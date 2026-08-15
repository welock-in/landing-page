
import { LegalPage } from "@/components/layout/LegalPage";
import { LocaleLink } from "@/components/ui/LocaleLink";
import { metadataFor, type LangParams } from "@/i18n/metadata";
import legal from "@/components/layout/LegalPage.module.css";

// The policy promises below that this date moves whenever the text does.
// Last move: named Lemon Squeezy as the desktop payment processor.
const UPDATED = "15 August 2026";
const CONTACT = "hello@welock.in";

export function generateMetadata({ params }: LangParams) {
  return metadataFor(params, (d) => ({
    ...d.pages.privacy.meta,
    path: "/privacy",
  }));
}

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy Policy" updated={UPDATED}>
      <p>
        Welockin helps you block distracting apps and websites during focus
        sessions. This policy explains what data the Welockin apps (Android, iOS,
        macOS and Windows) and this website collect, how it is used, and the
        choices you have. We keep it plain: <strong>we do not sell your data, we
        do not run advertising, and the sites you browse never leave your
        device.</strong>
      </p>

      <div className={legal.callout}>
        <p>
          <strong>The short version.</strong> We store your email and the
          blocklists and focus history tied to your account so they sync across
          your devices. The distraction blocking itself runs entirely on your
          phone — Welockin never sees or records the websites you visit. You can{" "}
          <LocaleLink href="/delete-account">delete your account and all its data</LocaleLink> at
          any time.
        </p>
      </div>

      <h2>Who we are</h2>
      <p>
        Welockin (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the data controller for
        the personal data described here. For any privacy question or request,
        contact us at <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>

      <h2>Data we collect</h2>
      <p>
        We collect only what the product needs to work. Specifically:
      </p>
      <div className={legal.tableWrap}>
        <table className={legal.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Why we collect it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Email address</strong>
              </td>
              <td>
                Your account identifier and the address we use to reach you
                about your account.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Password</strong>
              </td>
              <td>
                To sign you in. It is stored only as a salted one-way hash — we
                never store or see your actual password.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Device identifier &amp; name</strong>
              </td>
              <td>
                A random ID generated on your device (for example{" "}
                <code>android-…</code>), plus a device label and platform, so
                your account can list your devices and keep them in sync. It is
                not your phone&rsquo;s hardware ID or advertising ID.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Blocklists</strong>
              </td>
              <td>
                The names of the blocklists you create and the apps and websites
                you choose to block, so the same setup follows you across your
                devices.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Focus session history</strong>
              </td>
              <td>
                For each session: a label, start and end time, planned duration,
                whether you completed it, and whether it was a hard lock. This
                powers your streaks and stats.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>What stays on your device and is never sent to us</h2>
      <p>
        The blocking engine is fully local. In particular:
      </p>
      <ul>
        <li>
          <strong>Your browsing.</strong> During a session, Welockin runs an
          on-device VPN that acts as a local DNS filter: it simply refuses to
          resolve the domains on your blocklist. Your web traffic is{" "}
          <strong>not</strong> routed through our servers. We do not see, log or
          store the websites you visit or the content of any traffic.
        </li>
        <li>
          <strong>Your installed apps and app usage.</strong> To show the block
          screen when you open a blocked app, Welockin reads which app is
          currently in the foreground (Android&rsquo;s Usage Access). This check
          happens entirely on your device — the list of your installed apps and
          your usage is never uploaded.
        </li>
      </ul>

      <h2>Analytics on this website</h2>
      <p>
        Everything above is about the Welockin apps. This section is about
        welock.in, the website you are reading — they are separate, and it is
        worth being exact about which is which.
      </p>
      <p>
        We use <a href="https://posthog.com" rel="nofollow noopener" target="_blank">PostHog</a>{" "}
        to understand how people find and use this site, so we know which pages
        are worth improving. It records the pages you open here, the language
        you read them in, the buttons and links you interact with, and technical
        details your browser sends anyway — device type, browser, referring
        page, and an approximate location derived from your IP address.
      </p>
      <p>
        To recognise you as the same visitor between pages and on a later visit,
        PostHog stores an identifier on your device, in a cookie and in local
        storage, named{" "}
        <code>ph_&lt;project&gt;_posthog</code>. It contains a random id, not
        your name or email. We do not show a cookie banner. Deleting the cookie
        and local storage for this site removes the identifier, and a browser
        extension that blocks analytics will stop the collection entirely —
        neither affects anything else on the site.
      </p>
      <p>
        <strong>
          None of this touches the blocking engine or your browsing outside this
          website.
        </strong>{" "}
        Analytics here sees the pages of welock.in you visit, in the same way any
        website can see its own traffic. It cannot see the sites you visit
        elsewhere, and it is not connected to your blocklists or your focus
        sessions — those remain as described above.
      </p>
      <p>
        PostHog processes this data on infrastructure in the United States. If
        you are in the EEA or the UK, that is an international transfer; see{" "}
        <a href="#international-transfers">International transfers</a> below.
      </p>

      <h2>Permissions and why Welockin needs them</h2>
      <p>
        Android asks you to grant the sensitive permissions below. Each one maps
        to a specific feature:
      </p>
      <div className={legal.tableWrap}>
        <table className={legal.table}>
          <thead>
            <tr>
              <th>Permission</th>
              <th>What it is used for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>VPN service</strong>
              </td>
              <td>
                Runs the on-device DNS filter that blocks websites during a
                session. No traffic leaves your device through us.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Usage Access</strong>
              </td>
              <td>
                Detects the app in the foreground so a blocked app can be
                covered by the block screen. Read on-device only.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Display over other apps</strong>
              </td>
              <td>Shows the full-screen block screen over a blocked app.</td>
            </tr>
            <tr>
              <td>
                <strong>Foreground service (special use)</strong>
              </td>
              <td>
                Keeps the filter alive for the whole session, with an ongoing
                notification so you always know it is running.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Notifications</strong>
              </td>
              <td>Shows the ongoing-session notification and session updates.</td>
            </tr>
            <tr>
              <td>
                <strong>Run at startup</strong>
              </td>
              <td>
                Resumes a still-running locked session after a reboot, so a
                session can&rsquo;t be escaped by restarting the phone.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Network access</strong>
              </td>
              <td>Signs you in and syncs your account.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>How we use your data</h2>
      <ul>
        <li>To create and secure your account and sign you in.</li>
        <li>
          To sync your blocklists and focus history across your devices.
        </li>
        <li>To show your streaks, stats and session history.</li>
        <li>
          To operate, maintain and improve the service and to respond to your
          support requests.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> use your data for advertising, and we do not
        build advertising profiles about you.
      </p>

      <h2>Sharing</h2>
      <p>
        We do not sell your personal data and we do not share it with data
        brokers or advertisers. We use a small number of service providers
        strictly to run Welockin — for example cloud hosting and database
        infrastructure for our backend at{" "}
        <code>app.connect.welock.in</code>. They process data only on our
        instructions. We may also disclose data if required by law or to protect
        our rights and users.
      </p>

      <h2>Third-party stores &amp; payments</h2>
      <p>
        On Windows and macOS, purchases are processed by Lemon Squeezy as
        merchant of record; on iPhone and iPad they are handled by the Apple
        App Store. Welockin never receives or stores your card number. Both
        process the payment under their own privacy policies.
      </p>

      <h2>Retention &amp; deletion</h2>
      <p>
        We keep your account data for as long as your account exists. You can
        delete your account and all associated data at any time — in the app
        (<strong>Profile → Delete account</strong>) or from{" "}
        <LocaleLink href="/delete-account">welock.in/delete-account</LocaleLink>. Deletion is
        permanent. See that page for exactly what is removed and how long it
        takes.
      </p>

      <h2>Security</h2>
      <p>
        Data is encrypted in transit (HTTPS). Passwords are stored only as
        salted hashes, and your login token is kept in your device&rsquo;s
        secure storage (Android Keystore / iOS Keychain). No system is perfectly
        secure, but we work to protect your data with industry-standard
        measures.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live (for example under the GDPR or CCPA), you may
        have the right to access, correct, export or delete your personal data,
        and to object to or restrict certain processing. You can exercise most of
        these directly in the app, or by emailing{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. We will not discriminate
        against you for exercising these rights.
      </p>

      <h2>Children</h2>
      <p>
        Welockin is not directed to children under 13 (or under 16 in the EEA/UK),
        and we do not knowingly collect data from them. If you believe a child
        has provided us data, contact us and we will delete it.
      </p>

      <h2 id="international-transfers">International transfers</h2>
      <p>
        Your data may be processed in countries other than your own, including
        where our infrastructure providers operate. In particular, the website
        analytics described above are processed by PostHog in the United States.
        Where required, we rely on appropriate safeguards for such transfers.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we do, we&rsquo;ll
        revise the &ldquo;Last updated&rdquo; date above and, for material
        changes, provide additional notice.
      </p>

      <p className={legal.contact}>
        Questions or requests? Email{" "}
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>
    </LegalPage>
  );
}
