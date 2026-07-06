import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { SectionPlaceholder } from '@/components/section-placeholder';

export const metadata: Metadata = { title: 'How it works' };

export default function HowItWorksPage() {
  return (
    <>
      <PageHero eyebrow="How it works" title="Find, reach, and book — in four steps.">
        The depth-for-researchers walkthrough of the product loop lands in M02/M03.
      </PageHero>
      <SectionPlaceholder
        file="M02"
        title="The four-step walkthrough + product demo"
        note="Find leads → enrich → draft personalized outreach → send and book, each with real product imagery."
      />
    </>
  );
}
