// RFC 9116 security.txt. Static, cache-safe, refreshed on each build. Bump the
// LAST_UPDATED or EFFECTIVE_DATE in src/lib/legal.ts (or extend Expires below)
// well before the date printed here.
import { SITE_URL } from '@/lib/site';
import { PRIVACY_CONTACT } from '@/lib/legal';

export const dynamic = 'force-static';

function isoOneYearFromToday(): string {
  const d = new Date();
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return `${d.toISOString().replace(/\.\d{3}Z$/, 'Z')}`;
}

export function GET(): Response {
  const body = [
    `Contact: mailto:${PRIVACY_CONTACT}`,
    `Expires: ${isoOneYearFromToday()}`,
    'Preferred-Languages: en',
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    `Policy: ${SITE_URL}/security#disclosure`,
    '',
  ].join('\n');
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
