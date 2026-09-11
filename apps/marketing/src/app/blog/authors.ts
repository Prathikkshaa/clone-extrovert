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
  /** Optional external identity URLs for Person JSON-LD sameAs. */
  sameAs?: readonly string[];
  /** One-line editorial signature that captures the persona's voice. */
  signature?: string;
};

export const AUTHORS: Record<AuthorId, Author> = {
  arun: {
    id: 'arun',
    name: 'Arun',
    initials: 'A',
    role: 'Founder, Milo',
    bio:
      'Bootstrapped Milo out of Coimbatore after a decade of watching teams pay per seat for lists their SDRs never worked. Writes about positioning, category, and the argument for signal-first prospecting. Opinionated, first-person, not neutral.',
    focus: ['Positioning', 'Category', 'Founder outbound', 'AI sales prospecting'],
    signature: 'Writes from the founder chair. Names the tradeoff, picks a side, tells you why.',
    sameAs: [],
  },
  tara: {
    id: 'tara',
    name: 'Tara',
    initials: 'T',
    role: 'Deliverability editor',
    bio:
      'Spent six years running lifecycle at two Series B SaaS companies before the RFC rabbit hole ate her. Now she reads Postmaster Tools, SPF alignment specs, and the actual Google sender guidelines so you can send from your own domain without setting it on fire.',
    focus: ['Deliverability', 'Compliance', 'Cadence', 'Benchmarks'],
    signature: 'Cites the RFC. Shows the header. Never says "best practice" without a source.',
    sameAs: [],
  },
  zoya: {
    id: 'zoya',
    name: 'Zoya',
    initials: 'Z',
    role: 'SEO and web signals editor',
    bio:
      'Ex-technical SEO consultant, now writes for the teams that sell websites, redesigns, Core Web Vitals audits, and technical marketing retainers. Cares more about a lighthouse score than most people care about their own credit score.',
    focus: ['SEO', 'Web design signals', 'Agency verticals', 'Technical marketing'],
    signature: 'Reads the code before the copy. Every claim gets an anchor tag.',
    sameAs: [],
  },
  abhimanyu: {
    id: 'abhimanyu',
    name: 'Abhimanyu',
    initials: 'AB',
    role: 'Prospecting editor',
    bio:
      'Ran outbound for a two-partner agency selling into roofers, HVAC contractors, and dental practices for four years. Ships the playbooks the way he actually shipped lists: by hand first, automated once the pattern held.',
    focus: ['Contractor verticals', 'Local prospecting', 'List building', 'Agency operations'],
    signature: 'Blue-collar prospecting. Names the town, names the vertical, names the ask.',
    sameAs: [],
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
  'high-intent-local-leads': 'arun',

  // Wave 2: wedge examples + verticals
  'buying-signal-examples': 'arun',
  'get-web-design-clients-no-ads': 'zoya',
  'get-seo-clients-2026': 'zoya',
  'roofing-leads-no-ads': 'abhimanyu',

  // Wave 3: refreshed pillars + one new
  'find-local-businesses-without-a-website': 'abhimanyu',
  'why-cold-emails-go-to-spam': 'tara',
  'is-cold-email-legal': 'tara',
  'manual-vs-automated-prospecting': 'arun',

  // Wave 4A: manifesto / definition / taxonomy / benchmarks
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
  'freelance-clients-cold-email': 'arun',
  'prospecting-bootstrapped-founder': 'arun',

  // Wave 5: anti-features, booking flow, comparison, reply playbook, deliverability
  'what-milo-does-not-do': 'arun',
  'cold-email-to-booked-call-with-cal-com': 'abhimanyu',
  'milo-vs-clay-signal-first-prospecting': 'arun',
  'what-to-say-when-they-reply-cold-email-response-playbook': 'tara',
  'cold-email-deliverability-from-gmail-workspace-2026': 'tara',

  // Wave 6: services-sold-to-contractors verticals
  'selling-marketing-services-to-roofers': 'zoya',
  'selling-marketing-services-to-hvac-contractors': 'zoya',
  'selling-marketing-services-to-plumbing-contractors': 'zoya',

  // Wave 7: higher-margin verticals (legal, dental, med-spa, veterinary)
  'legal-firm-lead-generation-signals': 'abhimanyu',
  'dental-practice-new-patient-leads-2026': 'abhimanyu',
  'med-spa-cold-outreach-playbook': 'abhimanyu',
  'veterinary-clinic-outbound-playbook': 'abhimanyu',
};

export function authorFor(slug: string): Author {
  const id = AUTHOR_BY_SLUG[slug] ?? 'arun';
  return AUTHORS[id];
}

export function postsByAuthor(id: AuthorId, allSlugs: string[]): string[] {
  return allSlugs.filter((s) => (AUTHOR_BY_SLUG[s] ?? 'arun') === id);
}
