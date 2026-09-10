// SERVER. Pricing card data per mode. Enterprise-grade: no icons, no emoji, no
// mascots on cards. Identity comes from a mono index tag ("01" ... "04") and
// the plan name. Audience line names who the plan is for so buyers decide fast.
// One outcome anchor + one value line per card, four features max, one CTA
// with a matching microcopy line.
import type { PricingCard, CustomStrip } from './pricing-mode';
import { CONTACT_EMAIL } from './site';

const CustomMailto = `mailto:${CONTACT_EMAIL}?subject=Milo%20-%20Volume%20pricing%20enquiry`;

/* ── LEGACY: current three self-serve packs, redesigned card visual ── */
export const LEGACY_CARDS: PricingCard[] = [
  {
    id: 'starter',
    index: '01',
    label: 'Starter',
    audience: 'For founders trying Milo on their first market.',
    price: '$0',
    priceSuffix: 'to start',
    outcome: '~20 leads end to end',
    outcomeNote: 'Explore the full workflow, on us.',
    features: [
      'Real leads on your first search',
      'No card, no auto-charge, no clock',
      'Full workflow, not a demo',
    ],
    ctaLabel: 'Start free',
    ctaHref: '__SIGNUP__',
    microcopy: '100 free credits on signup. No card.',
  },
  {
    id: 'growth',
    index: '02',
    label: 'Growth',
    audience: 'For teams that need steady weekly prospecting.',
    price: '$39',
    priceSuffix: 'one-time',
    outcome: '~130 leads end to end',
    outcomeNote: 'A quarter of steady weekly outreach.',
    features: [
      'Weekly campaigns without topping up',
      'Where most freelancers settle in',
      'Best per-lead of the paid packs',
    ],
    ctaLabel: 'Start growing',
    ctaArrow: true,
    ctaHref: '__SIGNUP__',
    microcopy: 'Where most freelancers find their rhythm.',
    highlight: 'popular',
  },
  {
    id: 'scale',
    index: '03',
    label: 'Scale',
    audience: 'For high-volume operators and lean sales teams.',
    price: '$99',
    priceSuffix: 'one-time',
    outcome: '~290 leads end to end',
    outcomeNote: 'Largest single pack.',
    features: [
      'Always-on outreach volume',
      'No per-seat fee, share with your team',
      'Fewer top-ups, more sending',
    ],
    ctaLabel: 'Go always-on',
    ctaHref: '__SIGNUP__',
    microcopy: 'Cheapest per lead. No monthly minimum.',
  },
];

/* ── BETA: Free + Founding user ── */
export const BETA_CARDS: PricingCard[] = [
  {
    id: 'free',
    index: '01',
    label: 'Free',
    audience: 'For founders who want to see Milo work first.',
    price: '$0',
    priceSuffix: 'forever',
    outcome: '~20 leads end to end',
    outcomeNote: 'Explore the full workflow, on us.',
    features: ['Full workflow access', 'No card required', 'Credits never expire'],
    ctaLabel: 'Try free',
    ctaHref: '__SIGNUP__',
    microcopy: 'No auto-charge. Decide later.',
  },
  {
    id: 'founding',
    index: '02',
    label: 'Founding user',
    audience: 'For the first 200 accounts that back the beta.',
    price: '$10',
    priceSuffix: 'one-time',
    outcome: '~50 leads end to end',
    outcomeNote: 'Lock in beta pricing for good.',
    features: [
      'Full workflow access',
      'Credits never expire',
      'Beta price kept at GA',
    ],
    ctaLabel: 'Reserve my spot',
    ctaArrow: true,
    ctaHref: '__SIGNUP__',
    microcopy: 'First 200 accounts. GA pricing starts at $19.',
    highlight: 'popular',
  },
];

/* ── GA: Free + Base + Growth + Scale (+ Custom strip) ── */
export const GA_CARDS: PricingCard[] = [
  {
    id: 'free',
    index: '01',
    label: 'Free',
    audience: 'For curious founders kicking the tires.',
    price: '$0',
    priceSuffix: 'forever',
    outcome: '~20 leads end to end',
    outcomeNote: 'Explore the full workflow, on us.',
    features: [
      'Real leads on your first search',
      'No card, no auto-charge, no clock',
      'Full workflow, not a demo',
    ],
    ctaLabel: 'Try free',
    ctaHref: '__SIGNUP__',
    microcopy: 'No auto-charge. Decide later.',
  },
  {
    id: 'base',
    index: '02',
    label: 'Base',
    audience: 'For solo founders running their first real campaign.',
    price: '$19',
    priceSuffix: 'one-time',
    outcome: '~60 leads end to end',
    outcomeNote: 'Enough to see what actually converts.',
    features: [
      'A full campaign end to end',
      '~60 leads is a real test market',
      'Pays back with one signed client',
    ],
    ctaLabel: 'Run my first campaign',
    ctaHref: '__SIGNUP__',
    microcopy: 'One-time pack. Enough runway for a real first campaign.',
  },
  {
    id: 'growth',
    index: '03',
    label: 'Growth',
    audience: 'For teams that need steady, reliable prospecting.',
    price: '$49',
    priceSuffix: 'one-time',
    outcome: '~180 leads end to end',
    outcomeNote: "A full quarter's pipeline in one pack.",
    features: [
      'Weekly campaigns without topping up',
      '~30% lower per-lead than Base',
      'Where most teams settle in',
    ],
    ctaLabel: 'Start growing',
    ctaArrow: true,
    ctaHref: '__SIGNUP__',
    microcopy: 'Where most teams find their rhythm.',
    highlight: 'popular',
  },
  {
    id: 'scale',
    index: '04',
    label: 'Scale',
    audience: 'For high-volume operators and lean sales teams.',
    price: '$119',
    priceSuffix: 'one-time',
    outcome: '~480 leads end to end',
    outcomeNote: 'Lowest cost per lead across every plan.',
    features: [
      'Always-on outreach volume',
      'No per-seat fee, share with your team',
      'Best per-lead economics',
    ],
    ctaLabel: 'Go always-on',
    ctaHref: '__SIGNUP__',
    microcopy: 'Cheapest per lead. No monthly minimum.',
  },
];

export const CUSTOM_STRIP: CustomStrip = {
  eyebrow: 'Custom',
  title: 'Running many markets, or need invoicing?',
  body: 'One tool, many markets, one balance. Volume, purchase orders, and agency-friendly terms.',
  ctaLabel: 'Talk to us',
  ctaHref: CustomMailto,
};

/** Trust chips rendered under the card row. */
export const TRUST_CHIPS = [
  'No credit card required',
  'Credits never expire',
  'Your inbox, your data',
  'No spam, ever',
] as const;
