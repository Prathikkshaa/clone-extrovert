// Root layout — canvas/ink base, the distinctive fonts as CSS variables, the
// sticky-header + footer shell, and sane default metadata (full SEO/AEO lands in
// M04). RSC by default; only the header is a client island.
import type { Metadata, Viewport } from 'next';
import { headingFont, bodyFont } from '@/lib/fonts';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { APP_NAME } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  // Sensible defaults now; M04 adds OpenGraph, canonical, sitemap, JSON-LD.
  title: {
    default: `${APP_NAME} — book more meetings without learning to sell`,
    template: `%s · ${APP_NAME}`,
  },
  description:
    'Find local businesses worth reaching, write outreach that sounds like your best salesperson, and stay out of spam — one tool, pay for what you use.',
  applicationName: APP_NAME,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#fafaf8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="min-h-screen antialiased">
        {/* Skip link for keyboard/screen-reader users. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
