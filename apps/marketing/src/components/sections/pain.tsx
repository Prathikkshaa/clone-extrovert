// SERVER component - the pain section. Deliberate DENSITY DROP after the hero
// (M00 §5): quieter, tighter, narrower measure. Its whole job is the "that's
// exactly me" moment (M00 §2). Empathetic, plain, short. Reveal on scroll.
import { Reveal } from '@/components/reveal';

export function Pain() {
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="shell max-w-prose py-section-y">
        <Reveal>
          <p className="text-eyebrow uppercase text-muted">Sound familiar?</p>
          <p className="mt-5 text-heading-lg text-ink">
            You know you need outreach. But finding leads eats hours, every email you write
            feels generic, and half of them bounce or land in spam.
          </p>
          <p className="mt-5 text-body-lg text-muted">
            So you either pay for five different tools and stitch them together, or you put it
            off - and the calendar stays empty. Neither one gets you clients.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
