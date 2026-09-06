'use client';
// CLIENT ISLAND - "How it works" as a calm click-stepper: a vertical list of the
// four steps on the left, one larger focal preview on the right. Selecting a step
// swaps the preview. Accessible tablist (roles, aria-selected, roving tabindex,
// arrow/Home/End keys). Micro-interactions on the active step are gated behind
// motion-safe, so this stays the quiet explainer (the "See it work" demo is lively).
import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/reveal';

type Step = { title: string; copy: string };

const STEPS: Step[] = [
  { title: 'Find', copy: 'Search any industry and city, then filter for buying signals like “no website.”' },
  { title: 'Personalize', copy: 'Each email is written from the lead’s own public details and reviews - in your voice, not spam.' },
  { title: 'Send', copy: 'Goes from your own inbox, one at a time with natural spacing. Follow-ups run automatically.' },
  { title: 'Book', copy: 'Replies land in your inbox and meetings book to your calendar - you just show up.' },
];

function StepVisual({ index, shown }: { index: number; shown: boolean }) {
  const ease = 'transition-all duration-500 ease-soft motion-reduce:transition-none';
  if (index === 0) {
    const leads = [
      { n: 'Lone Star Roofing & Exteriors', m: 'Roofing · ★ 4.8 (126)' },
      { n: 'Hill Country Concrete Co.', m: 'Concrete · ★ 4.6 (58)' },
      { n: 'Brazos Valley Plumbing', m: 'Plumbing · ★ 4.7 (203)' },
    ];
    return (
      <div>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-md border border-line bg-canvas px-2.5 py-1 text-[0.8rem] text-ink">Roofers</span>
          <span className="rounded-md border border-line bg-canvas px-2.5 py-1 text-[0.8rem] text-ink">Austin, TX</span>
          <span className="rounded-md bg-accent-soft px-2.5 py-1 text-[0.8rem] font-medium text-accent">No website ✓</span>
        </div>
        <ul className="mt-4 space-y-2">
          {leads.map((l, i) => (
            <li
              key={l.n}
              className={`flex items-center justify-between rounded-md border border-line bg-canvas px-3 py-2.5 ${ease} ${shown ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'}`}
              style={{ transitionDelay: shown ? `${i * 70}ms` : '0ms' }}
            >
              <span className="text-body-sm text-ink">{l.n}</span>
              <span className="hidden text-[0.75rem] text-muted sm:block">{l.m}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="rounded-lg border border-line bg-canvas p-4">
        <p className="text-[0.8rem] text-muted">To: owner@lonestarroofing.com</p>
        <p className="mt-1 text-body font-medium text-ink">Quick idea for Lone Star Roofing</p>
        <div className="mt-3 space-y-2">
          {['w-full', 'w-11/12', 'w-4/5', 'w-2/3'].map((w, i) => (
            <div
              key={w}
              className={`h-2 rounded bg-line ${ease} ${shown ? `${w} opacity-100` : 'w-0 opacity-0'}`}
              style={{ transitionDelay: shown ? `${i * 90}ms` : '0ms' }}
            />
          ))}
        </div>
        <span className="mt-4 inline-block rounded-md bg-accent-soft px-2.5 py-1 text-[0.78rem] font-medium text-accent">
          Written from their public details + reviews
        </span>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="rounded-lg border border-line bg-canvas p-4">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-ink">Sending from you@yourinbox.com</span>
          <span className="rounded-full bg-positive-soft px-2.5 py-1 text-[0.75rem] font-medium text-positive">Healthy</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[0.8rem]">
          <span className="text-muted">Today · ramping up</span>
          <span className="text-muted">18 / 40</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
          <div
            className={`h-full rounded-full bg-accent transition-[width] duration-700 ease-soft motion-reduce:transition-none ${shown ? 'w-[45%]' : 'w-0'}`}
          />
        </div>
        <p className="mt-3 text-[0.78rem] text-muted">One at a time · randomized spacing · auto follow-ups</p>
      </div>
    );
  }
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-line bg-canvas p-4 ${ease} ${shown ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-positive-soft text-body font-medium text-positive">
        ✓
      </span>
      <div>
        <p className="text-body-sm text-ink">Meeting booked</p>
        <p className="text-[0.8rem] text-muted">Thursday · 2:30 PM · with Lone Star Roofing</p>
      </div>
    </div>
  );
}

function FocalPanel({ index }: { index: number }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const step = STEPS[index];
  return (
    <div>
      <h3 className="text-heading-md text-ink">{step.title}</h3>
      <p className="mt-2 max-w-prose text-body text-muted">{step.copy}</p>
      <div className="mt-5">
        <StepVisual index={index} shown={shown} />
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (i: number) => {
    const next = (i + STEPS.length) % STEPS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      select(active + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      select(active - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      select(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      select(STEPS.length - 1);
    }
  };

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

      <Reveal delay={0.05} className="mt-12 grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:gap-10">
        <div
          role="tablist"
          aria-label="How it works, step by step"
          aria-orientation="vertical"
          className="flex flex-col gap-2"
        >
          {STEPS.map((step, i) => {
            const isActive = i === active;
            return (
              <button
                key={step.title}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`hiw-tab-${i}`}
                aria-selected={isActive}
                aria-controls="hiw-panel"
                tabIndex={isActive ? 0 : -1}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                onKeyDown={onKeyDown}
                className={[
                  'flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors duration-200 ease-soft focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  isActive ? 'border-accent bg-accent-soft/50' : 'border-line bg-surface hover:border-accent/50',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-body-sm font-medium transition-colors duration-200',
                    isActive ? 'border-accent bg-accent text-white' : 'border-accent bg-canvas text-accent',
                  ].join(' ')}
                >
                  {i + 1}
                </span>
                <span className={isActive ? 'text-heading-sm text-ink' : 'text-heading-sm text-muted'}>
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="hiw-panel"
          aria-labelledby={`hiw-tab-${active}`}
          className="rounded-xl border border-line bg-surface p-6 md:p-8"
        >
          <FocalPanel key={active} index={active} />
        </div>
      </Reveal>
    </section>
  );
}
