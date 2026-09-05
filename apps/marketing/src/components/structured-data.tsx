// SERVER components - Schema.org JSON-LD for AEO (M00 §9 / M04 §2). Being
// citable by AI assistants + eligible for rich results. Everything here is
// FACTUAL and derived from single sources (APP_NAME, SITE_*, FAQ_ITEMS, the real
// File 14 pack prices) - no fabricated ratings, review counts, or user numbers.
import { APP_NAME, SITE_URL, SITE_DESCRIPTION, FOUNDER_NAME } from '@/lib/site';
import { FAQ_ITEMS } from '@/lib/faq';
import { CREDIT_PACKS } from '@extrovertai/shared';

function JsonLd({ data }: { data: Record<string, unknown> }) {
  // JSON.stringify output is safe inside a JSON-LD script; guard the closing tag.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/** The site entity (helps answer engines disambiguate the brand + its pages).
 *  No SearchAction: there is no on-site search endpoint to declare yet. */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: APP_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: { '@type': 'Organization', name: APP_NAME },
      }}
    />
  );
}

/** The brand. Logo is a placeholder path (swap-list). */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: APP_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        logo: `${SITE_URL}/opengraph-image`,
        founder: { '@type': 'Person', name: FOUNDER_NAME },
      }}
    />
  );
}

/** The product. Free-to-start + real credit-pack offers from shared (File 14). */
export function SoftwareApplicationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: APP_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        audience: {
          '@type': 'Audience',
          audienceType: 'Founders, freelancers, and small agencies',
        },
        offers: [
          {
            '@type': 'Offer',
            name: 'Free to start',
            price: '0',
            priceCurrency: 'USD',
            description: 'Create an account and get free credits - no card needed.',
          },
          ...CREDIT_PACKS.map((pack) => ({
            '@type': 'Offer',
            name: `${pack.label} credit pack`,
            price: (pack.priceUsdCents / 100).toFixed(2),
            priceCurrency: 'USD',
            description: `${pack.credits} credits`,
          })),
        ],
      }}
    />
  );
}

/** FAQ - built from the SAME array the page renders, so they can never drift. */
export function FaqJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }}
    />
  );
}
