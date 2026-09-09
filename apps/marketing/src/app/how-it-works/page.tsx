import type { Metadata } from 'next';
import { FaqJsonLd } from '@/components/structured-data';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Differentiators } from '@/components/sections/differentiators';
import { Demo } from '@/components/sections/demo';
import { FinalCta } from '@/components/sections/final-cta';
import { Faq } from '@/components/sections/faq';
import { HeroLeadsPanel } from '@/components/hero-leads-panel';
import { CtaButton } from '@/components/cta-button';
import { Reveal } from '@/components/reveal';
import { SIGNUP_URL } from '@/lib/site';
import { HOW_IT_WORKS_FAQ_ITEMS } from '@/lib/faq';
import {
  CREDITS_PER_LEAD_LOW,
  CREDITS_PER_LEAD_HIGH,
  leadsForCredits,
} from '@/lib/pricing-math';
import { CREDIT_PACKS, FREE_SIGNUP_CREDITS } from '@extrovertai/shared';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'How Milo turns an empty pipeline into a booked meeting: pick a market, find businesses with a buying signal, let AI research and personalize outreach from their own site and reviews, send safely from your inbox, and book meetings. Answers common questions about AI lead generation, qualified local prospecting, and personalized cold email.',
  alternates: { canonical: '/how-it-works' },
};

const growth = CREDIT_PACKS.find((p) => p.id === 'growth')!;
const growthLeads = leadsForCredits(growth.credits);

export default function HowItWorksPage() {
  return (
    <>
      <FaqJsonLd items={HOW_IT_WORKS_FAQ_ITEMS} />
      {/* HERO — the transformation, not the feature list. */}
      <section className="shell pt-16 pb-6 md:pt-24 md:pb-8">
        <div className="grid items-center gap-10 md:grid-cols-[1.05fr_1fr] md:gap-14">
          <Reveal className="max-w-xl">
            <p className="text-eyebrow uppercase tracking-wide text-accent">How it works</p>
            <h1 className="mt-3 text-display-lg text-ink">
              From an empty pipeline to a{' '}
              <span className="text-accent">booked meeting</span>.
            </h1>
            <p className="mt-5 text-body-lg text-muted">
              Pick a market. Milo finds local businesses that already have a problem you can
              solve, researches them, writes personalized outreach from their own site and
              reviews, and sends it from your inbox — one meeting at a time.
            </p>
            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <CtaButton href={SIGNUP_URL} size="lg">
                Find my first 20 leads
              </CtaButton>
              <CtaButton href="#demo" variant="secondary" size="lg">
                Watch the loop
              </CtaButton>
            </div>
            <p className="mt-3 text-body-sm text-muted">
              {FREE_SIGNUP_CREDITS} free credits · No card · You only pay when Milo does the work.
            </p>
          </Reveal>

          <Reveal delay={0.05} className="min-w-0">
            <HeroLeadsPanel />
          </Reveal>
        </div>
      </section>

      {/* JOURNEY — the 4-step canonical stepper, reframed as the pipeline story. */}
      <HowItWorks
        subtitle="One continuous loop — pick a market, discover businesses with a buying signal, personalize in your voice, and book meetings from your own inbox."
      />

      {/* CENTRAL DIFFERENTIATOR — buying signals, elevated to its own moment. */}
      <section className="shell py-section-y">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <Reveal className="min-w-0">
            <p className="text-eyebrow uppercase text-accent">Buying-signal targeting</p>
            <h2 className="mt-3 text-display-md text-ink">
              Not another lead database. Find the businesses that already have a problem you
              can solve.
            </h2>
            <p className="mt-5 text-body-lg text-muted">
              Milo filters real local businesses by ready-to-buy signals — no website, thin
              online presence, weak reviews — so every prospect on your list has a concrete
              reason to hear from you. That’s the difference between reaching 500 strangers
              and reaching 20 who need what you sell.
            </p>
            <ul className="mt-6 space-y-2.5 text-body-sm text-ink">
              {[
                'Search by industry and city — Milo returns real, public local businesses.',
                'Filter for “no website”, low online presence, or thin reviews.',
                'Every lead comes with the signal that qualified it.',
              ].map((li) => (
                <li key={li} className="flex items-start gap-2.5">
                  <span className="mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12 4 4 10-10" /></svg>
                  </span>
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.05} className="min-w-0">
            <HeroLeadsPanel />
          </Reveal>
        </div>
      </section>

      {/* DEMO — the full cold-city → booked-meeting loop (dark section, keeps rhythm). */}
      <Demo />

      {/* PERSONALIZATION — a single objection row from the shared Differentiators source. */}
      <Differentiators
        only={['Personalized, not spam']}
        hideHeading={false}
        eyebrow="Personalization"
        title="How Milo personalizes cold emails without sounding generic."
        intro="Every email is written from that lead’s own website and reviews, in your voice — so it reads like a real note from a person who did their homework."
      />

      {/* PRICING TIE-IN — the workflow's natural consequence, not a random price block. */}
      <section className="shell pb-section-y">
        <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface p-8 shadow-card md:p-10">
          <p className="text-eyebrow uppercase text-accent">You only pay when Milo does the work</p>
          <h2 className="mt-3 text-heading-lg text-ink">
            {FREE_SIGNUP_CREDITS} free credits, then about {CREDITS_PER_LEAD_LOW}–
            {CREDITS_PER_LEAD_HIGH} credits per lead — end to end.
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            A credit is one unit of prospecting work: finding a business, researching it,
            writing its sequence, sending an email. If a step doesn’t run, you aren’t charged.
            Your first {FREE_SIGNUP_CREDITS} credits (no card) get you through roughly{' '}
            {leadsForCredits(FREE_SIGNUP_CREDITS).low}–
            {leadsForCredits(FREE_SIGNUP_CREDITS).high} leads before you ever pay. Growth
            (${(growth.priceUsdCents / 100).toLocaleString('en-US')} · {growth.credits.toLocaleString('en-US')}{' '}
            credits) works out to about {growthLeads.low}–{growthLeads.high} leads.
          </p>
          <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <CtaButton href={SIGNUP_URL} size="md">
              Try a market free
            </CtaButton>
            <CtaButton href="/pricing" variant="secondary" size="md">
              See full pricing
            </CtaButton>
          </div>
        </div>
      </section>

      {/* TRUST + COMPLIANCE — moved lower, but complete. Two objection rows. */}
      <Differentiators
        only={['Lands in the inbox, stays compliant', 'You stay in control']}
        hideHeading={false}
        eyebrow="Trust & compliance"
        title="Sends the way a careful human does — and never without your say-so."
        intro="Your Gmail or Outlook, warmed up gradually, one message at a time. Every email carries one-click unsubscribe and your address. Nothing sends until you approve it."
      />

      {/* AGENCIES — secondary audience, kept small so it doesn’t interrupt the story. */}
      <section className="shell pb-section-y">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-3 rounded-xl border border-line bg-surface px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-body font-medium text-ink">Running an agency?</p>
            <p className="mt-1 text-body-sm text-muted">
              Milo works the same for a solo founder or a team — no seats, one credit pool,
              one voice per market you run.
            </p>
          </div>
          <CtaButton href={SIGNUP_URL} variant="secondary" size="sm">
            Start a market
          </CtaButton>
        </div>
      </section>

      {/* FAQ — search & answer intent, curated for /how-it-works. */}
      <Faq
        items={HOW_IT_WORKS_FAQ_ITEMS}
        title="How AI outreach really works — the honest answers."
        intro="The questions people (and AI answer engines) ask about AI lead generation and personalized cold email."
      />

      <FinalCta />
    </>
  );
}
