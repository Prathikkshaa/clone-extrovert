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


// A) Hero visual: the rendered "Milo calling out to local businesses" scene
// (Milo + the isometric city with connected business cards). Single optimized
// image, eager-loaded above the fold with explicit dimensions (no CLS).
function HeroMilo() {
  return (
    <img
      src="/milo/milo-hero-scene.webp"
      width={912}
      height={750}
      alt="Milo, the ExtrovertAI mascot, reaching out to local businesses across a city"
      loading="eager"
      fetchPriority="high"
      className="h-auto w-full rounded-2xl"
    />
  );
}

// --- Generic thin-line icons (stroke ~1.7, rounded, currentColor). No brand marks. ---
type IconProps = { className?: string };

function svgProps(className?: string) {
  return {
    viewBox: '0 0 24 24',
    className: className ?? 'h-6 w-6',
    fill: 'none' as const,
    'aria-hidden': true,
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
}

function IconSearch({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function IconDocLines({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
      <path d="M8 12h8M8 16h6" />
    </svg>
  );
}

function IconPaperPlane({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M21 4 3 11l6 2 2 6 10-15Z" />
      <path d="m9 13 5-5" />
    </svg>
  );
}

function IconCalendar({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M4 9h16M8 3v4M16 3v4" />
    </svg>
  );
}

function IconPerson({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function IconBolt({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M13 3 5 13h6l-1 8 8-11h-6l1-7Z" />
    </svg>
  );
}

function IconBarChart({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M4 20h16" />
      <path d="M7 20v-6M12 20V8M17 20v-9" />
    </svg>
  );
}

function IconEnvelope({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function IconPeople({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0" />
      <path d="M16 6.5a3 3 0 0 1 0 5.8M17.5 19a5.5 5.5 0 0 0-2.2-4.4" />
    </svg>
  );
}

function IconDatabase({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}

function IconPen({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M17 3 21 7 8 20l-4 1 1-4L17 3Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function IconCoins({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <ellipse cx="12" cy="7" rx="6" ry="3" />
      <path d="M6 7v4c0 1.7 2.7 3 6 3s6-1.3 6-3V7" />
      <path d="M6 11v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4" />
    </svg>
  );
}

function IconDocShield({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="M6 3h7l3 3v4" />
      <path d="M6 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4" />
      <path d="M8 8h4M8 12h3" />
      <path d="M17 12c-1.8.7-3 1.2-3 1.2 0 3.4 1.5 5.2 3 5.8 1.5-.6 3-2.4 3-5.8 0 0-1.2-.5-3-1.2Z" />
    </svg>
  );
}

function IconCheck({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="m5 12 4.5 4.5L19 7" />
    </svg>
  );
}

function IconChevronRight({ className }: IconProps) {
  return (
    <svg {...svgProps(className)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

// --- Section data ---
type Step = { n: string; title: string; copy: string; Icon: ComponentType<IconProps> };

const STEPS: Step[] = [
  { n: '1', title: 'Find', copy: 'We find local businesses worth reaching in your target market.', Icon: IconSearch },
  { n: '2', title: 'Write', copy: 'It writes personalized outreach in your voice using proven structures.', Icon: IconDocLines },
  { n: '3', title: 'Send', copy: 'Sent from your own inbox - no headaches, no extra tools.', Icon: IconPaperPlane },
  { n: '4', title: 'Book', copy: 'You get replies and meetings, so you can focus on the calls.', Icon: IconCalendar },
];

type MiniItem = { label: string; Icon: ComponentType<IconProps> };

const BUILD_FOOTER: MiniItem[] = [
  { label: 'Built for solo founders and small agencies', Icon: IconPerson },
  { label: 'No cold-call scripts or five-tool stack', Icon: IconBolt },
  { label: 'Real conversations with real local businesses', Icon: IconBarChart },
];

const BET_STATS: MiniItem[] = [
  { label: 'No tool sprawl', Icon: IconBolt },
  { label: 'No spam', Icon: IconEnvelope },
  { label: 'Built for solo founders & small agencies', Icon: IconPeople },
];

const TOOLS: MiniItem[] = [
  { label: 'Lead database', Icon: IconDatabase },
  { label: 'AI writer', Icon: IconPen },
  { label: 'Cold email tool', Icon: IconEnvelope },
  { label: 'CRM', Icon: IconPeople },
  { label: 'Scheduling', Icon: IconCalendar },
];

type Principle = { n: string; title: string; copy: string; Icon: ComponentType<IconProps> };

const PRINCIPLES: Principle[] = [
  {
    n: '01',
    title: 'Your inbox, your reputation',
    copy: 'Your own Gmail or Outlook. Warmed up, paced, and never a shared blast server.',
    Icon: IconEnvelope,
  },
  {
    n: '02',
    title: 'Pay for what you use',
    copy: 'Credits, not subscriptions. No seats. No monthly commitment.',
    Icon: IconCoins,
  },
  {
    n: '03',
    title: 'Personal, never spam',
    copy: 'Public details, thoughtful outreach, one-click unsubscribe. Region-aware.',
    Icon: IconDocShield,
  },
];

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

      {/* SECTION A - What we're building */}
      <section className="shell py-section-y">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow uppercase text-accent">What we&rsquo;re building</p>
          <h2 className="mt-3 text-display-md text-ink">
            A simpler way to get meetings with local businesses.
          </h2>
          <p className="mt-5 text-body-lg text-muted">
            {APP_NAME} is a cold-email and local-business lead-generation tool that finds local
            businesses worth reaching, writes personalized outreach in your voice, and sends it
            from your own inbox.
          </p>
          <p className="mt-4 text-body-lg text-muted">
            It exists for one reason: a solo founder or a small agency shouldn&rsquo;t need a full
            sales team to get meetings. Point it at a market - it does the finding, the writing,
            and the sending; you show up to the calls.
          </p>
        </Reveal>

        <Reveal className="mt-12 flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center">
          <img
            src="/milo/milo-hero.webp"
            width={414}
            height={486}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-auto w-full max-w-[130px] shrink-0"
          />
          <div className="flex w-full flex-col gap-4 md:flex-row md:items-stretch md:gap-2">
            {STEPS.map((s, i) => (
              <div key={s.title} className="flex flex-col md:flex-1 md:flex-row md:items-center md:gap-2">
                <div className="relative flex-1 rounded-xl border border-line bg-surface p-5 pt-12">
                  <span className="absolute left-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-accent-soft text-xs font-medium text-accent">
                    {s.n}
                  </span>
                  <div className="grid h-12 w-12 place-items-center rounded-lg bg-accent-soft text-accent">
                    <s.Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-heading-sm text-ink">{s.title}</h3>
                  <p className="mt-2 text-body-sm text-muted">{s.copy}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden shrink-0 items-center justify-center text-muted md:flex">
                    <IconChevronRight className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 flex justify-center">
          <span className="inline-flex items-center rounded-full bg-accent-soft px-4 py-1.5 text-xs font-medium tracking-wide text-accent">
            REPEAT. MORE MEETINGS. MORE GROWTH.
          </span>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-body-sm text-ink/80 md:flex-row md:justify-center md:gap-0 md:divide-x md:divide-line">
          {BUILD_FOOTER.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 md:px-6">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                <item.Icon className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION B - The problem & the bet */}
      <section className="shell py-section-y">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <p className="text-eyebrow uppercase text-accent">The problem &amp; the bet</p>
            <h2 className="mt-3 text-display-md text-ink">Existing tools all miss the mark.</h2>
            <p className="mt-4 text-body-lg text-muted">
              Lead databases are overpriced and stale. &ldquo;AI&rdquo; writers send generic spam.
              Cold-email platforms are complex and slow. Stitching five tools together is a project
              on its own.
            </p>
            <p className="mt-6 text-heading-md font-medium text-ink">So the bet is one honest tool.</p>
            <p className="mt-4 text-body-lg text-muted">
              Find the right businesses. Write like you. Send without landing in spam. One
              workflow, pay as you go.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {BET_STATS.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 text-body-sm text-ink/80">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                    <item.Icon className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="rounded-2xl bg-canvas p-6">
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex flex-col gap-3 md:flex-1">
                  {TOOLS.map((t) => (
                    <div
                      key={t.label}
                      className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                        <t.Icon className="h-5 w-5" />
                      </span>
                      <span className="text-body-sm text-ink">{t.label}</span>
                      <span aria-hidden="true" className="ml-auto text-muted">
                        &times;
                      </span>
                    </div>
                  ))}
                </div>
                {/* connectors converging to the ExtrovertAI node - decorative, md+ only */}
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="hidden h-40 w-14 shrink-0 self-center text-line md:block"
                  fill="none"
                  aria-hidden="true"
                >
                  <g stroke="currentColor" strokeWidth={0.6}>
                    <path d="M0 10 C 55 10, 45 50, 100 50" />
                    <path d="M0 30 C 55 30, 45 50, 100 50" />
                    <path d="M0 50 H 100" />
                    <path d="M0 70 C 55 70, 45 50, 100 50" />
                    <path d="M0 90 C 55 90, 45 50, 100 50" />
                  </g>
                </svg>
                <div className="flex shrink-0 flex-col items-center gap-2 self-center rounded-xl border border-line bg-surface px-5 py-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-white">
                    <IconCheck className="h-5 w-5" />
                  </span>
                  <span className="text-body font-medium text-ink">{APP_NAME}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <img
                  src="/milo/milo-celebrating.webp"
                  width={523}
                  height={612}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full max-w-[130px]"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION C - Principles */}
      <section className="shell py-section-y">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow uppercase text-accent">Principles</p>
          <h2 className="mt-3 text-display-md text-ink">What we hold to.</h2>
          <p className="mt-4 text-body-lg text-muted">
            Three simple principles keep {APP_NAME} honest, effective and built for the long term.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="flex items-center gap-3">
                <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <p.Icon className="h-6 w-6" />
                  <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-accent" />
                </div>
                <span className="text-body-sm font-medium text-accent">{p.n}</span>
                {i < PRINCIPLES.length - 1 && (
                  <span className="hidden flex-1 border-t border-line md:block" />
                )}
              </div>
              <h3 className="mt-5 text-heading-sm text-ink">{p.title}</h3>
              <p className="mt-2 text-body text-muted">{p.copy}</p>
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
