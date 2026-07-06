// Root layout — canvas/ink base, the distinctive fonts as CSS variables, the
// sticky-header + footer shell, site-wide SEO/AEO metadata defaults, and the
// Organization + SoftwareApplication JSON-LD. RSC by default; header is a client
// island. Per-page titles/descriptions override via each route's `metadata`.
import type { Metadata, Viewport } from 'next';
import { headingFont, bodyFont } from '@/lib/fonts';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { OrganizationJsonLd, SoftwareApplicationJsonLd } from '@/components/structured-data';
import { APP_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/site';
import './globals.css';

const TITLE_DEFAULT = `${APP_NAME} — book more meetings without learning to sell`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE_DEFAULT,
    template: `%s · ${APP_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: APP_NAME,
  alternates: { canonical: '/' },
  keywords: [
    'cold email tool',
    'cold email tool for agencies',
    'find local business leads',
    'find businesses without a website',
    'lead generation for freelancers',
    'B2B outreach software',
    'AI cold email',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
  },
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
        {/* Site-wide JSON-LD (AEO). FAQPage JSON-LD is added on pages with the FAQ. */}
        <OrganizationJsonLd />
        <SoftwareApplicationJsonLd />
      </body>
    </html>
  );
}
