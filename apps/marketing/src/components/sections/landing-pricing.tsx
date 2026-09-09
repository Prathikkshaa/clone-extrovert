// SERVER component - the LANDING-PAGE pricing section (short, premium, calm).
// Distinct from the full /pricing page: one glance = one tool replaces the
// five-tool stack, pay for what you use, pick a pack, start free. Every number is
// derived from lib/pricing-math (shared credit constants) so nothing can drift.
import { Fragment } from 'react';
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { SIGNUP_URL } from '@/lib/site';
import { CREDIT_PACKS, CREDIT_COSTS, FREE_SIGNUP_CREDITS } from '@extrovertai/shared';
import { usd, leadsForCredits, CREDITS_PER_LEAD_LOW, CREDITS_PER_LEAD_HIGH } from '@/lib/pricing-math';

/* ── inline icons (one weight/size, currentColor so they inherit accent) ── */
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

// The five jobs. Only paid actions carry a credit; tracking replies is included
// (honest: you pay for work done, not for watching your inbox).
const WORKFLOW = [
  { label: 'Find leads', chip: `${CREDIT_COSTS.search} credit`, Icon: IcoSearch },
  { label: 'Research', chip: `${CREDIT_COSTS.enrichment} credits`, Icon: IcoDoc },
  { label: 'Write', chip: `${CREDIT_COSTS.draft} credit`, Icon: IcoPen },
  { label: 'Send', chip: `${CREDIT_COSTS.send} credit`, Icon: IcoSend },
  { label: 'Track', chip: 'included', Icon: IcoChart },
];

const TAGLINE: Record<string, string> = {
  starter: 'Try it out',
  growth: 'For steady outreach',
  scale: 'For high-volume outreach',
};

const REASSURE = [
  { Icon: IcoCoins, title: 'One lead, end to end', sub: `~${CREDITS_PER_LEAD_LOW}–${CREDITS_PER_LEAD_HIGH} credits` },
  { Icon: IcoUsers, title: 'No seats', sub: 'Use it solo or with your team.' },
  { Icon: IcoCard, title: 'No monthly minimum', sub: 'Top up only when you need to.' },
  { Icon: IcoShield, title: 'Credits never expire', sub: 'While your account is active.' },
];

export function LandingPricing() {
  return (
    <section className="shell py-section-y">
      {/* eyebrow + headline + supporting copy - optically centered */}
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-eyebrow uppercase tracking-wide text-accent">Pricing</p>
        <h2 className="mt-3 text-display-md text-ink">
          One tool. <span className="text-accent">Five jobs.</span> One simple price.
        </h2>
        <p className="mx-auto mt-4 max-w-4xl text-body-lg text-muted">
          The whole outreach stack in one tool. Pay for the work you do, not five subscriptions.
        </p>
      </Reveal>

      {/* workflow - lightweight; arrows centered on the icon band */}
      <Reveal
        delay={0.05}
        as="ol"
        className="mt-10 flex flex-wrap items-start justify-center gap-x-2 gap-y-6"
      >
        {WORKFLOW.map((s, i) => (
          <Fragment key={s.label}>
            <li className="flex w-24 flex-col items-center text-center">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent">
                <s.Icon />
              </span>
              <span className="mt-2.5 text-body-sm font-medium text-ink">{s.label}</span>
              <span className="mt-1 text-[0.75rem] text-muted">{s.chip}</span>
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

      {/* three plans - equal widths/gaps/heights; Growth emphasized */}
      <div className="mx-auto mt-14 grid max-w-5xl items-stretch gap-6 md:grid-cols-3">
        {CREDIT_PACKS.map((pack, i) => {
          const best = pack.popular; // Growth
          const l = leadsForCredits(pack.credits);
          return (
            <Reveal
              key={pack.id}
              as="article"
              delay={0.05 * i}
              className={[
                'relative flex h-full flex-col rounded-2xl border bg-surface p-6 transition-shadow duration-200',
                best
                  ? 'border-accent shadow-float'
                  : 'border-line shadow-card hover:shadow-float',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-heading-md text-ink">{pack.label}</p>
                  <p className="mt-1 text-body-sm text-muted">{TAGLINE[pack.id]}</p>
                </div>
                {best ? (
                  <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-[0.7rem] font-medium text-white">
                    Most popular
                  </span>
                ) : null}
              </div>

              <p className="mt-5 text-display-md font-medium tracking-tight text-ink">
                {usd(pack.priceUsdCents)}
              </p>
              <p className="mt-1 text-body-sm text-muted">
                {pack.credits.toLocaleString('en-US')} credits
              </p>

              <div className="mt-5 rounded-lg bg-accent-soft px-4 py-3">
                <p className="text-body-sm font-medium text-accent">
                  &asymp; {l.low}&ndash;{l.high} leads
                </p>
                <p className="mt-0.5 text-[0.78rem] text-accent/80">end to end</p>
              </div>

              <div className="mt-6 flex flex-1 flex-col justify-end">
                <CtaButton
                  href={SIGNUP_URL}
                  variant={best ? 'primary' : 'secondary'}
                  className="w-full"
                >
                  Get Started
                </CtaButton>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* reassurance - the top objections, one calm row */}
      <Reveal
        delay={0.05}
        className="mx-auto mt-10 grid max-w-5xl gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-line"
      >
        {REASSURE.map((r) => (
          <div key={r.title} className="flex items-start gap-3 lg:px-6 lg:first:pl-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
              <r.Icon className="h-[1.1rem] w-[1.1rem]" />
            </span>
            <div>
              <p className="text-body-sm font-medium text-ink">{r.title}</p>
              <p className="text-[0.8rem] text-muted">{r.sub}</p>
            </div>
          </div>
        ))}
      </Reveal>

      {/* CTA group - primary dominates; secondary routes to the full page */}
      <Reveal delay={0.05} className="mt-14 flex flex-col items-center">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <CtaButton href={SIGNUP_URL} size="lg">
            Start free
          </CtaButton>
          <CtaButton href="/pricing" variant="secondary" size="lg">
            See full pricing
          </CtaButton>
        </div>
        <p className="mt-3 text-body-sm text-muted">
          {FREE_SIGNUP_CREDITS} credits &middot; No card required
        </p>
      </Reveal>
    </section>
  );
}
