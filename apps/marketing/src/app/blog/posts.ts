// Blog content source. A simple typed array is the content store for now; the
// index, the /blog/[slug] route, the sitemap, and the BlogPosting JSON-LD all read
// from here, so adding a post is one entry. Swap for MDX/a CMS later without
// touching those consumers.
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  /** Meta description (SEO). */
  description: string;
  category: string;
  /** Card teaser. */
  excerpt: string;
  /** ISO date. */
  datePublished: string;
  readMinutes: number;
  body: Block[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'find-local-businesses-without-a-website',
    title: 'How to find local businesses with no website (and win them as clients)',
    description:
      'A practical, step-by-step way to find local businesses that have no website, judge which ones are worth contacting, and pitch them without sounding like spam.',
    category: 'Playbook',
    excerpt:
      'Businesses with no website are one of the clearest buying signals there is. Here is how to find them, qualify them, and reach out in a way that actually gets replies.',
    datePublished: '2026-07-01',
    readMinutes: 6,
    body: [
      {
        type: 'p',
        text: 'If you sell websites, marketing, or almost any local service, the businesses worth contacting first are the ones with an obvious gap you can close. The most obvious gap of all is not having a website. This guide walks through how to find local businesses with no website, how to tell which ones are actually worth your time, and how to reach out so you get replies instead of getting ignored.',
      },
      {
        type: 'h2',
        text: 'Why "no website" is one of the best buying signals',
      },
      {
        type: 'p',
        text: 'A buying signal is any public fact about a business that means it is more likely to need what you sell. "No website" is a strong one because it is concrete and easy to verify: the business already has demand (real customers, real reviews) but is missing a piece of infrastructure most competitors already have. You are not convincing them they have a problem, you are pointing at one they already feel.',
      },
      {
        type: 'p',
        text: 'It also filters out the businesses that already bought what you sell. Reaching out to a plumber who has a slick website and an agency on retainer is a hard sell. Reaching out to a well-reviewed plumber whose only web presence is a Google Maps listing is a warm one.',
      },
      {
        type: 'h2',
        text: 'Where to find businesses without a website',
      },
      {
        type: 'p',
        text: 'The single best source is Google Maps (Google Business Profiles). Almost every local business appears there, and each listing shows whether the business has linked a website. A few reliable ways to work through it:',
      },
      {
        type: 'ul',
        items: [
          'Search a specific trade plus a city, for example "roofers in Austin, TX", and scan the listings for ones with no website link.',
          'Work one industry at a time. Trades like roofing, plumbing, concrete, landscaping, and electrical skew toward missing or outdated websites.',
          'Note the businesses that clearly have demand but no site: lots of reviews, a good rating, an active phone number, but no website field.',
          'Check nearby towns and suburbs, not just the city center. Competition for these leads is lower the further you get from downtown.',
        ],
      },
      {
        type: 'h2',
        text: 'How to tell which ones are worth your time',
      },
      {
        type: 'p',
        text: 'Not every business without a website is a good lead. You want ones that have money coming in and would clearly benefit from what you offer. Quick filters that work:',
      },
      {
        type: 'ul',
        items: [
          'Reviews and rating: a business with 40+ reviews and a 4.5+ rating has real, steady customers and can afford to invest.',
          'Recency: recent reviews mean the business is active right now, not winding down.',
          'A real phone number and address: signs of an established operation, not a side hobby.',
          'A category where a website obviously helps: anyone customers research before buying, such as contractors, clinics, restaurants, and professional services.',
        ],
      },
      {
        type: 'h2',
        text: 'How to pitch them without sounding like spam',
      },
      {
        type: 'p',
        text: 'The businesses you are contacting get plenty of generic "I can build you a website" emails and delete all of them. The way to stand out is specificity: prove in the first line that you looked at their actual business. A simple structure that works:',
      },
      {
        type: 'ul',
        items: [
          'Open with a specific, true observation: their rating and review count, a detail from their reviews, or the fact that customers who hear about them cannot find them online.',
          'Name the concrete cost of the gap, for example referrals that go cold because there is nothing to point people to.',
          'Make one clear, low-friction offer instead of a menu of services.',
          'Keep it short, send it from a real inbox, and follow up once or twice, politely.',
        ],
      },
      {
        type: 'p',
        text: 'Send from your own email address rather than a bulk blasting service, keep your daily volume modest, and always include a way to opt out. That is what keeps you out of spam folders and on the right side of anti-spam rules.',
      },
      {
        type: 'h2',
        text: 'A faster way to do all of this',
      },
      {
        type: 'p',
        text: "Doing this by hand works, but it is slow: searching Maps, copying details into a spreadsheet, researching each business, and writing every email from scratch. That is the exact loop ExtrovertAI automates. You search an industry and city, filter for the no-website signal, and it finds the leads, pulls the details, and drafts personalized outreach grounded in each business's own listing and reviews, then sends it from your inbox. You can try it free and run a real search for your own niche before paying anything.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
