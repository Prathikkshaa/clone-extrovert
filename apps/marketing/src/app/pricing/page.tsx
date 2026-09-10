import type { Metadata } from 'next';
import { Reveal } from '@/components/reveal';
import { Faq } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';
import { FaqJsonLd } from '@/components/structured-data';
import { PRICING_FAQ_ITEMS } from '@/lib/faq';
import { PRICING_MODE } from '@/lib/pricing-mode';
import { BETA_CARDS, GA_CARDS, LEGACY_CARDS, CUSTOM_STRIP } from '@/lib/pricing-cards';
import { PlanCards } from '@/components/pricing/plan-cards';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'AI sales prospecting pricing, pay-as-you-go. Start free with 100 credits, then pay for the work Milo does. Credits never expire; no seats, no subscription, no monthly minimum.',
  alternates: { canonical: '/pricing' },
};

/**
 * /pricing.
 *
 * Editorial. One outcome anchor per card, one comparison table, one FAQ, one
 * closing CTA. No decorative mascots, no floating icon soup, no glass. The
 * cards and the Custom strip are the same primitive the landing renders, so
 * this page and the landing tell the same story.
 */
export default function PricingPage() {
  const cards =
    PRICING_MODE === 'ga' ? GA_CARDS : PRICING_MODE === 'beta' ? BETA_CARDS : LEGACY_CARDS;
  const custom = PRICING_MODE === 'legacy' ? undefined : CUSTOM_STRIP;

  return (
    <>
      <FaqJsonLd items={PRICING_FAQ_ITEMS} />

      <section className="shell pt-14 md:pt-20">
        <Reveal className="mx-auto max-w-3xl">
          <p className="text-eyebrow uppercase tracking-wide text-accent">Pricing</p>
          <h1 className="mt-3 text-display-lg text-ink">Pay for the work Milo does.</h1>
          <p className="mt-5 max-w-2xl text-body-lg text-muted">
            Credits, not seats. No subscription, no monthly minimum. Credits never expire
            while your account is active.
          </p>
        </Reveal>
      </section>

      <section className="shell pb-section-y pt-10 md:pt-14">
        <PlanCards cards={cards} custom={custom} />
      </section>

      {PRICING_MODE === 'ga' ? <GaComparisonMatrix /> : null}

      <Faq
        items={PRICING_FAQ_ITEMS}
        title="Pricing, answered."
        intro="The money questions people ask before they start."
      />
      <FinalCta
        title="Find your first opportunities."
        body="100 free credits. No card. No subscription."
        cta="Start free"
      />
    </>
  );
}

/* ── GA comparison table. Clean typographic grid, no icon soup. ── */
type Row = {
  label: string;
  values: [string, string, string, string, string];
  emphasis?: 'header';
};

const COMPARE_COLS = ['Free', 'Base', 'Growth', 'Scale', 'Custom'] as const;

const COMPARE_ROWS: Row[] = [
  {
    label: 'Price',
    values: ['$0', '$19', '$49', '$119', 'Contact us'],
    emphasis: 'header',
  },
  {
    label: 'Credits',
    values: ['100 on signup', '300', '900', '2,400', 'Volume'],
  },
  {
    label: 'Leads, end to end',
    values: ['~20', '~60', '~180', '~480', 'Unlimited'],
  },
  {
    label: 'Cost per lead',
    values: ['Free', '~$0.32', '~$0.27', '~$0.25', 'Negotiated'],
  },
  {
    label: 'Full workflow',
    values: ['Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
  },
  {
    label: 'Multi-inbox rotation',
    values: ['Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
  },
  {
    label: 'Warm-up and throttling',
    values: ['Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
  },
  {
    label: 'Reply routing to your inbox',
    values: ['Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
  },
  {
    label: 'Team access, no seat fee',
    values: ['Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
  },
  {
    label: 'Credits never expire',
    values: ['Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
  },
  {
    label: 'Invoicing and purchase orders',
    values: ['–', '–', '–', '–', 'Yes'],
  },
  {
    label: 'Volume terms',
    values: ['–', '–', '–', '–', 'Yes'],
  },
];

function GaComparisonMatrix() {
  return (
    <section className="shell pb-section-y">
      <Reveal className="mx-auto max-w-3xl">
        <p className="text-eyebrow uppercase tracking-wide text-accent">Compare plans</p>
        <h2 className="mt-3 text-display-md text-ink">Every plan, side by side.</h2>
        <p className="mt-4 max-w-2xl text-body-lg text-muted">
          Same product on every plan. What changes is the size of the credit pool.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mx-auto mt-10 max-w-5xl overflow-x-auto">
        <table className="w-full min-w-[42rem] border-collapse text-body-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="w-56 py-3 text-left font-mono text-[0.72rem] uppercase tracking-wide text-muted">
                Plan
              </th>
              {COMPARE_COLS.map((c) => (
                <th
                  key={c}
                  className="py-3 text-left font-medium text-ink"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-0">
                <th
                  scope="row"
                  className="py-3 pr-4 text-left font-normal text-muted"
                >
                  {row.label}
                </th>
                {row.values.map((v, i) => (
                  <td
                    key={i}
                    className={[
                      'py-3 pr-4',
                      row.emphasis === 'header' ? 'text-ink font-medium' : 'text-ink/85',
                    ].join(' ')}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}
