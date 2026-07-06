// SERVER component — the closing CTA. One action, no new ideas (M00 §11): restate
// the transformation, a single "Start free" + friction microcopy. Full-width, on a
// dark ground for a confident finish. The one background motion is a subtle,
// slow accent-glow drift — decorative only, and the global reduced-motion rule in
// globals.css neutralises its animation (so it's reduced-motion-safe by default).
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { SIGNUP_URL, CTA_MICROCOPY } from '@/lib/site';

export function FinalCta() {
  return (
    <section className="on-dark relative overflow-hidden">
      {/* Subtle accent glow — not a blob; low-opacity, blurred, slow drift. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent/25 blur-3xl motion-safe:animate-[cta-drift_12s_ease-in-out_infinite]"
      />
      <div className="shell relative py-section-y text-center">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="text-display-lg text-ink">
            Stop staring at an empty calendar.
          </h2>
          <p className="mx-auto mt-5 max-w-prose text-body-lg text-muted">
            Find the right businesses, reach out like a pro, and let the meetings come to you.
            Start free — see real leads in minutes.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <CtaButton href={SIGNUP_URL} size="lg">
              Start free
            </CtaButton>
            <p className="text-body-sm text-muted">{CTA_MICROCOPY}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
