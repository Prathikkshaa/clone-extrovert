// SERVER components for the /pricing page only (kept OFF the home page so the
// landing stays lean). Everything numeric is derived in lib/pricing-math from the
// FINALIZED shared constants - no invented figures. Comparisons are by CATEGORY,
// never a named competitor with a quoted price, so nothing can go stale or wrong.
import type { ReactNode } from 'react';
import { CREDIT_PACKS } from '@extrovertai/shared';
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { CONTACT_URL, SIGNUP_URL } from '@/lib/site';
import {
  usd,
  fmtUsd2,
  bestPack,
  leadsForCredits,
  costPerLeadUsd,
  LOWEST_COST_PER_LEAD,
  LOWEST_PER_CREDIT_USD,
  CREDITS_PER_LEAD_LOW,
  CREDITS_PER_LEAD_HIGH,
} from '@/lib/pricing-math';

/* ─────────────────────────── ROI stat band ─────────────────────────── */
// A dark, high-contrast band (uses `.on-dark` so the sticky header flips light
// over it). Three real numbers doing the value anchoring, plus a soft ROI reframe.
export function PricingRoiBand() {
  const stats = [
    { big: `From ${LOWEST_COST_PER_LEAD}`, label: 'per lead — found, researched, written & sent' },
    { big: `${CREDITS_PER_LEAD_LOW}–${CREDITS_PER_LEAD_HIGH}`, label: 'credits a lead, end to end' },
    { big: '100 free', label: 'credits to start — no card' },
  ];
  return (
    <section className="on-dark py-section-y text-white">
      <div className="shell">
        <Reveal className="max-w-prose">
          <p className="text-eyebrow uppercase text-accent">The economics</p>
          <h2 className="mt-3 text-display-md">Outreach priced like a utility, not a headcount.</h2>
          <p className="mt-4 text-body-lg text-white/70">
            You set the offer. For most, a single new client covers the outreach many times
            over — the only question is how many doors you want to knock on.
          </p>
        </Reveal>
        <dl className="mt-10 grid gap-6 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal as="div" key={s.label} delay={i * 0.06} className="rounded-2xl border border-white/12 bg-white/[0.04] p-6">
              <dt className="text-display-md font-medium tracking-tight">{s.big}</dt>
              <dd className="mt-2 text-body-sm text-white/60">{s.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ──────────────────────── vs. the alternatives ──────────────────────── */
export function AlternativesStrip() {
  const rows = [
    {
      name: 'A sales hire or VA',
      cost: 'Thousands / month',
      gets: 'A salary whether or not meetings land — and management on top.',
      us: false,
    },
    {
      name: 'A bought lead list',
      cost: 'Per record, upfront',
      gets: 'Rows in a spreadsheet. Often stale. You still write and send everything.',
      us: false,
    },
    {
      name: 'A prospecting seat + a writer + a sender',
      cost: 'Three subscriptions',
      gets: 'Contacts here, copy there, sending somewhere else — glued together by you.',
      us: false,
    },
    {
      name: 'Extrovert',
      cost: `From ${LOWEST_COST_PER_LEAD} / lead`,
      gets: 'Found, researched, written and sent from your own inbox. Pay only for what you use.',
      us: true,
    },
  ];
  return (
    <section className="shell py-section-y">
      <Reveal className="max-w-prose">
        <p className="text-eyebrow uppercase text-accent">Why not the usual route</p>
        <h2 className="mt-3 text-display-md text-ink">The same work, without the stack or the salary.</h2>
      </Reveal>
      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {rows.map((r) => (
          <div
            key={r.name}
            className={[
              'grid gap-2 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[1.1fr_0.8fr_1.6fr] sm:items-center sm:gap-6',
              r.us ? 'bg-accent-soft/60' : 'bg-surface',
            ].join(' ')}
          >
            <p className={['text-body font-medium', r.us ? 'text-accent' : 'text-ink'].join(' ')}>
              {r.name}
            </p>
            <p className="text-body-sm text-muted">{r.cost}</p>
            <p className="text-body-sm text-muted">{r.gets}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[0.72rem] text-muted/70">
        Categories shown for comparison; your mileage and any third-party prices vary.
      </p>
    </section>
  );
}

/* ─────────────────────── side-by-side comparison ────────────────────── */
export function ComparisonMatrix() {
  const packs = [...CREDIT_PACKS].sort((a, b) => a.priceUsdCents - b.priceUsdCents);
  const cell = 'px-4 py-3 text-body-sm';
  const row = (
    label: string,
    render: (p: (typeof packs)[number]) => ReactNode,
    customValue: ReactNode,
  ) => (
    <tr className="border-t border-line">
      <th scope="row" className={`${cell} text-left font-medium text-ink`}>
        {label}
      </th>
      {packs.map((p) => (
        <td key={p.id} className={`${cell} text-center text-ink/80`}>
          {render(p)}
        </td>
      ))}
      <td className={`${cell} text-center text-ink/80`}>{customValue}</td>
    </tr>
  );

  return (
    <section className="shell py-section-y">
      <Reveal className="max-w-prose">
        <p className="text-eyebrow uppercase text-accent">Compare</p>
        <h2 className="mt-3 text-display-md text-ink">Every number, side by side.</h2>
        <p className="mt-4 text-body-lg text-muted">
          Nothing hidden. Each figure is computed from the same credit costs the product charges.
        </p>
      </Reveal>

      <Reveal className="mt-8 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[640px] border-collapse bg-surface text-left">
          <thead>
            <tr>
              <th className={`${cell} text-left text-[0.72rem] font-medium uppercase tracking-wide text-muted`}>
                &nbsp;
              </th>
              {packs.map((p) => (
                <th
                  key={p.id}
                  scope="col"
                  className={`${cell} text-center ${p.id === bestPack.id ? 'text-accent' : 'text-ink'}`}
                >
                  <span className="block text-heading-sm">{p.label}</span>
                  {p.id === bestPack.id ? (
                    <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[0.66rem] font-medium text-white">
                      Best value
                    </span>
                  ) : null}
                </th>
              ))}
              <th scope="col" className={`${cell} text-center text-ink`}>
                <span className="block text-heading-sm">Custom</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {row('Price', (p) => <span className="font-medium text-ink">{usd(p.priceUsdCents)}</span>, "Let's talk")}
            {row('Credits', (p) => p.credits.toLocaleString('en-US'), 'Volume')}
            {row(
              'Leads covered',
              (p) => {
                const l = leadsForCredits(p.credits);
                return `${l.low}–${l.high}`;
              },
              'Unlimited scale',
            )}
            {row(
              'Cost per lead',
              (p) => {
                const c = costPerLeadUsd(p.priceUsdCents, p.credits);
                return `${fmtUsd2(c.lo)}–${fmtUsd2(c.hi)}`;
              },
              'Best rates',
            )}
            {row(
              '$ / credit',
              (p) => `$${(p.priceUsdCents / p.credits / 100).toFixed(3)}`,
              `from ${LOWEST_PER_CREDIT_USD}`,
            )}
            {row('Credits expire', () => 'Never', 'Never')}
            {row('Invoicing & POs', () => '—', 'Yes')}
            <tr className="border-t border-line">
              <th scope="row" className={`${cell} text-left font-medium text-ink`}>
                &nbsp;
              </th>
              {packs.map((p) => (
                <td key={p.id} className={`${cell} text-center`}>
                  <CtaButton
                    href={SIGNUP_URL}
                    variant={p.id === bestPack.id ? 'primary' : 'secondary'}
                    size="sm"
                  >
                    Get {p.label}
                  </CtaButton>
                </td>
              ))}
              <td className={`${cell} text-center`}>
                <CtaButton href={CONTACT_URL} variant="secondary" size="sm">
                  Talk to us
                </CtaButton>
              </td>
            </tr>
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}

/* ─────────────────────────── Custom / Enterprise ─────────────────────── */
export function EnterpriseCard() {
  const perks = [
    'Volume pricing beyond the largest pack',
    'Invoicing and purchase orders',
    'Custom credit grants for your cadence',
    'A real person to help you launch',
  ];
  return (
    <section className="shell pb-section-y">
      <Reveal className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line bg-surface p-6 shadow-card md:flex-row md:items-center md:p-8">
        <div>
          <p className="text-eyebrow uppercase text-accent">For teams & agencies</p>
          <h2 className="mt-2 text-heading-lg text-ink">Sending at real volume?</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {perks.map((perk) => (
              <li key={perk} className="flex gap-2 text-body-sm text-ink/80">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="shrink-0">
          <CtaButton href={CONTACT_URL} size="lg" variant="secondary">
            Talk to us
          </CtaButton>
        </div>
      </Reveal>
    </section>
  );
}
