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
import { HeroLeadsPanel } from '@/components/hero-leads-panel';
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

const BENEFITS = ['100 free credits', 'No card needed', 'See leads in minutes'];

// The product narrative in four beats - the lightweight hero "how it works".
const STEPS: { Icon: (p: IconProps) => ReactElement; label: string; copy: string }[] = [
  { Icon: MagnifierIcon, label: 'Find', copy: 'Businesses that fit your market.' },
  { Icon: PenIcon, label: 'Personalize', copy: 'Researched, written like you.' },
  { Icon: SendIcon, label: 'Send', copy: 'From your own inbox.' },
  { Icon: CalendarIcon, label: 'Book', copy: 'Replies become meetings.' },
];

export function Hero() {
  return (
    <>
      <section className="shell grid items-center gap-10 pb-8 pt-10 md:grid-cols-[1fr_1.05fr] md:gap-14 md:pb-12 md:pt-20">
        <div>
          <Reveal>
            <p className="text-eyebrow uppercase text-accent">AI prospecting that books meetings</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 text-display-md text-ink">
              <span className="block">Tell {APP_NAME} what you sell.</span>
              <span className="block">It finds businesses that need you and books you meetings.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-prose text-body-lg text-muted">
              {APP_NAME} finds the local businesses that need what you sell, researches them, and
              reaches out in your voice, not spam. You get meetings. Pay only for what you use.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <CtaButton href={SIGNUP_URL} size="lg">
                Start free
              </CtaButton>
              <CtaButton href="#demo" variant="secondary" size="lg">
                See how it works
              </CtaButton>
            </div>
            <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 sm:flex-nowrap sm:divide-x sm:divide-line">
              {BENEFITS.map((benefit, i) => (
                <li
                  key={benefit}
                  className={
                    'flex items-center gap-2 whitespace-nowrap text-body-sm text-ink/80' +
                    (i > 0 ? ' sm:pl-3' : '')
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

        {/* Product leads panel - interactive, autoplaying micro-demo. */}
        <Reveal delay={0.12} y={24} className="min-w-0 md:-mt-6">
          <HeroLeadsPanel />
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
