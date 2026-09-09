// SERVER component - the LANDING-PAGE pricing section.
// Starter card = the FREE_SIGNUP_CREDITS grant (rendered as $0). Growth + Scale are
// read from the shared CREDIT_PACKS source of truth so nothing drifts.
import { Fragment } from 'react';
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { SIGNUP_URL } from '@/lib/site';
import { CREDIT_PACKS, CREDIT_COSTS, FREE_SIGNUP_CREDITS } from '@extrovertai/shared';
import { usd, leadsForCredits } from '@/lib/pricing-math';

/* ── inline icons (currentColor so they inherit accent) ── */
type IP = { className?: string };
const sp = (c = 'h-5 w-5') => ({
  viewBox: '0 0 24 24',
  className: c,
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});
const IcoSearch = (p: IP) => (<svg {...sp(p.className)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>);
const IcoDoc = (p: IP) => (<svg {...sp(p.className)}><path d="M6 3h9l3 3v15H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></svg>);
const IcoPen = (p: IP) => (<svg {...sp(p.className)}><path d="M12 20h8" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>);
const IcoSend = (p: IP) => (<svg {...sp(p.className)}><path d="M21 3 10.5 13.5M21 3l-6.5 18-4-8-8-4z" /></svg>);
const IcoChart = (p: IP) => (<svg {...sp(p.className)}><path d="M3 21h18M6 21v-6M11 21V9M16 21V4" /></svg>);
const IcoCoins = (p: IP) => (<svg {...sp(p.className)}><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></svg>);
const IcoUsers = (p: IP) => (<svg {...sp(p.className)}><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.8M20.5 20a5.5 5.5 0 0 0-4-5.3" /></svg>);
const IcoCard = (p: IP) => (<svg {...sp(p.className)}><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><path d="M2.5 10h19M6 15h4" /></svg>);
const IcoShield = (p: IP) => (<svg {...sp(p.className)}><path d="M12 3 5 6v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6z" /><path d="m9 12 2 2 4-4" /></svg>);
const IcoCheck = (p: IP) => (<svg {...sp(p.className)}><path d="m5 12 4 4 10-10" /></svg>);

const WORKFLOW = [
  { label: 'Find leads', chip: `${CREDIT_COSTS.search} credit`, Icon: IcoSearch },
  { label: 'Research', chip: `${CREDIT_COSTS.enrichment} credits`, Icon: IcoDoc },
  { label: 'Write', chip: `${CREDIT_COSTS.draft} credit`, Icon: IcoPen },
  { label: 'Send', chip: `${CREDIT_COSTS.send} credit`, Icon: IcoSend },
  { label: 'Track', chip: 'Included', Icon: IcoChart },
];

// Plan cards — Starter is the free-signup grant (rendered $0), Growth + Scale from
// CREDIT_PACKS. No pricing hardcoded that could contradict shared/Stripe.
const growthPack = CREDIT_PACKS.find((p) => p.id === 'growth')!;
const scalePack = CREDIT_PACKS.find((p) => p.id === 'scale')!;

const PLANS = [
  {
    id: 'starter',
    label: 'Starter',
    tagline: 'Try it out',
    priceLabel: '$0',
    credits: FREE_SIGNUP_CREDITS,
    features: ['Full workflow access', 'No credit card required', 'Credits never expire'],
    cta: 'Start free',
    highlight: false,
  },
  {
    id: 'growth',
    label: growthPack.label,
    tagline: 'For steady outreach',
    priceLabel: usd(growthPack.priceUsdCents),
    credits: growthPack.credits,
    features: ['Full workflow access', 'Best value for consistent use', 'Credits never expire'],
    cta: 'Build my pipeline',
    highlight: true,
  },
  {
    id: 'scale',
    label: scalePack.label,
    tagline: 'For high-volume outreach',
    priceLabel: usd(scalePack.priceUsdCents),
    credits: scalePack.credits,
    features: ['Full workflow access', 'For larger prospecting needs', 'Credits never expire'],
    cta: 'Scale prospecting',
    highlight: false,
  },
];

const REASSURE = [
  { Icon: IcoUsers, title: 'No seats', sub: 'Use it solo or with your team.' },
  { Icon: IcoCard, title: 'No monthly minimum', sub: 'Top up only when you need to.' },
  { Icon: IcoShield, title: 'Credits never expire', sub: 'Use them at your own pace.' },
];

export function LandingPricing() {
  return (
    <section id="pricing" className="shell py-section-y">
      {/* eyebrow + headline */}
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-eyebrow uppercase tracking-wide text-accent">Pricing</p>
        <h2 className="mt-3 text-display-md text-ink">
          One tool. <span className="text-accent">Five jobs.</span> One simple price.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-body-lg text-muted">
          Find businesses, research them, write personalized emails, send outreach and track results.
          Pay for the work you do, not five different subscriptions.
        </p>
      </Reveal>

      {/* five-step workflow */}
      <Reveal
        delay={0.05}
        as="ol"
        className="mx-auto mt-10 flex max-w-4xl items-start justify-between gap-1 sm:flex-wrap sm:justify-center sm:gap-x-2 sm:gap-y-6"
      >
        {WORKFLOW.map((s, i) => (
          <Fragment key={s.label}>
            <li className="flex min-w-0 flex-1 flex-col items-center text-center sm:w-24 sm:flex-none">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent sm:h-12 sm:w-12">
                <s.Icon className="h-[1.1rem] w-[1.1rem] sm:h-5 sm:w-5" />
              </span>
              <span className="mt-2 text-[0.72rem] font-medium leading-tight text-ink sm:mt-2.5 sm:text-body-sm">
                {s.label}
              </span>
              <span className="mt-1 text-[0.62rem] text-muted sm:text-[0.75rem]">{s.chip}</span>
            </li>
            {i < WORKFLOW.length - 1 ? (
              <li aria-hidden className="hidden h-12 items-center px-1 text-muted/40 sm:flex">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </li>
            ) : null}
          </Fragment>
        ))}
      </Reveal>

      {/* plans */}
      <div className="mx-auto mt-14 max-w-5xl">
        <div className="grid items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((p, i) => (
            <Reveal
              key={p.id}
              as="article"
              delay={0.05 * i}
              className={[
                'relative flex h-full flex-col rounded-2xl border p-6 transition-shadow duration-200',
                p.highlight
                  ? 'border-accent bg-accent-soft/40 shadow-float'
                  : 'border-line bg-surface shadow-card hover:shadow-float',
              ].join(' ')}
            >
              {p.highlight ? (
                <span className="absolute right-5 top-5 rounded-full bg-accent px-2.5 py-1 text-[0.68rem] font-medium tracking-wide text-white">
                  Most popular
                </span>
              ) : null}

              <div>
                <p className="text-heading-md text-ink">{p.label}</p>
                <p className="mt-1 text-body-sm text-muted">{p.tagline}</p>
              </div>

              <p className="mt-5 text-[2.5rem] font-medium leading-none tracking-tight text-ink">
                {p.priceLabel}
              </p>
              <p className="mt-2 text-body-sm text-muted">
                {p.credits.toLocaleString('en-US')} credits
              </p>

              <div className="mt-5 rounded-lg bg-accent-soft px-4 py-3">
                <p className="text-body-sm font-medium text-accent">
                  &asymp; {leadsForCredits(p.credits).low}&ndash;{leadsForCredits(p.credits).high} leads
                </p>
                <p className="mt-0.5 text-[0.78rem] text-accent/80">end to end</p>
              </div>

              <ul className="mt-5 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-body-sm text-ink">
                    <IcoCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-1 flex-col justify-end">
                <CtaButton
                  href={SIGNUP_URL}
                  variant={p.highlight ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  {p.cta}
                </CtaButton>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* benefit row — one line per item on desktop */}
      <Reveal
        delay={0.05}
        className="mx-auto mt-10 grid max-w-5xl gap-x-6 gap-y-4 sm:grid-cols-3"
      >
        {REASSURE.map((r) => (
          <div key={r.title} className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <r.Icon className="h-[1.1rem] w-[1.1rem]" />
            </span>
            <p className="min-w-0 text-body-sm leading-snug">
              <span className="font-medium text-ink">{r.title}</span>{' '}
              <span className="text-muted">{r.sub}</span>
            </p>
          </div>
        ))}
      </Reveal>

      {/* CTA group */}
      <Reveal delay={0.05} className="mt-12 flex flex-col items-center">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <CtaButton href={SIGNUP_URL} size="lg">
            Start with {FREE_SIGNUP_CREDITS} free credits
          </CtaButton>
          <CtaButton href="/pricing" variant="secondary" size="lg">
            See full pricing
          </CtaButton>
        </div>
        <p className="mt-3 text-body-sm text-muted">
          No card required &middot; No auto-charge &middot; Decide later
        </p>
      </Reveal>
    </section>
  );
}
