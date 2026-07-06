// Landing page (/) — M01 ships the SHELL only. This is a restrained, on-brand
// intro that exercises the type scale, the single accent, and asymmetric layout so
// the empty shell already reads as intentional. The real hero + sections land in
// M02/M03 via the clearly-labeled slots below.
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { SectionPlaceholder } from '@/components/section-placeholder';
import { SIGNUP_URL, CTA_MICROCOPY } from '@/lib/site';

export default function LandingPage() {
  return (
    <>
      <section className="shell grid items-center gap-10 pb-8 pt-16 md:grid-cols-[1.15fr_0.85fr] md:pt-24">
        <Reveal>
          <p className="text-eyebrow uppercase text-accent">Outreach that books meetings</p>
          <h1 className="mt-4 text-display-lg text-ink">
            From an empty calendar to booked meetings — without learning to sell.
          </h1>
          <p className="mt-6 max-w-prose text-body-lg text-muted">
            Find local businesses worth reaching, send emails that sound like your best
            salesperson wrote each one, and stay out of spam. One tool, pay for what you use.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <CtaButton href={SIGNUP_URL} size="lg">
              Start free
            </CtaButton>
            <CtaButton href="/how-it-works" variant="secondary" size="lg">
              See how it works
            </CtaButton>
          </div>
          <p className="mt-3 text-body-sm text-muted">{CTA_MICROCOPY}</p>
        </Reveal>

        {/* Product-visual slot — the constrained hero island + real screenshot land
            in M02. Placeholder framed so the layout balances now. */}
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/3] w-full rounded-xl border border-line bg-surface">
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
              <p className="text-body-sm text-muted">
                Product visual / hero island — <span className="text-ink">M02</span>
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <SectionPlaceholder
        file="M02"
        title="The pain, the 4-step how-it-works, and the product demo"
        note="Above-the-fold hero (with the one constrained 3D/parallax island), the problem section, the four-step walkthrough, and the autoplay silent demo video."
      />
      <SectionPlaceholder
        file="M03"
        title="Differentiators, founder's note, pricing, FAQ, and the final CTA"
        note="The zigzag differentiators, an honest founder's note, transparent pricing, an AEO-ready FAQ, and the closing call to action."
      />
    </>
  );
}
