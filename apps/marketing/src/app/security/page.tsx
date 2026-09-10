import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalDoc, type LegalTocEntry } from '@/components/legal/legal-doc';
import {
  EFFECTIVE_DATE,
  LAST_UPDATED,
  PRIVACY_CONTACT,
  SERVICE_NAME,
  SUBPROCESSORS,
} from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Security',
  description: `How ${SERVICE_NAME} protects your mailbox, your data, and the people you contact. Concrete controls, not marketing.`,
  alternates: { canonical: '/security' },
};

const TOC: LegalTocEntry[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'mailbox', label: 'Your mailbox' },
  { id: 'data', label: 'Data protection' },
  { id: 'data-location', label: 'Where your data lives' },
  { id: 'deliverability', label: 'Deliverability and compliance' },
  { id: 'infrastructure', label: 'Infrastructure and access' },
  { id: 'subprocessors', label: 'Subprocessors' },
  { id: 'certifications', label: 'Certifications and audits' },
  { id: 'operations', label: 'Operations' },
  { id: 'disclosure', label: 'Vulnerability disclosure' },
  { id: 'contact', label: 'Contact' },
];

export default function SecurityPage() {
  return (
    <LegalDoc
      eyebrow="Trust"
      title="Security"
      effectiveDate={EFFECTIVE_DATE}
      lastUpdated={LAST_UPDATED}
      toc={TOC}
      lead={
        <p>
          {SERVICE_NAME} handles your inbox, your prospects, and the messages that go out
          under your name. Below is a plain description of the controls that keep those
          things safe. If something on this page is unclear or missing, please write to
          us; we&rsquo;d rather have the conversation than pretend the question does not
          exist.
        </p>
      }
    >
      <h2 id="summary">1. Summary</h2>
      <ul>
        <li>Encrypted transit and encrypted storage of your mailbox credentials.</li>
        <li>OAuth-only mailbox access. No password ever leaves Google or Microsoft.</li>
        <li>Row-level access controls that scope every read and write to your workspace.</li>
        <li>Signed, idempotent webhooks for payments and bookings.</li>
        <li>Send guardrails built in: warm-up, rate limits, bounce handling, suppression.</li>
        <li>Vendors with clear data-protection terms; a full subprocessor list below.</li>
      </ul>

      <h2 id="mailbox">2. Your mailbox</h2>
      <p>
        You connect Gmail or Outlook to {SERVICE_NAME} using the provider&rsquo;s official
        OAuth flow. We never see your password. The provider returns an access token and
        a refresh token that we store encrypted with{' '}
        <strong>AES-256-GCM</strong> before they touch the database. When a token
        expires we refresh it silently. When you disconnect the mailbox we revoke and
        delete the tokens; nothing lingers.
      </p>
      <p>
        We request the minimum scopes required to do the work:
      </p>
      <ul>
        <li>
          <strong>Send</strong> messages you have explicitly approved.
        </li>
        <li>
          <strong>Read replies</strong> to the threads {SERVICE_NAME} started, so we can
          detect a response, stop the follow-up sequence, and surface the reply in your
          inbox view.
        </li>
      </ul>
      <p>
        We do not read the rest of your inbox, we do not archive mail elsewhere, and we
        do not analyze mailbox content for advertising or third-party model training.
      </p>

      <h2 id="data">3. Data protection</h2>
      <p>Concrete controls that apply to every workspace:</p>
      <ul>
        <li>All traffic is served over TLS.</li>
        <li>
          Database access is scoped by <strong>row-level security</strong>. A read or a
          write that is not for the current workspace never leaves the database.
        </li>
        <li>
          Payment card details are handled by Stripe and never sent to our servers.
        </li>
        <li>
          Signed webhooks (payments, bookings) are verified for signature and
          idempotency before we accept them, so a replayed or forged request cannot
          affect your account.
        </li>
        <li>
          Secrets (API keys, encryption keys, database credentials) live in a managed
          secrets store, are rotated on a schedule, and are only injected into the
          services that need them.
        </li>
      </ul>
      <p>
        For collection, retention, rights, and international transfers, see the{' '}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2 id="data-location">4. Where your data lives</h2>
      <p>
        Application data (accounts, workspaces, drafts, sent messages, replies, and
        suppression lists) is stored in a managed Postgres database. Background jobs run
        through a managed Redis instance. Static assets are served from a global CDN. The
        specific region hosting your data is documented in the account settings; on
        request we will confirm the exact region for your account in writing. Subprocessor
        regions are listed under <a href="#subprocessors">Subprocessors</a>. Cross-border
        processing is governed by the safeguards in the{' '}
        <Link href="/privacy#transfers">Privacy Policy</Link>.
      </p>

      <h2 id="deliverability">5. Deliverability and compliance</h2>
      <p>
        Cold outreach fails in the spam folder. It also fails legally when it hides the
        sender or ignores the recipient. {SERVICE_NAME} treats both problems as security
        problems and defends against them by default:
      </p>
      <ul>
        <li>
          <strong>Warm-up ramp.</strong> A new mailbox starts small and grows over days,
          not minutes.
        </li>
        <li>
          <strong>Rate limits and jitter.</strong> One message at a time, with a
          natural, randomized interval between sends. No batch blast.
        </li>
        <li>
          <strong>Bounce handling.</strong> Bounces mark the address as suppressed and
          pause the campaign automatically.
        </li>
        <li>
          <strong>Reply detection.</strong> Follow-ups stop the moment someone replies.
        </li>
        <li>
          <strong>One-click unsubscribe.</strong> Every message carries a working
          unsubscribe token. Suppression is instant and account-wide.
        </li>
        <li>
          <strong>Physical address.</strong> Every message carries your business name
          and mailing address, meeting CAN-SPAM and equivalent requirements.
        </li>
      </ul>

      <h2 id="infrastructure">6. Infrastructure and access</h2>
      <ul>
        <li>The service runs on managed cloud infrastructure with hardened defaults.</li>
        <li>
          Production access is limited to a small, named group of maintainers, is
          two-factor protected, and is logged.
        </li>
        <li>Dependencies are patched on a routine cadence; critical fixes ship faster.</li>
        <li>
          Application, database, and job-queue errors are monitored and alerted so
          incidents surface quickly.
        </li>
      </ul>

      <h2 id="subprocessors">7. Subprocessors</h2>
      <p>
        We use a small set of vendors to run the service. Each is bound by data
        protection terms and receives only the data it needs. The current list:
      </p>
      <ul>
        {SUBPROCESSORS.map((s) => (
          <li key={s.name}>
            <strong>{s.name}.</strong> {s.purpose}{' '}
            <a href={s.link} target="_blank" rel="noopener noreferrer">
              Privacy notice
            </a>
            .
          </li>
        ))}
      </ul>

      <h2 id="certifications">8. Certifications and audits</h2>
      <p>
        Milo is an early-stage product built by a small team. We do not currently hold a
        SOC 2 report, an ISO 27001 certificate, or an equivalent third-party audit. What
        we do instead is publish the controls we actually run (this page), name every
        subprocessor, and offer a Data Processing Agreement to business customers who
        need one. If you have specific compliance requirements before you can adopt the
        product, please write to us at{' '}
        <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a> and we will tell you
        honestly what we can and cannot meet today, and where a certification sits on our
        roadmap.
      </p>

      <h2 id="operations">9. Operations</h2>
      <ul>
        <li>Backups run on a routine schedule and are restored on a test cadence.</li>
        <li>
          Incidents that materially affect customer data trigger a written postmortem
          and a customer notification, within the timelines required by applicable law.
        </li>
        <li>
          We are a small, deliberate team. We prefer fewer moving parts and boring
          technology to feature spam.
        </li>
      </ul>

      <h2 id="disclosure">10. Vulnerability disclosure</h2>
      <p>
        If you believe you have found a vulnerability, please email{' '}
        <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a> with a description,
        steps to reproduce, and the impact you observed. Please give us reasonable time
        to investigate and fix the issue before you make it public. We will acknowledge
        your report within three business days and keep you updated as we work through
        it.
      </p>
      <p>We ask that researchers:</p>
      <ul>
        <li>Do not access data that does not belong to them.</li>
        <li>Do not run denial-of-service tests or spam our recipients.</li>
        <li>Give us a reasonable window to remediate before disclosing publicly.</li>
      </ul>
      <p>
        Good-faith researchers who follow these rules will not be pursued under
        computer-misuse laws.
      </p>

      <h2 id="contact">11. Contact</h2>
      <p>
        Security questions: <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a>.
        For privacy and data-subject requests, see the{' '}
        <Link href="/privacy">Privacy Policy</Link>. For the rules that govern your use
        of the service, see the <Link href="/terms">Terms of Service</Link>.
      </p>
    </LegalDoc>
  );
}
