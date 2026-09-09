// SERVER component - differentiators as an editorial ZIGZAG (M00 §3/§5), NOT a
// symmetric card trio. Alternating left/right rows: a representative visual on one
// side, objection-killing copy on the other, direction flipping down the page.
// Each row reveals on scroll. Every claim answers a specific fear from the message
// spine; copy is specific, no hype. Visuals are labeled DOM placeholders.
import { Reveal } from '@/components/reveal';
import { ProductPanel } from '@/components/product-panel';
import type { ReactNode } from 'react';

type Row = {
  eyebrow: string;
  title: string;
  copy: string;
  visual: ReactNode;
};

// Small, distinct representative visuals (labeled placeholders standing in for
// real screenshots - M00 §13).
function EmailDraftVisual() {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-float">
      <p className="text-body-sm text-muted">To: owner@lonestarroofing.com</p>
      <p className="mt-1 text-body font-medium text-ink">Quick idea for Lone Star Roofing</p>
      <div className="mt-4 space-y-2 text-body-sm text-ink/80">
        <p>Saw your 4.8★ from 126 jobs around Austin - clearly the crews do great work.</p>
        <p>
          Noticed you&rsquo;re running without a site, so homeowners comparing roofers can&rsquo;t
          find you after the referral. I help contractors fix exactly that…
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-md bg-accent-soft px-2.5 py-1 text-[0.78rem] font-medium text-accent">
          Written from their site + reviews
        </span>
      </div>
    </div>
  );
}

function ComplianceVisual() {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-float">
      <div className="flex items-center justify-between">
        <span className="text-body-sm text-ink">Sending from you@yourinbox.com</span>
        <span className="rounded-full bg-positive-soft px-2.5 py-1 text-[0.78rem] font-medium text-positive">
          Healthy
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-body-sm">
        <span className="text-muted">Throttled · warming up</span>
        <span className="text-muted">18 / 40 today</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full w-[45%] rounded-full bg-accent" />
      </div>
      <div className="mt-4 border-t border-line pt-3 text-[0.78rem] text-muted">
        Sent one at a time · randomized spacing · bounces watched
      </div>
    </div>
  );
}

function ApprovalVisual() {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-float">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-muted">Drafts waiting for you</p>
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[0.78rem] font-medium text-accent">
          3 to review
        </span>
      </div>
      <div className="mt-3 rounded-md border border-line bg-canvas px-3 py-3">
        <p className="text-body-sm font-medium text-ink">Quick idea for Lone Star Roofing</p>
        <p className="mt-1 text-[0.78rem] text-muted">To: owner@lonestarroofing.com</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-md bg-accent px-2.5 py-1 text-[0.78rem] font-medium text-white">
            Approve &amp; send
          </span>
          <span className="rounded-md border border-line px-2.5 py-1 text-[0.78rem] text-ink">
            Edit
          </span>
          <span className="rounded-md border border-line px-2.5 py-1 text-[0.78rem] text-muted">
            Skip
          </span>
        </div>
      </div>
      <p className="mt-3 text-[0.78rem] text-muted">Nothing sends until you say so.</p>
    </div>
  );
}

const ROWS: Row[] = [
  {
    eyebrow: 'Personalized, not spam',
    title: 'Every email is written from the lead’s own site and reviews.',
    copy: 'It references what the business actually does, in your voice - no mail-merge tokens, no “Hi {{first_name}}.”',
    visual: <EmailDraftVisual />,
  },
  {
    eyebrow: 'Buying-signal targeting',
    title: 'Find the businesses that actually need you - like the ones with no website.',
    copy: 'Filter for ready-to-buy signals like no website or a thin online presence. You reach real gaps, not a random list.',
    visual: <ProductPanel />,
  },
  {
    eyebrow: 'Lands in the inbox, stays compliant',
    title: 'Sends the way a careful human does - so you stay out of spam.',
    copy: 'From your own Gmail or Outlook: slow warm-up, one at a time, natural spacing. Every email carries one-click unsubscribe and your address - CAN-SPAM in the US, PECR/GDPR-aware in the UK/EU.',
    visual: <ComplianceVisual />,
  },
  {
    eyebrow: 'You stay in control',
    title: 'Nothing sends until you approve it.',
    copy: 'Milo drafts every email and queues it for you. Review, tweak, or skip - not a single message leaves your inbox on autopilot.',
    visual: <ApprovalVisual />,
  },
];

export function Differentiators({
  only,
  hideHeading = false,
  eyebrow = 'Why it works',
  title = 'Why does this outreach actually work?',
  intro = 'It’s built to kill the reasons cold outreach fails - one specific objection at a time.',
}: {
  /** Filter and REORDER rows by their `eyebrow` key. */
  only?: readonly string[];
  hideHeading?: boolean;
  eyebrow?: string;
  title?: string;
  intro?: string;
} = {}) {
  const rows = only
    ? only
        .map((k) => ROWS.find((r) => r.eyebrow === k))
        .filter((r): r is Row => Boolean(r))
    : ROWS;
  return (
    <section className="shell py-section-y">
      {hideHeading ? null : (
        <Reveal className="max-w-prose">
          <p className="text-eyebrow uppercase text-accent">{eyebrow}</p>
          <h2 className="mt-3 text-display-md text-ink">{title}</h2>
          <p className="mt-4 text-body-lg text-muted">{intro}</p>
        </Reveal>
      )}

      <div className={[hideHeading ? '' : 'mt-14', 'flex flex-col gap-16 md:gap-24'].join(' ')}>
        {rows.map((row, i) => {
          const flip = i % 2 === 1; // alternate the visual side down the page
          return (
            <Reveal
              key={row.eyebrow}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <div className={flip ? 'min-w-0 md:order-2' : 'min-w-0'}>
                <p className="text-eyebrow uppercase text-muted">{row.eyebrow}</p>
                <h3 className="mt-3 text-heading-lg text-ink">{row.title}</h3>
                <p className="mt-4 max-w-prose text-body-lg text-muted">{row.copy}</p>
              </div>
              <div className={flip ? 'min-w-0 md:order-1' : 'min-w-0'}>{row.visual}</div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
