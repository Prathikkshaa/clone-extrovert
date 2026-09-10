// SERVER. Shared plan-cards renderer used by the landing pricing section AND
// the standalone /pricing page. Single source for the card visual.
//
// Design intent:
//   - Pure typography. No emoji, no illustration. Identity comes from a small
//     mono index tag at the top-right of each card and from the plan name.
//   - Audience-first. The line under the plan name names the buyer, not a
//     feature; buyers self-select faster.
//   - One outcome anchor. One value note. Four features max. One CTA. One
//     microcopy line under the CTA.
//   - Highlighted card carries the sole "Most popular" pill and a subtle
//     accent surface.
//   - Trust chips are a full-width row under the card grid.
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { SIGNUP_URL } from '@/lib/site';
import type { PricingCard, CustomStrip } from '@/lib/pricing-mode';
import { TRUST_CHIPS } from '@/lib/pricing-cards';

type IP = { className?: string };
function IcoCheck(p: IP) {
  return (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12 4 4 10-10" />
    </svg>
  );
}
function IcoArrow(p: IP) {
  return (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
function IcoShield(p: IP) {
  return (
    <svg viewBox="0 0 24 24" className={p.className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3 5 6v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6z" />
    </svg>
  );
}

function resolveHref(href: string): string {
  return href === '__SIGNUP__' ? SIGNUP_URL : href;
}

function PlanCard({ card, delayMs }: { card: PricingCard; delayMs: number }) {
  const highlighted = card.highlight === 'popular';
  return (
    <Reveal
      as="article"
      delay={delayMs}
      className={[
        'relative flex h-full flex-col rounded-2xl border p-7 transition-shadow duration-200 md:p-8',
        highlighted
          ? 'border-accent bg-accent-soft/40 shadow-float'
          : 'border-line bg-surface shadow-card hover:shadow-float',
      ].join(' ')}
    >
      {/* Mono index tag, top-right. Highlighted card uses accent. */}
      <span
        aria-hidden
        className={[
          'absolute right-6 top-6 font-mono text-[0.72rem] tracking-wide',
          highlighted ? 'text-accent' : 'text-muted/70',
        ].join(' ')}
      >
        {card.index}
      </span>

      {highlighted ? (
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent px-3 py-1 text-[0.68rem] font-medium tracking-wide text-white shadow-card">
          Most popular
        </span>
      ) : null}

      {/* Plan identity */}
      <div>
        <p className="text-heading-md text-ink">{card.label}</p>
        <p className="mt-2 min-h-[3rem] max-w-[22ch] text-body-sm leading-snug text-muted">
          {card.audience}
        </p>
      </div>

      {/* Price */}
      <div className="mt-7 flex items-baseline gap-2">
        <span className="text-[2.5rem] font-medium leading-none tracking-tight text-ink">
          {card.price}
        </span>
        {card.priceSuffix ? (
          <span className="text-body-sm text-muted">{card.priceSuffix}</span>
        ) : null}
      </div>

      {/* Outcome + value note */}
      <div
        className={[
          'mt-5 rounded-lg px-4 py-3',
          highlighted ? 'bg-accent text-white' : 'bg-accent-soft text-accent',
        ].join(' ')}
      >
        <p className="text-body-sm font-medium">{card.outcome}</p>
        <p
          className={[
            'mt-1 text-[0.78rem] leading-snug',
            highlighted ? 'text-white/85' : 'text-accent/85',
          ].join(' ')}
        >
          {card.outcomeNote}
        </p>
      </div>

      {/* Features */}
      <ul className="mt-6 space-y-3">
        {card.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-body-sm text-ink/90">
            <IcoCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-8 flex flex-1 flex-col justify-end">
        <CtaButton
          href={resolveHref(card.ctaHref)}
          variant={highlighted ? 'primary' : 'secondary'}
          size="md"
          className="w-full"
        >
          {card.ctaLabel}
          {card.ctaArrow ? <IcoArrow className="ml-1.5 h-4 w-4" /> : null}
        </CtaButton>
        <p className="mt-3 text-center text-[0.75rem] leading-snug text-muted">
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
      className="mx-auto mt-8 flex max-w-6xl flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6 shadow-card md:flex-row md:items-center md:justify-between md:gap-8"
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

function TrustStrip() {
  return (
    <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-body-sm text-muted">
      {TRUST_CHIPS.map((c, i) => (
        <span key={c} className="flex items-center gap-2">
          {i === TRUST_CHIPS.length - 1 ? (
            <IcoShield className="h-4 w-4 text-accent/80" />
          ) : (
            <IcoCheck className="h-4 w-4 text-accent/80" />
          )}
          {c}
        </span>
      ))}
    </div>
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
      <div className={`mx-auto grid max-w-6xl items-stretch gap-6 ${gridClass}`}>
        {cards.map((card, i) => (
          <PlanCard key={card.id} card={card} delayMs={0.05 * i} />
        ))}
      </div>
      <TrustStrip />
      {custom ? <CustomStripView strip={custom} /> : null}
    </>
  );
}
