// Offline unit checks for the Stripe billing core (File 14).
//
// WHY: the LIVE Stripe webhook test is deferred (no tunnel / keys yet), so per the
// build file we unit-test the security + money-critical logic: signature verification
// (real round-trip via the SDK's test-header helper), grant extraction (only paid,
// only our own metadata, pack-catalogue amount — never a tampered amount), and the
// CREDIT_COSTS grounding (no action runs below its worst-case external cost). Run:
//   node --experimental-strip-types scripts/test-billing.ts
import Stripe from 'stripe';
import {
  extractGrant,
  isGrantingEvent,
  checkoutMetadata,
} from '../packages/server/src/stripe/stripe.util.ts';
import {
  CREDIT_COSTS,
  CREDIT_PACKS,
  CREDIT_USD_CENTS,
  findCreditPack,
} from '@extrovertai/shared';

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

// --- CREDIT_COSTS grounding: no action runs at a loss vs worst-case external cost ---
console.log('Pricing grounding:');
// Worst-case external cost per action, in USD cents (documented in constants/index.ts).
const WORST_CASE_CENTS: Record<string, number> = { search: 4, enrichment: 6, draft: 1, send: 0 };
// The CHEAPEST per-credit price across all packs (bulk packs give a bonus).
const minPerCreditCents = Math.min(...CREDIT_PACKS.map((p) => p.priceUsdCents / p.credits));
check('at least one credit pack exists', CREDIT_PACKS.length > 0);
check('min per-credit price stays at/above ~7c', minPerCreditCents >= 7);
check('anchor is 10c/credit', CREDIT_USD_CENTS === 10);
for (const action of Object.keys(CREDIT_COSTS) as (keyof typeof CREDIT_COSTS)[]) {
  const revenueCents = CREDIT_COSTS[action] * minPerCreditCents;
  check(
    `${action}: ${CREDIT_COSTS[action]}cr revenue (${revenueCents.toFixed(1)}c) covers worst-case ${WORST_CASE_CENTS[action]}c`,
    revenueCents >= WORST_CASE_CENTS[action],
  );
}
check('every pack price is a positive integer (Stripe cents)', CREDIT_PACKS.every((p) => Number.isInteger(p.priceUsdCents) && p.priceUsdCents > 0));
check('findCreditPack resolves a known id', findCreditPack('starter')?.credits === 100);
check('findCreditPack returns undefined for junk', findCreditPack('nope') === undefined);

// --- Grant extraction ---
console.log('Grant extraction:');
const starter = findCreditPack('starter')!;
const paidSession = {
  id: 'evt_1',
  type: 'checkout.session.completed',
  data: {
    object: {
      payment_status: 'paid',
      client_reference_id: 'user-123',
      metadata: checkoutMetadata('user-123', 'starter'),
    },
  },
};
const g = extractGrant(paidSession);
check('grants on paid checkout.session.completed', g?.userId === 'user-123' && g?.credits === starter.credits);
check('grant amount comes from the pack catalogue', g?.credits === 100 && g?.packId === 'starter');

// Tampered metadata amount must NOT over-credit — pack catalogue is authoritative.
const tampered = {
  id: 'evt_2',
  type: 'checkout.session.completed',
  data: {
    object: {
      payment_status: 'paid',
      client_reference_id: 'user-123',
      metadata: { userId: 'user-123', packId: 'starter', credits: '999999' },
    },
  },
};
check('tampered metadata credits ignored (pack wins)', extractGrant(tampered)?.credits === 100);

check(
  'unpaid checkout session does NOT grant',
  extractGrant({ id: 'e', type: 'checkout.session.completed', data: { object: { payment_status: 'unpaid', client_reference_id: 'u', metadata: checkoutMetadata('u', 'starter') } } }) === null,
);
check(
  'missing user → no grant',
  extractGrant({ id: 'e', type: 'checkout.session.completed', data: { object: { payment_status: 'paid', metadata: {} } } }) === null,
);
check('non-granting event type ignored', extractGrant({ id: 'e', type: 'customer.created', data: { object: {} } }) === null);
check('isGrantingEvent true for checkout.session.completed', isGrantingEvent('checkout.session.completed'));
check('isGrantingEvent false for random type', !isGrantingEvent('payment_intent.created'));

// --- Real Stripe signature round-trip (validates our constructEvent approach) ---
console.log('Signature verification (real Stripe SDK):');
const SECRET = 'whsec_test_secret_123';
const stripe = new Stripe('sk_test_dummy'); // no network — constructEvent is local crypto
const payload = JSON.stringify({ id: 'evt_sig', type: 'checkout.session.completed', data: { object: {} } });
const header = stripe.webhooks.generateTestHeaderString({ payload, secret: SECRET });

check('valid signature verifies', (() => {
  try { stripe.webhooks.constructEvent(payload, header, SECRET); return true; } catch { return false; }
})());
check('tampered payload rejected', (() => {
  try { stripe.webhooks.constructEvent(payload + ' ', header, SECRET); return false; } catch { return true; }
})());
check('wrong secret rejected', (() => {
  try { stripe.webhooks.constructEvent(payload, header, 'whsec_wrong'); return false; } catch { return true; }
})());
check('empty signature rejected', (() => {
  try { stripe.webhooks.constructEvent(payload, '', SECRET); return false; } catch { return true; }
})());

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
