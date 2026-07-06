import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { SectionPlaceholder } from '@/components/section-placeholder';

export const metadata: Metadata = { title: 'Pricing' };

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title="Pay for what you use — no five-tool stack.">
        Simple credit-based pricing. Full tiers, the FAQ, and the comparison land in M03.
      </PageHero>
      <SectionPlaceholder
        file="M03"
        title="Pricing tiers, credit packs, and the pricing FAQ"
        note="Transparent pack pricing (credits for search, enrichment, drafting, sending) with a deeper FAQ."
      />
    </>
  );
}
