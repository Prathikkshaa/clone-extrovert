// FAQ content — single source, reused on the landing page and /pricing. Does
// double duty (M00 §9): persuasion + AEO. Plain answers to the REAL doubts. The
// `FAQPage` schema.org markup is generated FROM this same array in M04, so the
// on-page Q/A and the structured data can never drift.
export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Will my emails actually land, or end up in spam?',
    a: 'They send from your own inbox (Gmail or Outlook), not a shared blast server — so you keep your own sender reputation. New inboxes are warmed up gradually and every send is throttled with natural spacing, which is exactly what keeps you out of spam folders.',
  },
  {
    q: 'Where do the leads come from? Is this legal?',
    a: 'Leads come from public business listings on Google Maps and each business’s own public website. You reach businesses at their public contact address about a genuine offer, and every email includes one-click unsubscribe and a physical mailing address — the requirements for compliant B2B outreach.',
  },
  {
    q: 'Do I need to be technical?',
    a: 'No. You connect your email inbox once, search for a type of business in a city, and review the drafts it writes. There’s nothing to install and no code — if you can send an email, you can use this.',
  },
  {
    q: 'What if it doesn’t work for my industry?',
    a: 'It works anywhere businesses show up on Google Maps — trades, local services, agencies, SaaS, professional services. Because you start free, you can run a real search for your niche and see the leads before you pay anything.',
  },
  {
    q: 'What does it cost?',
    a: 'You start free with a batch of credits — enough to find leads, write emails, and send them. After that you buy credits as you need them and only pay for what you use: finding, researching, writing, and sending. No subscription, no seats.',
  },
];
