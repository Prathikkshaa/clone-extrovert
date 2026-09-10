// SERVER component - the demo centerpiece, in the primary brand teal for an
// intentional brand moment (matches "Why I built this" + FAQ). Two columns:
// punchy narration + peak-intent CTA on the left, the compact looping product
// demo (DemoLoop client island) on the right - a light product card that pops
// against the teal.
//
// `id="demo"` is the smooth-scroll target for the hero's "See how it works".
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { DemoLoop } from './demo-loop';
import { SIGNUP_URL, APP_NAME, CTA_MICROCOPY } from '@/lib/site';

const LINERS = [
  'Name a market: “restaurants in Austin, no website.”',
  'Real businesses come back in seconds.',
  `${APP_NAME} drafts each email from their own details.`,
  'Sent from your inbox. Replies become meetings.',
];

export function Demo() {
  return (
    <section id="demo" className="scroll-mt-24 bg-accent text-white">
      <div className="shell py-section-y">
        <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
          {/* Left: punchy narration + peak-intent CTA */}
          <Reveal>
            <p className="text-eyebrow uppercase text-white/70">See it work</p>
            <h2 className="mt-3 text-display-md text-white">
              A cold city, warmed to a booked meeting.
            </h2>
            <ul className="mt-6 space-y-4">
              {LINERS.map((line, i) => (
                <li key={line} className="flex items-start gap-3 text-body-lg text-white/85">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15 text-body-sm font-medium text-white">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col items-center text-center">
              <CtaButton href={SIGNUP_URL} variant="secondary" size="md">
                Start free
              </CtaButton>
              <p className="mt-3 text-body-sm text-white/70">{CTA_MICROCOPY}</p>
            </div>
          </Reveal>

          {/* Right: the compact looping demo (light card pops on the teal) */}
          <Reveal delay={0.1} y={24} className="min-w-0">
            <DemoLoop />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
