/**
 * Tailwind config — maps the design tokens (master-context §7) to semantic
 * utility names. WHY: components reference semantic names (bg-canvas, text-ink,
 * bg-accent) that resolve to CSS custom properties defined in src/styles.css.
 * Theming (File 05) and dark mode are then a token swap with no component edits.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
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
      },
      fontWeight: {
        normal: '400',
        medium: '500',
      },
      fontSize: {
        // Type scale (§7): headings 22/18/16 @500, body 16 @400.
        'heading-lg': ['22px', { lineHeight: '1.3', fontWeight: '500' }],
        'heading-md': ['18px', { lineHeight: '1.35', fontWeight: '500' }],
        'heading-sm': ['16px', { lineHeight: '1.4', fontWeight: '500' }],
        body: ['16px', { lineHeight: '1.5', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};
