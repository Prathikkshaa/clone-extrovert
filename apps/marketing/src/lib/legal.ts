/**
 * Legal-entity constants used by /privacy and /terms.
 *
 * The prose in those pages describes the actual data processing behavior of the
 * product; the values here are the specifics (company name, mailing address,
 * effective date, jurisdiction) that must be confirmed with a lawyer and swapped
 * before public launch. Everything is wired to env vars so a deploy can inject
 * real values without a code change.
 *
 * DO NOT ship to production with the {{TODO ...}} placeholders visible. The
 * pages render the raw value so a reviewer can spot an unfilled slot at a glance.
 */
import { APP_NAME } from '@extrovertai/shared';
import { CONTACT_EMAIL } from './site';

/** Legal entity operating the service. */
export const LEGAL_ENTITY =
  process.env.NEXT_PUBLIC_LEGAL_ENTITY ?? 'Stallwart';

/**
 * Registered address, one line. Required by CAN-SPAM and by every real ToS.
 * Refine to the full street address before public launch via env override.
 */
export const LEGAL_ADDRESS =
  process.env.NEXT_PUBLIC_LEGAL_ADDRESS ?? 'Coimbatore, Tamil Nadu, India';

/** Governing law and jurisdiction for the Terms. */
export const LEGAL_JURISDICTION =
  process.env.NEXT_PUBLIC_LEGAL_JURISDICTION ?? 'the courts of Coimbatore, Tamil Nadu, India';

/** Privacy/DPO contact. Defaults to the same inbox as sales, override in prod. */
export const PRIVACY_CONTACT =
  process.env.NEXT_PUBLIC_PRIVACY_CONTACT ?? CONTACT_EMAIL;

/**
 * Effective / last-updated dates. Bumped on every material change. Kept as ISO
 * strings so a Date formatter can localize them; consumers use
 * `new Date(EFFECTIVE_DATE).toLocaleDateString(...)`.
 */
export const EFFECTIVE_DATE = process.env.NEXT_PUBLIC_LEGAL_EFFECTIVE_DATE ?? '2026-09-10';
export const LAST_UPDATED = process.env.NEXT_PUBLIC_LEGAL_LAST_UPDATED ?? '2026-09-10';

/** Product / service name used in the policies (single source). */
export const SERVICE_NAME = APP_NAME;

/**
 * Subprocessors we actually rely on to run the service. Reviewed and confirmed
 * against the backend build (see docs/PROGRESS.md). Any addition must be
 * reflected here AND in the Privacy Policy prose.
 */
export const SUBPROCESSORS = [
  {
    name: 'Supabase',
    purpose: 'Managed Postgres, authentication, row-level access controls.',
    region: 'EU or US region (per project configuration).',
    link: 'https://supabase.com/privacy',
  },
  {
    name: 'Google (Gmail API)',
    purpose: 'Sending outreach from your connected Gmail inbox.',
    region: 'Global.',
    link: 'https://policies.google.com/privacy',
  },
  {
    name: 'Public business directory data provider',
    purpose: 'Structured public information about local businesses (name, address, category, ratings) used for prospect discovery.',
    region: 'Global.',
    link: '/privacy',
  },
  {
    name: 'Microsoft (Outlook via Microsoft Graph)',
    purpose: 'Sending outreach from your connected Outlook inbox.',
    region: 'Global.',
    link: 'https://privacy.microsoft.com/privacystatement',
  },
  {
    name: 'Web content extraction service',
    purpose: 'Reading public business websites and your own site during onboarding to extract signals and enrich context.',
    region: 'US.',
    link: '/privacy',
  },
  {
    name: 'OpenRouter',
    purpose: 'Routing large-language-model calls for research summaries and email drafts.',
    region: 'US.',
    link: 'https://openrouter.ai/privacy',
  },
  {
    name: 'Stripe',
    purpose: 'Processing credit-pack purchases. Card data is handled by Stripe, not by us.',
    region: 'Global (see Stripe DPA).',
    link: 'https://stripe.com/privacy',
  },
  {
    name: 'Upstash',
    purpose: 'Managed Redis for background job queues and short-lived caching.',
    region: 'EU or US region.',
    link: 'https://upstash.com/trust/privacy.pdf',
  },
  {
    name: 'Resend',
    purpose: 'System email (account emails, password resets, receipts).',
    region: 'US and EU.',
    link: 'https://resend.com/legal/privacy-policy',
  },
  {
    name: 'Cal.com',
    purpose: 'Optional booking integration. Booking events reach us as a signed webhook when you enable it.',
    region: 'Global.',
    link: 'https://cal.com/privacy',
  },
  {
    name: 'Vercel',
    purpose: 'Hosting the marketing site and the application front end.',
    region: 'Global CDN.',
    link: 'https://vercel.com/legal/privacy-policy',
  },
] as const;

/** Formatted date for display in headers of legal pages. */
export function formatLegalDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
