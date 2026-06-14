// Offline unit checks for the Cal.com webhook core (File 13).
//
// WHY: the LIVE webhook test is deferred (no public tunnel / CALCOM_WEBHOOK_SECRET yet),
// so per the build file we unit-test the security-critical, pure logic here: signature
// verification (accept valid, reject unsigned/tampered/wrong-secret) and payload parsing
// (extract uid/organizer/attendees/trigger; tolerate junk). Run with Node 24 type
// stripping — no test framework, no DB, no Nest:
//   node --experimental-strip-types scripts/test-booking.ts
import { createHmac } from 'node:crypto';
import { verifyCalSignature, parseCalWebhook } from '../packages/server/src/booking/booking.util.ts';

let passed = 0;
let failed = 0;
function check(name: string, cond: boolean): void {
  if (cond) {
    passed++;
    console.log(`  ok   ${name}`);
  } else {
    failed++;
    console.error(`  FAIL ${name}`);
  }
}

const SECRET = 'test_webhook_secret_value';
const sign = (body: string, secret = SECRET): string =>
  createHmac('sha256', secret).update(body, 'utf8').digest('hex');

// --- Signature verification ---
console.log('Signature verification:');
const createdBody = JSON.stringify({
  triggerEvent: 'BOOKING_CREATED',
  payload: {
    uid: 'bk_abc123',
    title: 'Intro call',
    startTime: '2026-06-20T15:00:00Z',
    organizer: { email: 'Host@Example.com' },
    attendees: [{ email: 'Lead@Acme.io' }, { email: 'dup@acme.io' }, { email: 'dup@acme.io' }],
  },
});

check('valid signature accepted', verifyCalSignature(createdBody, sign(createdBody), SECRET) === true);
check(
  'uppercase-hex signature still accepted (case-insensitive)',
  verifyCalSignature(createdBody, sign(createdBody).toUpperCase(), SECRET) === true,
);
check('missing signature rejected', verifyCalSignature(createdBody, undefined, SECRET) === false);
check('empty signature rejected', verifyCalSignature(createdBody, '', SECRET) === false);
check(
  'tampered body rejected',
  verifyCalSignature(createdBody + ' ', sign(createdBody), SECRET) === false,
);
check(
  'wrong secret rejected',
  verifyCalSignature(createdBody, sign(createdBody, 'other_secret'), SECRET) === false,
);
check('missing server secret rejects', verifyCalSignature(createdBody, sign(createdBody), '') === false);
check(
  'garbage signature of right length rejected',
  verifyCalSignature(createdBody, 'a'.repeat(64), SECRET) === false,
);

// --- Payload parsing ---
console.log('Payload parsing:');
const created = parseCalWebhook(JSON.parse(createdBody));
check('parses created trigger', created?.trigger === 'BOOKING_CREATED');
check('extracts uid (idempotency key)', created?.uid === 'bk_abc123');
check('lowercases organizer email', created?.organizerEmail === 'host@example.com');
check('lowercases + dedupes attendees', JSON.stringify(created?.attendeeEmails) === JSON.stringify(['lead@acme.io', 'dup@acme.io']));
check('extracts title + startTime', created?.title === 'Intro call' && created?.startTime === '2026-06-20T15:00:00Z');

// Unknown / reschedule / cancel triggers parse without throwing (handled = ignore upstream).
const cancelled = parseCalWebhook({ triggerEvent: 'BOOKING_CANCELLED', payload: { uid: 'bk_abc123' } });
check('parses cancel trigger', cancelled?.trigger === 'BOOKING_CANCELLED');
const weird = parseCalWebhook({ triggerEvent: 'SOMETHING_NEW', payload: {} });
check('unknown trigger carried through (no throw)', weird?.trigger === 'SOMETHING_NEW');

// Defensive: junk inputs return null rather than throwing.
check('null input → null', parseCalWebhook(null) === null);
check('string input → null', parseCalWebhook('nope') === null);
check('no trigger → null', parseCalWebhook({ payload: {} }) === null);
check('missing organizer/attendees tolerated', (() => {
  const p = parseCalWebhook({ triggerEvent: 'BOOKING_CREATED', payload: { uid: 'x' } });
  return p?.organizerEmail === null && Array.isArray(p?.attendeeEmails) && p?.attendeeEmails.length === 0;
})());

// --- Idempotency key derivation (uid + trigger) is stable + distinguishes triggers ---
console.log('Idempotency key:');
const key = (p: { uid: string | null; trigger: string }): string => `${p.uid}|${p.trigger}`;
check(
  'same created event → same key (deduped)',
  key(parseCalWebhook(JSON.parse(createdBody))!) === key(parseCalWebhook(JSON.parse(createdBody))!),
);
check(
  'created vs cancelled of same booking → different keys (distinct rows)',
  key(parseCalWebhook(JSON.parse(createdBody))!) !== key(cancelled!),
);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
