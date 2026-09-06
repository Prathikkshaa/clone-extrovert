import type { Metadata } from 'next';
import { Pricing } from '@/components/sections/pricing';
import { PricingRoiBand, ComparisonMatrix } from '@/components/sections/pricing-enterprise';
import { Faq } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';
import { FaqJsonLd } from '@/components/structured-data';
import { PRICING_FAQ_ITEMS } from '@/lib/faq';

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
      <FaqJsonLd items={PRICING_FAQ_ITEMS} />

      <PricingRoiBand />
      <Pricing withHeading={false} withPacks={false} withFreeTier={false} />
      <ComparisonMatrix />

      <Faq
        items={PRICING_FAQ_ITEMS}
        title="Pricing, answered."
        intro="The money questions people ask before they start."
      />
      <FinalCta />
    </>
  );
}
