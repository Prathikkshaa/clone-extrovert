// SERVER component - the hero. Two-column layout (M00 §5): copy + CTAs on the
// left, a realistic product "leads panel" card on the right; below the two
// columns a full-width 3-up feature strip. Stacks on mobile.
//
// Copy is DIRECTION per M02 - specific, transformation-led, no hype words. The
// user refines final words. The leads panel is illustrative/decorative
// (aria-hidden) - the numbers are a sample list, not real metrics.
import type { ReactElement } from 'react';
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { SIGNUP_URL, APP_NAME } from '@/lib/site';

// --- inline thin-line icons (generic, no brand marks) ---
type IconProps = { className?: string };

function CheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function StoreIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 9 4.5 4h15L21 9" />
      <path d="M4 9v11h16V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function WrenchIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5l-6 6 2.4 2.4 6-6a4 4 0 0 0 5-5.4l-2.6 2.6-2-2 2.6-2.6Z" />
    </svg>
  );
}

function BoltIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  );
}

function ChevronIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function TrendUpIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 17l6-6 4 4 8-8" />
      <path d="M17 7h4v4" />
    </svg>
  );
}

function MagnifierIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function PenIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 20h8" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
    </svg>
  );
}

function SendIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 3 10.5 13.5M21 3l-6.5 18-4-8-8-4z" />
    </svg>
  );
}

function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </svg>
  );
}

// --- sample lead list (illustrative only) ---
type Lead = {
  name: string;
  meta: string;
  badge: string;
  badgeActive: boolean;
  Icon: (p: IconProps) => ReactElement;
};

const LEADS: Lead[] = [
  {
    name: 'Lone Star Roofing & Exteriors',
    meta: 'Roofing · ★ 4.8 (126)',
    badge: 'No website',
    badgeActive: true,
    Icon: StoreIcon,
  },
  {
    name: 'Hill Country Concrete Co.',
    meta: 'Concrete · ★ 4.6 (58)',
    badge: 'No website',
    badgeActive: true,
    Icon: WrenchIcon,
  },
  {
    name: 'Delgado Custom Carpentry',
    meta: 'Carpentry · ★ 4.9 (41)',
    badge: 'Has site',
    badgeActive: false,
    Icon: StoreIcon,
  },
  {
    name: 'Brazos Valley Plumbing',
    meta: 'Plumbing · ★ 4.7 (203)',
    badge: 'No website',
    badgeActive: true,
    Icon: WrenchIcon,
  },
  {
    name: 'Third Coast Electric',
    meta: 'Electrical · ★ 4.5 (89)',
    badge: 'Has site',
    badgeActive: false,
    Icon: BoltIcon,
  },
];

const BENEFITS = ['100 free credits', 'No card needed', 'See real leads in minutes'];

// The product narrative in four beats - the lightweight hero "how it works".
const STEPS: { Icon: (p: IconProps) => ReactElement; label: string; copy: string }[] = [
  { Icon: MagnifierIcon, label: 'Find', copy: 'Businesses that fit your market.' },
  { Icon: PenIcon, label: 'Personalize', copy: 'Researched, written like you.' },
  { Icon: SendIcon, label: 'Send', copy: 'From your own inbox.' },
  { Icon: CalendarIcon, label: 'Book', copy: 'Replies become meetings.' },
];

function LeadsPanel() {
  return (
    <div className="relative" aria-hidden="true">
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
          <p className="text-body-sm text-ink">Leads · Austin, TX</p>
          <p className="ml-auto text-body-sm text-muted">20 results</p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-2 px-4 py-3">
          <span className="rounded-full border border-line px-3 py-1 text-body-sm text-ink">
            Construction
          </span>
          <span className="rounded-full border border-line px-3 py-1 text-body-sm text-ink">
            Austin, TX
          </span>
          <span className="rounded-full bg-accent-soft px-3 py-1 text-body-sm text-accent">
            No website ✓
          </span>
        </div>

        {/* Lead rows */}
        <ul className="divide-y divide-line border-t border-line">
          {LEADS.map((lead) => {
            const { Icon } = lead;
            return (
              <li key={lead.name} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body-sm font-medium text-ink">{lead.name}</p>
                  <p className="truncate text-[0.8rem] text-muted">{lead.meta}</p>
                </div>
                <span
                  className={
                    lead.badgeActive
                      ? 'shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-[0.75rem] text-accent'
                      : 'shrink-0 rounded-full border border-line px-2.5 py-1 text-[0.75rem] text-muted'
                  }
                >
                  {lead.badge}
                </span>
                <ChevronIcon className="h-4 w-4 shrink-0 text-muted" />
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-line px-4 py-3">
          <p className="text-body-sm text-muted">5 of 20 leads · 3 with no website</p>
          <span className="ml-auto rounded-md bg-accent px-3 py-1.5 text-body-sm text-white">
            Save to list
          </span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <>
      <section className="shell grid items-center gap-12 pb-10 pt-14 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:pb-16 md:pt-24">
        <div>
          <Reveal>
            <p className="text-eyebrow uppercase text-accent">AI prospecting that books meetings</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 text-display-lg text-ink">
              Tell {APP_NAME} what you sell. It finds the businesses that need you and books you
              meetings.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-prose text-body-lg text-muted">
              {APP_NAME} is AI sales prospecting for founders, owners, and agencies who need
              clients. Tell it what you sell and the market you want, and it finds relevant local
              businesses, researches why each one might need you, and writes personalized outreach
              that sounds like you, not a spam blast, so more of it turns into real conversations
              and booked meetings. No seats, no monthly minimum, pay only for what you use.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CtaButton href={SIGNUP_URL} size="lg">
                Start free
              </CtaButton>
              <CtaButton href="#demo" variant="secondary" size="lg">
                See how it works
              </CtaButton>
            </div>
            <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 sm:divide-x sm:divide-line">
              {BENEFITS.map((benefit, i) => (
                <li
                  key={benefit}
                  className={
                    'flex items-center gap-2 text-body-sm text-ink/80' +
                    (i > 0 ? ' sm:pl-4' : '')
                  }
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Product leads panel (illustrative). */}
        <Reveal delay={0.12} y={24}>
          <LeadsPanel />
        </Reveal>
      </section>

      {/* Full-width product narrative: Find -> Personalize -> Send -> Book. A
          lightweight, static "how it works" glance - no animation, no layout shift. */}
      <Reveal delay={0.1}>
        <div className="shell border-t border-line py-8">
          <ol className="grid grid-cols-2 gap-x-4 gap-y-6 sm:flex sm:items-start sm:justify-between sm:gap-4">
            {STEPS.map(({ Icon, label, copy }, i) => (
              <li
                key={label}
                className="flex items-start gap-3 sm:flex-1"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-medium text-ink">
                    <span className="text-body-sm text-accent">{i + 1}</span>
                    {label}
                  </p>
                  <p className="mt-1 text-body-sm text-muted">{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </>
  );
}
