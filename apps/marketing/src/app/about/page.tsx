import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { FounderNote } from '@/components/sections/founder-note';
import { FinalCta } from '@/components/sections/final-cta';
import { APP_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: `Why ${APP_NAME} exists — built by someone who had the empty-pipeline problem, being built in the open, early and honest about it.`,
};

// About = founder story expanded + honest "we're new" tone (M00 §7). NO fabricated
// proof; the founder finalizes the words. Copy is DIRECTION.
export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About" title="Built by someone who had this exact problem.">
        No big team, no VC playbook — just a tool made to solve a real, boring, expensive
        problem: getting clients without a full-time sales motion.
      </PageHero>

      <section className="shell max-w-prose py-12">
        <Reveal className="space-y-5 text-body-lg text-ink/90">
          <p>
            {APP_NAME} started because the existing options all missed. Lead databases were
            stale and pricey. &ldquo;AI&rdquo; writers produced obvious spam. Cold-email platforms
            wanted a monthly commitment before you&rsquo;d sent a single email. And stitching five
            tools together was a weekend project on its own.
          </p>
          <p>
            The bet here is simple: a solo founder or a small agency shouldn&rsquo;t need to become a
            sales operation to get meetings. Point the tool at a market, let it find the right
            businesses, write outreach grounded in what each one actually does, and send it
            safely from your own inbox.
          </p>
          <p>
            We&rsquo;re early, and we&rsquo;d rather say that plainly than fake a wall of logos. What
            you see is what&rsquo;s built. The roadmap is shaped by what real users ask for — so if
            you try it, your feedback genuinely moves it.
          </p>
        </Reveal>
      </section>

      <FounderNote />
      <FinalCta />
    </>
  );
}
