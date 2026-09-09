// SERVER component - the demo centerpiece. A deliberate DARK section (M00 §5) so
// the product glows, used for rhythm (not dark-everything) via the `.on-dark`
// token island. Two columns: punchy narration on the left, the compact looping
// product demo (DemoLoop client island) on the right, with the peak-intent
// "Start free" CTA under the copy (M00 §11).
//
// `id="demo"` is the smooth-scroll target for the hero's "See how it works".
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { DemoLoop } from './demo-loop';
import { SIGNUP_URL, APP_NAME } from '@/lib/site';
import { CtaMicrocopy } from '@/components/cta-microcopy';

const LINERS = [
  'Name a market: “restaurants in Austin, no website.”',
  'Real businesses come back in seconds.',
  `${APP_NAME} drafts each email from their own details.`,
  'Sent from your inbox. Replies become meetings.',
];

export function Demo() {
  return (
    <section id="demo" className="on-dark scroll-mt-24">
      <div className="shell py-section-y">
        <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
          {/* Left: punchy narration + peak-intent CTA */}
          <Reveal>
            <p className="text-eyebrow uppercase text-accent">See it work</p>
            <h2 className="mt-3 text-display-md text-ink">
              A cold city, warmed to a booked meeting.
            </h2>
            <ul className="mt-6 space-y-4">
              {LINERS.map((line, i) => (
                <li key={line} className="flex items-start gap-3 text-body-lg text-muted">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-body-sm font-medium text-accent">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <CtaButton href={SIGNUP_URL} size="lg">
                Start free
              </CtaButton>
              <CtaMicrocopy className="mt-3" />
            </div>
          </Reveal>

          {/* Right: the compact looping demo */}
          <Reveal delay={0.1} y={24} className="min-w-0">
            <DemoLoop />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
