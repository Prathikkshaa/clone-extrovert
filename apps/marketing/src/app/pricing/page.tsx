import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Pricing } from '@/components/sections/pricing';
import { PricingRoiBand } from '@/components/sections/pricing-enterprise';
import { PricingCalculator } from '@/components/sections/pricing-calculator';
import {
  AlternativesStrip,
  ComparisonMatrix,
  EnterpriseCard,
} from '@/components/sections/pricing-enterprise';
import { Faq } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';
import { FaqJsonLd } from '@/components/structured-data';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Start free, then pay only for what you use. Simple credit pricing that covers finding, researching, writing, and sending - from ~$0.37 a lead, no seats, no subscription.',
  alternates: { canonical: '/pricing' },
};

// /pricing is the enterprise-grade proof page: lead with the economics (ROI band),
// then the honest packs, an interactive estimate, a category comparison, the full
// side-by-side matrix, and a custom tier for teams. All numbers derive from the
// shared credit constants (lib/pricing-math) so nothing can drift.
export default function PricingPage() {
  return (
    <>
      <FaqJsonLd />
      <PageHero eyebrow="Pricing" title="Pay for what you use - no five-tool stack.">
        Start free with credits included. Buy more only when you need them. Every number below
        is the real price - nothing hidden.
      </PageHero>

      <PricingRoiBand />
      <Pricing withHeading={false} />
      <PricingCalculator />
      <AlternativesStrip />
      <ComparisonMatrix />
      <EnterpriseCard />

      <Faq />
      <FinalCta />
    </>
  );
}
