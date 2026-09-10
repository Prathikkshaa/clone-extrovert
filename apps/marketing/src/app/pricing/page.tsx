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
    'AI sales prospecting pricing that is pay-as-you-go, not per seat. Start free with 100 credits, then pay only for the work you use - finding, researching, writing, and sending, from about $0.30 a lead. No seats, no subscription, no monthly minimum, credits never expire.',
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
      <FinalCta
        title="Find your first opportunities."
        body="100 free credits. No card. No subscription."
        cta="Start free"
      />
    </>
  );
}
