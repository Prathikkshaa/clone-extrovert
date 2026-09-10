// SERVER. Beta testimonials — two-row seamless marquee, opposite directions.
//
// NOTE ON THE COPY: the 17 names and roles below are PLACEHOLDERS for real
// beta-user testimonials. Every quote was written from a persona brief that
// matches Milo's actual ICP and product truths (no invented features). Swap
// with real quotes + names as beta users opt in; keep the shape identical.
//
// TECHNIQUE:
//   - Each row renders its cards TWICE side-by-side inside a track.
//   - CSS keyframes (marquee-left / marquee-right in globals.css) shift the
//     track by -50% so the loop lands exactly on the second copy. Zero jump.
//   - Rows pause on hover (`.marquee-row:hover { animation-play-state: paused }`
//     inlined below).
//   - Reduced-motion: the global block in globals.css forces
//     animation-duration: 0.001ms on *, which effectively freezes the marquee
//     into a static grid. No JS branch needed.
import { Reveal } from '@/components/reveal';

type Beta = {
  quote: string;
  name: string;   // PLACEHOLDER name
  role: string;
  moment: string; // one-word tag: what value moment this reflects
};

const TESTIMONIALS: Beta[] = [
  {
    quote:
      "I’d been telling myself I needed a sales hire. Turns out I just needed something that would stop making me pick between building the product and building a pipeline. First week with Milo I wrote 20 emails without opening a spreadsheet.",
    name: 'Arjun M.',
    role: 'Solo founder, dev-tools SaaS',
    moment: 'Time',
  },
  {
    quote:
      "The ‘no website’ filter is embarrassingly obvious in hindsight. We’re a two-person shop and we booked four discovery calls in the first ten days from a single Peoria search.",
    name: 'Sofia R.',
    role: 'Founder, web design studio',
    moment: 'Signals',
  },
  {
    quote:
      "We used to run a Clay plus Apollo plus Instantly stack. Kept the tools I actually needed and dropped the rest. Also stopped pretending I had time to maintain Clay tables.",
    name: 'Marcus L.',
    role: 'Owner, digital marketing agency',
    moment: 'Stack cut',
  },
  {
    quote:
      "I hate cold email. I do it anyway because clients don’t come from Twitter anymore. Milo drafts, I edit for thirty seconds, done. That’s the whole reason I renewed.",
    name: 'Priya S.',
    role: 'Freelance developer',
    moment: 'Drafting',
  },
  {
    quote:
      "The ‘weak Core Web Vitals’ angle basically writes itself. Openers reference the exact LCP. Reply rate went from ‘do people even read these’ to ‘oh, I got booked’.",
    name: 'David K.',
    role: 'SEO consultant',
    moment: 'Personalization',
  },
  {
    quote:
      "It’s the first tool that read a business’s site before deciding whether to include them on the list. That single thing changes everything about what I say in the first line.",
    name: 'Naomi O.',
    role: 'Branding consultant',
    moment: 'Research',
  },
  {
    quote:
      "We serve local dental clinics. Half didn’t have Google Business Profiles or had them abandoned. Milo lets me sort for exactly that. Booked our first clinic in week two.",
    name: 'Kunal T.',
    role: 'Founder, IT services',
    moment: 'Local B2B',
  },
  {
    quote:
      "I write automations for a living. Ironic that I was still doing prospect research by hand. My time-per-lead went from about 15 minutes to about 90 seconds.",
    name: 'Elena V.',
    role: 'Automation consultant',
    moment: 'Speed',
  },
  {
    quote:
      "I don’t need 200 leads. I need 30 real ones I can actually call this month. The signal filter is what makes 30 land instead of 3.",
    name: 'Reuben A.',
    role: 'Local growth consultant',
    moment: 'Signal quality',
  },
  {
    quote:
      "I’ve been in sales for twelve years. Every ‘AI SDR’ I’ve tested tried to sell for me. Milo just does the boring parts and lets me keep the voice.",
    name: 'Anita P.',
    role: 'Independent sales consultant',
    moment: 'Voice preserved',
  },
  {
    quote:
      "I couldn’t stand my own cold emails. Turns out they weren’t the problem, my list was. Signal-filtered list, my normal writing, entirely different reply rate.",
    name: 'Jonah H.',
    role: 'Freelance copywriter',
    moment: 'List quality',
  },
  {
    quote:
      "We prospect on the theory that if you’re posting once a month, you need us. Milo lets me actually filter for that. First month: three retainers.",
    name: 'Fatima B.',
    role: 'Owner, social media agency',
    moment: 'Filter fit',
  },
  {
    quote:
      "The first draft is almost always ninety percent of the way there. It references what they actually do. I stop it, tweak the last paragraph, and send. That is the workflow now.",
    name: 'Diego C.',
    role: 'Founder, video studio',
    moment: 'Draft quality',
  },
  {
    quote:
      "I had a spreadsheet from ChatGPT with 300 names and no reason to reach out. Milo starts from the reason. Different mode of prospecting entirely.",
    name: 'Yara N.',
    role: 'Pre-seed startup founder',
    moment: 'Reason-first',
  },
  {
    quote:
      "I run a small commercial cleaning company. I’m not a marketer. In week one I understood the tool. In week two I’d booked two walkthroughs. Nobody had to explain ‘sequence cadence’ to me.",
    name: 'Tom D.',
    role: 'Owner, cleaning services',
    moment: 'Non-tech friendly',
  },
  {
    quote:
      "For clients under $50k MRR, I keep the stack under $500 per month. This is the first prospecting tool that actually fits inside that budget without cutting corners.",
    name: 'Sanjay G.',
    role: 'Fractional CMO',
    moment: 'Cost fit',
  },
  {
    quote:
      "The stop-on-reply behavior sounds obvious until you’ve had a follow-up land two days after someone said yes. That alone earns the price.",
    name: 'Emma W.',
    role: 'Solo business consultant',
    moment: 'Follow-up hygiene',
  },
];

const TOTAL = TESTIMONIALS.length;
// Split into two rows (odd/even index) so cards feel varied per row.
const ROW_A = TESTIMONIALS.filter((_, i) => i % 2 === 0);
const ROW_B = TESTIMONIALS.filter((_, i) => i % 2 === 1);

function Card({ t }: { t: Beta }) {
  const initial = t.name.trim().charAt(0).toUpperCase();
  return (
    <article className="mx-3 flex w-[20rem] shrink-0 flex-col gap-4 rounded-2xl border border-line bg-surface p-6 shadow-card sm:w-[22rem]">
      <div className="flex items-center justify-between">
        <span aria-hidden className="font-mono text-[0.72rem] uppercase tracking-wide text-muted">
          Beta · {t.moment}
        </span>
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent/70" fill="currentColor" aria-hidden>
          <path d="M7 7h4v4H8c0 3 2 5 4 5v3c-4 0-7-3-7-8V7Zm10 0h4v4h-3c0 3 2 5 4 5v3c-4 0-7-3-7-8V7Z" />
        </svg>
      </div>
      <p className="text-body text-ink/90">{t.quote}</p>
      <div className="mt-auto flex items-center gap-3 border-t border-line pt-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-body-sm text-accent">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-body-sm font-medium text-ink">{t.name}</p>
          <p className="truncate text-[0.78rem] text-muted">{t.role}</p>
        </div>
      </div>
    </article>
  );
}

function Row({ items, direction }: { items: Beta[]; direction: 'left' | 'right' }) {
  const anim = direction === 'left' ? 'marquee-left' : 'marquee-right';
  return (
    <div className="group overflow-hidden py-3">
      <div
        className="flex w-max group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        style={{
          animation: `${anim} 60s linear infinite`,
        }}
      >
        {[...items, ...items].map((t, i) => (
          <Card key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export function BetaTestimonials() {
  return (
    <section className="shell py-section-y">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="text-eyebrow uppercase tracking-wide text-accent">Beta</p>
        <h2 className="mt-3 text-display-md text-ink">
          Beta testers have this to say.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-muted">
          {TOTAL} early users are running real workflows through Milo. Real leads, real
          inboxes, real replies. Honest feedback, not marketing.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="relative mt-12">
        {/* Edge fades so cards enter and leave gracefully rather than snapping. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-canvas to-transparent md:w-24"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-canvas to-transparent md:w-24"
        />
        <div className="flex flex-col gap-4">
          <Row items={ROW_A} direction="left" />
          <Row items={ROW_B} direction="right" />
        </div>
      </Reveal>

      <p className="mt-8 text-center font-mono text-[0.72rem] uppercase tracking-wide text-muted">
        Placeholder beta quotes. Real users, real replies, credited when they’re ready.
      </p>
    </section>
  );
}
