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
    <div className="rounded-xl border border-line bg-surface p-5 shadow-[0_20px_50px_-30px_rgba(26,26,24,0.3)]">
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
    <div className="rounded-xl border border-line bg-surface p-5 shadow-[0_20px_50px_-30px_rgba(26,26,24,0.3)]">
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

function ComplianceToolsVisual() {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-[0_20px_50px_-30px_rgba(26,26,24,0.3)]">
      <p className="text-body-sm text-muted">Footer added to every email</p>
      <div className="mt-3 space-y-2 text-body-sm text-ink/80">
        <p>
          <span className="text-accent underline">Unsubscribe</span> · one click, honoured
          instantly
        </p>
        <p>Your business mailing address</p>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-[0.78rem]">
        <span className="rounded-full bg-positive-soft px-2.5 py-1 font-medium text-positive">
          Opt-outs suppressed automatically
        </span>
      </div>
    </div>
  );
}

function OneToolVisual() {
  const replaced = ['Lead lists', 'Email finder', 'Copywriter', 'Cold-email tool', 'Scheduler'];
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-[0_20px_50px_-30px_rgba(26,26,24,0.3)]">
      <p className="text-body-sm text-muted">Instead of five subscriptions</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {replaced.map((t) => (
          <span
            key={t}
            className="rounded-md border border-line px-2.5 py-1 text-[0.8rem] text-muted line-through"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="text-body font-medium text-ink">One tool · pay for what you use</span>
      </div>
    </div>
  );
}

const ROWS: Row[] = [
  {
    eyebrow: 'Personalized, not spam',
    title: 'Every email is written from the lead’s own site and reviews.',
    copy: 'No mail-merge tokens, no “Hi {{first_name}}” tells. Each message references what that business actually does - in your voice - so it reads like you sat down and wrote it. Because, essentially, you did.',
    visual: <EmailDraftVisual />,
  },
  {
    eyebrow: 'Buying-signal targeting',
    title: 'Find the businesses that actually need you - like the ones with no website.',
    copy: 'Search any industry and city, then filter for signals that mean “ready to buy”: no website, thin online presence, low review counts. You reach people with an obvious gap, not a random list.',
    visual: <ProductPanel />,
  },
  {
    eyebrow: 'Built for deliverability',
    title: 'Sends the way a careful human does - so you stay out of spam.',
    copy: 'Every email goes from your own Gmail or Outlook, not a shared blast server, so you keep your own reputation. New inboxes start around 30 sends a day and ramp as they warm; messages go out one at a time with randomized spacing, not in a burst; and bounces are watched so a bad address can’t drag you down.',
    visual: <ComplianceVisual />,
  },
  {
    eyebrow: 'Compliance tools built in',
    title: 'One-click unsubscribe and your address on every email - region-aware.',
    copy: 'Each send carries a working one-click unsubscribe and a physical mailing address, and opt-outs are suppressed automatically. That covers CAN-SPAM in the US; for the UK/EU, outreach to businesses falls under PECR and GDPR, where a relevant offer to a business address can rest on legitimate interest. We give you the tools - you choose the regions and offers you send to.',
    visual: <ComplianceToolsVisual />,
  },
  {
    eyebrow: 'One tool, not five',
    title: 'Search, write, send, follow up, and book - in one place.',
    copy: 'Stop stitching together a lead-list tool, an email finder, a copywriter, a sending platform, and a scheduler. It’s one workflow, and you only pay for what you use.',
    visual: <OneToolVisual />,
  },
];

export function Differentiators() {
  return (
    <section className="shell py-section-y">
      <Reveal className="max-w-prose">
        <p className="text-eyebrow uppercase text-accent">Why it works</p>
        <h2 className="mt-3 text-display-md text-ink">Built to kill the reasons cold outreach fails.</h2>
      </Reveal>

      <div className="mt-14 flex flex-col gap-16 md:gap-24">
        {ROWS.map((row, i) => {
          const flip = i % 2 === 1; // alternate the visual side down the page
          return (
            <Reveal
              key={row.eyebrow}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-14"
            >
              <div className={flip ? 'md:order-2' : ''}>
                <p className="text-eyebrow uppercase text-muted">{row.eyebrow}</p>
                <h3 className="mt-3 text-heading-lg text-ink">{row.title}</h3>
                <p className="mt-4 max-w-prose text-body-lg text-muted">{row.copy}</p>
              </div>
              <div className={flip ? 'md:order-1' : ''}>{row.visual}</div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
