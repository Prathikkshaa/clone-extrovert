import type { Metadata } from 'next';
import { HowItWorks } from '@/components/sections/how-it-works';
import { Differentiators } from '@/components/sections/differentiators';
import { Demo } from '@/components/sections/demo';
import { ByTheNumbers } from '@/components/sections/by-the-numbers';
import { FinalCta } from '@/components/sections/final-cta';

export const metadata: Metadata = {
  title: 'How it works',
  description:
    'The full loop: find local businesses with buying signals, let AI write outreach from their site and reviews, send safely from your own inbox, and book meetings.',
  alternates: { canonical: '/how-it-works' },
};

// Depth for researchers (M00 §8): the 4 steps + the objection-answering
// walkthrough (with product visuals) + the demo. Reuses the built sections so the
// page stays consistent and there's one source per section.
export default function HowItWorksPage() {
  return (
    <>
      <HowItWorks
        as="h1"
        subtitle={'No new skill to learn. Here’s exactly what happens between “pick a market” and “a meeting on your calendar.”'}
      />
      <Differentiators />
      <Demo />
      <ByTheNumbers />
      <FinalCta />
    </>
  );
}
