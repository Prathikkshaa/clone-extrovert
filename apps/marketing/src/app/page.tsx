// Landing page (/) - the full conversion page. M02 built the top (hero → pain →
// how-it-works → demo); M03 adds the trust + close (differentiators → founder's
// note → pricing → FAQ → final CTA). RSC-first: only the header, reveal, parallax,
// demo player, and FAQ accordion are client islands.
import { Hero } from '@/components/sections/hero';
import { Pain } from '@/components/sections/pain';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Demo } from '@/components/sections/demo';
import { Differentiators } from '@/components/sections/differentiators';
import { FounderNote } from '@/components/sections/founder-note';
import { LandingPricing } from '@/components/sections/landing-pricing';
import { Faq } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';

export default function LandingPage() {
  return (
    <>
      {/* FAQ JSON-LD lives on /pricing and /how-it-works (distinct question sets).
          Landing's FAQ is rendered visually but the schema is emitted per-topic
          on the canonical page for that intent, not duplicated here. */}
      <Hero />
      <Pain />
      <HowItWorks />
      <Demo />
      <Differentiators />
      <FounderNote />
      <LandingPricing />
      <Faq tone="brand" />
      <FinalCta />
    </>
  );
}
