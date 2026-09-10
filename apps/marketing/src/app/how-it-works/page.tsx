import type { Metadata } from 'next';
import { FaqJsonLd } from '@/components/structured-data';
import { Reveal } from '@/components/reveal';
import { Differentiators } from '@/components/sections/differentiators';
import { Demo } from '@/components/sections/demo';
import { Faq } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';
import { MechanismExplorer } from '@/components/how-it-works/mechanism-explorer';
import { HOW_IT_WORKS_FAQ_ITEMS } from '@/lib/faq';
import { FREE_SIGNUP_CREDITS } from '@extrovertai/shared';
import { CREDITS_PER_LEAD_LOW, CREDITS_PER_LEAD_HIGH } from '@/lib/pricing-math';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'The mechanism behind Milo. How AI sales prospecting actually works: define a market, discover local businesses, read them, confirm the buying signal, personalize outreach, send responsibly from your own inbox, and turn replies into conversations.',
  alternates: { canonical: '/how-it-works' },
};

/**
 * /how-it-works. Editorial explainer, deliberately not a landing hero. Answers:
 * "If I give Milo a market, what actually happens between that decision and a
 * sales conversation?" Threaded by one running example.
 */
export default function HowItWorksPage() {
  return (
    <>
      <FaqJsonLd items={HOW_IT_WORKS_FAQ_ITEMS} />

      {/* COVER. Editorial stance, single measure, tight. The horizontal ruler
          in the explorer below IS the table of contents. */}
      <section className="shell pt-14 pb-8 md:pt-20 md:pb-10">
        <Reveal className="mx-auto max-w-3xl">
          <p className="font-mono text-eyebrow uppercase tracking-wide text-muted">
            The mechanism
          </p>
          <h1 className="mt-5 text-display-lg text-ink">
            Most prospecting starts with a list.{' '}
            <span className="text-accent">Milo starts with a reason to reach out.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-body-lg text-muted">
            A short, honest look at how AI sales prospecting, buying-signal discovery, and
            personalized outreach actually fit together. Seven steps, one running example,
            nothing hidden.
          </p>
        </Reveal>
      </section>

      {/* THE MECHANISM. Horizontal seven-step explorer, one running example. */}
      <MechanismExplorer />

      {/* SEE IT AT WORK. The existing Demo, kept intentionally as concrete proof. */}
      <Demo />

      {/* WHY CONTEXT WINS. One row from the shared Differentiators source. */}
      <Differentiators
        only={['Personalized, not spam']}
        eyebrow="Why it works"
        title="Context is what makes the outreach land."
        intro="Every draft is written from that specific business. That is the difference between an email a stranger deletes and a note an owner replies to."
      />

      {/* TRUST + DELIVERABILITY. Outcome-first 2x2 value grid. */}
      <section className="shell py-section-y">
        <Reveal className="mx-auto max-w-3xl">
          <p className="text-eyebrow uppercase text-accent">Deliverability & trust</p>
          <h2 className="mt-3 text-display-md text-ink">
            Built to land in the inbox, not the spam folder.
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            Cold outreach fails for one boring reason: it looks like blast. Milo is engineered
            end to end to look like you sending a real email, one at a time, from your own
            domain, in a way inbox filters trust.
          </p>
        </Reveal>

        <Reveal delay={0.05} className="mx-auto mt-12 max-w-5xl">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {[
              {
                stat: '0',
                unit: 'shared blast servers',
                title: 'Inbox, not spam folder.',
                copy: 'Warm-up ramps you gradually from a handful a day up to your daily cap. Sends spread across the day with randomized spacing and hard rate limits. Bounces pause the campaign automatically so a bad address never poisons the rest.',
              },
              {
                stat: 'You',
                unit: 'own the send',
                title: 'From your own inbox, on your own reputation.',
                copy: 'Connected through Gmail or Outlook OAuth. Tokens encrypted at rest. Every message ships from you@yourinbox.com, so replies come home and your domain reputation is yours to keep.',
              },
              {
                stat: '1×1',
                unit: 'per lead, per send',
                title: 'Behaves like a careful human.',
                copy: 'One message at a time. Natural, varied intervals. Follow-ups auto-stop the moment someone replies. No mass send, no midnight blast, no pattern for filters to catch.',
              },
              {
                stat: '100%',
                unit: 'of sends, compliant',
                title: 'Legal on every message.',
                copy: 'Every email carries a working one-click unsubscribe token and your physical address, non-removable. CAN-SPAM in the US, PECR and GDPR-aware in the UK and EU. Unsubscribes suppress on the spot, forever.',
              },
            ].map((v) => (
              <li key={v.title} className="flex flex-col gap-4 bg-surface p-6 md:p-8">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-display-md leading-none text-accent">
                    {v.stat}
                  </span>
                  <span className="font-mono text-[0.72rem] uppercase tracking-wide text-muted">
                    {v.unit}
                  </span>
                </div>
                <p className="text-heading-sm text-ink">{v.title}</p>
                <p className="max-w-prose text-body-sm text-muted">{v.copy}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* PRICING + AGENCIES. Outcome-led, tighter, with a real anchor number. */}
      <section className="shell pb-section-y">
        <Reveal className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-6 md:p-8">
            <p className="font-mono text-[0.72rem] uppercase tracking-wide text-accent">
              Pricing, plainly
            </p>
            <p className="mt-4 text-heading-lg text-ink">
              You only pay when Milo does the work.
            </p>
            <div className="mt-6 flex items-baseline gap-3 border-t border-line pt-6">
              <span className="font-mono text-display-md leading-none text-ink">
                {FREE_SIGNUP_CREDITS}
              </span>
              <span className="text-body-sm text-muted">free credits on signup, no card.</span>
            </div>
            <p className="mt-4 max-w-prose text-body-sm text-muted">
              Roughly {CREDITS_PER_LEAD_LOW} to {CREDITS_PER_LEAD_HIGH} credits per lead, end
              to end. The Growth pack tops you up with 650 credits (about 92 to 130 leads) when
              the mechanism proves out. No seats, no monthly minimum, credits never expire.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 md:p-8">
            <p className="font-mono text-[0.72rem] uppercase tracking-wide text-accent">
              For agencies
            </p>
            <p className="mt-4 text-heading-lg text-ink">
              One tool, many markets. No seats.
            </p>
            <div className="mt-6 flex items-baseline gap-3 border-t border-line pt-6">
              <span className="font-mono text-display-md leading-none text-ink">1</span>
              <span className="text-body-sm text-muted">
                credit pool across every client market.
              </span>
            </div>
            <p className="mt-4 max-w-prose text-body-sm text-muted">
              Run a distinct voice, market, and inbox per client. Same mechanism, same
              deliverability guardrails, one balance to top up. Bring your team without a seat
              tax.
            </p>
          </div>
        </Reveal>
      </section>

      {/* FAQ. Site-wide accordion, brand tone. Same pattern as landing / pricing. */}
      <Faq
        items={HOW_IT_WORKS_FAQ_ITEMS}
        tone="brand"
        title="How AI outreach actually works."
        intro="Short answers to the questions people ask about AI sales prospecting, buying signals, and personalized cold outreach."
      />

      {/* CLOSE. Site-wide FinalCta, one primary action. */}
      <FinalCta
        title="Try the mechanism on your own market."
        body={`${FREE_SIGNUP_CREDITS} free credits. No card. You only pay when Milo does the work.`}
        cta="Find my first 20 leads"
      />
    </>
  );
}
