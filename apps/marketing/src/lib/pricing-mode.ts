// Pricing surface flag. Reads NEXT_PUBLIC_PRICING at build time.
//
//   legacy  the current three self-serve packs (Starter / Growth / Scale)
//   beta    the founding-user launch (Free + Founding user $10 / 250 credits)
//   ga      general availability (Free / Base $19 / Growth $49 / Scale $119)
//
// Default is `legacy` so redeploys never change what a user sees without an
// explicit env flip. The Stripe products in @extrovertai/shared are the source
// of truth for real transactions; the entries below are UI descriptors only.
// Wire the Stripe products before flipping to `beta` or `ga` in production.
import type { ComponentType } from 'react';

export type PricingMode = 'legacy' | 'beta' | 'ga';

export const PRICING_MODE: PricingMode = (() => {
  const raw = process.env.NEXT_PUBLIC_PRICING?.toLowerCase();
  if (raw === 'beta' || raw === 'ga') return raw;
  return 'legacy';
})();

/** A card the redesigned pricing component renders. Purely descriptive. */
export type PricingCard = {
  id: string;
  label: string;
  bestIf: string;
  price: string;
  priceSuffix?: string;
  outcome: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  microcopy: string;
  highlight?: 'popular';
  Icon: ComponentType<{ className?: string }>;
};

/** Compact strip rendered below the card row when a mode has a Custom tier. */
export type CustomStrip = {
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};
