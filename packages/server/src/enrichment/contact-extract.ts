// contact-extract — pure functions to pull + rank emails and phones from site text.
//
// WHY: contact extraction is the riskiest "could fabricate" step (master-context
// §7: never invent a contact). Keeping it as small, pure, testable functions makes
// the ranking rules explicit and auditable. NOTHING here invents data — it only
// finds, filters, and orders what actually appears in the page text.

/** A ranked set of emails: the single best pick plus de-duplicated alternates. */
export interface RankedEmails {
  best: string | null;
  alternates: string[];
}

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

// Local-parts that are generic mailboxes — usable for cold outreach but a person/
// role address is preferred when one exists.
const GENERIC_PREFIXES = new Set([
  'info',
  'contact',
  'hello',
  'hi',
  'support',
  'sales',
  'admin',
  'office',
  'team',
  'mail',
  'enquiry',
  'enquiries',
  'inquiries',
  'help',
  'booking',
  'bookings',
  'reservations',
  'reception',
  'accounts',
  'billing',
]);

// Local-parts we never surface as the "best" email — auto/transactional senders.
const NOREPLY_PREFIXES = ['noreply', 'no-reply', 'donotreply', 'do-not-reply', 'no_reply'];

// Image/asset traps and placeholder domains that masquerade as emails.
const IMAGE_EXT_RE = /\.(png|jpe?g|gif|webp|svg|ico|bmp|tiff?)$/i;
const PLACEHOLDER_DOMAINS = new Set([
  'example.com',
  'example.org',
  'domain.com',
  'yourdomain.com',
  'email.com',
  'sentry.io',
  'wix.com',
  'wixpress.com',
  'godaddy.com',
  'squarespace.com',
]);
const PLACEHOLDER_LOCALS = new Set(['you', 'youremail', 'your-email', 'name', 'email', 'username']);

/** Pull every plausible, non-trap email from raw page text (incl. mailto: links). */
export function extractEmails(text: string): string[] {
  if (!text) return [];
  const found = new Set<string>();
  const matches = text.match(EMAIL_RE) ?? [];
  for (const raw of matches) {
    const email = raw.toLowerCase().replace(/[.,;:)]+$/, '');
    if (isValidEmail(email)) found.add(email);
  }
  return [...found];
}

/** Pull plausible phone numbers from text (loose; validated by digit count). */
export function extractPhones(text: string): string[] {
  if (!text) return [];
  const found = new Set<string>();
  const matches = text.match(/\+?\(?\d[\d\s().-]{6,}\d/g) ?? [];
  for (const raw of matches) {
    const digits = raw.replace(/\D/g, '');
    // Plausible international/national range; avoids years, prices, IDs.
    if (digits.length >= 7 && digits.length <= 15) found.add(raw.trim().replace(/\s+/g, ' '));
  }
  return [...found];
}

/**
 * Rank emails best-first. Preference: site-domain match > person/role address >
 * generic mailbox. `noreply`-style addresses are never the "best" pick (kept as
 * alternates only). De-prioritized/invalid addresses never become `best`.
 */
export function rankEmails(emails: string[], siteUrl: string | null): RankedEmails {
  const unique = [...new Set(emails.map((e) => e.toLowerCase()))].filter(isValidEmail);
  if (unique.length === 0) return { best: null, alternates: [] };

  const siteDomain = registrableDomain(siteUrl);
  const scored = unique
    .map((email) => ({ email, score: scoreEmail(email, siteDomain), noreply: isNoreply(email) }))
    .sort((a, b) => b.score - a.score);

  // Best = highest-scoring non-noreply address; noreply stays an alternate only.
  const best = scored.find((s) => !s.noreply)?.email ?? null;
  const alternates = scored.map((s) => s.email).filter((e) => e !== best);
  return { best, alternates };
}

/** Pick the most plausible phone: prefer an already-known one, else the first found. */
export function pickPhone(known: string | null, fromSite: string[]): string | null {
  if (known && known.trim()) return known.trim();
  return fromSite[0] ?? null;
}

// --- internals ---

function isValidEmail(email: string): boolean {
  if (!email || email.length > 254 || email.includes(' ')) return false;
  if (IMAGE_EXT_RE.test(email)) return false;
  const [local, domain] = email.split('@');
  if (!local || !domain || !domain.includes('.')) return false;
  if (PLACEHOLDER_DOMAINS.has(domain)) return false;
  if (PLACEHOLDER_LOCALS.has(local)) return false;
  // Reject hash-like locals (tracking pixels) e.g. u003e or 32-char hex blobs.
  if (/^[0-9a-f]{16,}$/.test(local)) return false;
  return true;
}

function isNoreply(email: string): boolean {
  const local = email.split('@')[0] ?? '';
  return NOREPLY_PREFIXES.some((p) => local.startsWith(p));
}

function scoreEmail(email: string, siteDomain: string | null): number {
  const [local, domain] = email.split('@');
  let score = 0;
  if (siteDomain && domain.endsWith(siteDomain)) score += 4; // on-brand address
  if (isNoreply(email)) score -= 6;
  else if (GENERIC_PREFIXES.has(local)) score -= 2; // usable, but de-prioritized
  else score += 3; // looks like a person/role mailbox
  if (local.includes('.') || local.includes('-')) score += 1; // first.last style
  return score;
}

function registrableDomain(siteUrl: string | null): string | null {
  if (!siteUrl) return null;
  try {
    const host = new URL(siteUrl).hostname.replace(/^www\./, '').toLowerCase();
    const parts = host.split('.');
    return parts.length >= 2 ? parts.slice(-2).join('.') : host;
  } catch {
    return null;
  }
}
