'use client';
// CLIENT ISLAND. /how-it-works FAQ with an intentional interaction:
//   * exactly one item open by default
//   * fine-pointer devices: items open on hover with a small dwell so a passing
//     pointer does not twitch the section; a clicked item pins open until
//     another is clicked or hovered
//   * coarse pointer / touch: hover is off. Taps toggle like a normal accordion
// Real <button> in <h3>, aria-expanded, hidden panel when collapsed.
import { useEffect, useRef, useState } from 'react';
import type { FaqItem } from '@/lib/faq';
import { Reveal } from '@/components/reveal';

const OPEN_DELAY_MS = 120;

export function HoverFaq({
  items,
  title = 'How AI outreach actually works.',
  intro = 'Short answers to the questions people ask about AI lead generation, buying signals, and personalized cold email.',
}: {
  items: FaqItem[];
  title?: string;
  intro?: string;
}) {
  const [open, setOpen] = useState(0);
  const [canHover, setCanHover] = useState(false);
  const dwellTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setCanHover(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);

  const cancelDwell = () => {
    if (dwellTimer.current) {
      clearTimeout(dwellTimer.current);
      dwellTimer.current = null;
    }
  };

  const scheduleOpen = (i: number) => {
    if (!canHover) return;
    cancelDwell();
    if (open === i) return;
    dwellTimer.current = setTimeout(() => setOpen(i), OPEN_DELAY_MS);
  };

  const clickToggle = (i: number) => {
    cancelDwell();
    setOpen((prev) => (prev === i ? -1 : i));
  };

  return (
    <section className="shell py-section-y">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-eyebrow uppercase text-accent">FAQ</p>
        <h2 className="mt-3 text-display-md text-ink">{title}</h2>
        <p className="mt-4 text-body-lg text-muted">{intro}</p>
      </Reveal>

      <Reveal delay={0.05} className="mx-auto mt-10 max-w-3xl">
        <ul
          onMouseLeave={cancelDwell}
          className="divide-y divide-line border-y border-line"
        >
          {items.map((item, i) => {
          const isOpen = open === i;
          const btnId = `faq-q-${i}`;
          const panelId = `faq-a-${i}`;
          return (
            <li
              key={item.q}
              onMouseEnter={() => scheduleOpen(i)}
              onFocus={() => scheduleOpen(i)}
              className="group"
            >
              <h3>
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => clickToggle(i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-accent focus-visible:text-accent"
                >
                  <span className="text-heading-sm text-ink group-hover:text-accent">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className={[
                      'grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-200',
                      isOpen
                        ? 'rotate-45 border-accent bg-accent text-white'
                        : 'group-hover:border-accent group-hover:text-accent',
                    ].join(' ')}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                hidden={!isOpen}
                className="pb-6 pr-14"
              >
                <p className="max-w-prose text-body-lg text-muted">{item.a}</p>
              </div>
            </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
