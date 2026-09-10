// SERVER. The landing pricing section.
//
// The visible surface is driven by NEXT_PUBLIC_PRICING (see lib/pricing-mode):
//   ga (default)  Free + Base $19 + Growth $49 + Scale $119 + Custom strip
//   beta          Free + Founding user $10 + Custom strip
//   legacy        Starter $10 + Growth $39 + Scale $99 (original pack shape)
//
// Card visuals are delegated to <PlanCards /> so this page and /pricing render
// the same primitive. This section adds the workflow strip + the bottom CTA
// pair on top.
import { Fragment } from 'react';
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { SIGNUP_URL } from '@/lib/site';
import { CREDIT_COSTS, FREE_SIGNUP_CREDITS } from '@extrovertai/shared';
import { PRICING_MODE } from '@/lib/pricing-mode';
import { LEGACY_CARDS, BETA_CARDS, GA_CARDS, CUSTOM_STRIP } from '@/lib/pricing-cards';
import { PlanCards } from '@/components/pricing/plan-cards';

/* ── icons for the five-step workflow row ── */
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

const WORKFLOW = [
  { label: 'Find leads', chip: `${CREDIT_COSTS.search} credit`, Icon: IcoSearch },
  { label: 'Research', chip: `${CREDIT_COSTS.enrichment} credits`, Icon: IcoDoc },
  { label: 'Write', chip: `${CREDIT_COSTS.draft} credit`, Icon: IcoPen },
  { label: 'Send', chip: `${CREDIT_COSTS.send} credit`, Icon: IcoSend },
  { label: 'Track', chip: 'Included', Icon: IcoChart },
];

export function LandingPricing() {
  const cards =
    PRICING_MODE === 'ga' ? GA_CARDS : PRICING_MODE === 'beta' ? BETA_CARDS : LEGACY_CARDS;
  const custom = PRICING_MODE === 'legacy' ? undefined : CUSTOM_STRIP;

  return (
    <section id="pricing" className="shell py-section-y">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-eyebrow uppercase tracking-wide text-accent">Pricing</p>
        <h2 className="mt-3 text-display-md text-ink">
          One tool. <span className="text-accent">Five jobs.</span> One simple price.
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-body-lg text-muted">
          Pay for the work Milo does, not five different subscriptions.
        </p>
      </Reveal>

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
              <span className="mt-1 text-[0.6rem] text-muted/70 sm:text-[0.68rem]">
                {s.chip}
              </span>
            </li>
            {i < WORKFLOW.length - 1 ? (
              <li aria-hidden className="hidden h-12 items-center px-2 sm:flex">
                <span className="h-px w-6 bg-line/70" />
              </li>
            ) : null}
          </Fragment>
        ))}
      </Reveal>

      <div className="mt-12">
        <PlanCards cards={cards} custom={custom} />
      </div>

      <Reveal delay={0.05} className="mt-10 flex flex-col items-center">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <CtaButton href={SIGNUP_URL} size="md">
            Start free
          </CtaButton>
          <CtaButton href="/pricing" variant="secondary" size="md">
            See full pricing
          </CtaButton>
        </div>
        <p className="mt-3 text-body-sm text-muted">
          {FREE_SIGNUP_CREDITS} free credits &middot; No card required &middot; Decide later
        </p>
      </Reveal>
    </section>
  );
}
