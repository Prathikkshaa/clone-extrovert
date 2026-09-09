// SERVER. The editorial spine of /how-it-works: seven chapters that reveal the
// mechanism behind Milo, threaded by one running example (Lone Star Roofing,
// Austin) so the abstract stays concrete. No landing patterns, no floating
// dashboard cards; each artifact is a restrained typographic or data snippet.
import type { ReactNode } from 'react';
import { Reveal } from '@/components/reveal';

type Chapter = {
  n: string;
  title: string;
  intent: string;
  mechanism: string;
  artifact?: ReactNode;
  emphasise?: boolean;
};

/* ── inline artifacts (specific per chapter, restrained) ── */

function MarketQuery() {
  return (
    <div className="mt-6 font-mono text-body-sm leading-loose text-ink">
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

function DiscoveryTable() {
  const rows = [
    ['Lone Star Roofing', '4.8 · 126', 'no site'],
    ['Hill Country Roofers', '4.6 · 88', 'no site'],
    ['Bluebonnet Roofing Co.', '4.9 · 41', 'no site'],
  ];
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface text-body-sm">
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

function ResearchSketch() {
  const lines = [
    ['site.title', 'not found'],
    ['reviews.rating', '4.8 across 126 jobs'],
    ['reviews.themes', 'punctual, storm damage, insurance claims'],
    ['tech.detected', 'Google Business Profile only'],
  ];
  return (
    <dl className="mt-6 divide-y divide-line rounded-lg border border-line bg-surface text-body-sm">
      {lines.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[minmax(0,10rem)_1fr] gap-4 px-4 py-2.5">
          <dt className="font-mono text-muted">{k}</dt>
          <dd className="min-w-0 text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function SignalGrid() {
  const items = [
    { label: 'No website', reason: 'Referrals go cold. Homeowners can’t compare.' },
    { label: 'Thin online presence', reason: 'A modest lift wins local share.' },
    { label: 'Weak reviews', reason: 'Reputation work has a clear buyer.' },
    { label: 'Hiring signal', reason: 'They’re expanding and stretched thin.' },
  ];
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it.label} className="rounded-lg border border-line bg-surface px-4 py-3 text-body-sm">
          <p className="font-medium text-ink">{it.label}</p>
          <p className="mt-0.5 text-muted">{it.reason}</p>
        </li>
      ))}
    </ul>
  );
}

function EmailDraft() {
  return (
    <div className="mt-6 rounded-lg border border-line bg-surface p-5 text-body-sm">
      <p className="text-muted">Subject</p>
      <p className="mt-1 font-medium text-ink">Quick idea for Lone Star Roofing</p>
      <div className="mt-4 space-y-2 text-ink/80">
        <p>
          Saw the 4.8 across 126 storm-damage jobs around Austin. Clear the crews deliver.
        </p>
        <p>
          Noticed there’s no site yet, so homeowners comparing roofers after a referral can’t find you.
          I help contractors close that gap in a week.
        </p>
      </div>
      <div className="mt-4 border-t border-line pt-3 text-[0.78rem] text-muted">
        Grounded in their reviews. Rewritten in your voice. Nothing sends yet.
      </div>
    </div>
  );
}

function SendLog() {
  const rows = [
    ['09:14', 'Sent · 1 of 40 today', 'from you@yourinbox.com'],
    ['10:02', 'Sent · 2 of 40 today', 'natural spacing'],
    ['11:47', 'Sent · 3 of 40 today', 'warm-up ramping'],
  ];
  return (
    <ol className="mt-6 divide-y divide-line rounded-lg border border-line bg-surface font-mono text-body-sm">
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

function ReplyCard() {
  return (
    <div className="mt-6 rounded-lg border border-line bg-surface p-5 text-body-sm">
      <p className="text-muted">From: owner@lonestarroofing.com</p>
      <p className="mt-1 text-ink">
        Interesting. Got 10 minutes Thursday? We just lost a job to a competitor with a site.
      </p>
      <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
        <span className="rounded-md bg-accent-soft px-2.5 py-1 text-[0.78rem] font-medium text-accent">
          Positive
        </span>
        <span className="text-[0.78rem] text-muted">Follow-ups paused. Reply in your inbox.</span>
      </div>
    </div>
  );
}

const CHAPTERS: Chapter[] = [
  {
    n: '01',
    title: 'You define the market.',
    intent: 'A trade, a place, and the signal you can act on.',
    mechanism:
      'Milo treats the signal as a filter, not a bonus. The list is scoped to businesses that show it in public information anyone can look up.',
    artifact: <MarketQuery />,
  },
  {
    n: '02',
    title: 'Milo discovers real local businesses.',
    intent: 'Live discovery from public sources, not a rented database.',
    mechanism:
      'For "roofing in Austin, TX, no website", Milo returns real, current businesses with the metadata the next step needs: category, rating, address.',
    artifact: <DiscoveryTable />,
  },
  {
    n: '03',
    title: 'It reads each business.',
    intent: 'Before writing anything, Milo studies the specific business.',
    mechanism:
      'Their site (when present), their reviews, and their category get distilled into a short factual sketch. Every downstream sentence has to be grounded in something on that sketch.',
    artifact: <ResearchSketch />,
  },
  {
    n: '04',
    title: 'It confirms the buying signal.',
    intent: 'This is why the outreach lands.',
    mechanism:
      'A lead only earns a place on the list when the signal is observable in the sketch: a concrete gap you can solve. No signal, no outreach. Milo would rather send fewer, better emails.',
    artifact: <SignalGrid />,
    emphasise: true,
  },
  {
    n: '05',
    title: 'It writes the outreach in your voice.',
    intent: 'Three messages, personalized from what the business actually does.',
    mechanism:
      'Milo drafts a 3-email sequence per lead. No merge tokens, no "Hi {{first_name}}." Every specific claim is anchored in the sketch, and every draft waits for your approval.',
    artifact: <EmailDraft />,
  },
  {
    n: '06',
    title: 'It sends the way a careful human does.',
    intent: 'From your Gmail or Outlook, not a shared blast server.',
    mechanism:
      'Slow warm-up, one at a time, randomized spacing. Every message carries one-click unsubscribe and your physical address (CAN-SPAM in the US, PECR/GDPR-aware in the UK and EU).',
    artifact: <SendLog />,
  },
  {
    n: '07',
    title: 'It turns a reply into a conversation.',
    intent: 'Replies come to your inbox. That is the point.',
    mechanism:
      'Follow-ups stop the moment someone responds. Milo labels the reply, drafts an answer for you to approve, and hands the thread back as normal email.',
    artifact: <ReplyCard />,
  },
];

export function Chapters() {
  return (
    <section className="shell pb-section-y">
      <ol className="mx-auto max-w-4xl">
        {CHAPTERS.map((c, i) => (
          <Reveal
            key={c.n}
            as="li"
            className={[
              'relative grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 pb-16 md:gap-x-10 md:pb-24',
              i === CHAPTERS.length - 1
                ? ''
                : "before:absolute before:left-[1.35rem] before:top-14 before:h-[calc(100%-3rem)] before:w-px before:bg-line md:before:left-[1.75rem]",
            ].join(' ')}
          >
            <div className="col-start-1 row-span-2 flex items-start">
              <span
                className={[
                  'grid h-11 w-11 place-items-center rounded-full font-mono text-body-sm tracking-tight md:h-14 md:w-14',
                  c.emphasise
                    ? 'bg-accent text-white'
                    : 'border border-line bg-surface text-ink',
                ].join(' ')}
              >
                {c.n}
              </span>
            </div>
            <div className="col-start-2 min-w-0">
              <h3 className="text-heading-lg text-ink">{c.title}</h3>
              <p className="mt-3 max-w-prose text-body-lg text-ink/80">{c.intent}</p>
              <p className="mt-3 max-w-prose text-body text-muted">{c.mechanism}</p>
              {c.artifact}
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
