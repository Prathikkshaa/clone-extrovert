import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { Reveal } from '@/components/reveal';
import { FounderNote } from '@/components/sections/founder-note';
import { FinalCta } from '@/components/sections/final-cta';
import { APP_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: `Why ${APP_NAME} exists - outreach for people who'd rather have clients than run a sales team. Early, honest, and built in the open.`,
  alternates: { canonical: '/about' },
};

// About = sharp positioning + honest "we're early" candor (M00 §7). NO fabricated
// team, proof, metrics, or logos. Copy is DIRECTION; the founder finalizes words.

type Principle = { title: string; copy: string };

const PRINCIPLES: Principle[] = [
  {
    title: 'Your inbox, your reputation',
    copy: 'Every email sends from your own Gmail or Outlook - warmed up and paced like a careful human. Never a shared blast server.',
  },
  {
    title: 'Pay for what you use',
    copy: 'Credits, not subscriptions. No seats, no monthly commitment. Your credits never expire while your account is active.',
  },
  {
    title: 'Personal, never spam',
    copy: 'Each email is written from the business’s public details, with one-click unsubscribe and your address on it. Region-aware: CAN-SPAM, PECR, GDPR.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Outreach for people who'd rather have clients than run a sales team."
      >
        No cold-call scripts, no five-tool stack, no headcount. One tool that finds the right
        businesses and reaches out like you would - if you had the time.
      </PageHero>

      <section className="shell max-w-prose py-section-y">
        <Reveal>
          <p className="text-eyebrow uppercase text-accent">What we&rsquo;re building</p>
          <p className="mt-4 text-heading-md font-medium text-ink">
            {APP_NAME} is a cold-email and local-business lead-generation tool that finds local
            businesses worth reaching, writes personalized outreach in your voice, and sends it
            from your own inbox.
          </p>
          <div className="mt-5 space-y-4 text-body-lg text-muted">
            <p>
              It exists for one reason: a solo founder or a small agency shouldn&rsquo;t need a
              full sales team to get meetings.
            </p>
            <p>
              Point it at a market. It does the finding, the writing, and the sending - you show
              up to the calls.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="shell max-w-prose py-section-y">
        <Reveal className="space-y-8">
          <div>
            <p className="text-eyebrow uppercase text-accent">The problem &amp; the bet</p>
            <h2 className="mt-3 text-heading-lg text-ink">Existing tools all missed.</h2>
            <p className="mt-4 text-body-lg text-muted">
              Lead databases were overpriced and stale. &ldquo;AI&rdquo; writers spat out obvious
              spam. Cold-email platforms wanted a monthly commitment before your first send. And
              stitching five subscriptions together was a project on its own.
            </p>
          </div>
          <div>
            <h2 className="text-heading-lg text-ink">So the bet is one honest tool.</h2>
            <p className="mt-4 text-body-lg text-muted">
              Find the right businesses. Write like you. Send without landing in spam. One
              workflow, pay as you go - nothing to stitch together.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="shell py-section-y">
        <Reveal className="max-w-prose">
          <p className="text-eyebrow uppercase text-accent">Principles</p>
          <h2 className="mt-3 text-display-md text-ink">What we hold to.</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 0.05}
              className="rounded-xl border border-line bg-surface p-6"
            >
              <h3 className="text-heading-sm text-ink">{p.title}</h3>
              <p className="mt-3 text-body text-muted">{p.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <FounderNote />

      <section className="shell max-w-prose py-section-y">
        <Reveal>
          <p className="text-eyebrow uppercase text-accent">Where we are</p>
          <h2 className="mt-3 text-heading-lg text-ink">Early, and building in the open.</h2>
          <div className="mt-4 space-y-4 text-body-lg text-muted">
            <p>
              We&rsquo;d rather say that plainly than fake a wall of logos. What you see is
              what&rsquo;s built - no more, no less.
            </p>
            <p>
              The roadmap is shaped by what real users ask for. That&rsquo;s the upside of being
              early: try it now, and your feedback genuinely moves what gets built next.
            </p>
          </div>
        </Reveal>
      </section>

      <FinalCta />
    </>
  );
}
