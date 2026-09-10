'use client';
// CLIENT ISLAND. The /how-it-works mechanism, as a horizontal step explorer.
// One numbered ruler across the top (all seven steps visible at once) and one
// deep-dive panel below that swaps content when a step is selected. Autoplays
// on entry (pauses on hover, on any user interaction, and under reduced motion).
// Real tab semantics: role="tablist" / "tab" / "tabpanel", roving tabindex,
// arrow-key nav, Home / End, aria-selected.
import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { ReactNode } from 'react';

const AUTOPLAY_MS = 5000;

/* ── inline artifacts, restrained and typographic. One running example
      (Lone Star Roofing, Austin) threads every step. ── */

function ArtMarketQuery() {
  return (
    <div className="font-mono text-body-sm leading-loose text-ink">
      <span className="text-muted">market</span>{' '}
      <span className="rounded-sm bg-accent-soft px-1.5 py-0.5 text-accent">roofing</span>{' '}
      <span className="text-muted">in</span>{' '}
      <span className="rounded-sm bg-accent-soft px-1.5 py-0.5 text-accent">Austin, TX</span>
      <br />
      <span className="text-muted">signal</span>{' '}
      <span className="rounded-sm bg-accent-soft px-1.5 py-0.5 text-accent">no website</span>
    </div>
  );
}

function ArtDiscovery() {
  const rows = [
    ['Lone Star Roofing', '4.8 · 126', 'no site'],
    ['Hill Country Roofers', '4.6 · 88', 'no site'],
    ['Bluebonnet Roofing Co.', '4.9 · 41', 'no site'],
  ];
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-gradient-to-b from-white to-surface text-body-sm shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float">
      <div className="grid grid-cols-[1.5fr_auto_auto] gap-4 border-b border-line bg-canvas/60 px-4 py-2 font-mono text-[0.72rem] uppercase tracking-wide text-muted">
        <span>Business</span>
        <span>Rating</span>
        <span>Signal</span>
      </div>
      {rows.map(([b, r, s], i) => (
        <div
          key={b}
          className={[
            'grid grid-cols-[1.5fr_auto_auto] gap-4 px-4 py-2.5',
            i === 0 ? 'bg-accent-soft/40' : '',
          ].join(' ')}
        >
          <span className="min-w-0 truncate text-ink">{b}</span>
          <span className="text-muted">{r}</span>
          <span className="text-accent">{s}</span>
        </div>
      ))}
    </div>
  );
}

function ArtResearch() {
  const lines = [
    ['site.title', 'not found'],
    ['reviews.rating', '4.8 across 126 jobs'],
    ['reviews.themes', 'punctual, storm damage, insurance claims'],
    ['tech.detected', 'Google Business Profile only'],
  ];
  return (
    <dl className="divide-y divide-line rounded-lg border border-line bg-gradient-to-b from-white to-surface shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float text-body-sm">
      {lines.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[minmax(0,10rem)_1fr] gap-4 px-4 py-2.5">
          <dt className="font-mono text-muted">{k}</dt>
          <dd className="min-w-0 text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function ArtSignal() {
  const items = [
    { label: 'No website', reason: 'Referrals go cold. Homeowners can’t compare.' },
    { label: 'Thin online presence', reason: 'A modest lift wins local share.' },
    { label: 'Weak reviews', reason: 'Reputation work has a clear buyer.' },
    { label: 'Hiring signal', reason: 'They’re expanding and stretched thin.' },
  ];
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it.label} className="rounded-lg border border-line bg-gradient-to-b from-white to-surface shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float px-4 py-3 text-body-sm">
          <p className="font-medium text-ink">{it.label}</p>
          <p className="mt-0.5 text-muted">{it.reason}</p>
        </li>
      ))}
    </ul>
  );
}

function ArtEmail() {
  return (
    <div className="rounded-lg border border-line bg-gradient-to-b from-white to-surface p-5 text-body-sm shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float">
      <div className="flex items-center justify-between">
        <p className="text-muted">Subject</p>
        <span className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wide text-muted">
          Illustrative example
        </span>
      </div>
      <p className="mt-1 font-medium text-ink">A note from a local contractor</p>
      <div className="mt-4 space-y-2 text-ink/80">
        <p>Hi Marcus,</p>
        <p>
          Ran into Lone Star Roofing while looking through storm-damage crews in Austin. Wanted to
          reach out because I work with contractors on a small first thing: getting the business
          findable when a referral goes home and searches for you.
        </p>
        <p>Open to a short call next week if it is useful?</p>
      </div>
      <div className="mt-4 border-t border-line pt-3 text-[0.78rem] text-muted">
        Draft grounded in the lead sketch, rewritten in your voice. Waits for your approval.
      </div>
    </div>
  );
}

function ArtSend() {
  const rows = [
    ['09:14', 'Sent · 1 of 40 today', 'from you@yourinbox.com'],
    ['10:02', 'Sent · 2 of 40 today', 'natural spacing'],
    ['11:47', 'Sent · 3 of 40 today', 'warm-up ramping'],
  ];
  return (
    <ol className="divide-y divide-line rounded-lg border border-line bg-gradient-to-b from-white to-surface shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float font-mono text-body-sm">
      {rows.map(([t, a, b]) => (
        <li key={t} className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 px-4 py-2.5">
          <span className="text-muted">{t}</span>
          <span className="min-w-0 truncate text-ink">{a}</span>
          <span className="hidden text-muted sm:inline">{b}</span>
        </li>
      ))}
    </ol>
  );
}

function ArtReply() {
  return (
    <div className="rounded-lg border border-line bg-gradient-to-b from-white to-surface p-5 text-body-sm shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float">
      <div className="flex items-center justify-between">
        <p className="text-muted">Reply received</p>
        <span className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-wide text-muted">
          Illustrative example
        </span>
      </div>
      <p className="mt-2 text-ink">
        Thanks for reaching out. Can you send a bit more on what you had in mind? Not sure it is
        the right time for us, but curious.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3">
        <span className="rounded-md bg-accent-soft px-2.5 py-1 text-[0.78rem] font-medium text-accent">
          Interested
        </span>
        <span className="text-[0.78rem] text-muted">Follow-ups paused. Reply in your inbox.</span>
      </div>
    </div>
  );
}

type Step = {
  short: string;
  title: string;
  intent: string;
  mechanism: string;
  artifact: ReactNode;
  pivot?: boolean;
};

const STEPS: Step[] = [
  {
    short: 'Market',
    title: 'You define the market.',
    intent: 'A trade, a place, and the signal you can act on.',
    mechanism:
      'Milo treats the signal as a filter, not a bonus. The list is scoped to businesses that show it in public information anyone can look up.',
    artifact: <ArtMarketQuery />,
  },
  {
    short: 'Discover',
    title: 'Milo discovers real local businesses.',
    intent: 'Live discovery from public sources, not a rented database.',
    mechanism:
      'For "roofing in Austin, TX, no website", Milo returns real, current businesses with the metadata the next step needs: category, rating, address.',
    artifact: <ArtDiscovery />,
  },
  {
    short: 'Read',
    title: 'It reads each business.',
    intent: 'Before writing anything, Milo studies the specific business.',
    mechanism:
      'Their site (when present), their reviews, and their category get distilled into a short factual sketch. Every downstream sentence has to be grounded in it.',
    artifact: <ArtResearch />,
  },
  {
    short: 'Signal',
    title: 'It confirms the buying signal.',
    intent: 'This is why the outreach lands.',
    mechanism:
      'A lead only earns a place on the list when the signal is observable in the sketch: a concrete gap you can solve. No signal, no outreach.',
    artifact: <ArtSignal />,
    pivot: true,
  },
  {
    short: 'Write',
    title: 'It writes the outreach in your voice.',
    intent: 'Three messages, personalized from what the business actually does.',
    mechanism:
      'Milo drafts a 3-email sequence per lead. No merge tokens, no "Hi {{first_name}}." Every claim is anchored in the sketch, and every draft waits for your approval.',
    artifact: <ArtEmail />,
  },
  {
    short: 'Send',
    title: 'It sends the way a careful human does.',
    intent: 'From your Gmail or Outlook, not a shared blast server.',
    mechanism:
      'Slow warm-up, one at a time, randomized spacing. Every message carries one-click unsubscribe and your physical address. CAN-SPAM, PECR, GDPR-aware.',
    artifact: <ArtSend />,
  },
  {
    short: 'Reply',
    title: 'It turns a reply into a conversation.',
    intent: 'Replies come to your inbox. That is the point.',
    mechanism:
      'Follow-ups stop the moment someone responds. Milo labels the reply, drafts an answer for you to approve, and hands the thread back as normal email.',
    artifact: <ArtReply />,
  },
];

type S = { i: number; auto: boolean; tick: number };
type A = { type: 'set'; i: number } | { type: 'next' } | { type: 'stop' } | { type: 'tick' };

function reducer(s: S, a: A): S {
  switch (a.type) {
    case 'set':
      return { ...s, i: a.i, auto: false, tick: 0 };
    case 'next':
      return { ...s, i: (s.i + 1) % STEPS.length, tick: 0 };
    case 'stop':
      return { ...s, auto: false };
    case 'tick':
      return { ...s, tick: s.tick + 1 };
    default:
      return s;
  }
}

const HOVER_PREVIEW_MS = 120;

export function MechanismExplorer() {
  const [{ i, auto, tick }, dispatch] = useReducer(reducer, { i: 0, auto: true, tick: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canHover, setCanHover] = useState(false);
  const [hovering, setHovering] = useState(false);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const rafId = useRef<number | null>(null);
  const lastTs = useRef<number>(0);
  const dwellTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hv = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateRm = () => setReducedMotion(rm.matches);
    const updateHv = () => setCanHover(hv.matches);
    updateRm();
    updateHv();
    rm.addEventListener?.('change', updateRm);
    hv.addEventListener?.('change', updateHv);
    return () => {
      rm.removeEventListener?.('change', updateRm);
      hv.removeEventListener?.('change', updateHv);
    };
  }, []);

  const cancelDwell = () => {
    if (dwellTimer.current) {
      clearTimeout(dwellTimer.current);
      dwellTimer.current = null;
    }
  };
  const previewOnHover = (idx: number) => {
    if (!canHover) return;
    cancelDwell();
    if (i === idx) return;
    dwellTimer.current = setTimeout(() => {
      dispatch({ type: 'set', i: idx });
    }, HOVER_PREVIEW_MS);
  };

  // Autoplay ticker (60fps rAF, throttled by AUTOPLAY_MS). Pauses on hover,
  // reduced-motion, or once the user has interacted.
  useEffect(() => {
    if (!auto || reducedMotion || hovering) return;
    const loop = (ts: number) => {
      if (!lastTs.current) lastTs.current = ts;
      const elapsed = ts - lastTs.current;
      dispatch({ type: 'tick' });
      if (elapsed >= AUTOPLAY_MS) {
        lastTs.current = ts;
        dispatch({ type: 'next' });
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      lastTs.current = 0;
    };
  }, [auto, reducedMotion, hovering, i]);

  // Progress 0..1 for the active step's autoplay bar.
  const progress = useMemo(() => {
    if (!auto || reducedMotion) return 0;
    return Math.min(1, (tick * 16.7) / AUTOPLAY_MS);
  }, [tick, auto, reducedMotion]);

  const onKey = (e: React.KeyboardEvent, idx: number) => {
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % STEPS.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + STEPS.length) % STEPS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = STEPS.length - 1;
    else return;
    e.preventDefault();
    dispatch({ type: 'set', i: next });
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="shell pb-section-y">
      <div
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {/* RULER. A horizontal 7-step tab list. Keyboard-navigable. */}
        <div
          role="tablist"
          aria-label="How the mechanism works"
          aria-orientation="horizontal"
          className="relative grid grid-cols-7 gap-1"
        >
          {/* base connecting hairline (behind the dots) */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-[calc(50%/7)] right-[calc(50%/7)] top-[28px] h-px bg-line sm:top-[30px]"
          />
          {STEPS.map((s, idx) => {
            const active = idx === i;
            return (
              <button
                key={s.short}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                role="tab"
                type="button"
                id={`mech-tab-${idx}`}
                aria-selected={active}
                aria-controls={`mech-panel-${idx}`}
                tabIndex={active ? 0 : -1}
                onClick={() => dispatch({ type: 'set', i: idx })}
                onKeyDown={(e) => onKey(e, idx)}
                onMouseEnter={() => previewOnHover(idx)}
                onMouseLeave={cancelDwell}
                onFocus={() => previewOnHover(idx)}
                className="group relative z-10 flex cursor-pointer flex-col items-center gap-2 py-3 text-center focus:outline-none active:scale-[0.98]"
              >
                <span
                  className={[
                    'grid h-8 w-8 place-items-center rounded-full font-mono text-[0.72rem] transition-all duration-200 sm:h-9 sm:w-9 sm:text-[0.78rem]',
                    active
                      ? 'scale-110 bg-accent text-white shadow-float ring-4 ring-accent/15'
                      : s.pivot
                        ? 'border border-accent bg-accent-soft text-accent group-hover:scale-105 group-hover:border-accent group-hover:bg-accent group-hover:text-white'
                        : 'border border-line bg-surface text-muted group-hover:scale-105 group-hover:border-accent group-hover:text-accent group-focus-visible:border-accent group-focus-visible:text-accent',
                  ].join(' ')}
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span
                  className={[
                    'hidden text-[0.78rem] leading-tight transition-colors sm:block',
                    active
                      ? 'text-ink font-medium'
                      : 'text-muted group-hover:text-ink group-focus-visible:text-ink',
                  ].join(' ')}
                >
                  {s.short}
                </span>
              </button>
            );
          })}
        </div>

        {/* PANEL. One deep-dive panel that swaps by step. */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-white to-surface shadow-card md:mt-10">
          {STEPS.map((s, idx) => {
            const active = idx === i;
            return (
              <div
                key={s.short}
                role="tabpanel"
                id={`mech-panel-${idx}`}
                aria-labelledby={`mech-tab-${idx}`}
                hidden={!active}
                className={
                  active
                    ? 'grid gap-10 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-14 md:p-10'
                    : ''
                }
              >
                <div className="min-w-0">
                  <p className="font-mono text-[0.72rem] uppercase tracking-wide text-muted">
                    Step {String(idx + 1).padStart(2, '0')} of {STEPS.length}
                  </p>
                  <h3 className="mt-3 text-heading-lg text-ink">{s.title}</h3>
                  <p className="mt-4 max-w-prose text-body-lg text-ink/85">{s.intent}</p>
                  <p className="mt-3 max-w-prose text-body text-muted">{s.mechanism}</p>
                  {/* Progress bar. Present under autoplay only. */}
                  {auto && !reducedMotion ? (
                    <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-line/70">
                      <div
                        className="h-full bg-accent transition-[width] duration-[80ms] ease-linear"
                        style={{ width: `${progress * 100}%` }}
                        aria-hidden
                      />
                    </div>
                  ) : null}
                </div>
                <div className="min-w-0 self-center">{s.artifact}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
