import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Differentiators } from '@/components/sections/differentiators';
import { Demo } from '@/components/sections/demo';
import { FinalCta } from '@/components/sections/final-cta';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'The full loop: find local businesses with buying signals, let AI write outreach from their site and reviews, send safely from your own inbox, and book meetings.',
};

// Depth for researchers (M00 §8): the 4 steps + the objection-answering
// walkthrough (with product visuals) + the demo. Reuses the built sections so the
// page stays consistent and there's one source per section.
export default function HowItWorksPage() {
  return (
    <>
      <PageHero eyebrow="How it works" title="Find, personalize, send, and book - one loop.">
        No new skill to learn. Here&rsquo;s exactly what happens between &ldquo;pick a market&rdquo; and
        &ldquo;a meeting on your calendar.&rdquo;
      </PageHero>
      <HowItWorks />
      <Differentiators />
      <Demo />
      <FinalCta />
    </>
  );
}
