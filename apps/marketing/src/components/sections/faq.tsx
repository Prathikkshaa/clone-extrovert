'use client';
// CLIENT ISLAND - the FAQ accordion. Needs open/close state, so it's a client
// component. Accessible: each question is a real <button> in an <h3> with
// aria-expanded + aria-controls; the answer is a region labelled by its button
// and hidden via `hidden` when collapsed (keyboard + screen-reader friendly).
// The Q/A structure is clean so M04 can annotate it with FAQPage schema.
import { useState } from 'react';
import { Reveal } from '@/components/reveal';
import { FAQ_ITEMS } from '@/lib/faq';

export function Faq({ withHeading = true }: { withHeading?: boolean }) {
  // The questions people worry about most (deliverability, lead source + legality,
  // and "do I need to be technical?") open by default so the answers - and the named
  // data source - are visible without a click. The rest stay collapsed.
  const [open, setOpen] = useState<Set<number>>(() => new Set([0, 1, 2]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className="shell py-section-y">
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        {withHeading ? (
          <Reveal>
            <p className="text-eyebrow uppercase text-accent">Questions</p>
            <h2 className="mt-3 text-display-md text-ink">The honest answers.</h2>
            <p className="mt-4 max-w-prose text-body-lg text-muted">
              The things people actually worry about before trying a cold-outreach tool.
            </p>
          </Reveal>
        ) : (
          <div />
        )}

        <Reveal delay={0.05}>
          <ul className="divide-y divide-line border-y border-line">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = open.has(i);
              const btnId = `faq-q-${i}`;
              const panelId = `faq-a-${i}`;
              return (
                <li key={item.q}>
                  <h3 className="m-0">
                    <button
                      type="button"
                      id={btnId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggle(i)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className="text-heading-sm text-ink">{item.q}</span>
                      <span
                        aria-hidden
                        className={[
                          'relative mt-1 h-4 w-4 shrink-0 text-accent transition-transform duration-300 ease-soft',
                          isOpen ? 'rotate-45' : '',
                        ].join(' ')}
                      >
                        {/* plus → x on open */}
                        <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-current" />
                        <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 bg-current" />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    hidden={!isOpen}
                    className="pb-5 pr-8"
                  >
                    <p className="max-w-prose text-body text-muted">{item.a}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
