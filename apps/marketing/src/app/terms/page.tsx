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
} from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The rules for using ${SERVICE_NAME}: accounts, credits, acceptable outreach, deliverability, liability, and how to end the relationship.`,
  alternates: { canonical: '/terms' },
};

const TOC: LegalTocEntry[] = [
  { id: 'agreement', label: 'Agreement' },
  { id: 'service', label: 'The service' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'account', label: 'Your account' },
  { id: 'acceptable-use', label: 'Acceptable use' },
  { id: 'anti-spam', label: 'Anti-spam and compliance' },
  { id: 'credits', label: 'Credits, billing, refunds' },
  { id: 'third-parties', label: 'Third-party services' },
  { id: 'your-content', label: 'Your content' },
  { id: 'our-ip', label: 'Our intellectual property' },
  { id: 'confidentiality', label: 'Confidentiality' },
  { id: 'warranties', label: 'Warranties and disclaimers' },
  { id: 'liability', label: 'Limitation of liability' },
  { id: 'indemnity', label: 'Indemnification' },
  { id: 'termination', label: 'Termination' },
  { id: 'law', label: 'Governing law and disputes' },
  { id: 'changes', label: 'Changes to these terms' },
  { id: 'contact', label: 'Contact' },
];

export default function TermsPage() {
  return (
    <LegalDoc
      eyebrow="Legal"
      title="Terms of Service"
      effectiveDate={EFFECTIVE_DATE}
      lastUpdated={LAST_UPDATED}
      toc={TOC}
      lead={
        <p>
          These Terms are the agreement between you and {LEGAL_ENTITY} when you use{' '}
          {SERVICE_NAME}. They cover who can use the service, what you can do with it,
          how billing works, what we promise, and what happens when things go wrong.
          Please read them carefully.
        </p>
      }
    >
      <h2 id="agreement">1. Agreement</h2>
      <p>
        By creating an account or otherwise using {SERVICE_NAME} you agree to these Terms
        and to our{' '}
        <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use the
        service. If you are agreeing on behalf of a company, you represent that you have
        authority to bind that company to these Terms.
      </p>

      <h2 id="service">2. The service</h2>
      <p>
        {SERVICE_NAME} is an AI sales prospecting tool. It helps you discover local
        businesses that match a market you define, researches each one from public
        sources, drafts personalized outreach in your voice, sends the messages you
        approve from your own connected mailbox, and helps you turn replies into
        conversations. The exact set of features may change over time as we improve the
        product.
      </p>

      <h2 id="eligibility">3. Eligibility</h2>
      <p>
        You must be at least 16 years old and legally able to enter into a contract to
        use the service. If your country restricts business email or requires a
        professional licence to run outbound campaigns, it is your responsibility to
        comply.
      </p>

      <h2 id="account">4. Your account</h2>
      <p>
        You are responsible for the security of your account, for the truthfulness of
        the information in it, and for everything that happens under it. Notify us
        promptly at <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a> if you
        suspect unauthorized access. You may not share accounts across people; ask us
        about team access instead.
      </p>

      <h2 id="acceptable-use">5. Acceptable use</h2>
      <p>You agree not to use the service to:</p>
      <ul>
        <li>Send messages that are illegal, deceptive, misleading, or harassing.</li>
        <li>Impersonate any person or organization.</li>
        <li>Send messages on behalf of another company without its written permission.</li>
        <li>
          Reach out to consumers about regulated products (financial advice, medical
          claims, adult content, firearms, gambling, cryptocurrency solicitations, and
          similar) unless you hold the licences and disclosures the target jurisdiction
          requires.
        </li>
        <li>Scrape or attempt to reverse-engineer the service or its APIs.</li>
        <li>
          Circumvent the credit system, the send caps, the compliance guardrails, or the
          suppression list.
        </li>
        <li>Upload malware, run automated attacks, or otherwise attempt to harm the service.</li>
        <li>Resell the service, or use it to build a competing product.</li>
      </ul>
      <p>
        We reserve the right to investigate suspected violations and to suspend or
        terminate accounts that break these rules.
      </p>

      <h2 id="anti-spam">6. Anti-spam and compliance</h2>
      <p>
        Cold outreach is legal in most jurisdictions when the recipient is a business
        contact, the sender identifies themselves honestly, the message is relevant to
        the recipient, and unsubscribing is easy and immediate. The service is built to
        support that standard by default. In particular:
      </p>
      <ul>
        <li>
          <strong>CAN-SPAM (US).</strong> Every message carries your business name and
          physical mailing address and a working unsubscribe link that suppresses the
          contact immediately.
        </li>
        <li>
          <strong>PECR and UK GDPR (UK).</strong> Sending to business email addresses of
          sole traders and partnerships requires consent or a soft opt-in and honors any
          objection instantly.
        </li>
        <li>
          <strong>GDPR (EU).</strong> Where the recipient is an identifiable natural
          person you rely on legitimate interests, keep the outreach relevant and
          professional, and honor objections. You are the controller for the outreach
          you send.
        </li>
        <li>
          <strong>CASL (Canada), Spam Act (Australia), and equivalents.</strong> You are
          responsible for meeting the requirements of your target country.
        </li>
      </ul>
      <p>
        You are the sender of the messages you approve. You are responsible for
        complying with the laws that apply to those messages and to the businesses you
        contact. We provide the compliance mechanics; you provide judgment.
      </p>

      <h2 id="credits">7. Credits, billing, refunds</h2>
      <p>
        {SERVICE_NAME} is pay-as-you-go. Each new account receives a small allotment of
        free credits. Additional credits are purchased in packs. Credits are consumed
        only when the service actually performs work on your behalf (for example running
        a search, researching a lead, drafting a message, or sending a message). If work
        fails for a transient reason the credit is refunded automatically.
      </p>
      <ul>
        <li>
          Credit-pack purchases are handled by Stripe. All prices are stated in USD
          unless otherwise indicated at checkout.
        </li>
        <li>
          Credits are non-transferable and have no cash value. They do not expire while
          your account is active.
        </li>
        <li>
          Purchases are non-refundable except where required by law. If a pack was
          purchased in error or a service defect prevented delivery of the credits, email{' '}
          <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a> within 14 days and
          we will make it right.
        </li>
        <li>
          Chargebacks or reversals may result in immediate suspension of the account
          until the dispute is resolved.
        </li>
        <li>Taxes, where applicable, are your responsibility.</li>
      </ul>

      <h2 id="third-parties">8. Third-party services</h2>
      <p>
        The service relies on your Gmail or Outlook account for sending and reading
        message threads you have started. Your use of those mailboxes is subject to the
        provider&rsquo;s own terms, and their rate limits and policies apply. Google API
        Services User Data Policy and Microsoft Graph Terms apply where relevant.
      </p>
      <p>
        Optional integrations (for example Cal.com booking) are governed by their own
        terms and privacy notices; see the{' '}
        <Link href="/privacy">Privacy Policy</Link> for the full list of subprocessors.
      </p>

      <h2 id="your-content">9. Your content</h2>
      <p>
        You retain ownership of the information you provide (your company profile, your
        lead lists, the drafts you edit and approve, and the replies received in your
        mailbox). You grant us a limited licence to process that information as
        necessary to provide the service. We will not sell it, and we will not use it to
        train third-party foundation models.
      </p>

      <h2 id="our-ip">10. Our intellectual property</h2>
      <p>
        The {SERVICE_NAME} name, marks, site, software, models, and documentation are
        owned by {LEGAL_ENTITY} and its licensors. You receive a limited, revocable,
        non-transferable licence to use the service in accordance with these Terms.
        Nothing in these Terms grants you any other right to our intellectual property.
      </p>

      <h2 id="confidentiality">11. Confidentiality</h2>
      <p>
        Non-public information one party shares with the other in the course of using
        the service is confidential. Each party will use it only to perform under these
        Terms and will protect it with reasonable care. This section does not apply to
        information that is already public, was independently developed, or must be
        disclosed by law.
      </p>

      <h2 id="warranties">12. Warranties and disclaimers</h2>
      <p>
        We work hard to make the service reliable, but the service is provided{' '}
        &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the maximum extent
        permitted by law, we disclaim all warranties, express or implied, including
        merchantability, fitness for a particular purpose, and non-infringement. We do
        not warrant that any specific message will reach the inbox, that any specific
        recipient will reply, that any specific lead will convert, or that the service
        will be uninterrupted or error-free.
      </p>

      <h2 id="liability">13. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, neither party is liable to the other
        for indirect, incidental, special, consequential, exemplary, or punitive
        damages, or for loss of profits, revenue, goodwill, or data. Our total
        liability for any claim arising out of or relating to these Terms is limited to
        the greater of one hundred US dollars or the amount you paid us in the twelve
        months before the event giving rise to the claim.
      </p>
      <p>
        Nothing in these Terms limits liability for gross negligence, fraud, wilful
        misconduct, or anything else that cannot lawfully be limited.
      </p>

      <h2 id="indemnity">14. Indemnification</h2>
      <p>
        You will defend and indemnify us against claims, damages, and reasonable costs
        (including legal fees) arising out of your outreach content, your use of the
        service in violation of these Terms, or your violation of any applicable law or
        third-party right. We will notify you of the claim, allow you to control the
        defence, and cooperate reasonably.
      </p>

      <h2 id="termination">15. Termination</h2>
      <p>
        You may stop using the service and delete your account at any time from the app.
        We may suspend or terminate your account for a material breach of these Terms
        (including sending outreach that violates{' '}
        <a href="#acceptable-use">Section 5</a> or{' '}
        <a href="#anti-spam">Section 6</a>), for non-payment, or if required by law. On
        termination the licences granted here end and, subject to the retention rules in
        the <Link href="/privacy">Privacy Policy</Link>, your data is deleted or
        returned to you.
      </p>

      <h2 id="law">16. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of {LEGAL_JURISDICTION}, without regard to
        conflict-of-laws principles. The parties submit to the exclusive jurisdiction of
        the courts located there for any dispute not resolved informally. Before filing
        a formal claim, each party will attempt in good faith to resolve the dispute by
        writing to <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a> for at
        least thirty days.
      </p>

      <h2 id="changes">17. Changes to these terms</h2>
      <p>
        We may update these Terms as the product and the law evolve. When we make a
        material change we will update the effective date at the top and, where the
        change materially affects your rights, notify you in-app or by email before it
        takes effect. Your continued use of the service after that date means you accept
        the updated Terms.
      </p>

      <h2 id="contact">18. Contact</h2>
      <p>
        Questions about these Terms:{' '}
        <a href={`mailto:${PRIVACY_CONTACT}`}>{PRIVACY_CONTACT}</a>. Postal address:{' '}
        {LEGAL_ENTITY}, {LEGAL_ADDRESS}.
      </p>
    </LegalDoc>
  );
}
