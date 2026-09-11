/**
 * Site-wide config - nav, CTA targets, footer link groups.
 *
 * Single source so the shell (header/footer) and later sections never hardcode
 * routes or the signup URL. `APP_NAME` comes from @extrovertai/shared (M00 §4 -
 * never hardcode the product name).
 */
import { APP_NAME } from '@extrovertai/shared';

export { APP_NAME };

/**
 * PLACEHOLDER - the product signup route lives in apps/web (Angular). Wire the
 * real URL at deploy time via NEXT_PUBLIC_APP_URL. Until then this points at the
 * conventional signup path so every "Start free" CTA resolves consistently.
 * TODO(wiring): confirm the real signup route/host with the product app.
 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.extrovertai.example/signup';
export const SIGNUP_URL = APP_URL;

/**
 * PLACEHOLDER - login route for existing users. Defaults to a sibling of the
 * signup URL; override at deploy time via NEXT_PUBLIC_LOGIN_URL.
 */
export const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL ?? APP_URL.replace(/\/signup$/, '/login');

/**
 * PLACEHOLDER - the marketing site's own canonical origin (used by metadataBase,
 * sitemap, robots, canonical URLs, and absolute OG image URLs). Set the real
 * production domain at deploy time via NEXT_PUBLIC_SITE_URL.
 * TODO(wiring): confirm the real marketing domain.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://extrovertai.example').replace(/\/$/, '');

/** One-line product description reused across metadata + JSON-LD (single source). */
export const SITE_DESCRIPTION =
  `${APP_NAME} is AI sales prospecting: it finds the businesses that need what you sell and reaches out personally, turning prospects into conversations and booked meetings.`;

/** Friction-reducing microcopy shown under primary CTAs (M00 §3). */
export const CTA_MICROCOPY = 'No card needed';

/**
 * PLACEHOLDER - sales/enterprise contact for the "Custom" pricing tier. Swap the
 * address (or point at a real /contact route) when it exists.
 * TODO(wiring): confirm the real sales inbox / contact route.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'stallwartofficial@gmail.com';
export const CONTACT_URL = `mailto:${CONTACT_EMAIL}?subject=Volume%20pricing%20enquiry`;

/** Primary nav (M00 §8 page inventory). */
export const NAV_LINKS = [
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
] as const;

/** Resources group - surfaced as a dropdown in the primary nav. */
export const NAV_RESOURCES = {
  label: 'Resources',
  items: [
    { href: '/blog', label: 'Blog', description: 'Playbooks by operators' },
    { href: '/ebooks', label: 'E-Books', description: 'Deeper guides, one PDF each' },
  ],
} as const;

/** Footer link groups - real destinations, no fake badges (M00 §7). */
export const FOOTER_GROUPS = [
  {
    heading: 'Product',
    links: [
      { href: '/how-it-works', label: 'How it works' },
      { href: '/pricing', label: 'Pricing' },
      { href: SIGNUP_URL, label: 'Start free' },
      { href: LOGIN_URL, label: 'Log in' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/ebooks', label: 'E-Books' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy' },
      { href: '/terms', label: 'Terms' },
      { href: '/security', label: 'Security' },
    ],
  },
] as const;

/** Founder name (used in the About page and Organization JSON-LD). */
export const FOUNDER_NAME = 'Arun';
