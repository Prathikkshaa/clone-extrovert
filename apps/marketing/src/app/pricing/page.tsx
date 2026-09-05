import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Pricing } from '@/components/sections/pricing';
import { Faq } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';
import { FaqJsonLd } from '@/components/structured-data';

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
      <Faq />
      <FinalCta />
    </>
  );
}
