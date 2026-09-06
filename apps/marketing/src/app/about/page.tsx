import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { Reveal } from '@/components/reveal';
import { FounderNote } from '@/components/sections/founder-note';
import { FinalCta } from '@/components/sections/final-cta';
import { APP_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: `Why ${APP_NAME} exists - outreach for people who'd rather have clients than run a sales team. Early, honest, and built in the open.`,
  alternates: { canonical: '/about' },
};

// About = sharp positioning + honest "we're early" candor (M00 §7). NO fabricated
// team, proof, metrics, or logos. Copy is DIRECTION; the founder finalizes words.

// --- Hand-built inline SVGs (theme-aware via currentColor; color set by a
// wrapping text-* class). Decorative motifs are aria-hidden. Thin strokes, rounded
// caps, minimal - matching the site's quiet editorial house style. ---

// Small generic line icons for the business "chips" (no real brand logos).
function IconCafe() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9h11v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Z" />
      <path d="M16 10h2a2 2 0 0 1 0 4h-2" />
      <path d="M8 3v2M11 3v2" />
    </svg>
  );
}

function IconClinic() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M12 8v6M9 11h6" />
    </svg>
  );
}

function IconGym() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
    </svg>
  );
}

function IconStore() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9 5 4h14l1 5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-3 0Z" />
      <path d="M5 11v8h14v-8" />
    </svg>
  );
}

type Chip = { label: string; Icon: ComponentType };

const HERO_CHIPS: Chip[] = [
  { label: 'Cafe', Icon: IconCafe },
  { label: 'Clinic', Icon: IconClinic },
  { label: 'Gym', Icon: IconGym },
  { label: 'Store', Icon: IconStore },
];

// A) Hero composition: Milo "calling out" to local businesses. Milo is the focal
// image; thin dashed accent connectors reach out (behind the chips) to a column of
// generic business chips.
function HeroMilo() {
  return (
    <div className="relative rounded-xl border border-line bg-surface p-8">
      <div className="grid grid-cols-[auto_1fr] items-center gap-6">
        {/* Focal Milo, calling out */}
        <img
          src="/milo/milo-speaking.webp"
          width={336}
          height={498}
          alt="Milo, the ExtrovertAI mascot"
          loading="eager"
          fetchPriority="high"
          className="h-auto w-full max-w-[180px]"
        />
        {/* Chips, with dashed connectors layered behind */}
        <div className="relative">
          {/* dashed accent connectors, hidden on mobile to avoid mess */}
          <svg
            viewBox="0 0 120 220"
            className="pointer-events-none absolute inset-0 hidden h-full w-full text-accent md:block"
            fill="none"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <g stroke="currentColor" strokeWidth={1.25} strokeDasharray="4 4" strokeLinecap="round">
              <path d="M0 110 C 30 30, 60 28, 108 28" />
              <path d="M0 110 C 30 90, 60 82, 108 82" />
              <path d="M0 110 C 30 130, 60 138, 108 138" />
              <path d="M0 110 C 30 190, 60 192, 108 192" />
            </g>
          </svg>
          <ul className="relative flex flex-col gap-3">
            {HERO_CHIPS.map((c) => (
              <li
                key={c.label}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-body-sm text-ink"
              >
                <span className="text-muted">
                  <c.Icon />
                </span>
                {c.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// B) Principle icons - consistent thin-line, ~28px within a 32-viewBox.
function IconShieldMail() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3 5 7v8c0 6.5 4.5 10.5 11 13 6.5-2.5 11-6.5 11-13V7L16 3Z" />
      <rect x="10.5" y="12" width="11" height="7.5" rx="1.5" />
      <path d="M10.5 13 16 16.5 21.5 13" />
    </svg>
  );
}

function IconCoin() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="16" cy="16" r="11" />
      <circle cx="16" cy="16" r="6.5" />
      <path d="M16 12.5v7M13.5 16h5" />
    </svg>
  );
}

function IconNib() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 6 9 20l-2 6 6-2L27 10a2.8 2.8 0 0 0-4-4Z" />
      <path d="M20 9l3 3" />
      <path d="M6 27h9" />
    </svg>
  );
}

type Principle = { title: string; copy: string; Icon: ComponentType };

const PRINCIPLES: Principle[] = [
  {
    title: 'Your inbox, your reputation',
    copy: 'Every email sends from your own Gmail or Outlook - warmed up and paced like a careful human. Never a shared blast server.',
    Icon: IconShieldMail,
  },
  {
    title: 'Pay for what you use',
    copy: 'Credits, not subscriptions. No seats, no monthly commitment. Your credits never expire while your account is active.',
    Icon: IconCoin,
  },
  {
    title: 'Personal, never spam',
    copy: 'Each email is written from the business’s public details, with one-click unsubscribe and your address on it. Region-aware: CAN-SPAM, PECR, GDPR.',
    Icon: IconNib,
  },
];

// C) The loop: Find -> Write -> Send -> Book, with a return arrow curving back.
function LoopDiagram() {
  const steps = ['Find', 'Write', 'Send', 'Book'];
  const xs = [70, 190, 310, 430];
  const cy = 60;
  return (
    <svg
      viewBox="0 0 500 150"
      className="h-auto w-[500px] max-w-none"
      fill="none"
      aria-hidden="true"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* forward connectors */}
      <g className="text-line" stroke="currentColor" strokeWidth={1.5}>
        <line x1="102" y1={cy} x2="158" y2={cy} />
        <line x1="222" y1={cy} x2="278" y2={cy} />
        <line x1="342" y1={cy} x2="398" y2={cy} />
      </g>
      {/* forward arrowheads */}
      <g className="text-muted" stroke="currentColor" strokeWidth={1.5}>
        <path d="M152 55l6 5-6 5" />
        <path d="M272 55l6 5-6 5" />
        <path d="M392 55l6 5-6 5" />
      </g>
      {/* return loop from Book back to Find */}
      <g className="text-accent" stroke="currentColor" strokeWidth={1.5}>
        <path d="M430 76 v34 a8 8 0 0 1-8 8 H78 a8 8 0 0 1-8-8 V76" opacity={0.9} />
        <path d="M65 82l5 -6 5 6" />
      </g>
      {/* nodes */}
      {steps.map((s, i) => (
        <g key={s}>
          <circle
            cx={xs[i]}
            cy={cy}
            r="20"
            className="text-accent"
            fill="var(--color-accent-soft)"
            stroke="currentColor"
            strokeWidth={1.5}
          />
          <text
            x={xs[i]}
            y={cy + 4}
            textAnchor="middle"
            className="fill-current text-ink"
            style={{ fontSize: '12px', fontWeight: 500 }}
          >
            {s}
          </text>
        </g>
      ))}
    </svg>
  );
}

// D) Five tools -> one: five greyed, scattered chips with tangled lines collapsing
// into a single solid accent node on the right.
function FiveToOne() {
  const chips = [
    { x: 12, y: 14 },
    { x: 40, y: 48 },
    { x: 8, y: 84 },
    { x: 46, y: 118 },
    { x: 20, y: 150 },
  ];
  const tx = 300;
  const ty = 90;
  return (
    <svg
      viewBox="0 0 380 190"
      className="h-auto w-full"
      fill="none"
      aria-hidden="true"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* tangled thin lines collapsing to the one node */}
      <g className="text-line" stroke="currentColor" strokeWidth={1.5}>
        {chips.map((c, i) => (
          <path
            key={i}
            d={`M${c.x + 56} ${c.y + 13} C ${c.x + 150} ${c.y + 13}, ${tx - 70} ${ty}, ${tx - 26} ${ty}`}
          />
        ))}
      </g>
      {/* five greyed, scattered chips */}
      <g className="text-muted">
        {chips.map((c, i) => (
          <g key={i}>
            <rect
              x={c.x}
              y={c.y}
              width="56"
              height="26"
              rx="6"
              fill="var(--color-surface)"
              stroke="currentColor"
              strokeWidth={1.5}
            />
            <line
              x1={c.x + 12}
              y1={c.y + 13}
              x2={c.x + 44}
              y2={c.y + 13}
              stroke="currentColor"
              strokeWidth={1.5}
              opacity={0.6}
            />
          </g>
        ))}
      </g>
      {/* the one solid accent node */}
      <g className="text-accent">
        <circle cx={tx} cy={ty} r="26" fill="currentColor" />
        <path
          d="M291 90l6 6 12-12"
          stroke="var(--color-surface)"
          strokeWidth={2}
          fill="none"
        />
      </g>
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="shell grid items-center gap-12 pt-16 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:pt-24">
        <div>
          <Reveal>
            <p className="text-eyebrow uppercase text-accent">About</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-3 text-display-lg text-ink">
              Outreach for people who&rsquo;d rather have clients than run a sales team.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-prose text-body-lg text-muted">
              No cold-call scripts, no five-tool stack, no headcount. One tool that finds the
              right businesses and reaches out like you would - if you had the time.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.12} y={24}>
          <HeroMilo />
        </Reveal>
      </section>

      <section className="shell max-w-prose py-section-y">
        <Reveal>
          <p className="text-eyebrow uppercase text-accent">What we&rsquo;re building</p>
          <p className="mt-4 text-heading-md font-medium text-ink">
            {APP_NAME} is a cold-email and local-business lead-generation tool that finds local
            businesses worth reaching, writes personalized outreach in your voice, and sends it
            from your own inbox.
          </p>
          <div className="mt-5 space-y-4 text-body-lg text-muted">
            <p>
              It exists for one reason: a solo founder or a small agency shouldn&rsquo;t need a
              full sales team to get meetings.
            </p>
            <p>
              Point it at a market. It does the finding, the writing, and the sending - you show
              up to the calls.
            </p>
          </div>
          <div className="mt-8 flex flex-col items-center gap-6 rounded-xl border border-line bg-surface p-6 md:flex-row">
            <img
              src="/milo/milo-hero.webp"
              width={414}
              height={486}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-auto w-full max-w-[140px] shrink-0"
            />
            <div className="w-full overflow-x-auto">
              <LoopDiagram />
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell max-w-prose py-section-y">
        <Reveal className="space-y-8">
          <div>
            <p className="text-eyebrow uppercase text-accent">The problem &amp; the bet</p>
            <h2 className="mt-3 text-heading-lg text-ink">Existing tools all missed.</h2>
            <p className="mt-4 text-body-lg text-muted">
              Lead databases were overpriced and stale. &ldquo;AI&rdquo; writers spat out obvious
              spam. Cold-email platforms wanted a monthly commitment before your first send. And
              stitching five subscriptions together was a project on its own.
            </p>
          </div>
          <div>
            <h2 className="text-heading-lg text-ink">So the bet is one honest tool.</h2>
            <p className="mt-4 text-body-lg text-muted">
              Find the right businesses. Write like you. Send without landing in spam. One
              workflow, pay as you go - nothing to stitch together.
            </p>
            <div className="mt-6 rounded-xl border border-line bg-surface p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="w-full overflow-x-auto">
                  <FiveToOne />
                </div>
                <img
                  src="/milo/milo-celebrating.webp"
                  width={534}
                  height={601}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full max-w-[150px] shrink-0"
                />
              </div>
              <p className="mt-2 text-body-sm text-muted">Five subscriptions, or one tool.</p>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="shell py-section-y">
        <Reveal className="max-w-prose">
          <p className="text-eyebrow uppercase text-accent">Principles</p>
          <h2 className="mt-3 text-display-md text-ink">What we hold to.</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 0.05}
              className="rounded-xl border border-line bg-surface p-6"
            >
              <span className="inline-flex rounded-md bg-accent-soft p-2 text-accent">
                <p.Icon />
              </span>
              <h3 className="mt-4 text-heading-sm text-ink">{p.title}</h3>
              <p className="mt-3 text-body text-muted">{p.copy}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <FounderNote />

      <section className="shell max-w-prose py-section-y">
        <Reveal>
          <p className="text-eyebrow uppercase text-accent">Where we are</p>
          <h2 className="mt-3 text-heading-lg text-ink">Early, and building in the open.</h2>
          <div className="mt-4 space-y-4 text-body-lg text-muted">
            <p>
              We&rsquo;d rather say that plainly than fake a wall of logos. What you see is
              what&rsquo;s built - no more, no less.
            </p>
            <p>
              The roadmap is shaped by what real users ask for. That&rsquo;s the upside of being
              early: try it now, and your feedback genuinely moves what gets built next.
            </p>
          </div>
        </Reveal>
      </section>

      <FinalCta />
    </>
  );
}
