// FAQ content - single source, reused on the landing page and /pricing. Does
// double duty (M00 §9): persuasion + AEO. Plain answers to the REAL doubts. The
// `FAQPage` schema.org markup is generated FROM this same array in M04, so the
// on-page Q/A and the structured data can never drift.
export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Will my emails actually land, or end up in spam?',
    a: 'They send from your own inbox (Gmail or Outlook), not a shared blast server - so you keep your own sender reputation. New inboxes start at a conservative daily cap (around 30 sends) and ramp up as they warm; sends go out one at a time with natural, randomized spacing rather than in a burst; and bounces are watched so a bad address doesn’t drag your reputation down. That behaviour - your own inbox, a slow ramp, human-like pacing - is exactly what keeps you out of spam folders.',
  },
  {
    q: 'Where do the leads come from? Is this legal?',
    a: 'Leads come from public business listings on Google Maps and each business’s own public website - the same information anyone can look up. You reach businesses at their public contact address about a genuine, relevant offer, and every email carries one-click unsubscribe plus a physical mailing address. Your obligations depend on where you and the recipient are: in the US that satisfies CAN-SPAM; in the UK/EU, outreach to businesses falls under PECR and GDPR, where a relevant offer to a business address can rest on legitimate interest and the unsubscribe honours the opt-out. We give you the compliance tools (opt-out, address, suppression); you decide the regions and offers you send to.',
  },
  {
    q: 'Do I need to be technical?',
    a: 'No. You connect your email inbox once, search for a type of business in a city, and review the drafts it writes. There’s nothing to install and no code - if you can send an email, you can use this.',
  },
  {
    q: 'What if it doesn’t work for my industry?',
    a: 'It works anywhere businesses show up on Google Maps - trades, local services, agencies, SaaS, professional services. Because you start free, you can run a real search for your niche and see the leads before you pay anything.',
  },
  {
    q: 'What does it cost?',
    a: 'You start free with 100 credits - no card - enough to find, research, write, and send to a first batch of real leads. After that you buy credits as you need them and only pay for what you use: find a lead (1 credit), research it (2), write a full sequence (1), send an email (1). A lead taken all the way through is about 5 credits, so a $45 pack of 550 credits works roughly 110 leads end to end. No subscription, no seats, and credits never expire while your account is active. Billed in USD; cards accepted from any country.',
  },
];
