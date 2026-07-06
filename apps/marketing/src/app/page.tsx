// Landing page (/) — the full conversion page. M02 built the top (hero → pain →
// how-it-works → demo); M03 adds the trust + close (differentiators → founder's
// note → pricing → FAQ → final CTA). RSC-first: only the header, reveal, parallax,
// demo player, and FAQ accordion are client islands.
import { Hero } from '@/components/sections/hero';
import { Pain } from '@/components/sections/pain';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Demo } from '@/components/sections/demo';
import { Differentiators } from '@/components/sections/differentiators';
import { FounderNote } from '@/components/sections/founder-note';
import { Pricing } from '@/components/sections/pricing';
import { Faq } from '@/components/sections/faq';
import { FinalCta } from '@/components/sections/final-cta';
import { FaqJsonLd } from '@/components/structured-data';

export default function LandingPage() {
  return (
    <>
      <FaqJsonLd />
      <Hero />
      <Pain />
      <HowItWorks />
      <Demo />
      <Differentiators />
      <FounderNote />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
