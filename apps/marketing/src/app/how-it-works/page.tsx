import type { Metadata } from 'next';
import { FaqJsonLd } from '@/components/structured-data';
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { Differentiators } from '@/components/sections/differentiators';
import { Demo } from '@/components/sections/demo';
import { Chapters } from '@/components/how-it-works/chapters';
import { HoverFaq } from '@/components/how-it-works/hover-faq';
import { HOW_IT_WORKS_FAQ_ITEMS } from '@/lib/faq';
import { SIGNUP_URL } from '@/lib/site';
import { FREE_SIGNUP_CREDITS } from '@extrovertai/shared';
import { CREDITS_PER_LEAD_LOW, CREDITS_PER_LEAD_HIGH } from '@/lib/pricing-math';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'The mechanism behind Milo. How AI lead generation actually works: define a market, discover local businesses, read them, confirm the buying signal, personalize outreach, send responsibly from your own inbox, and turn replies into conversations.',
  alternates: { canonical: '/how-it-works' },
};

const CONTENTS = [
  'You define the market.',
  'Milo discovers real local businesses.',
  'It reads each business.',
  'It confirms the buying signal.',
  'It writes the outreach in your voice.',
  'It sends the way a careful human does.',
  'It turns a reply into a conversation.',
];

/**
 * /how-it-works. Editorial explainer, deliberately not a landing hero. Answers:
 * "If I give Milo a market, what actually happens between that decision and a
 * sales conversation?" Threaded by one running example.
 */
export default function HowItWorksPage() {
  return (
    <>
      <FaqJsonLd items={HOW_IT_WORKS_FAQ_ITEMS} />

      {/* COVER. Stance on the left, typographic table of contents on the right. */}
      <section className="shell pt-14 md:pt-20">
        <div className="grid gap-10 border-b border-line pb-14 md:grid-cols-[1.05fr_1fr] md:gap-16 md:pb-20">
          <Reveal className="max-w-xl">
            <p className="font-mono text-eyebrow uppercase tracking-wide text-muted">
              The mechanism
            </p>
            <h1 className="mt-5 text-display-lg text-ink">
              Most prospecting starts with a list.
              <br />
              <span className="text-accent">Milo starts with a reason to reach out.</span>
            </h1>
            <p className="mt-6 max-w-md text-body-lg text-muted">
              A short, honest look at how AI lead generation, buying-signal discovery,
              and personalized outreach actually fit together. End to end, one example,
              nothing hidden.
            </p>
            <p className="mt-5 font-mono text-body-sm text-muted">
              Read in about three minutes.
            </p>
          </Reveal>

          <Reveal delay={0.05} className="min-w-0 md:pl-6 md:border-l md:border-line">
            <p className="font-mono text-eyebrow uppercase tracking-wide text-muted">
              Contents
            </p>
            <ol className="mt-5 space-y-3.5">
              {CONTENTS.map((t, i) => (
                <li
                  key={t}
                  className="grid grid-cols-[auto_1fr] items-baseline gap-4 text-body text-ink"
                >
                  <span className="font-mono text-body-sm tracking-tight text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* THE MECHANISM. Seven chapters, one running example. */}
      <Chapters />

      {/* SEE IT AT WORK. The existing Demo, kept intentionally as concrete proof. */}
      <Demo />

      {/* WHY CONTEXT WINS. One row from the shared Differentiators source. */}
      <Differentiators
        only={['Personalized, not spam']}
        eyebrow="Why it works"
        title="Context is what makes the outreach land."
        intro="Every draft is written from that specific business. That is the difference between an email a stranger deletes and a note an owner replies to."
      />

      {/* TRUST AND COMPLIANCE. Condensed to a compact three-column mechanic. */}
      <section className="shell py-section-y">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-eyebrow uppercase text-accent">Trust & compliance</p>
          <h2 className="mt-3 text-display-md text-ink">Sends the way a careful human does.</h2>
        </Reveal>
        <Reveal delay={0.05} className="mx-auto mt-10 grid max-w-4xl gap-x-10 gap-y-8 md:grid-cols-3">
          {[
            {
              t: 'Your inbox',
              d: 'Connected via Gmail or Outlook OAuth. Tokens encrypted. Disconnect anytime.',
            },
            {
              t: 'Warmed up, throttled',
              d: 'Slow daily ramp, one at a time, randomized spacing. Bounces watched.',
            },
            {
              t: 'Unsubscribe & address',
              d: 'One-click unsubscribe and your physical address on every message. CAN-SPAM, PECR, GDPR-aware.',
            },
          ].map((c) => (
            <div key={c.t}>
              <p className="text-heading-sm text-ink">{c.t}</p>
              <p className="mt-2 max-w-prose text-body-sm text-muted">{c.d}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* PRICING + AGENCIES. One compact rule, two short lines each. */}
      <section className="shell pb-section-y">
        <div className="mx-auto grid max-w-4xl gap-8 border-y border-line py-8 md:grid-cols-2 md:gap-16 md:py-10">
          <div>
            <p className="font-mono text-eyebrow uppercase tracking-wide text-muted">
              Pricing, plainly
            </p>
            <p className="mt-2 text-heading-sm text-ink">
              You only pay when Milo does the work.
            </p>
            <p className="mt-2 text-body-sm text-muted">
              {FREE_SIGNUP_CREDITS} free credits on signup. About {CREDITS_PER_LEAD_LOW} to{' '}
              {CREDITS_PER_LEAD_HIGH} credits per lead, end to end. Growth pack is 550 to 650
              credits when you are ready to keep going.
            </p>
          </div>
          <div>
            <p className="font-mono text-eyebrow uppercase tracking-wide text-muted">
              Agencies
            </p>
            <p className="mt-2 text-heading-sm text-ink">Same mechanism, more markets.</p>
            <p className="mt-2 text-body-sm text-muted">
              No seats. Run one market per client from the same pool of credits. Milo keeps a
              distinct voice per market.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ. One open, hover-to-open on desktop, tap on touch. */}
      <HoverFaq items={HOW_IT_WORKS_FAQ_ITEMS} />

      {/* CLOSE. Small, single CTA on a hairline. Not a dark full-width block. */}
      <section className="shell pb-section-y">
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 border-t border-line pt-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-heading-sm text-ink">Try the mechanism on your own market.</p>
            <p className="mt-1 text-body-sm text-muted">
              {FREE_SIGNUP_CREDITS} free credits. No card. You only pay when the work runs.
            </p>
          </div>
          <CtaButton href={SIGNUP_URL} size="md">
            Find my first 20 leads
          </CtaButton>
        </div>
      </section>
    </>
  );
}
