// SERVER. The pricing surfaces described by mode. Kept out of the section
// component so the flag reader stays type-safe and testable. Every card lists a
// single outcome anchor ("~N leads end to end") instead of the credit count,
// per the audit finding on cognitive load. Prices are UI copy only; Stripe
// products live in @extrovertai/shared.
import type { PricingCard, CustomStrip } from './pricing-mode';
import { CONTACT_EMAIL } from './site';

const CustomMailto = `mailto:${CONTACT_EMAIL}?subject=Milo%20-%20Volume%20pricing%20enquiry`;

/* ── icons (thin-line, single accent, inherit currentColor via text-*) ── */
type IP = { className?: string };
const sp = (c = 'h-5 w-5') => ({
  viewBox: '0 0 24 24',
  className: c,
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});
const IcoSpark = (p: IP) => (<svg {...sp(p.className)}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>);
const IcoFlag = (p: IP) => (<svg {...sp(p.className)}><path d="M5 22V4M5 4h11l-2 4 2 4H5" /></svg>);
const IcoLeaf = (p: IP) => (<svg {...sp(p.className)}><path d="M20 4c-8 0-14 4-14 12a5 5 0 0 0 5 5c8 0 12-8 12-16-4 0-7 3-9 6" /><path d="M4 20 12 12" /></svg>);
const IcoRocket = (p: IP) => (<svg {...sp(p.className)}><path d="M14 4c4 0 6 2 6 6-3 0-6 1-8 3l-5 5-4-4 5-5c2-2 3-5 3-8 0 0 1 1 3 3Z" /><circle cx="15" cy="9" r="1.4" /></svg>);
const IcoLayers = (p: IP) => (<svg {...sp(p.className)}><path d="m3 8 9-5 9 5-9 5-9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 16 9 5 9-5" /></svg>);

export const CARD_ICONS = {
  spark: IcoSpark,
  flag: IcoFlag,
  leaf: IcoLeaf,
  rocket: IcoRocket,
  layers: IcoLayers,
};

/* ── LEGACY: current three self-serve packs, redesigned card visual ── */
export const LEGACY_CARDS: PricingCard[] = [
  {
    id: 'starter',
    label: 'Starter',
    bestIf: 'Trying Milo on your first market.',
    price: '$0',
    priceSuffix: 'to start',
    outcome: '~20 leads end to end',
    features: ['Full workflow access', 'No card required', 'Credits never expire'],
    ctaLabel: 'Start free',
    ctaHref: '__SIGNUP__',
    microcopy: '100 free credits on signup.',
    Icon: IcoSpark,
  },
  {
    id: 'growth',
    label: 'Growth',
    bestIf: 'Running steady weekly outreach.',
    price: '$39',
    priceSuffix: 'one-time',
    outcome: '~130 leads end to end',
    features: ['Full workflow access', 'Best value per lead', 'Credits never expire'],
    ctaLabel: 'Start free',
    ctaHref: '__SIGNUP__',
    microcopy: 'Try Milo free first. No card until you buy.',
    highlight: 'popular',
    Icon: IcoFlag,
  },
  {
    id: 'scale',
    label: 'Scale',
    bestIf: 'High-volume prospecting.',
    price: '$99',
    priceSuffix: 'one-time',
    outcome: '~290 leads end to end',
    features: ['Full workflow access', 'Largest single pack', 'Credits never expire'],
    ctaLabel: 'Start free',
    ctaHref: '__SIGNUP__',
    microcopy: 'Try Milo free first. No card until you buy.',
    Icon: IcoRocket,
  },
];

/* ── BETA: Free + Founding user. Announced when the launch is public. ── */
export const BETA_CARDS: PricingCard[] = [
  {
    id: 'free',
    label: 'Free',
    bestIf: 'See Milo work first.',
    price: '$0',
    priceSuffix: 'forever',
    outcome: '~20 leads end to end',
    features: ['Full workflow access', 'No card required', 'Credits never expire'],
    ctaLabel: 'Start free',
    ctaHref: '__SIGNUP__',
    microcopy: 'No auto-charge. Decide later.',
    Icon: IcoSpark,
  },
  {
    id: 'founding',
    label: 'Founding user',
    bestIf: 'Lock in beta pricing.',
    price: '$10',
    priceSuffix: 'one-time',
    outcome: '~50 leads end to end',
    features: [
      'Full workflow access',
      'Credits never expire',
      'Beta price kept at GA',
    ],
    ctaLabel: 'Reserve my spot',
    ctaHref: '__SIGNUP__',
    microcopy: 'First 200 accounts. Post-beta pricing starts at $19.',
    highlight: 'popular',
    Icon: IcoFlag,
  },
];

/* ── GA: 4 self-serve + Custom strip. Priced against the competitive floor. ── */
export const GA_CARDS: PricingCard[] = [
  {
    id: 'free',
    label: 'Free',
    bestIf: 'See Milo work first.',
    price: '$0',
    priceSuffix: 'forever',
    outcome: '~20 leads end to end',
    features: ['Full workflow access', 'No card required', 'Credits never expire'],
    ctaLabel: 'Start free',
    ctaHref: '__SIGNUP__',
    microcopy: 'No auto-charge. Decide later.',
    Icon: IcoSpark,
  },
  {
    id: 'base',
    label: 'Base',
    bestIf: 'Testing your first real campaign.',
    price: '$19',
    priceSuffix: 'one-time',
    outcome: '~60 leads end to end',
    features: ['Full workflow access', 'Credits never expire', 'One market at a time'],
    ctaLabel: 'Start free',
    ctaHref: '__SIGNUP__',
    microcopy: 'Try Milo free first. Buy when ready.',
    Icon: IcoLeaf,
  },
  {
    id: 'growth',
    label: 'Growth',
    bestIf: 'Steady weekly prospecting.',
    price: '$49',
    priceSuffix: 'one-time',
    outcome: '~180 leads end to end',
    features: ['Full workflow access', 'Best value per lead', 'Credits never expire'],
    ctaLabel: 'Start free',
    ctaHref: '__SIGNUP__',
    microcopy: 'Try Milo free first. Buy when ready.',
    highlight: 'popular',
    Icon: IcoFlag,
  },
  {
    id: 'scale',
    label: 'Scale',
    bestIf: 'Always-on high volume.',
    price: '$119',
    priceSuffix: 'one-time',
    outcome: '~480 leads end to end',
    features: ['Full workflow access', 'Largest single pack', 'Credits never expire'],
    ctaLabel: 'Start free',
    ctaHref: '__SIGNUP__',
    microcopy: 'Try Milo free first. Buy when ready.',
    Icon: IcoRocket,
  },
];

export const CUSTOM_STRIP: CustomStrip = {
  eyebrow: 'Custom',
  title: 'Running many markets, or need invoicing?',
  body: 'One tool, many markets, one balance. Volume, purchase orders, and agency-friendly terms.',
  ctaLabel: 'Talk to us',
  ctaHref: CustomMailto,
};
