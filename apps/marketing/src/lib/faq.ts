// FAQ content - single source, reused on the landing page and /pricing. Does
// double duty (M00 §9): persuasion + AEO. Answers are SHORT (1-2 sentences) so
// they read at a glance in the accordion, while still being self-contained for
// answer engines. The `FAQPage` schema is generated FROM this same array, so the
// on-page Q/A and the structured data can never drift.
export type FaqItem = { q: string; a: string };

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Will my emails actually land, or end up in spam?',
    a: 'They send from your own Gmail or Outlook - never a shared blast server - ramp up slowly (~30/day at first), and go out one at a time with natural spacing. That pacing is what keeps you in the inbox.',
  },
  {
    q: 'Where do the leads come from? Is this legal?',
    a: 'You search by industry and city; it returns real local businesses from public information anyone can look up. Every email carries one-click unsubscribe and a physical address - CAN-SPAM in the US, PECR/GDPR-aware in the UK/EU. You choose the regions and offers.',
  },
  {
    q: 'Do I need to be technical?',
    a: 'No. Connect your inbox once, search a business type in a city, and review the drafts. Nothing to install, no code - if you can send an email, you can use this.',
  },
  {
    q: 'Do the emails send automatically, or do I review them first?',
    a: 'You’re always in control. Each lead gets a 3-email sequence, and nothing goes out until you’ve reviewed and approved the drafts.',
  },
  {
    q: 'What happens when someone replies?',
    a: 'Replies land straight in your own inbox, so you carry on like any normal email - and follow-ups stop automatically the moment someone responds.',
  },
  {
    q: 'Is my inbox and data safe?',
    a: 'Yes. You connect through your provider’s official sign-in (OAuth) - we never see your password - and access is stored encrypted. Disconnect anytime.',
  },
  {
    q: 'Is there a subscription or contract?',
    a: 'No. Pay-as-you-go credits, bought when you need them - no subscription, no seats, and they never expire while your account is active.',
  },
  {
    q: 'What does it cost?',
    a: 'Start free with 100 credits, no card. After that you pay only for what you use - about 5-7 credits per lead end to end - roughly $0.40-0.58 each - so $45 (550 credits) ≈ 78-110 leads. Billed in USD; cards from any country.',
  },
];
