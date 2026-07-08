// SERVER component - the demo centerpiece. A deliberate DARK section (M00 §5) so
// the product glows, used for rhythm (not dark-everything) via the `.on-dark`
// token island. Holds the looping product demo (DemoLoop client island - cycles
// the four stages of the loop) and - critically - the post-demo "Start free" CTA
// at peak intent (M00 §11, the highest-converting spot).
//
// `id="demo"` is the smooth-scroll target for the hero's "See how it works".
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { DemoLoop } from './demo-loop';
import { SIGNUP_URL, CTA_MICROCOPY } from '@/lib/site';

export function Demo() {
  return (
    <section id="demo" className="on-dark scroll-mt-24">
      <div className="shell py-section-y">
        <Reveal className="max-w-prose">
          <p className="text-eyebrow uppercase text-accent">See it work</p>
          <h2 className="mt-3 text-display-md text-ink">
            Watch a cold city turn into a booked meeting.
          </h2>
          <p className="mt-4 text-body-lg text-muted">
            No slides, no setup theatre. This is the actual loop: search a market, watch real
            leads come back, let it draft the outreach, and send from your own inbox.
          </p>
        </Reveal>

        <Reveal delay={0.1} y={24} className="mt-10">
          <DemoLoop />
        </Reveal>

        {/* Peak-intent CTA - do not omit (M00 §11). */}
        <Reveal delay={0.05} className="mt-10 flex flex-col items-start gap-3">
          <CtaButton href={SIGNUP_URL} size="lg">
            Start free
          </CtaButton>
          <p className="text-body-sm text-muted">{CTA_MICROCOPY}</p>
        </Reveal>
      </div>
    </section>
  );
}
