// SERVER component - the hero. Asymmetric, left-aligned (M00 §5): copy + CTAs on
// the left, the product visual (with the one parallax island) on the right;
// stacks on mobile (headline → visual → CTAs handled by source order + grid).
//
// Copy is DIRECTION per M02 - specific, transformation-led, no hype words. The
// user refines final words.
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { HeroVisual } from '@/components/hero-visual';
import { ProductPanel } from '@/components/product-panel';
import { SIGNUP_URL, CTA_MICROCOPY } from '@/lib/site';

export function Hero() {
  return (
    <section className="shell grid items-center gap-12 pb-10 pt-14 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:pb-16 md:pt-24">
      <div>
        <Reveal>
          <p className="text-eyebrow uppercase text-accent">Outreach that books meetings</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-4 text-display-lg text-ink">
            Find the right businesses, email them like a pro, and book meetings.
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-prose text-body-lg text-muted">
            For founders and agencies who need clients - not another tool to learn. Find local
            businesses worth reaching, send emails that sound like your best salesperson wrote
            each one, and stay out of spam. One tool, pay for what you use.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CtaButton href={SIGNUP_URL} size="lg">
              Start free
            </CtaButton>
            <CtaButton href="#demo" variant="secondary" size="lg">
              See how it works
            </CtaButton>
          </div>
          <p className="mt-3 text-body-sm text-muted">{CTA_MICROCOPY}</p>
        </Reveal>
      </div>

      {/* Product visual + the one constrained parallax island. */}
      <Reveal delay={0.12} y={24}>
        <HeroVisual>
          <ProductPanel />
        </HeroVisual>
      </Reveal>
    </section>
  );
}
