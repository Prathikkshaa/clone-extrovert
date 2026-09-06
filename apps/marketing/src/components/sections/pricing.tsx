// SERVER component - pricing. Free-first (activation), then the credit model
// explained simply (M00 §3). Honest + transparent: prices are VISIBLE and use the
// FINALIZED product values from @extrovertai/shared (File 14 - CREDIT_PACKS /
// CREDIT_COSTS / CREDIT_USD_CENTS), NOT invented numbers. "Best per-credit" is
// computed from the real prices (a fact), never a fake "most popular" claim.
//
// Reused on the landing page and the /pricing page. Copy is DIRECTION.
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { SIGNUP_URL } from '@/lib/site';
import { CtaMicrocopy } from '@/components/cta-microcopy';
import { CREDIT_PACKS, CREDIT_COSTS, FREE_SIGNUP_CREDITS } from '@extrovertai/shared';

const usd = (cents: number) => `$${(cents / 100).toLocaleString('en-US')}`;

// Best-value pack = lowest price per credit (a computed fact, honest highlight).
const bestPack = [...CREDIT_PACKS].sort(
  (a, b) => a.priceUsdCents / a.credits - b.priceUsdCents / b.credits,
)[0];
const bestPackId = bestPack.id;

// Lowest per-credit price across all packs, derived (not hardcoded). We advertise
// "from $X/credit" instead of a single "1 credit ≈ $0.10" anchor, because the packs
// are NOT all $0.10 — they get cheaper with volume, and the old "≈" hid that.
const LOWEST_PER_CREDIT_USD = `$${(bestPack.priceUsdCents / bestPack.credits / 100).toFixed(3)}`;

// Honest per-lead credit math, computed from the real per-action costs so it can
// never drift. A lead is found (search), researched (enrichment), and its 3-email
// sequence written once (draft). SENDS vary: follow-ups stop the moment a lead
// replies, so at best 1 email sends, at worst all 3 do.
const CREDITS_PER_LEAD_BASE =
  CREDIT_COSTS.search + CREDIT_COSTS.enrichment + CREDIT_COSTS.draft;
const CREDITS_PER_LEAD_LOW = CREDITS_PER_LEAD_BASE + CREDIT_COSTS.send; // reply came early
const CREDITS_PER_LEAD_HIGH = CREDITS_PER_LEAD_BASE + 3 * CREDIT_COSTS.send; // full sequence

// Leads a pack works, as an honest RANGE (both floored so we never over-promise):
// fewer sends per lead => more leads, so low-lead-count uses the HIGH per-lead cost.
const leadsForPack = (credits: number) => ({
  low: Math.floor(credits / CREDITS_PER_LEAD_HIGH),
  high: Math.floor(credits / CREDITS_PER_LEAD_LOW),
});

// Anchor the worked example on the popular "Growth" pack when present, else the first.
const examplePack = CREDIT_PACKS.find((p) => p.popular) ?? CREDIT_PACKS[0];
const exampleLeads = leadsForPack(examplePack.credits);

// Three justification layers per card (self-selection): who it's designed for +
// concrete "best for" signals. The outcome range is computed per pack below.
const DESIGNED_FOR: Record<string, string> = {
  starter: 'Trying it on your first real campaign.',
  growth: 'Freelancers running steady, weekly outreach.',
  scale: 'Agencies reaching out at volume.',
};
const BEST_FOR: Record<string, string[]> = {
  starter: ['Your first outreach test', 'A single niche or city', 'Seeing replies before you commit'],
  growth: ['Consistent weekly campaigns', 'One or two niches at a time', 'Solo consultants & freelancers'],
  scale: ['Always-on, high-volume outreach', 'Multiple clients & inboxes', 'Lowest price per credit'],
};

export function Pricing({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <section className="shell py-section-y">
      {withHeading ? (
        <Reveal className="max-w-prose">
          <p className="text-eyebrow uppercase text-accent">Pricing</p>
          <h2 className="mt-3 text-display-md text-ink">Start free. Pay only for what you use.</h2>
          <p className="mt-4 text-body-lg text-muted">
            No seats, no monthly minimum, no five-tool stack. Less than one month of the tools
            this replaces - and you can start without a card.
          </p>
        </Reveal>
      ) : null}

      {/* Free tier - lead with it (M00 §3). */}
      <Reveal delay={0.05} className="mt-10">
        <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-accent/40 bg-accent-soft/50 p-6 md:flex-row md:items-center md:p-8">
          <div>
            <p className="text-heading-md text-ink">Free to start</p>
            <p className="mt-2 max-w-prose text-body text-muted">
              Create an account and get {FREE_SIGNUP_CREDITS} free credits - enough to find real
              leads, research them, write your first emails, and send them. No card needed.
            </p>
          </div>
          <div className="shrink-0">
            <CtaButton href={SIGNUP_URL} size="lg">
              Start free
            </CtaButton>
            <CtaMicrocopy className="mt-2" />
          </div>
        </div>
      </Reveal>

      {/* Credit model - explained simply. */}
      <Reveal delay={0.1} className="mt-8">
        <div className="rounded-xl border border-line bg-surface p-6 md:p-8">
          <p className="text-heading-sm text-ink">
            One simple unit: credits. From {LOWEST_PER_CREDIT_USD}/credit - cheaper by the pack.
          </p>
          <p className="mt-2 text-body text-muted">Credits cover the whole loop, pay as you go:</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Find a lead', cost: CREDIT_COSTS.search },
              { label: 'Research it', cost: CREDIT_COSTS.enrichment },
              { label: 'Write a full sequence', cost: CREDIT_COSTS.draft },
              { label: 'Send an email', cost: CREDIT_COSTS.send },
            ].map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between gap-3 rounded-md border border-line bg-canvas px-3 py-2.5"
              >
                <span className="text-body-sm text-ink">{row.label}</span>
                <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-[0.78rem] font-medium text-accent">
                  {row.cost} {row.cost === 1 ? 'credit' : 'credits'}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-body-sm text-muted">
            A full lead - found, researched, written, sent - runs about{' '}
            <span className="font-medium text-ink">
              {CREDITS_PER_LEAD_LOW}&ndash;{CREDITS_PER_LEAD_HIGH} credits
            </span>
            . So the {usd(examplePack.priceUsdCents)} {examplePack.label} pack &asymp;{' '}
            <span className="font-medium text-ink">
              {exampleLeads.low}&ndash;{exampleLeads.high} leads
            </span>
            .
          </p>
        </div>
      </Reveal>

      {/* Top-up packs - real prices from shared; each shows who it suits. */}
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {CREDIT_PACKS.map((pack, i) => {
          const best = pack.id === bestPackId;
          return (
            <Reveal key={pack.id} delay={0.05 * i}>
              <div
                className={[
                  'flex h-full flex-col rounded-xl border bg-surface p-6',
                  best ? 'border-accent shadow-[0_20px_50px_-30px_rgba(15,118,110,0.5)]' : 'border-line',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <p className="text-heading-sm text-ink">{pack.label}</p>
                  {best ? (
                    <span className="rounded-full bg-accent px-2.5 py-1 text-[0.72rem] font-medium text-white">
                      Best value
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 text-display-md text-ink">{usd(pack.priceUsdCents)}</p>
                <p className="mt-1 text-body-sm text-muted">
                  {pack.credits.toLocaleString('en-US')} credits
                </p>

                {/* Outcome: what the credits actually buy, as an honest range. */}
                {(() => {
                  const l = leadsForPack(pack.credits);
                  return (
                    <p className="mt-3 rounded-md bg-accent-soft px-3 py-2 text-body-sm font-medium text-accent">
                      ≈ {l.low}&ndash;{l.high} leads, end to end
                    </p>
                  );
                })()}

                {/* Designed for. */}
                <p className="mt-4 text-[0.72rem] font-medium uppercase tracking-wide text-muted">
                  Designed for
                </p>
                <p className="mt-1 text-body-sm text-ink/80">{DESIGNED_FOR[pack.id]}</p>

                {/* Best for - concrete self-selection signals. */}
                <p className="mt-4 text-[0.72rem] font-medium uppercase tracking-wide text-muted">
                  Best for
                </p>
                <ul className="mt-1 space-y-1.5 text-body-sm text-ink/80">
                  {BEST_FOR[pack.id].map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-1 flex-col justify-end">
                  <CtaButton
                    href={SIGNUP_URL}
                    variant={best ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    Get {pack.label}
                  </CtaButton>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={0.05} className="mt-6">
        <p className="text-body-sm text-muted">
          Credits never expire while your account is active. Billed in USD; cards accepted from
          any country.
        </p>
      </Reveal>
    </section>
  );
}
