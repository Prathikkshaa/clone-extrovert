// SERVER. Shared plan-cards renderer used by the landing pricing section AND
// the standalone /pricing page. Single source for the card visual: outcome
// anchor, four features max, one CTA, one microcopy line. Growth (or Founding
// user in beta) carries the sole "Most popular" pill. Custom is a compact
// horizontal strip below the cards, never a fifth card.
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { SIGNUP_URL } from '@/lib/site';
import type { PricingCard, CustomStrip } from '@/lib/pricing-mode';

type IP = { className?: string };
function IcoCheck(p: IP) {
  return (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}
function IcoArrow(p: IP) {
  return (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function resolveHref(href: string): string {
  return href === '__SIGNUP__' ? SIGNUP_URL : href;
}

function PlanCard({ card, delayMs }: { card: PricingCard; delayMs: number }) {
  const highlighted = card.highlight === 'popular';
  const Icon = card.Icon;
  return (
    <Reveal
      as="article"
      delay={delayMs}
      className={[
        'relative flex h-full flex-col rounded-2xl border p-6 transition-shadow duration-200 md:p-7',
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
        <span
          className={[
            'grid h-10 w-10 place-items-center rounded-full',
            highlighted ? 'bg-accent text-white' : 'bg-accent-soft text-accent',
          ].join(' ')}
        >
          <Icon className="h-[1.1rem] w-[1.1rem]" />
        </span>
        <div className="min-w-0">
          <p className="text-heading-md text-ink">{card.label}</p>
          <p className="mt-0.5 text-body-sm text-muted">{card.bestIf}</p>
        </div>
      </div>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-[2.25rem] font-medium leading-none tracking-tight text-ink">
          {card.price}
        </span>
        {card.priceSuffix ? (
          <span className="text-body-sm text-muted">{card.priceSuffix}</span>
        ) : null}
      </div>

      <div className="mt-4 rounded-lg bg-accent-soft px-3.5 py-2.5">
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
          size="sm"
          className="w-full"
        >
          {card.ctaLabel}
        </CtaButton>
        <p className="mt-2 text-center text-[0.75rem] leading-snug text-muted">
          {card.microcopy}
        </p>
      </div>
    </Reveal>
  );
}

function CustomStripView({ strip }: { strip: CustomStrip }) {
  return (
    <Reveal
      as="aside"
      delay={0.05}
      className="mx-auto mt-6 flex max-w-5xl flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card md:flex-row md:items-center md:justify-between md:gap-8 md:p-6"
    >
      <div className="min-w-0">
        <p className="font-mono text-[0.72rem] uppercase tracking-wide text-accent">
          {strip.eyebrow}
        </p>
        <p className="mt-1 text-heading-sm text-ink">{strip.title}</p>
        <p className="mt-1 max-w-2xl text-body-sm text-muted">{strip.body}</p>
      </div>
      <CtaButton href={strip.ctaHref} variant="secondary" size="sm" className="shrink-0">
        {strip.ctaLabel}
        <IcoArrow className="ml-1.5 h-3.5 w-3.5" />
      </CtaButton>
    </Reveal>
  );
}

export function PlanCards({
  cards,
  custom,
}: {
  cards: PricingCard[];
  custom?: CustomStrip;
}) {
  const gridClass =
    cards.length === 2
      ? 'md:grid-cols-2'
      : cards.length === 4
        ? 'md:grid-cols-2 lg:grid-cols-4'
        : 'md:grid-cols-3';
  return (
    <>
      <div className={`mx-auto grid max-w-5xl items-stretch gap-5 ${gridClass}`}>
        {cards.map((card, i) => (
          <PlanCard key={card.id} card={card} delayMs={0.05 * i} />
        ))}
      </div>
      {custom ? <CustomStripView strip={custom} /> : null}
    </>
  );
}
