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
    a: 'Start free with 100 credits, no card. After that you pay only for what you use, about 5-7 credits per lead end to end (roughly $0.30-0.42 each on Growth), so $39 (650 credits) ≈ 92-130 leads. Billed in USD; cards from any country.',
  },
];

// /how-it-works FAQ: search/answer-intent questions AI answer engines ask about
// AI-driven local lead generation and personalized cold outreach. Reuses two
// FAQ_ITEMS answers verbatim (deliverability + legality) so wording stays
// consistent across pages.
export const HOW_IT_WORKS_FAQ_ITEMS: FaqItem[] = [
  {
    q: 'How does AI lead generation work with Milo?',
    a: 'You pick a market — an industry and a city — and Milo pulls real local businesses from public information anyone can look up. It then researches each one from its own website and reviews, drafts a personalized 3-email sequence in your voice, and sends the ones you approve from your own inbox. You only pay in credits when the work actually runs.',
  },
  {
    q: 'How does AI find qualified local business leads?',
    a: 'By starting from a buying signal, not a directory dump. You can filter for businesses that are missing something you can fix — like no website, thin online presence, or weak reviews — so every lead already has a reason to hear from you.',
  },
  {
    q: 'How does AI personalize cold emails without sounding generic?',
    a: 'Milo reads the lead’s own site and reviews and writes each email grounded in what that specific business actually does — no mail-merge tokens, no "Hi {{first_name}}." You review every draft before it sends, so nothing goes out that doesn’t sound like you.',
  },
  FAQ_ITEMS[0], // deliverability
  FAQ_ITEMS[1], // where do leads come from + legality
  FAQ_ITEMS[3], // review-before-send
];

// Pricing-page FAQ: the money questions people ask before buying. Numbers match
// lib/pricing-math (kept in words here; if packs change, update both).
export const PRICING_FAQ_ITEMS: FaqItem[] = [
  {
    q: 'How does Milo pricing work?',
    a: 'Pay-as-you-go, not per seat. You start free with 100 credits, then buy credits only when you need them. Credits cover the whole prospecting loop - find, research, write, send - so you pay for work done, not software you might not use.',
  },
  {
    q: 'How many leads can I get with 100 credits?',
    a: 'Around 14 to 20 leads end to end - found, researched, written and sent - which is exactly what the 100 free signup credits give you, no card required.',
  },
  {
    q: 'What is a credit, and what does it buy?',
    a: 'One simple unit of prospecting work. A full lead runs about 5 to 7 credits: find it (1), research it (2), write the 3-email sequence (1), and each email sent (1). Credits are roughly $0.06 to $0.10 each, and Growth gives the lowest price per credit of the self-serve plans.',
  },
  {
    q: 'How much does one prospect actually cost?',
    a: 'About $0.30 to $0.48 all in, depending on the plan: found, researched, written and sent. Growth is the best value at roughly $0.30 to $0.42 a prospect; Scale trades a little of that for raw volume.',
  },
  {
    q: 'Is there a monthly subscription or contract?',
    a: 'No. Pay-as-you-go credits, bought only when you need them. No subscription, no contract, no monthly minimum.',
  },
  {
    q: 'Do I pay per seat?',
    a: 'No. There are no seats and no per-user fees. You pay for prospecting (credits), so you can use Milo solo or with your team at the same price.',
  },
  {
    q: 'Do unused credits expire?',
    a: 'No. Credits never expire while your account is active, so you can buy in advance and use them at your own pace.',
  },
  {
    q: 'Can I try Milo for free?',
    a: 'Yes. You get 100 free credits on signup, no card and no auto-charge, enough for roughly 14 to 20 leads end to end before you ever pay.',
  },
  {
    q: 'Which plan should I choose?',
    a: 'Starter (free) to prove it on your first market, Growth for steady weekly prospecting and the best value per prospect, Scale for always-on high volume. Choose Custom if you need invoicing, purchase orders, or volume beyond the plans.',
  },
];
