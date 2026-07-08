'use client';
// CLIENT ISLAND - the looping product demo. Since the real screen-capture video is
// a later swap-list item, this stands in with a proper, on-brand UI that cycles
// through the four stages of the loop (search -> leads -> draft -> booked), with a
// synced caption/progress strip. Reduced-motion-safe: when the user prefers
// reduced motion, it stops cycling and shows the "leads" scene statically.
import { useEffect, useState } from 'react';

const SCENES = ['Type a city', 'Leads appear', 'The email writes itself', 'A meeting books'];
const INTERVAL_MS = 2600;

export function DemoLoop() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setActive(1); // show a representative static scene, no cycling
      return;
    }
    const id = setInterval(() => setActive((a) => (a + 1) % SCENES.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-3 text-body-sm text-muted">{APP_LABELS[active]}</span>
      </div>

      {/* Stage - all scenes are stacked; the active one fades in. Fixed aspect so
          the frame never jumps between scenes. */}
      <div className="relative aspect-[16/10] w-full bg-canvas">
        {SCENES.map((_, i) => (
          <div
            key={i}
            aria-hidden={i !== active}
            className={[
              'absolute inset-0 p-5 transition-opacity duration-500 ease-soft md:p-6',
              i === active ? 'opacity-100' : 'pointer-events-none opacity-0',
            ].join(' ')}
          >
            <Scene index={i} />
          </div>
        ))}
      </div>

      {/* Caption / progress strip - the 4 steps, active one highlighted. */}
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
        {SCENES.map((c, i) => (
          <span
            key={c}
            className={[
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-body-sm transition-colors duration-300',
              i === active ? 'bg-accent text-white' : 'bg-canvas text-muted',
            ].join(' ')}
          >
            <span className={i === active ? 'text-white/70' : 'text-muted/60'}>{i + 1}</span>
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

const APP_LABELS = ['Find leads', 'Find leads', 'Write outreach', 'Booked'];

function Scene({ index }: { index: number }) {
  if (index === 0) return <SearchScene />;
  if (index === 1) return <LeadsScene />;
  if (index === 2) return <DraftScene />;
  return <BookedScene />;
}

function SearchScene() {
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <p className="text-body-sm text-muted">Search a market</p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-line bg-surface px-3 py-2 text-body text-ink">
          Roofers
        </span>
        <span className="flex items-center rounded-md border border-accent bg-surface px-3 py-2 text-body text-ink">
          Austin, TX
          <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-accent" />
        </span>
        <span className="rounded-md bg-accent-soft px-3 py-2 text-body font-medium text-accent">
          No website ✓
        </span>
      </div>
      <div className="mt-1">
        <span className="inline-flex items-center rounded-md bg-accent px-4 py-2 text-body-sm font-medium text-white">
          Search
        </span>
      </div>
    </div>
  );
}

function LeadsScene() {
  const rows = [
    { name: 'Lone Star Roofing & Exteriors', meta: 'Roofing · ★ 4.8 (126)', flag: true },
    { name: 'Hill Country Concrete Co.', meta: 'Concrete · ★ 4.6 (58)', flag: true },
    { name: 'Delgado Custom Carpentry', meta: 'Carpentry · ★ 4.9 (41)', flag: false },
    { name: 'Brazos Valley Plumbing', meta: 'Plumbing · ★ 4.7 (203)', flag: true },
  ];
  return (
    <div className="flex h-full flex-col">
      <p className="mb-2 text-body-sm text-muted">12 leads · 8 with no website</p>
      <ul className="flex-1 divide-y divide-line overflow-hidden rounded-md border border-line">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center justify-between gap-3 bg-surface px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-body-sm font-medium text-ink">{r.name}</p>
              <p className="truncate text-[0.8rem] text-muted">{r.meta}</p>
            </div>
            {r.flag ? (
              <span className="shrink-0 rounded-full bg-accent-soft px-2 py-0.5 text-[0.72rem] font-medium text-accent">
                No website
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DraftScene() {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="rounded-md border border-line bg-surface p-4">
        <p className="text-[0.8rem] text-muted">To: owner@lonestarroofing.com</p>
        <p className="mt-1 text-body font-medium text-ink">Quick idea for Lone Star Roofing</p>
        <div className="mt-3 space-y-1.5">
          <div className="h-2 w-[92%] rounded bg-line" />
          <div className="h-2 w-[80%] rounded bg-line" />
          <div className="h-2 w-[86%] rounded bg-line" />
          <div className="h-2 w-[54%] rounded bg-accent-soft" />
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-accent-soft px-2.5 py-1 text-[0.76rem] font-medium text-accent">
          Written from their site + reviews
        </div>
      </div>
    </div>
  );
}

function BookedScene() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-positive-soft text-2xl text-positive">
        ✓
      </span>
      <div>
        <p className="text-heading-sm text-ink">Meeting booked</p>
        <p className="text-body-sm text-muted">Thursday · 2:30 PM · with Lone Star Roofing</p>
      </div>
    </div>
  );
}
