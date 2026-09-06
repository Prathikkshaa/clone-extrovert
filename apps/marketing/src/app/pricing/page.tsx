import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Pricing } from '@/components/sections/pricing';
import { Faq } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';
import { FaqJsonLd } from '@/components/structured-data';
import { Reveal } from '@/components/reveal';

// Quick self-selection helper for researchers on /pricing (not on the home page).
const PICKS = [
  { when: 'You’re just testing the waters', pick: 'Starter', note: 'one niche, first campaign' },
  { when: 'You run steady, weekly outreach', pick: 'Growth', note: 'freelancers & consultants' },
  { when: 'You send at volume or for clients', pick: 'Scale', note: 'agencies, multiple inboxes' },
];

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Start free, then pay only for what you use. Simple credit pricing that covers finding, researching, writing, and sending - no seats, no subscription.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return (
    <>
      <FaqJsonLd />
      <PageHero eyebrow="Pricing" title="Pay for what you use - no five-tool stack.">
        Start free with credits included. Buy more only when you need them. Every number below
        is the real price - nothing hidden.
      </PageHero>
      <Pricing withHeading={false} />

      {/* Which pack? - self-selection helper (research intent on /pricing). */}
      <section className="shell pb-4">
        <Reveal className="rounded-xl border border-line bg-surface p-6 md:p-8">
          <h2 className="text-heading-md text-ink">Which pack is right for me?</h2>
          <p className="mt-2 max-w-prose text-body text-muted">
            You only pay for what you use - find a lead (1 credit), research it (2), write its
            3-email sequence (1), and send each email (1). A lead worked end to end runs about
            5&ndash;7 credits, so pick by how much outreach you run:
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {PICKS.map((p) => (
              <li key={p.pick} className="rounded-md border border-line bg-canvas p-4">
                <p className="text-body-sm text-muted">{p.when}</p>
                <p className="mt-2 text-heading-sm text-ink">{p.pick}</p>
                <p className="mt-1 text-body-sm text-muted">{p.note}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <Faq />
      <FinalCta />
    </>
  );
}
