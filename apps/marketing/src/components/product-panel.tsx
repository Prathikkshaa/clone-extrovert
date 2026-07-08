// SERVER component - a built, on-brand REPRESENTATION of the product UI (the lead
// list showing the "No website" buying-signal badge). This stands in for a real
// product screenshot (M00 §13 placeholder) but renders as crisp DOM (no image
// asset, no layout shift, sharp on every display) and reads as genuine product
// imagery. Swap for a real screenshot/video frame when available - it's isolated
// here and used by both the hero and the demo fallback.
//
// Labeled as representative via the `aria-label`; the copy/data are realistic
// examples (construction firms in a city, no-website filter) per the message spine.

const LEADS: { name: string; meta: string; noWebsite?: boolean }[] = [
  { name: 'Lone Star Roofing & Exteriors', meta: 'Roofing · ★ 4.8 (126)', noWebsite: true },
  { name: 'Hill Country Concrete Co.', meta: 'Concrete · ★ 4.6 (58)', noWebsite: true },
  { name: 'Delgado Custom Carpentry', meta: 'Carpentry · ★ 4.9 (41)' },
  { name: 'Brazos Valley Plumbing', meta: 'Plumbing · ★ 4.7 (203)', noWebsite: true },
  { name: 'Third Coast Electric', meta: 'Electrical · ★ 4.5 (89)' },
];

export function ProductPanel({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Representative product screenshot: a lead list for construction firms in Austin, several flagged as having no website"
      className={[
        'w-full overflow-hidden rounded-xl border border-line bg-surface shadow-[0_24px_60px_-30px_rgba(26,26,24,0.35)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="h-2.5 w-2.5 rounded-full bg-line" />
        <span className="ml-3 text-body-sm text-muted">Leads · Austin, TX</span>
      </div>

      {/* Search + filter row */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <span className="rounded-md border border-line px-3 py-1.5 text-body-sm text-ink">
          Construction
        </span>
        <span className="rounded-md border border-line px-3 py-1.5 text-body-sm text-muted">
          Austin, TX
        </span>
        <span className="rounded-md bg-accent-soft px-3 py-1.5 text-body-sm font-medium text-accent">
          No website ✓
        </span>
      </div>

      {/* Lead rows */}
      <ul className="divide-y divide-line">
        {LEADS.map((lead) => (
          <li key={lead.name} className="flex items-center justify-between gap-3 px-4 py-3.5">
            <div className="min-w-0">
              <p className="truncate text-body font-medium text-ink">{lead.name}</p>
              <p className="truncate text-body-sm text-muted">{lead.meta}</p>
            </div>
            {lead.noWebsite ? (
              <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-[0.75rem] font-medium text-accent">
                No website
              </span>
            ) : (
              <span className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[0.75rem] text-muted">
                Has site
              </span>
            )}
          </li>
        ))}
      </ul>

      {/* Footer action bar */}
      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
        <span className="text-body-sm text-muted">5 of 20 leads · 3 with no website</span>
        <span className="rounded-md bg-accent px-3 py-1.5 text-body-sm font-medium text-white">
          Save to list
        </span>
      </div>
    </div>
  );
}
