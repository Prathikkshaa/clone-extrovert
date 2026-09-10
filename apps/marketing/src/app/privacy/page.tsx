import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDoc, type LegalTocEntry } from '@/components/legal/legal-doc';
import {
  EFFECTIVE_DATE,
  LAST_UPDATED,
  LEGAL_ADDRESS,
  LEGAL_ENTITY,
  LEGAL_JURISDICTION,
  PRIVACY_CONTACT,
  SERVICE_NAME,
  SUBPROCESSORS,
} from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${SERVICE_NAME} collects, uses, and protects personal data. Written in plain language for the humans who read it.`,
  alternates: { canonical: '/privacy' },
};

const TOC: LegalTocEntry[] = [
  { id: 'who-we-are', label: 'Who we are' },
  { id: 'scope', label: 'Scope of this policy' },
  { id: 'what-we-collect', label: 'What we collect' },
  { id: 'how-we-use-it', label: 'How we use it' },
  { id: 'legal-bases', label: 'Legal bases (EU / UK)' },
  { id: 'sharing', label: 'Sharing and subprocessors' },
  { id: 'data-location', label: 'Where your data lives' },
  { id: 'retention', label: 'How long we keep it' },
  { id: 'security', label: 'How we secure it' },
  { id: 'your-rights', label: 'Your rights' },
  { id: 'transfers', label: 'International transfers' },
  { id: 'dpa', label: 'Data processing agreement' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'children', label: 'Children' },
  { id: 'changes', label: 'Changes to this policy' },
  { id: 'contact', label: 'Contact' },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Privacy Policy"
      effectiveDate={EFFECTIVE_DATE}
      lastUpdated={LAST_UPDATED}
      toc={TOC}
      lead={
        <p>
          {SERVICE_NAME} helps you find the businesses that need what you sell and reach out
          to them personally. To do that we handle some personal data. This policy explains
          exactly what we collect, why we collect it, who else touches it, how long we keep
          it, and the rights you have over it.
        </p>
      }
    >
      <h2 id="who-we-are">1. Who we are</h2>
      <p>
        The service known as {SERVICE_NAME} is operated by <strong>{LEGAL_ENTITY}</strong>,
        with a registered address at <strong>{LEGAL_ADDRESS}</strong>. In this policy
        &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; refer to that entity. For
        personal data covered by the EU or UK GDPR, we act as the data controller for the
        information you provide about yourself and as a data processor for the information
        you place in your workspace about your prospects.
      </p>
      <p>
        Questions or requests about privacy go to{' '}
        <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a>. We aim to respond within
        seven business days and always within the statutory response window.
      </p>

      <h2 id="scope">2. Scope of this policy</h2>
      <p>
        This policy covers the {SERVICE_NAME} marketing site, the {SERVICE_NAME} application,
        and the background services that make the product work (email sending, research,
        billing, and support). It does not cover third-party sites we link to or the
        internal email systems of the recipients of your outreach.
      </p>

      <h2 id="what-we-collect">3. What we collect</h2>
      <p>
        We collect the least amount of personal data we need to run the service. Concretely:
      </p>
      <h3>Account information</h3>
      <p>
        Your name, email address, and password hash (via our authentication provider). We
        never see or store your password in plain text.
      </p>
      <h3>Company profile</h3>
      <p>
        The information you enter or that we extract from your public website during
        onboarding: what you sell, your voice, your logo and accent color, and the physical
        address you place at the bottom of outbound email (required by CAN-SPAM and by
        most equivalent laws).
      </p>
      <h3>Mailbox credentials (OAuth)</h3>
      <p>
        When you connect Gmail or Outlook we receive OAuth access and refresh tokens from
        Google or Microsoft. We store them encrypted with AES-256-GCM at rest and use them
        only to send messages you have approved, read the threads you have started, and
        refresh access when a token expires. We never read your inbox at large. You can
        disconnect a mailbox at any time from the app, which revokes and deletes the
        tokens.
      </p>
      <h3>Prospect and lead data</h3>
      <p>
        Business names, categories, ratings, review excerpts, addresses, phone numbers, and
        publicly-listed contact emails discovered from public business directories and
        public business websites. This is business information anyone can look up. Where
        those records include a natural person&rsquo;s contact detail (for example the
        owner&rsquo;s public email), we treat it as personal data under the GDPR and honor
        the rights below.
      </p>
      <h3>Message content</h3>
      <p>
        The subject and body of every outbound email you draft, send, or receive through
        the service. We store it so you can review, edit, approve, and track replies.
        Replies fetched from your mailbox are stored in your workspace only.
      </p>
      <h3>Billing information</h3>
      <p>
        When you buy credits we receive the amount, the pack, the currency, and a Stripe
        customer identifier. Card numbers are never sent to us. Stripe processes and stores
        that information directly under its own privacy terms.
      </p>
      <h3>Usage and technical data</h3>
      <p>
        Pages viewed, actions taken, error reports, IP address, browser user agent, device
        type, and timestamps. We use this to diagnose problems, prevent abuse, and improve
        the product.
      </p>
      <h3>What we do not collect</h3>
      <ul>
        <li>We do not sell personal data.</li>
        <li>We do not use your prospects, drafts, or replies to train third-party models.</li>
        <li>We do not read messages in your mailbox outside the threads you have started.</li>
        <li>We do not run advertising trackers on the marketing site.</li>
      </ul>

      <h2 id="how-we-use-it">4. How we use it</h2>
      <p>We use personal data only for the following purposes:</p>
      <ul>
        <li>
          <strong>Deliver the service.</strong> Sign you in, run discovery, research
          prospects, draft messages, send messages from your mailbox, ingest replies, and
          keep an accurate account of the work performed.
        </li>
        <li>
          <strong>Meter and bill fairly.</strong> Track credit consumption per action so
          you only pay when work runs. Refund credits automatically on transient failures.
        </li>
        <li>
          <strong>Keep sending trusted.</strong> Enforce daily send caps, warm-up ramps,
          bounce handling, and suppression of unsubscribed addresses across your account.
        </li>
        <li>
          <strong>Support and communicate.</strong> Reply to your emails, send account
          notices, deliver receipts, and warn you when your balance is low.
        </li>
        <li>
          <strong>Protect the service.</strong> Detect abuse, secure the platform, and
          respond to legal requests where legally required.
        </li>
      </ul>

      <h2 id="legal-bases">5. Legal bases (EU and UK GDPR)</h2>
      <p>Where GDPR applies, we rely on the following bases:</p>
      <ul>
        <li>
          <strong>Contract.</strong> To provide the account, run the service, and bill you
          for it.
        </li>
        <li>
          <strong>Legitimate interests.</strong> To secure the platform, prevent fraud,
          maintain deliverability, and improve the product. Where we rely on legitimate
          interests we balance them against your rights and give you a way to object.
        </li>
        <li>
          <strong>Consent.</strong> Where the law requires it, for example non-essential
          cookies. You may withdraw consent at any time.
        </li>
        <li>
          <strong>Legal obligation.</strong> To comply with tax, accounting, anti-fraud,
          and lawful requests from authorities.
        </li>
      </ul>

      <h2 id="sharing">6. Sharing and subprocessors</h2>
      <p>
        We only share personal data with vendors who help us run the service, under written
        data protection terms. Each is limited to what it needs. The current list:
      </p>
      <ul>
        {SUBPROCESSORS.map((s) => (
          <li key={s.name}>
            <strong>{s.name}.</strong> {s.purpose} {s.region} See{' '}
            <a href={s.link} target="_blank" rel="noopener noreferrer">
              their privacy notice
            </a>
            .
          </li>
        ))}
      </ul>
      <p>
        We do not share personal data with anyone else, except as required by law, to
        protect the safety of a person, or as part of a business transfer where the buyer
        assumes this policy or a comparable one.
      </p>

      <h2 id="data-location">7. Where your data lives</h2>
      <p>
        Application data (accounts, workspaces, drafts, sent messages, replies,
        suppression lists) is stored in a managed Postgres database in an EU or US
        region depending on the project&rsquo;s configured location. Background jobs
        run through a managed Redis instance in the same region. Static assets and the
        marketing site are served from a global CDN. The specific region your account
        uses is documented in the account settings and can be shared on request.
      </p>
      <p>
        Third-party subprocessors process data in the regions listed in the previous
        section. Where a subprocessor operates globally (for example the AI model
        gateway or the payment processor), we rely on the contractual safeguards
        described under <a href="#transfers">International transfers</a>.
      </p>

      <h2 id="retention">8. How long we keep it</h2>
      <ul>
        <li>
          <strong>Account data</strong> lives while your account is active and for up to
          90 days after you delete it, unless a longer period is required by law.
        </li>
        <li>
          <strong>Workspace data</strong> (leads, drafts, sent messages, replies) is kept
          for as long as your account is active. On deletion we remove or anonymize it
          within 90 days.
        </li>
        <li>
          <strong>OAuth tokens</strong> are deleted immediately when you disconnect a
          mailbox or delete your account.
        </li>
        <li>
          <strong>Suppression lists</strong> (unsubscribes and bounces) are kept
          indefinitely at the account level so a deleted contact cannot be re-emailed if
          they later reappear in a search.
        </li>
        <li>
          <strong>Billing records</strong> are retained for the period required by
          applicable tax law, typically six to ten years.
        </li>
        <li>
          <strong>Backups</strong> may retain data for up to 35 days after deletion, after
          which they are overwritten.
        </li>
      </ul>

      <h2 id="security">9. How we secure it</h2>
      <p>
        Security is not a checkbox. The core controls we run today:
      </p>
      <ul>
        <li>All traffic to the marketing site and the application is served over TLS.</li>
        <li>
          Mailbox OAuth tokens are encrypted with AES-256-GCM at rest before they are
          written to the database.
        </li>
        <li>
          Postgres row-level security limits every read and write to the account that owns
          the row.
        </li>
        <li>
          Webhooks from payment and booking providers are verified with cryptographic
          signatures and idempotency keys before we accept them.
        </li>
        <li>
          Sensitive credentials live in a secrets manager. Access is limited to the
          services that need them, logged, and rotated on a schedule.
        </li>
        <li>
          We patch dependencies regularly and monitor errors so incidents surface fast.
        </li>
      </ul>
      <p>
        See our{' '}
        <Link href="/security">Security overview</Link> for a fuller picture. If you
        believe you have found a vulnerability, email{' '}
        <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a> with details and we
        will respond promptly.
      </p>

      <h2 id="your-rights">10. Your rights</h2>
      <p>Depending on where you live, you have some or all of the following rights:</p>
      <ul>
        <li>Access the personal data we hold about you.</li>
        <li>Correct data that is wrong.</li>
        <li>Delete your account and the personal data attached to it.</li>
        <li>Restrict or object to specific processing.</li>
        <li>Receive a portable copy of your data.</li>
        <li>Withdraw consent where consent is our legal basis.</li>
        <li>
          Lodge a complaint with your local data-protection authority (for example the ICO
          in the UK or your national DPA in the EU).
        </li>
      </ul>
      <p>
        To exercise any of these rights, email{' '}
        <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a>. We may need to verify
        your identity before we act on the request.
      </p>
      <p>
        <strong>California residents (CCPA / CPRA).</strong> You have the right to know
        what we collect, to delete it, and to opt out of sale or sharing. We do not sell
        personal information and we do not share it for cross-context behavioural
        advertising. You may still exercise the rights above by emailing us.
      </p>

      <h2 id="transfers">11. International transfers</h2>
      <p>
        Some of our subprocessors are based outside the EU or the UK. Where personal data
        is transferred out of the EEA or the UK we rely on the European Commission&rsquo;s
        Standard Contractual Clauses (and the UK International Data Transfer Addendum),
        together with additional safeguards where appropriate. We are willing to provide a
        copy of the relevant clauses on request.
      </p>

      <h2 id="dpa">12. Data processing agreement</h2>
      <p>
        If you are a business customer subject to GDPR, UK GDPR, or an equivalent framework,
        you are entitled to a Data Processing Agreement (DPA) with us that incorporates
        the current Standard Contractual Clauses and the UK International Data Transfer
        Addendum where relevant. Our DPA is available on request: email{' '}
        <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a> with your legal entity
        name and the account email, and we will send it for signature. Any material change
        to the DPA is notified in-app and by email in advance.
      </p>

      <h2 id="cookies">13. Cookies</h2>
      <p>
        The marketing site uses a minimal set of first-party cookies for session state and
        for measuring aggregate site usage. We do not run advertising trackers. The
        application uses cookies required to keep you signed in and to preserve your
        preferences.
      </p>

      <h2 id="children">14. Children</h2>
      <p>
        The service is a business tool. It is not directed at children under 16 and we do
        not knowingly collect personal data from them. If you believe a child has provided
        personal data, contact us and we will remove it.
      </p>

      <h2 id="changes">15. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. When we make a material change we
        will update the effective date at the top and, where the change materially affects
        you, notify you by email or in-app before it takes effect.
      </p>

      <h2 id="contact">16. Contact</h2>
      <p>
        Privacy questions or requests: <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a>.
        Postal address: {LEGAL_ENTITY}, {LEGAL_ADDRESS}.
      </p>
      <p>
        This policy is governed by the laws of {LEGAL_JURISDICTION}. See our{' '}
        <Link href="/terms">Terms of Service</Link> for the rules that apply to your use
        of the service.
      </p>
    </LegalDoc>
  );
}
