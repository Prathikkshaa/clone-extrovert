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
    a: 'You search by industry and city and it returns real local businesses, built from public business information anyone can look up - the same details a prospective customer would find. You reach them at their public business contact address about a genuine, relevant offer, and every email carries one-click unsubscribe plus a physical mailing address. Your obligations depend on where you and the recipient are: in the US that satisfies CAN-SPAM; in the UK/EU, outreach to businesses falls under PECR and GDPR, where a relevant offer to a business address can rest on legitimate interest and the unsubscribe honours the opt-out. We give you the compliance tools (opt-out, address, suppression); you decide the regions and offers you send to.',
  },
  {
    q: 'Do I need to be technical?',
    a: 'No. You connect your email inbox once, search for a type of business in a city, and review the drafts it writes. There’s nothing to install and no code - if you can send an email, you can use this.',
  },
  {
    q: 'Do the emails send automatically, or do I review them first?',
    a: 'You’re always in control. Each lead gets a short sequence - a first email plus two follow-ups - and nothing goes out until you’ve reviewed and approved the drafts. You can edit or skip anything before it sends.',
  },
  {
    q: 'How does it write in my voice?',
    a: 'You set up your offer, your tone, and a couple of proof points once. Every email is then generated from that plus what the specific business publicly shows about itself - so it sounds like you and speaks to them. No mail-merge tokens, no “Hi {{first_name}}” tells.',
  },
  {
    q: 'What happens when someone replies?',
    a: 'Replies land straight in your own inbox - it’s your Gmail or Outlook - so you carry on the conversation like any normal email. Follow-ups stop automatically the moment a lead replies, so nobody who’s already responding gets chased.',
  },
  {
    q: 'How do meetings actually get booked?',
    a: 'You add your scheduling link to your account. When a prospect books a time, the meeting is captured and that lead is marked as booked, so you can see which outreach is turning into real conversations.',
  },
  {
    q: 'Can I run outreach for more than one client or inbox?',
    a: 'Yes. You can connect more than one sending inbox and run separate searches and campaigns - handy for agencies doing outreach for several clients. It’s pay-as-you-go credits with no per-seat fees, so more inboxes doesn’t mean a bigger subscription.',
  },
  {
    q: 'How many emails can I send per day?',
    a: 'Each connected inbox starts around 30 sends a day and ramps up as it warms. Sends are spaced out naturally through the day rather than fired off in a burst - the pacing that protects your sender reputation and keeps you landing in the inbox.',
  },
  {
    q: 'Is my inbox and data safe?',
    a: 'You connect through your provider’s official sign-in (OAuth) - we never see or store your password - and the access it grants is stored encrypted, never in plain text. You can disconnect an inbox at any time.',
  },
  {
    q: 'Is there a subscription or contract?',
    a: 'No. It’s pay-as-you-go credits - buy them when you need them, and they never expire while your account is active. No subscription, no seats, no monthly minimum.',
  },
  {
    q: 'What if it doesn’t work for my industry?',
    a: 'It works for any industry where businesses have a findable local presence - trades, local services, agencies, SaaS, professional services. Because you start free, you can run a real search for your niche and see the leads before you pay anything.',
  },
  {
    q: 'What does it cost?',
    a: 'You start free with 100 credits - no card - enough to find, research, write, and send to a first batch of real leads. After that you buy credits as you need them and only pay for what you use: find a lead (1 credit), research it (2), write a full sequence (1), send an email (1). A lead taken all the way through is about 5 credits, so a $45 pack of 550 credits works roughly 110 leads end to end. No subscription, no seats, and credits never expire while your account is active. Billed in USD; cards accepted from any country.',
  },
];
