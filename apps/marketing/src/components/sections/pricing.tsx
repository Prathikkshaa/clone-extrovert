// SERVER component - pricing. Free-first (activation), then the credit model
// explained simply (M00 §3). Honest + transparent: prices are VISIBLE and use the
// FINALIZED product values from @extrovertai/shared (File 14 - CREDIT_PACKS /
// CREDIT_COSTS / CREDIT_USD_CENTS), NOT invented numbers. "Best per-credit" is
// computed from the real prices (a fact), never a fake "most popular" claim.
//
// Reused on the landing page and the /pricing page. Copy is DIRECTION.
import { Reveal } from '@/components/reveal';
import { CtaButton } from '@/components/cta-button';
import { SIGNUP_URL, CTA_MICROCOPY } from '@/lib/site';
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

// Worked example, computed from the real per-action costs so it can never drift:
// one lead taken all the way through = find + research + write a sequence + send.
const CREDITS_PER_LEAD =
  CREDIT_COSTS.search + CREDIT_COSTS.enrichment + CREDIT_COSTS.draft + CREDIT_COSTS.send;
// Anchor the example on the popular "Growth" pack when present, else the first pack.
const examplePack = CREDIT_PACKS.find((p) => p.popular) ?? CREDIT_PACKS[0];
const EXAMPLE_LEADS = Math.round(examplePack.credits / CREDITS_PER_LEAD);

// Who each pack suits, so customers self-select their best match.
const SUITED_FOR: Record<string, string> = {
  starter: 'Best for trying it on your first campaign',
  growth: 'Best for freelancers running steady outreach',
  scale: 'Best for agencies reaching out at volume',
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
            <p className="mt-2 text-body-sm text-muted">{CTA_MICROCOPY}</p>
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
            So one lead taken all the way - found, researched, written, and sent - is about{' '}
            <span className="font-medium text-ink">{CREDITS_PER_LEAD} credits</span>. The{' '}
            {usd(examplePack.priceUsdCents)} {examplePack.label} pack (
            {examplePack.credits.toLocaleString('en-US')} credits) works roughly{' '}
            <span className="font-medium text-ink">{EXAMPLE_LEADS} leads</span> end to end.
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
                <p className="mt-3 text-body-sm text-ink/80">{SUITED_FOR[pack.id]}</p>
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
