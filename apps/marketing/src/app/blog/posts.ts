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
  /** ISO date of the last meaningful edit. Falls back to datePublished when unset. */
  dateModified?: string;
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
    dateModified: '2026-09-05',
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
  {
    slug: 'how-to-find-local-business-leads',
    title: 'How to find local business leads: a practical guide for freelancers and agencies',
    description:
      'A step-by-step guide to finding local business leads worth contacting, qualifying them by buying signals, and reaching out without sounding like spam.',
    category: 'Playbook',
    excerpt:
      'Finding local business leads is less about volume and more about picking the right businesses. Here is a repeatable way to build a list worth working.',
    datePublished: '2026-08-04',
    dateModified: '2026-09-05',
    readMinutes: 7,
    body: [
      {
        type: 'p',
        text: 'The fastest way to find local business leads is to start from public business information anyone can look up - the industry, location, ratings, reviews, and web presence a business already shows the world - and filter for the ones with a visible gap you can close. This guide walks freelancers and agencies through building that list, qualifying it by buying signals, and reaching out in a way that gets replies.',
      },
      {
        type: 'h2',
        text: 'What makes a good local business lead?',
      },
      {
        type: 'p',
        text: 'A good lead is a business that already has demand and has a problem you can solve. Demand shows up as steady customers: a healthy review count, a solid rating, recent activity, a working phone number. The problem is whatever gap your service closes - a missing website, thin online presence, no clear way to book. When both are present, you are not convincing someone they need help; you are pointing at something they already feel.',
      },
      {
        type: 'h2',
        text: 'Where do you actually find them?',
      },
      {
        type: 'p',
        text: 'Every established local business leaves a public trail, because its customers need to find it. That means you can build a list from public business information anyone can look up, working one industry and one area at a time. The catch is that this information is scattered and inconsistent - there is no tidy filter for "needs what I sell" - so the manual version means checking businesses one by one. A few things make it far more efficient:',
      },
      {
        type: 'ul',
        items: [
          'Pick one industry per session so you can judge quality quickly and reuse the same pitch.',
          'Work the suburbs and nearby towns, not just the city center, where competition for the same leads is lower.',
          'Favour categories customers research before buying - contractors, clinics, restaurants, professional services.',
          'Capture the details you will need to personalize later: name, rating, review themes, and whether they have a real website.',
        ],
      },
      {
        type: 'h2',
        text: 'How do you qualify a list quickly?',
      },
      {
        type: 'p',
        text: 'Once you have candidates, spend your time only on the ones likely to buy. Reviews and rating tell you a business has real, steady customers and can afford to invest. Recent activity tells you it is still running. A clear service category tells you whether your offer fits. Drop anything that already bought what you sell - a business with a slick site and an agency on retainer is a hard sell compared with a well-reviewed one that has an obvious gap.',
      },
      {
        type: 'h2',
        text: 'Key takeaways',
      },
      {
        type: 'ul',
        items: [
          'Start from public business information anyone can look up, filtered by industry and area.',
          'Qualify on demand (reviews, rating, recency) plus a gap your service closes.',
          'Work one industry at a time and capture the details you need to personalize.',
          'Skip businesses that already bought what you sell - the gap is the whole point.',
        ],
      },
      {
        type: 'p',
        text: 'Doing this by hand works, but it is slow. ExtrovertAI runs the whole loop for you - search an industry and area, filter for buying signals, and it builds the list, pulls each business’s public details, and drafts personalized outreach you review before it sends from your own inbox. You can run a real search for your niche free before paying anything.',
      },
    ],
  },
  {
    slug: 'why-cold-emails-go-to-spam',
    title: 'Why cold emails go to spam (and how to actually stay out of it)',
    description:
      'The real reasons cold emails land in spam - reputation, volume, and content - and the concrete habits that keep your outreach in the inbox.',
    category: 'Deliverability',
    excerpt:
      'Cold emails go to spam because of how they are sent, not just what they say. Here is what actually drives deliverability and how to protect it.',
    datePublished: '2026-08-12',
    dateModified: '2026-09-05',
    readMinutes: 6,
    body: [
      {
        type: 'p',
        text: 'Cold emails go to spam mostly because of how they are sent, not just what they say: a cold or shared sending reputation, too much volume too fast, and content that pattern-matches to bulk mail. The good news is that all three are things you control. This guide explains what really drives deliverability and the habits that keep your outreach in the inbox.',
      },
      {
        type: 'h2',
        text: 'What decides whether an email lands in spam?',
      },
      {
        type: 'p',
        text: 'Mailbox providers weigh a few things: the reputation of the domain and inbox you send from, how recipients react (opens, replies, and especially spam complaints), your authentication setup, and whether your sending pattern looks human or automated. No single trick beats a good reputation, and nothing wrecks one faster than complaints and bounces.',
      },
      {
        type: 'h2',
        text: 'Why does volume matter so much?',
      },
      {
        type: 'p',
        text: 'A brand-new inbox that suddenly sends hundreds of messages looks exactly like a spammer, so providers throttle or filter it. The fix is to ramp gradually. A new inbox should start small - around 30 sends a day is a sensible floor - and increase over weeks as it warms up and builds a track record. Sending one message at a time with randomized spacing, rather than a single burst, also reads as human behaviour.',
      },
      {
        type: 'h2',
        text: 'Does the content really matter too?',
      },
      {
        type: 'p',
        text: 'It does, but less than people think, and mostly through reactions. Generic mail-merge blasts get ignored or reported, and that reputation hit is what hurts you. Specific, relevant emails written from the recipient’s own public details earn replies, and replies are one of the strongest positive signals there is. Keeping messages short, honest, and genuinely tailored is a deliverability tactic as much as a copywriting one.',
      },
      {
        type: 'h2',
        text: 'How do you stay out of spam?',
      },
      {
        type: 'ul',
        items: [
          'Send from your own Gmail or Outlook, not a shared blast server, so you keep your own reputation.',
          'Ramp new inboxes slowly - start around 30 a day and increase as they warm.',
          'Send one at a time with randomized spacing instead of a burst.',
          'Watch bounces and stop sending to bad addresses fast.',
          'Personalize each message and include a working one-click unsubscribe so complaints stay near zero.',
        ],
      },
      {
        type: 'h2',
        text: 'Key takeaways',
      },
      {
        type: 'ul',
        items: [
          'Reputation, volume, and reactions decide deliverability - content matters mainly through replies and complaints.',
          'Warm up new inboxes and keep sending patterns human.',
          'Personalization and easy opt-outs keep complaints low, which protects the inbox.',
        ],
      },
      {
        type: 'p',
        text: 'Keeping all of this straight by hand is fiddly. ExtrovertAI runs the loop with these habits built in - it sends from your own inbox, ramps volume with warm-up, spaces sends and monitors bounces, and drafts personalized emails you approve before they go out. You can try it free.',
      },
    ],
  },
  {
    slug: 'is-cold-email-legal',
    title: 'Is cold email legal? CAN-SPAM, PECR, and GDPR explained for small businesses',
    description:
      'A plain-English guide to whether cold email is legal, covering CAN-SPAM in the US and PECR and GDPR in the UK and EU, and the rules that keep you compliant.',
    category: 'Compliance',
    excerpt:
      'Cold email to businesses is legal in most places when you follow the rules. Here is what CAN-SPAM, PECR, and GDPR actually require.',
    datePublished: '2026-08-21',
    dateModified: '2026-09-05',
    readMinutes: 7,
    body: [
      {
        type: 'p',
        text: 'Yes - cold email to businesses is legal in most places, as long as you follow the rules for the region you are sending to. In the US that means CAN-SPAM; in the UK and EU it means PECR and GDPR. None of them ban cold outreach outright, but each sets conditions. This is a plain-English overview for small businesses, not legal advice - check your specifics if you are unsure.',
      },
      {
        type: 'h2',
        text: 'What does CAN-SPAM require in the US?',
      },
      {
        type: 'p',
        text: 'CAN-SPAM does not require prior consent to send commercial email, which is why cold email is workable in the US. It does require that you are honest and give people an easy way out: no misleading headers or subject lines, a clear way to opt out, opt-outs honoured promptly, and a valid physical postal address in every message. Follow those and a cold email is compliant.',
      },
      {
        type: 'h2',
        text: 'How are the UK and EU different?',
      },
      {
        type: 'p',
        text: 'The UK and EU are stricter because PECR governs electronic marketing and GDPR governs personal data. For marketing to individuals, consent is generally expected. Business-to-business outreach has more room: emailing a role or company address about a relevant offer can often rest on legitimate interest rather than prior consent, provided the contact is relevant, you are transparent about who you are, and you make opting out easy. Sending to sole traders and partnerships is treated more like sending to individuals, so tread carefully there.',
      },
      {
        type: 'h2',
        text: 'What does legitimate interest actually mean?',
      },
      {
        type: 'p',
        text: 'Legitimate interest is a lawful basis under GDPR for processing someone’s data without explicit consent when your purpose is reasonable, the contact is relevant, and it does not override their rights and expectations. In practice that means only reaching businesses your offer genuinely fits, keeping records of why you contacted them, being clear about your identity, and honouring opt-outs immediately. It is a basis you have to be able to justify, not a free pass.',
      },
      {
        type: 'h2',
        text: 'How do you stay compliant in practice?',
      },
      {
        type: 'ul',
        items: [
          'Include a working one-click unsubscribe in every email and honour it immediately.',
          'Put a valid physical mailing address in every message.',
          'Suppress anyone who opts out so they are never contacted again.',
          'Target relevant businesses with a genuine offer, not random lists.',
          'Be aware of the region you are sending to - CAN-SPAM for the US, PECR and GDPR for the UK and EU.',
        ],
      },
      {
        type: 'h2',
        text: 'Key takeaways',
      },
      {
        type: 'ul',
        items: [
          'Cold email to businesses is legal in the US, UK, and EU when you follow the local rules.',
          'CAN-SPAM allows cold email with honesty, an opt-out, and a physical address.',
          'PECR and GDPR are stricter; B2B outreach can rest on legitimate interest with relevance and transparency.',
          'One-click unsubscribe, a mailing address, and auto-suppression are the baseline everywhere.',
        ],
      },
      {
        type: 'p',
        text: 'Getting the compliance details right on every send is exactly what tooling should handle. ExtrovertAI runs the loop with a one-click unsubscribe and your physical address on every email, automatic suppression of opt-outs, and region-aware handling for the US, UK, and EU - so you can focus on the offer. You can try it free.',
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
