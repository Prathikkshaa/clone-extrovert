// Blog authors. Four editorial personas, distinct expertise. Every published
// post maps to exactly one author via AUTHOR_BY_SLUG (unmapped slugs default
// to the founder). The mapping is by subject matter, not round-robin: signals
// / philosophy / manifestos land with Arun, deliverability / compliance /
// cadence / benchmarks with Tara, SEO / web-signal verticals with Zoya, and
// practical prospecting / contractor verticals with Abhimanyu.

export type AuthorId = 'arun' | 'tara' | 'zoya' | 'abhimanyu';

export type Author = {
  id: AuthorId;
  name: string;
  initials: string;
  role: string;
  bio: string;
  focus: readonly string[];
};

export const AUTHORS: Record<AuthorId, Author> = {
  arun: {
    id: 'arun',
    name: 'Arun',
    initials: 'A',
    role: 'Founder, Milo',
    bio:
      'Founder at Milo. Writes about positioning, category, and the mechanics of AI sales prospecting for small teams. Based in India.',
    focus: ['Positioning', 'Category', 'Founder outbound', 'AI sales prospecting'],
  },
  tara: {
    id: 'tara',
    name: 'Tara',
    initials: 'T',
    role: 'Deliverability editor',
    bio:
      'Ex-lifecycle marketer who now covers cold email deliverability, compliance, cadence, and reply-rate research for Milo. Reads the RFCs so you do not have to.',
    focus: ['Deliverability', 'Compliance', 'Cadence', 'Benchmarks'],
  },
  zoya: {
    id: 'zoya',
    name: 'Zoya',
    initials: 'Z',
    role: 'SEO and web signals editor',
    bio:
      'SEO consultant turned editor. Writes the vertical playbooks for agencies that sell websites, SEO, and technical marketing services. Cares about Core Web Vitals as a personality trait.',
    focus: ['SEO', 'Web design signals', 'Agency verticals', 'Technical marketing'],
  },
  abhimanyu: {
    id: 'abhimanyu',
    name: 'Abhimanyu',
    initials: 'AB',
    role: 'Prospecting editor',
    bio:
      'Ex-agency sales lead who ships the practical prospecting playbooks: contractor and trade verticals, Google Maps workflows, and list-building for people who bill by the hour.',
    focus: ['Contractor verticals', 'Local prospecting', 'List building', 'Agency operations'],
  },
} as const;

/**
 * Per-slug author assignment. Read the article, decide who fits, ship. Any
 * slug not in this map defaults to Arun (see authorFor()).
 */
export const AUTHOR_BY_SLUG: Record<string, AuthorId> = {
  // Wave 1: pillars and philosophy
  'buying-signal-playbook-local-b2b': 'arun',
  'google-maps-prospecting-not-scraping': 'abhimanyu',
  'signal-vs-database-prospecting': 'arun',
  'high-intent-local-leads': 'abhimanyu',

  // Wave 2: wedge examples + verticals
  'buying-signal-examples': 'arun',
  'get-web-design-clients-no-ads': 'zoya',
  'get-seo-clients-2026': 'zoya',
  'roofing-leads-no-ads': 'abhimanyu',

  // Wave 3: refreshed pillars + one new
  'find-local-businesses-without-a-website': 'zoya',
  'why-cold-emails-go-to-spam': 'tara',
  'is-cold-email-legal': 'tara',
  'manual-vs-automated-prospecting': 'arun',

  // Wave 4A: manifesto / definition / taxonomy / benchmarks
  'lead-databases-are-stale': 'arun',
  'what-is-an-ai-sdr': 'arun',
  'buying-signals-taxonomy': 'arun',
  'cold-email-reply-rate-benchmarks-2026': 'tara',

  // Wave 4B: cadence + verticals
  'cold-email-follow-up-cadence': 'tara',
  'hvac-leads-no-ads': 'abhimanyu',
  'plumbing-leads-no-ads': 'abhimanyu',
  'cold-email-templates-seo': 'zoya',

  // Wave 4C: practical + freelance + comparison + founder
  'prospecting-list-from-google-maps': 'abhimanyu',
  'freelance-clients-cold-email': 'tara',
  'apollo-alternative-small-teams': 'arun',
  'prospecting-bootstrapped-founder': 'arun',
};

export function authorFor(slug: string): Author {
  const id = AUTHOR_BY_SLUG[slug] ?? 'arun';
  return AUTHORS[id];
}

export function postsByAuthor(id: AuthorId, allSlugs: string[]): string[] {
  return allSlugs.filter((s) => (AUTHOR_BY_SLUG[s] ?? 'arun') === id);
}
