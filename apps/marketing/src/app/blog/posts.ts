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
        text: 'It also filters out the businesses that already bought what you sell. Reaching out to a plumber who has a slick website and an agency on retainer is a hard sell. Reaching out to a well-reviewed plumber whose only web presence is a basic public listing is a warm one.',
      },
      {
        type: 'h2',
        text: 'Where these businesses show up',
      },
      {
        type: 'p',
        text: 'Businesses with no website still leave a public trail. They have real customers, so they show up wherever those customers look for them, and that public presence usually makes it obvious whether a business has a real site behind it or not. The problem is that this information is scattered and inconsistent, there is no tidy "no website" button to press, and you end up checking businesses one at a time. As you work through a market, these are the signals worth paying attention to:',
      },
      {
        type: 'ul',
        items: [
          'Work one industry at a time. Trades like roofing, plumbing, concrete, landscaping, and electrical skew toward missing or outdated websites.',
          'Focus on businesses that clearly have demand but nowhere to send a customer online: lots of reviews, a strong rating, an active phone number, but no real site.',
          'Look beyond the city center. Competition for these leads is lower in nearby towns and suburbs.',
          'Prioritise categories customers research before buying - contractors, clinics, restaurants, professional services - where a missing website costs the most.',
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
        text: "Doing this by hand works, but it is slow: checking businesses one by one, copying details into a spreadsheet, researching each one, and writing every email from scratch. That is the exact loop ExtrovertAI automates. You search an industry and city, filter for the no-website signal, and it finds the leads, pulls the details, and drafts personalized outreach grounded in each business's own public details and reviews, then sends it from your inbox. You can try it free and run a real search for your own niche before paying anything.",
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
