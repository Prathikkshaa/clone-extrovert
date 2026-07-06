import type { Config } from 'tailwindcss';

/**
 * Tailwind config — ExtrovertAI marketing site.
 *
 * WHY (M00 §5 — the #1 anti-slop lever): we OVERRIDE Tailwind's stock palette,
 * fonts, and add a fluid type scale so nothing renders with generic Tailwind
 * defaults (Inter-on-white + violet accent = "AI-generated"). Every colour maps
 * to a CSS custom property defined in `globals.css`, mirroring the product app
 * (apps/web) so the whole site re-themes by swapping variables — same tokens,
 * same discipline. Fonts come from `next/font` (see src/lib/fonts.ts) and are
 * injected as CSS variables on <html>.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    // Distinctive type: characterful geometric sans for headings, humanist sans
    // for body — deliberately NOT the default Inter (M00 §5).
    fontFamily: {
      heading: ['var(--font-heading)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        muted: 'var(--color-muted)',
        line: 'var(--color-line)',
        accent: 'var(--color-accent)',
        'accent-strong': 'var(--color-accent-strong)',
        'accent-soft': 'var(--color-accent-soft)',
        positive: 'var(--color-positive)',
        'positive-soft': 'var(--color-positive-soft)',
        warning: 'var(--color-warning)',
        'warning-soft': 'var(--color-warning-soft)',
        danger: 'var(--color-danger)',
        'danger-soft': 'var(--color-danger-soft)',
      },
      borderRadius: {
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
      },
      // Fluid, clamp-based type scale (M00 §10) — sizes breathe between mobile and
      // desktop with no media queries. Headings weight 500, body 400 (two weights).
      fontSize: {
        'display-xl': ['clamp(2.75rem, 1.6rem + 5.2vw, 5rem)', { lineHeight: '1.02', fontWeight: '500', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 1.5rem + 3.4vw, 3.75rem)', { lineHeight: '1.05', fontWeight: '500', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.75rem, 1.3rem + 2vw, 2.75rem)', { lineHeight: '1.1', fontWeight: '500', letterSpacing: '-0.01em' }],
        'heading-lg': ['clamp(1.375rem, 1.15rem + 1vw, 1.75rem)', { lineHeight: '1.2', fontWeight: '500', letterSpacing: '-0.01em' }],
        'heading-md': ['clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem)', { lineHeight: '1.3', fontWeight: '500' }],
        'heading-sm': ['1.0625rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)', { lineHeight: '1.6', fontWeight: '400' }],
        body: ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.9375rem', { lineHeight: '1.55', fontWeight: '400' }],
        eyebrow: ['0.8125rem', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.08em' }],
      },
      maxWidth: {
        content: '72rem', // the shell's outer measure (~1152px)
        prose: '38rem', // comfortable reading measure for long copy
      },
      spacing: {
        // Generous section rhythm — deliberate density variation (M00 §5).
        'section-y': 'clamp(4rem, 2.5rem + 7vw, 8rem)',
      },
      transitionTimingFunction: {
        // One considered easing used across micro-interactions (calm, human).
        soft: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
