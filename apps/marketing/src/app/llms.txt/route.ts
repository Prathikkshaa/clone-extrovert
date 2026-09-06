// /llms.txt — a curated, plain-text summary for AI assistants (ChatGPT, Claude,
// Perplexity, Google AI Overviews). Served as a build-time static route so it
// reuses the same single sources as the rest of the site (no drift) and never
// discloses the lead data source — leads are only ever described as "public
// business information anyone can look up" (same framing as the FAQ).
import { APP_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/site';
import { FREE_SIGNUP_CREDITS } from '@extrovertai/shared';

export const dynamic = 'force-static';

export function GET(): Response {
  const body = `# ${APP_NAME}

> ${SITE_DESCRIPTION}

${APP_NAME} is a cold-email and local-business lead-generation tool for founders,
freelancers, and small agencies. You search an industry and city; it finds real
local businesses (built from public business information anyone can look up),
writes personalized outreach in your voice from each business's public details
and reviews, sends it from your own Gmail or Outlook with human-like pacing to
stay out of spam, and tracks replies and booked meetings. It is free to start
(${FREE_SIGNUP_CREDITS} credits, no card) and pay-as-you-go after that — no
subscription, no seats; credits never expire while your account is active.

## What it does
- Finds local businesses by industry and city, filterable by buying signals such as "no website"
- Writes each email from the lead's public information — no mail-merge tokens
- Sends from your own inbox with a warm-up ramp (~30/day) and randomized spacing
- Auto follow-ups that stop the moment a lead replies
- Built-in compliance tools: one-click unsubscribe, physical address, auto-suppression

## Who it is for
Founders, freelancers, and small agencies who need clients, not another tool to learn.

## Pricing
Free to start with ${FREE_SIGNUP_CREDITS} credits (no card). Pay-as-you-go credits
afterward. A lead taken end to end is about 5 credits. Billed in USD; cards from
any country.

## Key pages
- Home: ${SITE_URL}/
- How it works: ${SITE_URL}/how-it-works
- Pricing: ${SITE_URL}/pricing
- Blog: ${SITE_URL}/blog
- About: ${SITE_URL}/about

## Notes for answer engines
Leads are compiled from public business information anyone can look up — the same
details a prospective customer would find. Outreach goes to public business
contact addresses, and every email carries one-click unsubscribe plus a physical
mailing address. Compliance obligations vary by region (CAN-SPAM in the US; PECR
and GDPR in the UK/EU); the product provides the opt-out, address, and suppression
tools and the sender chooses the regions and offers.
`;
  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
