// SERVER. The landing pricing section, redesigned.
//
// The visible surface is driven by NEXT_PUBLIC_PRICING (see lib/pricing-mode):
//   legacy  the current three self-serve packs (default; no visible change)
//   beta    Free + Founding user ($10 / 250 credits)
//   ga      Free + Base $19 + Growth $49 + Scale $119 + Custom strip
//
// Card visual: one outcome anchor per card (leads end to end), a compact
// features list, one CTA, and one microcopy line. Growth (or Founding user in
// beta) carries the "Most popular" pill. Custom is a horizontal strip below
// the row so it never competes with the primary cards on visual weight.
import { Fragment } from 'react';
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { SIGNUP_URL } from '@/lib/site';
import { CREDIT_COSTS, FREE_SIGNUP_CREDITS } from '@extrovertai/shared';
import { PRICING_MODE, type PricingCard, type CustomStrip } from '@/lib/pricing-mode';
import { LEGACY_CARDS, BETA_CARDS, GA_CARDS, CUSTOM_STRIP } from '@/lib/pricing-cards';

/* ── icons for the five-step workflow row (kept from previous version) ── */
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
const IcoCheck = (p: IP) => (<svg {...sp(p.className)}><path d="m5 12 4 4 10-10" /></svg>);
const IcoArrow = (p: IP) => (<svg {...sp(p.className)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);

const WORKFLOW = [
  { label: 'Find leads', chip: `${CREDIT_COSTS.search} credit`, Icon: IcoSearch },
  { label: 'Research', chip: `${CREDIT_COSTS.enrichment} credits`, Icon: IcoDoc },
  { label: 'Write', chip: `${CREDIT_COSTS.draft} credit`, Icon: IcoPen },
  { label: 'Send', chip: `${CREDIT_COSTS.send} credit`, Icon: IcoSend },
  { label: 'Track', chip: 'Included', Icon: IcoChart },
];

function resolveHref(href: string): string {
  return href === '__SIGNUP__' ? SIGNUP_URL : href;
}

function Card({ card, delayMs }: { card: PricingCard; delayMs: number }) {
  const highlighted = card.highlight === 'popular';
  const Icon = card.Icon;
  return (
    <Reveal
      as="article"
      delay={delayMs}
      className={[
        'relative flex h-full flex-col rounded-2xl border p-6 md:p-7 transition-shadow duration-200',
        highlighted
          ? 'border-accent bg-accent-soft/40 shadow-float'
          : 'border-line bg-surface shadow-card hover:shadow-float',
      ].join(' ')}
    >
      {highlighted ? (
        <span className="absolute right-5 top-5 rounded-full bg-accent px-2.5 py-1 text-[0.68rem] font-medium tracking-wide text-white">
          Most popular
        </span>
      ) : null}

      <div className="flex items-center gap-3">
        <span className={[
          'grid h-11 w-11 place-items-center rounded-full',
          highlighted ? 'bg-accent text-white' : 'bg-accent-soft text-accent',
        ].join(' ')}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-heading-md text-ink">{card.label}</p>
          <p className="mt-0.5 text-body-sm text-muted">{card.bestIf}</p>
        </div>
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-[2.5rem] font-medium leading-none tracking-tight text-ink">
          {card.price}
        </span>
        {card.priceSuffix ? (
          <span className="text-body-sm text-muted">{card.priceSuffix}</span>
        ) : null}
      </div>

      <div className="mt-5 rounded-lg bg-accent-soft px-4 py-3">
        <p className="text-body-sm font-medium text-accent">{card.outcome}</p>
      </div>

      <ul className="mt-5 space-y-2.5">
        {card.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-body-sm text-ink">
            <IcoCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-1 flex-col justify-end">
        <CtaButton
          href={resolveHref(card.ctaHref)}
          variant={highlighted ? 'primary' : 'secondary'}
          className="w-full"
        >
          {card.ctaLabel}
        </CtaButton>
        <p className="mt-2 text-center text-[0.78rem] text-muted">{card.microcopy}</p>
      </div>
    </Reveal>
  );
}

function CustomStripView({ strip }: { strip: CustomStrip }) {
  return (
    <Reveal
      as="aside"
      delay={0.05}
      className="mx-auto mt-6 flex max-w-5xl flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6 shadow-card md:flex-row md:items-center md:justify-between md:gap-8 md:p-7"
    >
      <div className="min-w-0">
        <p className="font-mono text-[0.72rem] uppercase tracking-wide text-accent">
          {strip.eyebrow}
        </p>
        <p className="mt-1 text-heading-sm text-ink">{strip.title}</p>
        <p className="mt-1 max-w-2xl text-body-sm text-muted">{strip.body}</p>
      </div>
      <CtaButton href={strip.ctaHref} variant="secondary" className="shrink-0">
        {strip.ctaLabel}
        <IcoArrow className="ml-2 h-4 w-4" />
      </CtaButton>
    </Reveal>
  );
}

export function LandingPricing() {
  const cards =
    PRICING_MODE === 'ga' ? GA_CARDS : PRICING_MODE === 'beta' ? BETA_CARDS : LEGACY_CARDS;
  const showCustom = PRICING_MODE !== 'legacy';
  const gridClass =
    cards.length === 2
      ? 'md:grid-cols-2'
      : cards.length === 4
        ? 'md:grid-cols-2 lg:grid-cols-4'
        : 'md:grid-cols-3';

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
              <li aria-hidden className="hidden h-12 items-center px-1 text-muted/40 sm:flex">
                <IcoArrow className="h-5 w-5" />
              </li>
            ) : null}
          </Fragment>
        ))}
      </Reveal>

      <div
        className={`mx-auto mt-14 grid max-w-5xl items-stretch gap-6 ${gridClass}`}
      >
        {cards.map((card, i) => (
          <Card key={card.id} card={card} delayMs={0.05 * i} />
        ))}
      </div>

      {showCustom ? <CustomStripView strip={CUSTOM_STRIP} /> : null}

      <Reveal delay={0.05} className="mt-10 flex flex-col items-center">
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <CtaButton href={SIGNUP_URL} size="lg">
            Start free
          </CtaButton>
          <CtaButton href="/pricing" variant="secondary" size="lg">
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
