/**
 * Fonts - self-hosted via next/font (no layout shift, no external requests at
 * runtime; Next fetches + subsets at build time).
 *
 * CHOICE (M00 §5 - "one confident, distinctive type choice, not default Inter"):
 *  - Headings: **Space Grotesk** - a characterful geometric grotesk with a slight
 *    technical edge. Distinctive without being loud; reads as intentional/human,
 *    not the default-Inter "AI template" look. Weight 500 for headings.
 *  - Body: **IBM Plex Sans** - a clean, warm humanist sans that pairs well with a
 *    geometric heading and stays highly readable at long measures. Weights 400/500.
 *
 * Two weights only (400/500), matching the product design system. Both expose a
 * CSS variable consumed by tailwind.config.ts (`--font-heading` / `--font-body`).
 */
import { Space_Grotesk, IBM_Plex_Sans } from 'next/font/google';

export const headingFont = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-heading',
  display: 'swap',
});

export const bodyFont = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});
