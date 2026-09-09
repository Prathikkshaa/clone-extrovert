'use client';
// CLIENT ISLAND - the hero's live "search" panel. It autoplays a looping, on-brand
// micro-demo: a caret types the industry + city filters, the "No website" chip pops,
// results count up, and lead rows stream in one at a time with their name typing out.
// Hovering or clicking a filter chip replays it. Fully reduced-motion-safe (shows the
// finished state, no motion) and layout-shift-free (every row keeps a fixed height).
import { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';

type IconProps = { className?: string };
const base = {
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};
const StoreIcon = (p: IconProps) => (
  <svg {...base} className={p.className}>
    <path d="M3 9 4.5 4h15L21 9" />
    <path d="M4 9v11h16V9" />
    <path d="M9 20v-6h6v6" />
  </svg>
);
const WrenchIcon = (p: IconProps) => (
  <svg {...base} className={p.className}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5l-6 6 2.4 2.4 6-6a4 4 0 0 0 5-5.4l-2.6 2.6-2-2 2.6-2.6Z" />
  </svg>
);
const BoltIcon = (p: IconProps) => (
  <svg {...base} className={p.className}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
  </svg>
);
const ChevronIcon = (p: IconProps) => (
  <svg {...base} className={p.className} strokeWidth={2}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
const TrendUpIcon = (p: IconProps) => (
  <svg {...base} className={p.className} strokeWidth={2}>
    <path d="M3 17l6-6 4 4 8-8" />
    <path d="M17 7h4v4" />
  </svg>
);

type Lead = { name: string; meta: string; badge: string; badgeActive: boolean; Icon: (p: IconProps) => ReactElement };

const LEADS: Lead[] = [
  { name: 'Lone Star Roofing & Exteriors', meta: 'Roofing · ★ 4.8 (126)', badge: 'No website', badgeActive: true, Icon: StoreIcon },
  { name: 'Hill Country Concrete Co.', meta: 'Concrete · ★ 4.6 (58)', badge: 'No website', badgeActive: true, Icon: WrenchIcon },
  { name: 'Delgado Custom Carpentry', meta: 'Carpentry · ★ 4.9 (41)', badge: 'Has site', badgeActive: false, Icon: StoreIcon },
  { name: 'Brazos Valley Plumbing', meta: 'Plumbing · ★ 4.7 (203)', badge: 'No website', badgeActive: true, Icon: WrenchIcon },
  { name: 'Third Coast Electric', meta: 'Electrical · ★ 4.5 (89)', badge: 'Has site', badgeActive: false, Icon: BoltIcon },
];

const INDUSTRY = 'Construction';
const LOCATION = 'Austin, TX';

type RowState = { name: string; shown: boolean; meta: boolean };
const emptyRows = (): RowState[] => LEADS.map(() => ({ name: '', shown: false, meta: false }));
const fullRows = (): RowState[] => LEADS.map((l) => ({ name: l.name, shown: true, meta: true }));

export function HeroLeadsPanel() {
  const [industry, setIndustry] = useState('');
  const [location, setLocation] = useState('');
  const [caret, setCaret] = useState<0 | 1 | null>(0);
  const [noWeb, setNoWeb] = useState(false);
  const [count, setCount] = useState(0);
  const [rows, setRows] = useState<RowState[]>(emptyRows);
  const [pulse, setPulse] = useState(false);
  const [runId, setRunId] = useState(0);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setIndustry(INDUSTRY);
      setLocation(LOCATION);
      setCaret(null);
      setNoWeb(true);
      setCount(20);
      setRows(fullRows());
      return;
    }
    const timers: number[] = [];
    const sleep = (ms: number) =>
      new Promise<void>((res) => {
        const t = window.setTimeout(res, ms);
        timers.push(t);
      });
    const setRow = (r: number, patch: Partial<RowState>) =>
      setRows((prev) => prev.map((row, i) => (i === r ? { ...row, ...patch } : row)));

    const run = async () => {
      while (!cancelled.current) {
        setIndustry('');
        setLocation('');
        setCaret(0);
        setNoWeb(false);
        setCount(0);
        setPulse(false);
        setRows(emptyRows());
        await sleep(600);
        for (let i = 1; i <= INDUSTRY.length && !cancelled.current; i++) {
          setIndustry(INDUSTRY.slice(0, i));
          await sleep(45);
        }
        await sleep(280);
        setCaret(1);
        for (let i = 1; i <= LOCATION.length && !cancelled.current; i++) {
          setLocation(LOCATION.slice(0, i));
          await sleep(45);
        }
        setCaret(null);
        await sleep(240);
        setNoWeb(true);
        await sleep(360);
        for (let c = 1; c <= 20 && !cancelled.current; c++) {
          setCount(c);
          await sleep(28);
        }
        await sleep(180);
        for (let r = 0; r < LEADS.length && !cancelled.current; r++) {
          setRow(r, { shown: true });
          const nm = LEADS[r].name;
          for (let i = 1; i <= nm.length && !cancelled.current; i++) {
            setRow(r, { name: nm.slice(0, i) });
            await sleep(16);
          }
          setRow(r, { meta: true });
          await sleep(110);
        }
        await sleep(450);
        setPulse(true);
        await sleep(650);
        setPulse(false);
        await sleep(2200);
      }
    };
    void run();
    return () => {
      cancelled.current = true;
      timers.forEach((t) => clearTimeout(t));
    };
  }, [runId]);

  const replay = () => setRunId((v) => v + 1);

  const Caret = () => (
    <span className="ml-0.5 inline-block h-[1em] w-px animate-pulse bg-accent align-middle" />
  );

  return (
    <div className="relative">
      {/* Floating trend chip - hidden on small screens to avoid overflow. */}
      <div className="absolute -right-3 -top-4 z-10 hidden items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 shadow-card md:flex">
        <TrendUpIcon className="h-5 w-5 shrink-0 text-accent" />
        <div className="text-body-sm leading-tight text-ink">
          <div>More meetings.</div>
          <div>Less work.</div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        {/* Window bar */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
          </div>
          <p className="text-body-sm text-ink">Leads · {location || '…'}</p>
          <p className="ml-auto text-body-sm text-muted">{count} results</p>
        </div>

        {/* Filter chips - the industry + city type themselves; click to replay. */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          <button
            type="button"
            onClick={replay}
            onMouseEnter={replay}
            className="rounded-full border border-line px-3 py-1 text-left text-body-sm text-ink transition-colors hover:border-accent/60"
          >
            {industry || <span className="text-muted">Industry</span>}
            {caret === 0 ? <Caret /> : null}
          </button>
          <button
            type="button"
            onClick={replay}
            className="rounded-full border border-line px-3 py-1 text-left text-body-sm text-ink transition-colors hover:border-accent/60"
          >
            {location || <span className="text-muted">City</span>}
            {caret === 1 ? <Caret /> : null}
          </button>
          <span
            className={[
              'rounded-full px-3 py-1 text-body-sm transition-all duration-300',
              noWeb ? 'bg-accent-soft text-accent opacity-100' : 'border border-dashed border-line text-muted opacity-60',
            ].join(' ')}
          >
            No website ✓
          </span>
        </div>

        {/* Lead rows - fixed height each, so streaming never shifts layout. */}
        <ul className="divide-y divide-line border-t border-line">
          {LEADS.map((lead, i) => {
            const state = rows[i];
            const { Icon } = lead;
            return (
              <li
                key={lead.name}
                className={[
                  'flex h-[3.25rem] items-center gap-3 px-4 transition-all duration-300 ease-out',
                  state.shown ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0',
                ].join(' ')}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium text-ink">{state.name}</p>
                  <p
                    className={[
                      'truncate text-[0.8rem] text-muted transition-opacity duration-200',
                      state.meta ? 'opacity-100' : 'opacity-0',
                    ].join(' ')}
                  >
                    {lead.meta}
                  </p>
                </div>
                <span
                  className={[
                    'shrink-0 rounded-full px-2.5 py-1 text-[0.75rem] transition-opacity duration-200',
                    state.meta ? 'opacity-100' : 'opacity-0',
                    lead.badgeActive ? 'bg-accent-soft text-accent' : 'border border-line text-muted',
                  ].join(' ')}
                >
                  {lead.badge}
                </span>
                <ChevronIcon className={['h-4 w-4 shrink-0 text-muted transition-opacity duration-200', state.meta ? 'opacity-100' : 'opacity-0'].join(' ')} />
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-line px-4 py-3">
          <p className="text-body-sm text-muted">
            {rows.filter((r) => r.meta).length} of {count} leads · {noWeb ? 'filtered by no website' : 'searching…'}
          </p>
          <span
            className={[
              'ml-auto rounded-md bg-accent px-3 py-1.5 text-body-sm text-white transition-transform duration-300',
              pulse ? 'scale-105' : 'scale-100',
            ].join(' ')}
          >
            Save to list
          </span>
        </div>
      </div>
    </div>
  );
}
