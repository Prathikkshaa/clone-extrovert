// SERVER component - how it works in 4 steps: Find → Personalize → Send → Book.
// NOT three identical centered cards (anti-slop §5): a left-aligned, connected
// horizontal flow on desktop (numbered, with a hairline connector), vertical on
// mobile. Each step carries a small, DISTINCT representative UI snippet (labeled
// placeholders, M00 §13). Staggered scroll-reveal as each enters.
import { Reveal } from '@/components/reveal';
import type { ReactNode } from 'react';

type Step = {
  n: string;
  title: string;
  copy: string;
  snippet: ReactNode;
};

// Small, distinct snippet mocks - each hints at the real screen for that step.
const chip = 'rounded-md border border-line bg-surface px-2.5 py-1 text-[0.8rem] text-ink';
const accentChip = 'rounded-md bg-accent-soft px-2.5 py-1 text-[0.8rem] font-medium text-accent';

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Find',
    copy: 'Search any industry and city. Filter for buying signals like “no website.”',
    snippet: (
      <div className="flex flex-wrap gap-1.5">
        <span className={chip}>Roofers</span>
        <span className={chip}>Austin, TX</span>
        <span className={accentChip}>No website ✓</span>
      </div>
    ),
  },
  {
    n: '02',
    title: 'Personalize',
    copy: 'AI writes each email from the lead’s site and reviews - in your voice, not spam.',
    snippet: (
      <div className="rounded-md border border-line bg-surface p-3">
        <p className="text-[0.8rem] text-muted">Subject</p>
        <p className="text-[0.85rem] text-ink">Quick idea for Lone Star Roofing</p>
        <div className="mt-2 h-1.5 w-4/5 rounded bg-line" />
        <div className="mt-1.5 h-1.5 w-3/5 rounded bg-line" />
      </div>
    ),
  },
  {
    n: '03',
    title: 'Send',
    copy: 'Sends from your own inbox, throttled to stay out of spam. Auto follow-ups.',
    snippet: (
      <div className="rounded-md border border-line bg-surface p-3">
        <div className="flex items-center justify-between text-[0.8rem]">
          <span className="text-ink">Today</span>
          <span className="text-muted">18 / 40</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full w-[45%] rounded-full bg-accent" />
        </div>
      </div>
    ),
  },
  {
    n: '04',
    title: 'Book',
    copy: 'Replies land in your inbox; meetings book straight to your calendar.',
    snippet: (
      <div className="flex items-center gap-2 rounded-md border border-line bg-surface p-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-positive-soft text-body-sm font-medium text-positive">
          ✓
        </span>
        <div>
          <p className="text-[0.85rem] text-ink">Meeting booked</p>
          <p className="text-[0.8rem] text-muted">Thu · 2:30 PM</p>
        </div>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="shell py-section-y">
      <Reveal className="max-w-prose">
        <p className="text-eyebrow uppercase text-accent">How it works</p>
        <h2 className="mt-3 text-display-md text-ink">How does it work?</h2>
        <p className="mt-4 text-body-lg text-muted">
          Four steps from search to booked. You point it at a market; it does the finding,
          writing, and sending - you show up to the meetings. No new skill to learn.
        </p>
      </Reveal>

      <ol className="mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
        {STEPS.map((step, i) => (
          <Reveal as="li" key={step.n} delay={i * 0.08} className="relative">
            {/* Hairline connector between the number circles on desktop. It sits at
                the circle's vertical center and, because the title is BELOW the
                circle (not beside it), it only crosses the empty gap to the next
                circle - never the text. */}
            {i < STEPS.length - 1 ? (
              <span
                aria-hidden
                className="absolute left-11 -right-6 top-4 hidden h-px bg-line md:block"
              />
            ) : null}
            <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-accent bg-canvas text-body-sm font-medium text-accent">
              {step.n.slice(1)}
            </span>
            <h3 className="mt-4 text-heading-md text-ink">{step.title}</h3>
            <p className="mt-2 text-body text-muted">{step.copy}</p>
            <div className="mt-4">{step.snippet}</div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
