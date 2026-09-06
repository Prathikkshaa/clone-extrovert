// SERVER component - quotable, self-contained product-truth facts (GEO). A <dl>
// grid where each item is an extractable value + label pair, derived from the
// shared constants where possible so the numbers stay true to the product. Kept
// deliberately plain so each stat reads as a standalone quotable fact.
import { Reveal } from '@/components/reveal';
import { FREE_SIGNUP_CREDITS, CREDIT_PACKS } from '@extrovertai/shared';

// Growth pack drives the "credits per pack" math; ~5 credits take one lead
// end-to-end (search + enrichment + draft + send across a 3-email sequence).
const growth = CREDIT_PACKS.find((p) => p.id === 'growth') ?? CREDIT_PACKS[0];
const CREDITS_PER_LEAD = 5;
const growthPriceUsd = Math.round(growth.priceUsdCents / 100);
const growthLeads = Math.round(growth.credits / CREDITS_PER_LEAD);

type Stat = { value: string; label: string };

const STATS: Stat[] = [
  {
    value: `${FREE_SIGNUP_CREDITS} credits`,
    label: 'Free to start, no card required',
  },
  {
    value: `~${CREDITS_PER_LEAD} credits`,
    label: 'Per lead end-to-end: find, write, follow up, send',
  },
  {
    value: `${growth.credits} credits ≈ ${growthLeads} leads`,
    label: `The $${growthPriceUsd} Growth pack, billed in USD`,
  },
  {
    value: '~30 emails/day',
    label: 'Per inbox to start, ramping up as it warms',
  },
  {
    value: '3-email sequence',
    label: 'One intro plus two follow-ups that auto-stop on a reply',
  },
  {
    value: '0 subscriptions',
    label: 'Pay-as-you-go credits that never expire while active',
  },
];

export function ByTheNumbers() {
  return (
    <section className="shell py-section-y">
      <Reveal className="max-w-prose">
        <p className="text-eyebrow uppercase text-accent">By the numbers</p>
        <h2 className="mt-3 text-display-md text-ink">The product in six facts.</h2>
        <p className="mt-4 text-body-lg text-muted">
          The numbers that matter, straight from the product - no subscription, no seats, and no
          surprises.
        </p>
      </Reveal>

      <dl className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {STATS.map((stat, i) => (
          <Reveal as="div" key={stat.label} delay={i * 0.06} className="border-t border-line pt-5">
            <dt className="text-heading-lg text-ink">{stat.value}</dt>
            <dd className="mt-2 text-body text-muted">{stat.label}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
