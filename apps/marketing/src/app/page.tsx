// Landing page (/) — M02 builds the persuasion core: hero (+ the one parallax
// island), pain, how-it-works (4 steps), and the dark demo centerpiece. The
// remaining conversion/trust sections (differentiators, founder's note, pricing,
// FAQ, final CTA) land in M03 via the labeled slot below.
import { Hero } from '@/components/sections/hero';
import { Pain } from '@/components/sections/pain';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Demo } from '@/components/sections/demo';
import { SectionPlaceholder } from '@/components/section-placeholder';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Pain />
      <HowItWorks />
      <Demo />
      <SectionPlaceholder
        file="M03"
        title="Differentiators, founder's note, pricing, FAQ, and the final CTA"
        note="The zigzag differentiators, an honest founder's note, transparent pricing, an AEO-ready FAQ, and the closing call to action."
      />
    </>
  );
}
