// SERVER components for the /pricing page only (kept OFF the home page so the
// landing stays lean). Everything numeric is derived in lib/pricing-math from the
// FINALIZED shared constants - no invented figures. Comparisons are by CATEGORY,
// never a named competitor with a quoted price, so nothing can go stale or wrong.
import { Fragment, type ReactNode } from 'react';
import { CREDIT_PACKS, type CreditPack } from '@extrovertai/shared';
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

/* ───────────────────────────── hero iconography ─────────────────────── */
// Small inline SVGs (stroke = currentColor) so they inherit the accent/white
// they sit in - no icon dependency, no extra requests.
const svg = 'h-[1.15rem] w-[1.15rem]';
function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={svg} aria-hidden>
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" />
    </svg>
  );
}
function IconResearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={svg} aria-hidden>
      <path d="M6 3h9l3 3v15H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}
function IconWrite() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={svg} aria-hidden>
      <path d="M12 20h8" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={svg} aria-hidden>
      <path d="M21 3 10.5 13.5M21 3l-6.5 18-4-8-8-4z" />
    </svg>
  );
}
export const STEP_ICONS = { search: IconSearch, research: IconResearch, write: IconWrite, send: IconSend } as const;

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
      <path d="m4 12 5 5L20 6" />
    </svg>
  );
}
function IconGift() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7S11 3 8.5 3 6 6 6 6.5 8 7 12 7zM12 7s1-4 3.5-4S18 6 18 6.5 16 7 12 7z" />
    </svg>
  );
}

/* ─────────────────────────── Dark hero + ROI band ───────────────────── */
// The page's HERO (matches the approved comp): value headline + CTA, Milo in the
// middle, a "What you pay" summary card, then the 4-step loop and a stat strip.
// Dark `.on-dark` band so the sticky header flips light over it. Numbers derive
// from lib/pricing-math so nothing drifts. Above-the-fold, so NOT wrapped in
// Reveal (it must paint instantly, never flash empty).
export function PricingRoiBand() {
  const cardChecks = [
    'Find the right businesses',
    'Research and enrich details',
    'Write personalized emails (in your voice)',
    'Send from your inbox',
    'Stay out of spam',
  ];
  const stats = [
    { big: LOWEST_COST_PER_LEAD, unit: 'a lead', label: 'found, researched, written & sent' },
    { big: `${CREDITS_PER_LEAD_LOW}–${CREDITS_PER_LEAD_HIGH}`, unit: 'credits', label: 'per lead, end to end' },
    { big: '100', unit: 'free credits', label: 'to start — no card required' },
  ];

  return (
    <section className="on-dark relative -mt-[77px] overflow-hidden pb-14 pt-[7.5rem] text-white md:pb-16">
      {/* soft radial glow behind Milo/card, purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 hidden h-[560px] w-[720px] rounded-full bg-accent/10 blur-3xl lg:block"
      />
      <div className="shell relative">
        <div className="relative grid items-start gap-10 lg:grid-cols-2 lg:gap-10 xl:grid-cols-[minmax(0,1fr)_220px_minmax(0,390px)] xl:gap-8">
          {/* Left: value + CTA */}
          <div className="max-w-xl">
            <p className="text-eyebrow uppercase tracking-wide text-accent">Pricing</p>
            <h1 className="mt-4 text-display-lg tracking-tight">
              Outreach priced like a utility,{' '}
              <span className="text-white/45">not a headcount.</span>
            </h1>
            <p className="mt-5 max-w-md text-body-lg text-white/70">
              Start free with 100 credits. After that you only pay for what you use — from{' '}
              {LOWEST_COST_PER_LEAD} a lead, found, researched, written and sent. No seats, no
              subscription, nothing hidden.
            </p>
            <div className="mt-7">
              <CtaButton href={SIGNUP_URL} size="lg">
                Start free
              </CtaButton>
              <p className="mt-3 text-body-sm text-white/55">No card needed&nbsp;&nbsp;|&nbsp;&nbsp;Free to start</p>
            </div>
          </div>

          {/* Middle: Milo scene (xl only). Bubble + sparkles are baked into the
              artwork; the stairs he stands on are drawn behind his feet. Lives in
              its own grid column so it never overlaps the headline or the card. */}
          <div className="hidden self-end xl:block" aria-hidden>
            <div className="relative w-full pb-8">
              {/* staircase Milo stands on: two dark-green steps with lit top edges,
                  the lower one wider and shifted forward-left (descending). */}
              <div className="absolute inset-x-0 bottom-0 z-0 flex flex-col items-center">
                <div className="h-9 w-40 rounded-[5px] bg-[#1a2a26] shadow-[inset_0_1.5px_0_rgba(255,255,255,0.14)]" />
                <div className="-mt-3.5 mr-14 h-9 w-56 rounded-[5px] bg-[#122320] shadow-[inset_0_1.5px_0_rgba(255,255,255,0.09)]" />
              </div>
              <img
                src="/milo/milo-hero-bubble.webp"
                alt=""
                width={300}
                height={246}
                loading="eager"
                className="relative z-10 -mb-3 w-full"
              />
            </div>
          </div>

          {/* Right: "What you pay" summary card */}
          <div className="self-start rounded-3xl border border-white/12 bg-white/[0.04] p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <p className="text-heading-sm text-white">What you pay</p>
              <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[0.72rem] font-medium text-accent-strong">
                Pay as you go
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-display-md font-medium tracking-tight text-white">{LOWEST_COST_PER_LEAD}</span>
              <span className="text-body-lg text-white/60">per lead</span>
            </div>
            <p className="mt-1 flex items-center gap-1.5 text-body-sm text-white/55">
              {CREDITS_PER_LEAD_LOW}–{CREDITS_PER_LEAD_HIGH} credits / lead
              <span
                title="A lead runs 5–7 credits end to end: find, research, write, and 1–3 sends (follow-ups stop when they reply)."
                className="grid h-4 w-4 cursor-help place-items-center rounded-full border border-white/30 text-[0.6rem] text-white/60"
              >
                i
              </span>
            </p>

            <ul className="mt-4 space-y-2 border-t border-white/12 pt-4">
              {cardChecks.map((c) => (
                <li key={c} className="flex items-center gap-3 text-body-sm text-white/85">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent-strong">
                    <IconCheck />
                  </span>
                  {c}
                </li>
              ))}
            </ul>

            {/* Highlighted free-credits callout (light fill, like the comp) */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#e8f4ef] p-4">
              <span className="text-[#0f766e]">
                <IconGift />
              </span>
              <div>
                <p className="text-body-sm font-semibold text-[#12332e]">100 free credits</p>
                <p className="text-[0.8rem] text-[#12332e]/70">Try it out. No card required.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <dl className="mt-10 grid gap-x-8 gap-y-6 border-t border-white/12 pt-6 sm:grid-cols-3 sm:divide-x sm:divide-white/12">
          {stats.map((s) => (
            <div key={s.label} className="sm:px-6 sm:first:pl-0">
              <dt className="flex items-baseline gap-1.5">
                <span className="text-heading-lg font-medium tracking-tight text-white">{s.big}</span>
                <span className="text-body-sm text-white/50">{s.unit}</span>
              </dt>
              <dd className="mt-1.5 text-body-sm text-white/60">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ───────────────────────── comparison row icons ─────────────────────── */
const ri = 'h-[1.05rem] w-[1.05rem] shrink-0 text-muted';
const riProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.7', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, className: ri, 'aria-hidden': true };
const ROW_ICONS = {
  tag: () => (<svg {...riProps}><path d="M20.6 13.4 12 22l-9-9V4h9z" /><path d="M7.5 7.5h.01" /></svg>),
  db: () => (<svg {...riProps}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></svg>),
  bars: () => (<svg {...riProps}><path d="M3 21h18M6 21v-6M11 21V9M16 21V4" /></svg>),
  users: () => (<svg {...riProps}><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M20.5 20a5.5 5.5 0 0 0-4-5.3" /></svg>),
  percent: () => (<svg {...riProps}><path d="M19 5 5 19" /><circle cx="7" cy="7" r="1.6" /><circle cx="17" cy="17" r="1.6" /></svg>),
  clock: () => (<svg {...riProps}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>),
  doc: () => (<svg {...riProps}><path d="M6 3h9l3 3v15H6z" /><path d="M14 3v4h4" /></svg>),
} as const;

function IconInfinity() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" className="h-5 w-5" aria-hidden>
      <path d="M6.5 8.5c-2.2 0-4 1.6-4 3.5s1.8 3.5 4 3.5c3.3 0 5.7-7 9-7 2.2 0 4 1.6 4 3.5s-1.8 3.5-4 3.5c-3.3 0-5.7-7-9-7z" />
    </svg>
  );
}
function IconCard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19M6 15h4" />
    </svg>
  );
}

/* ─────────────────────── side-by-side comparison ────────────────────── */
// Matches the approved comp: a Milo-headed column per plan, the Scale column
// highlighted, row icons on the left, and a trust strip below. Every figure is
// derived from lib/pricing-math so it can never drift from what the API charges.
export function ComparisonMatrix() {
  type Col = {
    id: string;
    name: string;
    tagline: string;
    img: string;
    bubble: string;
    pack?: CreditPack;
    best?: boolean;
    custom?: boolean;
    baked?: boolean; // artwork already includes its speech bubble
  };
  const byId = Object.fromEntries(CREDIT_PACKS.map((p) => [p.id, p])) as Record<string, CreditPack>;
  const columns: Col[] = [
    { id: 'starter', name: 'Starter', tagline: 'Try it out.', img: 'milo-hero', bubble: 'A great place to start.', pack: byId['starter'] },
    { id: 'growth', name: 'Growth', tagline: 'For steady progress.', img: 'milo-typing', bubble: 'For consistent outreach.', pack: byId['growth'] },
    { id: 'scale', name: 'Scale', tagline: 'For high-volume outreach.', img: 'milo-scale-full', bubble: 'More meetings. Less cost.', pack: byId['scale'], best: true, baked: true },
    { id: 'custom', name: 'Custom', tagline: 'Built for your needs.', img: 'milo-custom-full', bubble: "Need more? Let's tailor it for you.", custom: true, baked: true },
  ];
  const rows: { label: string; icon: keyof typeof ROW_ICONS; value: (c: Col) => ReactNode }[] = [
    { label: 'Price', icon: 'tag', value: (c) => (c.pack ? usd(c.pack.priceUsdCents) : "Let's talk") },
    { label: 'Credits', icon: 'db', value: (c) => (c.pack ? c.pack.credits.toLocaleString('en-US') : 'Volume') },
    { label: 'Leads covered', icon: 'bars', value: (c) => {
        if (!c.pack) return 'Unlimited scale';
        const l = leadsForCredits(c.pack.credits);
        return `${l.low}–${l.high}`;
      } },
    { label: 'Cost per lead', icon: 'users', value: (c) => {
        if (!c.pack) return 'Best rates';
        const x = costPerLeadUsd(c.pack.priceUsdCents, c.pack.credits);
        return `${fmtUsd2(x.lo)}–${fmtUsd2(x.hi)}`;
      } },
    { label: '$ / credit', icon: 'percent', value: (c) => (c.pack ? `$${(c.pack.priceUsdCents / c.pack.credits / 100).toFixed(3)}` : `From ${LOWEST_PER_CREDIT_USD}`) },
    { label: 'Credits expire', icon: 'clock', value: () => 'Never' },
    { label: 'Invoicing & POs', icon: 'doc', value: (c) => (c.custom ? 'Yes' : '—') },
  ];

  // Per-cell highlight for the Scale column (continuous bordered box).
  const hi = (c: Col, extra = '') => (c.best ? `bg-accent-soft/50 border-x border-accent ${extra}` : '');

  return (
    <section className="relative overflow-hidden bg-canvas py-section-y">
      {/* header */}
      <div className="shell relative">
        <div className="relative text-center">
          <p className="text-eyebrow uppercase tracking-wide text-accent">Pricing</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-display-md text-ink">Every number, side by side.</h2>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-muted">
            Nothing hidden. No estimates buried in the fine print. Every number comes from the same
            credit cost you actually pay.
          </p>
          {/* flying Milo with bubble, xl only */}
          <div className="absolute -top-4 right-0 hidden items-start gap-2 xl:flex" aria-hidden>
            <div className="relative mt-4 max-w-[9rem] rounded-2xl bg-surface px-3.5 py-2 text-left text-[0.8rem] font-medium leading-tight text-ink shadow-card">
              Same power. Lower cost as you scale.
              <span className="absolute -right-1.5 top-5 h-3 w-3 rotate-45 bg-surface" />
            </div>
            <img src="/milo/milo-flying.webp" alt="" width={96} height={92} className="h-auto w-[76px]" />
          </div>
        </div>

        {/* the grid */}
        <Reveal className="mt-12 overflow-x-auto pb-2">
          <div className="grid min-w-[860px] grid-cols-[minmax(150px,0.85fr)_repeat(4,minmax(0,1fr))] items-stretch">
            {/* Row 0: mascots + bubbles */}
            <div />
            {columns.map((c) =>
              c.baked ? (
                // Artwork already carries its speech bubble - show it whole.
                <div key={c.id} className="flex items-end justify-center px-2 pb-2">
                  <img src={`/milo/${c.img}.webp`} alt="" className="h-auto w-full max-w-[230px]" />
                </div>
              ) : (
                <div key={c.id} className="flex flex-col items-center justify-end px-3 pb-3">
                  <div className="relative mb-1 rounded-xl bg-surface px-3 py-1.5 text-center text-[0.72rem] font-medium leading-tight text-ink shadow-card">
                    {c.bubble}
                    <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-surface" />
                  </div>
                  <img src={`/milo/${c.img}.webp`} alt="" width={100} height={100} className="h-[84px] w-auto" />
                </div>
              ),
            )}

            {/* Row 1: name + tagline (top of the highlighted box) */}
            <div className="px-4 pt-2" />
            {columns.map((c) => (
              <div
                key={c.id}
                className={`relative px-4 pb-4 pt-4 text-center ${hi(c, 'rounded-t-2xl border-t')}`}
              >
                {c.best ? (
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent px-3 py-0.5 text-[0.66rem] font-medium text-white">
                    Best value
                  </span>
                ) : null}
                <p className={`text-heading-md ${c.best ? 'text-accent' : 'text-ink'}`}>{c.name}</p>
                <p className="mt-1 text-body-sm text-muted">{c.tagline}</p>
              </div>
            ))}

            {/* Data rows */}
            {rows.map((r) => {
              const Icon = ROW_ICONS[r.icon];
              return (
                <Fragment key={r.label}>
                  <div className="flex items-center gap-2.5 border-t border-line px-2 py-3.5 text-body-sm font-medium text-ink">
                    <Icon />
                    {r.label}
                  </div>
                  {columns.map((c) => (
                    <div
                      key={c.id}
                      className={`flex items-center justify-center border-t border-line px-4 py-3.5 text-center text-body-sm ${
                        c.best ? 'font-medium text-ink' : 'text-ink/80'
                      } ${hi(c)}`}
                    >
                      {r.value(c)}
                    </div>
                  ))}
                </Fragment>
              );
            })}

            {/* CTA row (bottom of the highlighted box) */}
            <div className="px-2 pt-5" />
            {columns.map((c) => (
              <div key={c.id} className={`px-3 pb-5 pt-5 ${hi(c, 'rounded-b-2xl border-b')}`}>
                {c.custom ? (
                  <CtaButton href={CONTACT_URL} variant="secondary" size="sm" className="w-full">
                    Talk to us
                  </CtaButton>
                ) : (
                  <CtaButton
                    href={SIGNUP_URL}
                    variant={c.best ? 'primary' : 'secondary'}
                    size="sm"
                    className="w-full"
                  >
                    Get {c.name}
                  </CtaButton>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Trust strip */}
        <Reveal className="mt-8 flex flex-col gap-6 rounded-2xl border border-line bg-surface p-5 md:flex-row md:items-center md:gap-4 md:p-6">
          <div className="flex items-center gap-3 md:pr-4" aria-hidden>
            <img src="/milo/milo-typing.webp" alt="" width={70} height={54} className="h-12 w-auto" />
            <div className="relative rounded-xl bg-accent-soft px-3 py-1.5 text-[0.72rem] font-medium leading-tight text-accent">
              100 free credits to
              <br />
              explore. No card needed!
            </div>
          </div>
          <div className="grid flex-1 gap-5 sm:grid-cols-3 md:border-l md:border-line md:pl-6">
            {[
              { Icon: IconGift, title: '100 free credits', sub: 'No card needed. Free to start.' },
              { Icon: IconInfinity, title: 'Credits never expire', sub: 'Use them at your own pace.' },
              { Icon: IconCard, title: 'Global payments', sub: 'Billed in USD; cards from any country.' },
            ].map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Icon />
                </span>
                <div>
                  <p className="text-body-sm font-medium text-ink">{title}</p>
                  <p className="text-[0.8rem] text-muted">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
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
