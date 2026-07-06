/**
 * Site-wide config — nav, CTA targets, footer link groups.
 *
 * Single source so the shell (header/footer) and later sections never hardcode
 * routes or the signup URL. `APP_NAME` comes from @extrovertai/shared (M00 §4 —
 * never hardcode the product name).
 */
import { APP_NAME } from '@extrovertai/shared';

export { APP_NAME };

/**
 * PLACEHOLDER — the product signup route lives in apps/web (Angular). Wire the
 * real URL at deploy time via NEXT_PUBLIC_APP_URL. Until then this points at the
 * conventional signup path so every "Start free" CTA resolves consistently.
 * TODO(wiring): confirm the real signup route/host with the product app.
 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.extrovertai.example/signup';
export const SIGNUP_URL = APP_URL;

/**
 * PLACEHOLDER — the marketing site's own canonical origin (used by metadataBase,
 * sitemap, robots, canonical URLs, and absolute OG image URLs). Set the real
 * production domain at deploy time via NEXT_PUBLIC_SITE_URL.
 * TODO(wiring): confirm the real marketing domain.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://extrovertai.example').replace(/\/$/, '');

/** One-line product description reused across metadata + JSON-LD (single source). */
export const SITE_DESCRIPTION =
  'Find local businesses worth reaching, write outreach that sounds like your best salesperson, and stay out of spam — one tool, pay for what you use.';

/** Friction-reducing microcopy shown under primary CTAs (M00 §3). */
export const CTA_MICROCOPY = 'No card needed · Free to start';

/** Primary nav (M00 §8 page inventory). */
export const NAV_LINKS = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
] as const;

/** Footer link groups — real destinations, no fake badges (M00 §7). */
export const FOOTER_GROUPS = [
  {
    heading: 'Product',
    links: [
      { href: '/how-it-works', label: 'How it works' },
      { href: '/pricing', label: 'Pricing' },
      { href: SIGNUP_URL, label: 'Start free' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/blog', label: 'Blog' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
    ],
  },
] as const;

/** Founder placeholder (M00 §13 — clearly-labeled, swap when real). */
export const FOUNDER_NAME = 'the founder'; // TODO(content): real founder name
