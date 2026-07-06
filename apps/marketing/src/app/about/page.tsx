import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { SectionPlaceholder } from '@/components/section-placeholder';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Built by someone who had this exact problem.">
        The honest founder&rsquo;s note — why this exists and where it&rsquo;s headed — lands in M03.
      </PageHero>
      <SectionPlaceholder
        file="M03"
        title="Founder's note + honest-early roadmap"
        note="A real founder story (placeholder photo + draft copy) and transparent roadmap — trust without fabricated social proof."
      />
    </>
  );
}
