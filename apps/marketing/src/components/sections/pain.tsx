// SERVER component - the pain section. Deliberate DENSITY DROP after the hero
// (M00 §5), but made to LAND: an emotional-stakes headline (the cost of doing
// nothing) + three scannable hits + a bridge kicker into "how it works". Its
// whole job is the "that's exactly me" moment (M00 §2). Reveal on scroll.
import { Reveal } from '@/components/reveal';

const HITS = [
  'Finding leads eats the hours you meant to spend selling.',
  'Every email you write sounds like everyone else’s.',
  'Half of them bounce or die in spam, so the calendar stays empty.',
];

export function Pain() {
  return (
    <section className="border-y border-line bg-surface/40">
      <div className="shell max-w-2xl py-section-y">
        <Reveal>
          <p className="text-eyebrow uppercase text-muted">Sound familiar?</p>
          <h2 className="mt-5 text-display-md text-ink">
            Every week without outreach is clients going to whoever emailed them first.
          </h2>
          <ul className="mt-8 space-y-4">
            {HITS.map((hit) => (
              <li key={hit} className="flex gap-3 text-body-lg text-muted">
                <span
                  aria-hidden
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                />
                <span>{hit}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-heading-sm text-ink">
            The fix isn’t five more tools. It’s one that does the work, from find to booked.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
