'use client';
// CLIENT ISLAND (M00 §4): a small "how many leads do you want?" calculator. Genuine
// interactivity (a range input + derived recommendation). All math comes from
// lib/pricing-math (which reads the FINALIZED shared constants), so it can never
// disagree with the pack cards. No external deps, tiny state - cheap to hydrate.
import { useState } from 'react';
import Link from 'next/link';
import { CREDIT_PACKS } from '@extrovertai/shared';
import { CtaButton } from '@/components/cta-button';
import { SIGNUP_URL, CONTACT_URL } from '@/lib/site';
import { leadsForCredits, usd, fmtUsd2 } from '@/lib/pricing-math';

// Packs sorted small -> large so we can pick the smallest that covers the target.
const PACKS = [...CREDIT_PACKS].sort((a, b) => a.credits - b.credits);
const MAX_SINGLE = leadsForCredits(PACKS[PACKS.length - 1].credits).high; // most the biggest pack can cover

const MIN = 10;
const MAX = 250;
const STEP = 10;

export function PricingCalculator() {
  const [leads, setLeads] = useState(80);

  // Smallest pack that CAN cover the target (uses the pack's realistic top-end
  // reach). This recommends the honest cheapest fit rather than over-selling.
  // Beyond the biggest pack's reach we point to Custom.
  const pack = PACKS.find((p) => leadsForCredits(p.credits).high >= leads);
  const overCap = !pack;
  const perLead = pack ? pack.priceUsdCents / 100 / leads : 0;

  return (
    <section className="shell py-section-y">
      <div className="rounded-2xl border border-line bg-surface p-6 shadow-card md:p-8">
        <p className="text-eyebrow uppercase text-accent">Estimate it</p>
        <h2 className="mt-3 text-heading-lg text-ink">How many leads do you want to reach?</h2>
        <p className="mt-2 max-w-prose text-body text-muted">
          Drag to your target. We&rsquo;ll show the pack that covers it and what each lead works
          out to &mdash; found, researched, written and sent.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          {/* Slider */}
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="lead-target" className="text-body-sm text-muted">
                Leads per month
              </label>
              <span className="text-display-md font-medium text-ink">
                {leads}
                {overCap ? '+' : ''}
              </span>
            </div>
            <input
              id="lead-target"
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={leads}
              onChange={(e) => setLeads(Number(e.target.value))}
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-line accent-accent"
              aria-describedby="calc-result"
            />
            <div className="mt-2 flex justify-between text-[0.72rem] text-muted/70">
              <span>{MIN}</span>
              <span>{MAX}+</span>
            </div>
          </div>

          {/* Result */}
          <div
            id="calc-result"
            aria-live="polite"
            className="rounded-xl border border-accent/30 bg-accent-soft/50 p-5"
          >
            {overCap ? (
              <>
                <p className="text-body-sm text-muted">For {MAX_SINGLE}+ leads a month</p>
                <p className="mt-1 text-heading-md text-ink">Let&rsquo;s size a custom plan</p>
                <p className="mt-2 text-body-sm text-muted">
                  Volume pricing and invoicing for always-on outreach.
                </p>
                <Link
                  href={CONTACT_URL}
                  className="mt-4 inline-flex text-body-sm font-medium text-accent underline underline-offset-4 hover:no-underline"
                >
                  Talk to us &rarr;
                </Link>
              </>
            ) : (
              <>
                <p className="text-body-sm text-muted">Recommended</p>
                <p className="mt-1 text-heading-md text-ink">
                  {pack!.label} &middot; {usd(pack!.priceUsdCents)}
                </p>
                <dl className="mt-3 space-y-1.5 text-body-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Credits</dt>
                    <dd className="text-ink">{pack!.credits.toLocaleString('en-US')}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">Covers</dt>
                    <dd className="text-ink">
                      up to {leadsForCredits(pack!.credits).low}&ndash;
                      {leadsForCredits(pack!.credits).high} leads
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-muted">At {leads} leads</dt>
                    <dd className="font-medium text-accent">{fmtUsd2(perLead)} / lead</dd>
                  </div>
                </dl>
                <CtaButton href={SIGNUP_URL} className="mt-4 w-full">
                  Start free &middot; upgrade to {pack!.label}
                </CtaButton>
              </>
            )}
          </div>
        </div>
        <p className="mt-4 text-[0.72rem] text-muted/70">
          Estimates use the worst case (a full 3-email sequence per lead), so real numbers usually
          come in cheaper. You always start free &mdash; no card.
        </p>
      </div>
    </section>
  );
}
