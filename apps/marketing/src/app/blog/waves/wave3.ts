import type { BlogPost } from '../posts';

export const WAVE3_POSTS: BlogPost[] = [
  {
    slug: 'find-local-businesses-without-a-website',
    title: 'How to find local businesses with no website (2026 playbook)',
    description:
      'The operator guide to finding local businesses that still do not have a website, verifying the gap, and reaching the owner without spamming.',
    datePublished: '2026-08-01',
    dateModified: '2026-09-10',
    category: 'Local prospecting',
    cluster: 'Local prospecting',
    tags: ['local leads', 'no website', 'Google Maps', 'prospecting', 'SMB'],
    related: [
      'buying-signal-playbook-local-b2b',
      'google-maps-prospecting-not-scraping',
      'high-intent-local-leads',
    ],
    body: [
      {
        type: 'stat',
        value: 'about 1 in 5',
        label: 'US small businesses on Google Maps still have no website linked to their profile, and most do not realize it is costing them calls',
      },
      {
        type: 'p',
        text:
          'Local businesses without a website are one of the highest-intent buyer segments for web design, local SEO, and done-for-you marketing offers. The owner already gets calls, they already have reviews, and they already know they are losing the customers who search on their phone. The problem is not demand. The problem is finding them in a way that is fast, accurate, and does not get you banned from every platform you touch.',
      },
      {
        type: 'p',
        text:
          'This post covers the full workflow: where the data lives, how to verify a real gap, how to prioritize, and how to reach out. It replaces our older "how to find local business leads" guide because the mechanics are the same and the no-website case is the sharpest version of the question.',
      },
      { type: 'h2', text: 'Where the data actually lives', id: 'data' },
      {
        type: 'p',
        text:
          'Public map data is the source of truth for local business existence. If a place is open and taking customers, it is listed on the major map platforms. Every listing has a set of fields: name, category, address, phone, opening hours, rating, review count, and sometimes a website URL. The absence of a website field is the signal you want.',
      },
      {
        type: 'ul',
        items: [
          'Official directory data returns a website field per place. Empty means no website on file.',
          'Google Business Profile is the owner-facing view of the same record.',
          'Yelp, Bing Places, Apple Maps, and vertical directories (HomeAdvisor, Houzz, Avvo) mirror or extend the same directory data.',
          'Facebook and Instagram pages sometimes substitute for a real site. Whether you count those as "having a website" is a judgement call.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Scraping vs API',
        text:
          'The Google Maps front end is not a legal or reliable data source. Use the official map API. It costs money per request but the data is clean and the platform terms of service allow it. See our note on the difference in the Google Maps prospecting post below.',
      },
      { type: 'h2', text: 'The 6-step workflow', id: 'workflow' },
      {
        type: 'steps',
        items: [
          {
            title: '1. Pick one vertical and one city',
            text:
              'The narrower the better. "Roofers in Peoria IL" beats "contractors in Illinois" every time. A tight ICP means your email actually sounds like it was written for this person.',
          },
          {
            title: '2. Pull the directory result set',
            text:
              'Query the official map API (or run Milo\'s discovery) for that vertical and city. Expect 40 to 200 results per pull depending on density.',
          },
          {
            title: '3. Filter out any place with a website field',
            text:
              'This is the core filter. Keep only rows where the website field is empty or points to a Facebook, Instagram, or Linktree URL.',
          },
          {
            title: '4. Verify the gap',
            text:
              'For each kept row, do a name + city Google search. If the top result is a real domain owned by this business, remove them. About 10 to 20 percent of "no website" rows in the directory data actually do have a site the owner never added to their listing.',
          },
          {
            title: '5. Prioritize by proof of demand',
            text:
              'Rank by review count. A place with 80 reviews and no website is worth 10 times a place with 3 reviews and no website. Reviews prove they already get customers.',
          },
          {
            title: '6. Reach out by phone first, email second',
            text:
              'A place with no website often has an owner who lives on the phone. A short call gets a decision faster than any email sequence. Email is your fallback and your follow-up channel, not your opener.',
          },
        ],
      },
      { type: 'h2', text: 'Tool comparison', id: 'compare' },
      {
        type: 'table',
        caption: 'Ways to find local businesses with no website, compared.',
        headers: ['Approach', 'Freshness', 'Website filter', 'Owner contact', 'Cost shape', 'Best for'],
        rows: [
          ['Milo', 'Live directory pull', 'Native filter', 'Owner email drafted per lead', 'PAYG credits', 'Operators who want signal + outreach in one place'],
          ['Apollo / ZoomInfo', 'B2B database, weeks to months stale', 'Not reliable for SMB', 'Employee emails, often no owner', 'Seat + contact credits', 'Mid-market B2B, not local SMB'],
          ['Manual Google Maps', 'Live', 'Manual eyeball', 'Manual scrape', 'Time only', 'Small pulls, one-off research'],
          ['Apify / scrapers', 'Live but grey-area', 'Depends on scraper', 'Public phone / listing only', 'Per-run compute', 'Engineers building their own pipeline'],
        ],
      },
      {
        type: 'p',
        text:
          'Apollo and ZoomInfo are excellent for mid-market B2B, and terrible for local SMB. A 12-person roofing outfit is not in their database with the owner\'s email. The data was never collected. That is the gap Milo and manual directory work fill.',
      },
      { type: 'h2', text: 'Three worked examples', id: 'examples' },
      { type: 'h3', text: 'Roofers in Peoria, IL', id: 'peoria' },
      {
        type: 'p',
        text:
          'A directory pull for "roofing contractor" in Peoria typically returns 60 to 90 places. Roughly one third have no website field or point at a Facebook page. After verifying, expect 15 to 25 real no-website roofers. Storm-season timing (spring and late summer in the Midwest) doubles the response rate to a "we can build you a site" pitch.',
      },
      { type: 'h3', text: 'Dentists in Bristol, UK', id: 'bristol' },
      {
        type: 'p',
        text:
          'Dentists almost always have a website, so the no-website filter is not the play. Instead, filter for dentists with a website but no online booking, or a WordPress site last updated years ago. The "no modern web presence" segment is bigger than the "no website at all" segment in professional services.',
      },
      { type: 'h3', text: 'Landscapers in Austin, TX', id: 'austin' },
      {
        type: 'p',
        text:
          'Landscaping is a phone-and-truck business. In Austin you will find 40 to 60 landscapers with strong review counts and no website. Season matters: February and March are the buying window. A short pitch tied to "you already get calls, you are losing the ones who Google you at 9pm" lands here.',
      },
      { type: 'h2', text: 'Do not skip deliverability and legality', id: 'legal' },
      {
        type: 'p',
        text:
          'A perfect list still fails if your emails go to spam or if you break local marketing law. Two required reads before you send at scale:',
      },
      {
        type: 'link',
        text: 'Why cold emails go to spam and how to fix deliverability in 2026',
        href: '/blog/why-cold-emails-go-to-spam',
        label: 'Deliverability guide',
      },
      {
        type: 'link',
        text: 'Is cold email legal in 2026: US, UK, EU, Canada, Australia',
        href: '/blog/is-cold-email-legal',
        label: 'Legal guide',
      },
      {
        type: 'link',
        text: 'Buying signal playbook for local B2B',
        href: '/blog/buying-signal-playbook-local-b2b',
        label: 'Signals',
      },
      {
        type: 'link',
        text: 'Public map data, done right',
        href: '/blog/google-maps-prospecting-not-scraping',
        label: 'Method',
      },
      {
        type: 'takeaway',
        title: 'The one thing to remember',
        text: 'A no-website local business is one of the highest-intent buyers you will ever find, because they already have reviews and phone calls and they know they are losing the customers who look them up on a phone. The real work is verifying the gap (roughly 10 to 20 percent of "no website" rows have a site the owner never listed) and reaching by phone first.',
      },
      { type: 'h2', text: 'FAQ', id: 'faq' },
      {
        type: 'faq',
        items: [
          {
            q: 'Is a Facebook page a website?',
            a: 'For the purpose of a "we will build you a site" pitch, no. Owners with only a Facebook page usually respond well to the same offer. Filter Facebook and Instagram URLs into the same bucket as no-website.',
          },
          {
            q: 'How many leads should I expect per city?',
            a: 'Between 15 and 60 real no-website businesses per vertical in a mid-sized city, before you filter for quality. Denser cities have more competition and lower no-website rates.',
          },
          {
            q: 'Can I just scrape Google Maps directly?',
            a: 'You can, and Google will rate-limit or block you. The official map API is the supported path and the cost per record is low enough for prospecting.',
          },
          {
            q: 'Should I call or email first?',
            a: 'Call first for the top 10 by review count, email the rest. A no-website owner is a phone-first buyer by definition.',
          },
          {
            q: 'Does Milo do the phone step?',
            a: 'No. Milo drafts the email and sends from your inbox. Calls are on you. We think that is the right split for now.',
          },
        ],
      },
    ],
  },

  {
    slug: 'why-cold-emails-go-to-spam',
    title: 'Why cold emails go to spam (and the 2026 deliverability fix)',
    description:
      'A 2026 fix for cold emails landing in spam: SPF, DKIM, DMARC, a 30-day warm-up, and the Gmail/Yahoo bulk-sender thresholds to clear.',
    datePublished: '2026-08-12',
    dateModified: '2026-09-10',
    category: 'Deliverability',
    cluster: 'Deliverability',
    tags: ['deliverability', 'SPF', 'DKIM', 'DMARC', 'warm-up'],
    related: [
      'is-cold-email-legal',
      'find-local-businesses-without-a-website',
      'buying-signal-playbook-local-b2b',
    ],
    body: [
      {
        type: 'tldr',
        text:
          'Cold emails land in spam because of three things: authentication (SPF, DKIM, DMARC), sending reputation (warm-up + volume + complaint rate), and content (spammy patterns, bad links, no unsubscribe). Fix the first two before you touch the third. In 2026, Gmail and Yahoo enforce SPF+DKIM+DMARC, a one-click unsubscribe, and complaint rates under 0.3 percent for anyone sending more than 5,000 messages a day to their users.',
      },
      { type: 'h2', text: 'What actually decides inbox vs spam', id: 'model' },
      {
        type: 'p',
        text:
          'Inbox placement is a weighted score that Gmail, Outlook, and Yahoo compute per sender. The inputs, in rough order of weight: is the mail cryptographically signed and aligned, does the sending IP and domain have a positive history, do recipients open and reply, do recipients hit "report spam", and does the message body look like something a human wrote to another human.',
      },
      {
        type: 'ul',
        items: [
          'Authentication is a hard gate. Fail SPF + DKIM alignment and you are in spam before content is even read.',
          'Reputation is a slow gate. It builds and decays over weeks.',
          'Content is the last gate. Fix it last because fixing it first without the first two changes nothing.',
        ],
      },
      { type: 'h2', text: 'SPF, DKIM, DMARC: the how-to', id: 'auth' },
      { type: 'h3', text: 'SPF', id: 'spf' },
      {
        type: 'p',
        text:
          'SPF is a TXT record on your sending domain that lists which servers may send mail as you. Example record for a domain that sends via Google Workspace:',
      },
      {
        type: 'quote',
        text: 'v=spf1 include:_spf.google.com ~all',
        cite: 'example SPF record',
      },
      {
        type: 'p',
        text:
          'The ~all is a soft fail. Use -all (hard fail) only once you are certain every sending source is listed. Missing sources cause legitimate mail to be rejected.',
      },
      { type: 'h3', text: 'DKIM', id: 'dkim' },
      {
        type: 'p',
        text:
          'DKIM signs each outgoing message with a private key. The public key sits in a TXT record at selector._domainkey.yourdomain.com. Your email provider generates the key. For Google Workspace the selector is usually google, so the record lives at google._domainkey.yourdomain.com. Publish exactly what the provider gives you, then flip on signing in the admin console.',
      },
      { type: 'h3', text: 'DMARC', id: 'dmarc' },
      {
        type: 'p',
        text:
          'DMARC tells receivers what to do when SPF or DKIM fail, and where to send reports. A safe starting record on _dmarc.yourdomain.com:',
      },
      {
        type: 'quote',
        text: 'v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com; adkim=s; aspf=s',
        cite: 'example DMARC record (monitoring mode)',
      },
      {
        type: 'p',
        text:
          'Start at p=none for two weeks, read the aggregate reports, fix any legitimate source that fails alignment, then move to p=quarantine and eventually p=reject. Gmail and Yahoo require at least p=none for bulk senders.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Send from a subdomain, not the root',
        text:
          'Cold outreach should send from a subdomain like mail.yourdomain.com or go.yourdomain.com. That way a reputation hit on outbound never damages your transactional or root-domain mail.',
      },
      { type: 'h2', text: 'The 2024 Gmail and Yahoo rules (still in force in 2026)', id: 'rules' },
      {
        type: 'p',
        text:
          'In February 2024 Google and Yahoo published aligned bulk-sender requirements. They apply to any sender sending more than roughly 5,000 messages per day to Gmail or Yahoo users, and they are enforced by silent spam-folder placement, not by error responses.',
      },
      {
        type: 'ul',
        items: [
          'SPF and DKIM must both pass and align with the From domain.',
          'DMARC record required at minimum p=none.',
          'One-click List-Unsubscribe header (RFC 8058) required.',
          'Spam complaint rate must stay under 0.3 percent, and ideally under 0.1 percent.',
          'Bounce rate must stay under 2 percent.',
          'From address must not impersonate Gmail or Yahoo domains.',
        ],
      },
      {
        type: 'link',
        text: 'Google sender guidelines (official)',
        href: 'https://support.google.com/mail/answer/81126',
        label: 'Google docs',
      },
      {
        type: 'link',
        text: 'Yahoo sender best practices (official)',
        href: 'https://senders.yahooinc.com/best-practices/',
        label: 'Yahoo docs',
      },
      {
        type: 'link',
        text: 'Google Postmaster Tools (monitor your reputation)',
        href: 'https://postmaster.google.com/',
        label: 'Postmaster',
      },
      { type: 'h2', text: '30-day warm-up schedule', id: 'warmup' },
      {
        type: 'p',
        text:
          'A new domain or a new sending mailbox has zero reputation. Ramp slowly. Below is a conservative schedule that works for a single mailbox sending cold outreach to mixed Gmail, Outlook, and business inboxes.',
      },
      {
        type: 'table',
        caption: 'Suggested 30-day warm-up for a new cold-sending mailbox.',
        headers: ['Day', 'Sends per day', 'Notes'],
        rows: [
          ['1-3', '5', 'Warm-up network only. Send and reply to seed accounts.'],
          ['4-7', '10', 'Add 2 to 3 real prospects per day. Watch for bounces.'],
          ['8-14', '20', 'Increase warm-up traffic. Real cold at 5 to 10 per day.'],
          ['15-21', '35', 'Real cold at 15 to 20 per day. Check Postmaster Tools daily.'],
          ['22-28', '50', 'Real cold at 25 to 30 per day. Reputation should read "medium" or "high".'],
          ['29-30', '75', 'Steady state. Do not exceed 100 per mailbox per day for cold outreach.'],
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'One mailbox is a ceiling, not a strategy',
        text:
          'If you need to send 500 cold emails a day, you need 5 to 10 mailboxes across 2 to 3 domains, not one mailbox pushed to 500. Volume per mailbox is the reputation-killer.',
      },
      { type: 'h2', text: 'Decision tree: my email went to spam, now what?', id: 'decision' },
      {
        type: 'steps',
        items: [
          {
            title: '1. Check authentication',
            text:
              'Send a test to mail-tester.com or check-auth@verifier.port25.com. If SPF, DKIM, or DMARC fail, stop and fix that first. Nothing else matters.',
          },
          {
            title: '2. Check Postmaster Tools',
            text:
              'Look at domain reputation and IP reputation for the last 7 days. If either is "low" or "bad", pause sending and let it recover.',
          },
          {
            title: '3. Check complaint rate',
            text:
              'If complaint rate is above 0.3 percent, your list or your copy is the problem. Pause, tighten targeting, and rewrite the opener.',
          },
          {
            title: '4. Check volume ramp',
            text:
              'If you jumped from 20 to 200 sends per day, back off to the last volume that worked and ramp 20 percent per week.',
          },
          {
            title: '5. Check content only after 1 to 4',
            text:
              'Remove tracking pixels, remove link shorteners, keep body under 120 words, include a plain-text unsubscribe line, avoid attachments.',
          },
        ],
      },
      {
        type: 'takeaway',
        title: 'The one thing to remember',
        text: 'Inbox placement is authentication first, reputation second, content last. If SPF, DKIM, and DMARC do not pass and align, no amount of subject-line tuning will save the send. Ramp volume slowly, keep complaint rates under 0.1 percent, and send cold from a subdomain so a bad campaign never touches your transactional mail.',
      },
      {
        type: 'link',
        text: 'Is cold email legal in 2026',
        href: '/blog/is-cold-email-legal',
        label: 'Legal side',
      },
      { type: 'h2', text: 'FAQ', id: 'faq' },
      {
        type: 'faq',
        items: [
          {
            q: 'Do I need a separate domain for cold outreach?',
            a: 'Not required, but a separate subdomain is strongly recommended. It isolates reputation from your transactional and root-domain mail.',
          },
          {
            q: 'How long until a new domain is safe to send from?',
            a: 'Two to four weeks of warm-up with real conversational traffic. There is no shortcut.',
          },
          {
            q: 'Does adding an unsubscribe link hurt reply rate?',
            a: 'No measurable effect in most tests. Not having one hurts inbox placement and violates the Gmail/Yahoo rules.',
          },
          {
            q: 'Are open-tracking pixels bad for deliverability?',
            a: 'They add a tiny external image reference that some filters flag. For cold outreach the marginal signal is not worth the risk. Turn them off.',
          },
          {
            q: 'What complaint rate is safe?',
            a: 'Under 0.1 percent is safe. Between 0.1 and 0.3 percent is a warning zone. Over 0.3 percent triggers Gmail bulk-sender enforcement.',
          },
        ],
      },
    ],
  },

  {
    slug: 'is-cold-email-legal',
    title: 'Is cold email legal in 2026? US, UK, EU, Canada, Australia',
    description:
      'A jurisdiction-by-jurisdiction guide to cold email legality in 2026 covering CAN-SPAM, PECR, GDPR, CASL, and the Australia SPAM Act 2003.',
    datePublished: '2026-08-21',
    dateModified: '2026-09-10',
    category: 'Compliance',
    cluster: 'Compliance',
    tags: ['legal', 'CAN-SPAM', 'GDPR', 'CASL', 'compliance'],
    related: [
      'why-cold-emails-go-to-spam',
      'find-local-businesses-without-a-website',
      'signal-vs-database-prospecting',
    ],
    body: [
      {
        type: 'tldr',
        text:
          'Cold B2B email is legal in the US under CAN-SPAM with no prior consent required, is legal in the UK to corporate addresses under PECR with no consent but is restricted to individuals, is legal in the EU only with a lawful basis under GDPR (usually legitimate interest for B2B), requires express or implied consent in Canada under CASL, and is regulated in Australia under the SPAM Act 2003. In every jurisdiction you must identify yourself, provide a physical address, and honour opt-outs.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Not legal advice',
        text:
          'This post is a starting map, written by operators for operators. It is not legal advice. Rules change, enforcement changes, and edge cases matter. If your outreach is at scale or crosses borders, talk to a lawyer in each relevant jurisdiction.',
      },
      { type: 'h2', text: 'The five-jurisdiction comparison', id: 'compare' },
      {
        type: 'table',
        caption: 'Cold email rules by jurisdiction, 2026.',
        headers: [
          'Jurisdiction',
          'Consent needed?',
          'Opt-out required?',
          'Physical address in email?',
          'Enforcement body',
          'Max penalty',
        ],
        rows: [
          [
            'US (CAN-SPAM)',
            'No prior consent needed',
            'Yes, honour within 10 business days',
            'Yes, valid postal address',
            'FTC',
            'Up to USD 51,744 per email',
          ],
          [
            'UK (PECR + UK GDPR)',
            'No for corporate subscribers, yes (or soft opt-in) for individuals',
            'Yes',
            'Yes, identity + how to contact',
            'ICO',
            'Up to GBP 17.5m or 4% of global turnover',
          ],
          [
            'EU (GDPR + ePrivacy)',
            'Lawful basis required (legitimate interest for B2B is common)',
            'Yes',
            'Yes, controller identity + contact',
            'National DPAs, EDPB coordinates',
            'Up to EUR 20m or 4% of global turnover',
          ],
          [
            'Canada (CASL)',
            'Express or implied consent required',
            'Yes, functional within 10 business days',
            'Yes, sender identification + address',
            'CRTC',
            'Up to CAD 10m per violation (org)',
          ],
          [
            'Australia (SPAM Act 2003)',
            'Consent required (express or inferred)',
            'Yes, functional and free',
            'Yes, accurate sender info',
            'ACMA',
            'Up to AUD 2.22m per day for repeat offenders',
          ],
        ],
      },
      { type: 'h2', text: 'United States: CAN-SPAM', id: 'us' },
      {
        type: 'p',
        text:
          'CAN-SPAM (15 USC 7701 et seq., implementing rule 16 CFR Part 316) does not require prior consent for commercial email. It does require truthful headers, a non-deceptive subject line, clear identification as an ad if applicable, a valid physical postal address, and a working opt-out that you honour within 10 business days. Every recipient is counted separately for penalties.',
      },
      {
        type: 'link',
        text: 'FTC CAN-SPAM compliance guide (primary source)',
        href: 'https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business',
        label: 'FTC',
      },
      { type: 'h2', text: 'United Kingdom: PECR + UK GDPR', id: 'uk' },
      {
        type: 'p',
        text:
          'The Privacy and Electronic Communications Regulations (PECR) treat B2B corporate subscribers differently from individuals. You can email a role address at a company (info@, sales@, or a named employee at a corporate domain) without prior consent, provided you identify yourself and offer opt-out. Sole traders and non-limited partnerships in England, Wales, and Northern Ireland are treated as individuals and generally need consent or the soft opt-in. UK GDPR still applies to any personal data you process.',
      },
      {
        type: 'link',
        text: 'ICO direct marketing guidance (primary source)',
        href: 'https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/',
        label: 'ICO',
      },
      { type: 'h2', text: 'European Union: GDPR + ePrivacy', id: 'eu' },
      {
        type: 'p',
        text:
          'GDPR requires a lawful basis for processing personal data. For B2B cold outreach the usual basis is legitimate interest (Article 6(1)(f)), which requires a documented three-part balancing test: purpose, necessity, and the recipient\'s rights. National ePrivacy rules layer on top and vary. Germany, for example, is stricter than Ireland. If you send at scale into the EU, run a per-country analysis rather than a single EU-wide policy.',
      },
      {
        type: 'link',
        text: 'EDPB (European Data Protection Board)',
        href: 'https://www.edpb.europa.eu/edpb_en',
        label: 'EDPB',
      },
      { type: 'h2', text: 'Canada: CASL', id: 'canada' },
      {
        type: 'p',
        text:
          'Canada\'s Anti-Spam Legislation is one of the strictest regimes. Any commercial electronic message to a Canadian recipient needs express consent, or a defined implied consent (existing business relationship, published business address without a "no unsolicited email" notice, and other narrow cases). Every message needs sender identification, a physical address, and a functional unsubscribe. Enforcement by the CRTC is active.',
      },
      {
        type: 'link',
        text: 'CRTC CASL requirements (primary source)',
        href: 'https://crtc.gc.ca/eng/internet/anti.htm',
        label: 'CRTC',
      },
      { type: 'h2', text: 'Australia: SPAM Act 2003', id: 'au' },
      {
        type: 'p',
        text:
          'The SPAM Act 2003 requires consent (express or inferred from an existing relationship), clear sender identification, and a functional, free, working-for-30-days unsubscribe. The regulator is ACMA and fines have been substantial for repeat corporate offenders.',
      },
      {
        type: 'link',
        text: 'ACMA spam rules (primary source)',
        href: 'https://www.acma.gov.au/rules-sending-marketing-emails-and-messages',
        label: 'ACMA',
      },
      { type: 'h2', text: 'A safe baseline that works everywhere', id: 'baseline' },
      {
        type: 'p',
        text:
          'If you want one policy that covers most B2B outreach across these five jurisdictions without a lawyer on every send, adopt this baseline. It is stricter than CAN-SPAM and looser than CASL, and it will keep you inside the guardrails for the majority of B2B cases.',
      },
      {
        type: 'ul',
        items: [
          'Only email business addresses at businesses (no personal Gmail, Yahoo, iCloud).',
          'Only email people whose role plausibly cares about your offer (documented legitimate interest).',
          'Identify yourself, your company, and your postal address in every message.',
          'Include a plain-text unsubscribe line and a one-click List-Unsubscribe header.',
          'Honour opt-outs immediately and permanently. Store the suppression list forever.',
          'Do not email known Canadian recipients without express or valid implied consent.',
          'Keep a record of why you contacted each recipient (source, date, reasoning).',
        ],
      },
      {
        type: 'link',
        text: 'Deliverability guide: why cold emails go to spam',
        href: '/blog/why-cold-emails-go-to-spam',
        label: 'Deliverability',
      },
      {
        type: 'takeaway',
        title: 'The one thing to remember',
        text: 'Cold B2B email is legal across every major English-speaking jurisdiction when you identify yourself honestly, publish a real postal address, honour opt-outs immediately, and can point to why you contacted each recipient. The variance across borders is in consent thresholds and enforcement appetite, not the fundamentals.',
      },
      { type: 'h2', text: 'FAQ', id: 'faq' },
      {
        type: 'faq',
        items: [
          {
            q: 'Is cold email legal in the US?',
            a: 'Yes, under CAN-SPAM, without prior consent, provided you follow the header, address, and opt-out rules.',
          },
          {
            q: 'Do I need consent to email a business in the EU?',
            a: 'You need a lawful basis under GDPR. For B2B outreach that is usually legitimate interest, documented with a three-part balancing test. Some member states add stricter ePrivacy rules on top.',
          },
          {
            q: 'Can I email Canadian prospects at all?',
            a: 'Yes, but only with express consent or a defined implied consent (existing business relationship or a publicly listed business address with no "no unsolicited email" notice).',
          },
          {
            q: 'What must every cold email include?',
            a: 'Your real identity, your company name, a valid physical address, and a working way to opt out. In practice, put a footer that covers all four every time.',
          },
          {
            q: 'Does Milo handle compliance for me?',
            a: 'Milo adds an unsubscribe footer, honours opt-outs across your sends, and lets you exclude jurisdictions from a campaign. It does not decide legitimate interest for you and it is not a substitute for legal review at scale.',
          },
        ],
      },
    ],
  },

  {
    slug: 'manual-vs-automated-prospecting',
    title: 'Manual vs automated prospecting: where to draw the line',
    description:
      'Which parts of B2B prospecting should always be automated, which parts should never be automated, and the hybrid workflow founders actually run.',
    datePublished: '2026-06-12',
    category: 'Prospecting',
    cluster: 'Prospecting',
    tags: ['prospecting', 'automation', 'founder-led sales', 'workflow'],
    related: [
      'buying-signal-playbook-local-b2b',
      'find-local-businesses-without-a-website',
      'signal-vs-database-prospecting',
    ],
    body: [
      {
        type: 'tldr',
        text:
          'Automate discovery, enrichment, first-touch drafting, sending, and routing. Never automate the choice of who to target, the read of a buying signal, the reply to a warm response, or the final decision to send. Founder-led sales works best as a hybrid: machines do the sixty percent that is mechanical, you do the forty percent that is judgement.',
      },
      { type: 'h2', text: 'Why "all manual" and "all automated" both lose', id: 'framing' },
      {
        type: 'p',
        text:
          'The all-manual founder gets 40 great emails out per week and stalls. The all-automated founder gets 4,000 emails out per week, burns their domain, and never learns what the market actually wants. The interesting question is not automated vs manual. It is which step of the workflow belongs to which side.',
      },
      { type: 'h2', text: 'The split', id: 'split' },
      {
        type: 'table',
        caption: 'Which prospecting steps to automate, and which to keep by hand.',
        headers: ['Step', 'Automate?', 'Why'],
        rows: [
          ['Pick the ICP and the vertical', 'Never', 'This is strategy. A wrong ICP scales wrong faster with automation.'],
          ['Pull candidate accounts (public directories)', 'Always', 'Mechanical, high-volume, no judgement.'],
          ['Enrich each account (website, size, tech, hiring)', 'Always', 'Same input to same output. A machine wins.'],
          ['Read the buying signal', 'Partially', 'A model can rank. A human should sanity-check the top slice.'],
          ['Draft the first-touch email', 'Always with human template', 'Model writes from your voice template. You approve the batch.'],
          ['Send + follow up 1 and 2', 'Always', 'Cadence and timing are mechanical.'],
          ['Reply to a real reply', 'Never', 'Founder replies. Every time. This is where the deal is won or lost.'],
          ['Book the call', 'Always', 'Cal.com or similar. Zero human value in the back-and-forth.'],
          ['Qualify on the call', 'Never', 'Founder. Always.'],
          ['Update the record after the call', 'Automate the capture, human writes the read', 'Transcript is automation, next-step judgement is you.'],
        ],
      },
      { type: 'h2', text: 'The hybrid workflow', id: 'workflow' },
      {
        type: 'steps',
        items: [
          {
            title: '1. Decide the ICP by hand, weekly',
            text:
              'Twenty minutes on Monday. Pick 1 to 3 vertical + geo combinations for the week. Write down why. This is the only strategy step.',
          },
          {
            title: '2. Let the machine pull and enrich',
            text:
              'Fire the discovery pull. Let enrichment run. Do not touch it. Come back to a scored list.',
          },
          {
            title: '3. Human eyeball the top 20',
            text:
              'Read the top 20 by score. Kill the obviously wrong ones. Approve the rest as a batch. Five minutes.',
          },
          {
            title: '4. Machine drafts, human approves',
            text:
              'The model drafts a first-touch email per lead using your voice template and the enrichment. You skim the batch, edit two or three, approve.',
          },
          {
            title: '5. Machine sends and follows up',
            text:
              'Sending, throttling, follow-up 1 (day 3) and follow-up 2 (day 7) run without you.',
          },
          {
            title: '6. Human owns every reply',
            text:
              'The moment a real human replies, the machine steps out. You write the next message. This is the rule.',
          },
          {
            title: '7. Machine books, human runs the call',
            text:
              'Cal.com or similar handles scheduling. You run the call. You update the account with the next step.',
          },
        ],
      },
      { type: 'h2', text: 'The three things you must never automate', id: 'never' },
      { type: 'h3', text: 'Who you target', id: 'target' },
      {
        type: 'p',
        text:
          'Every meaningful improvement in outbound comes from a sharper ICP, not a smarter sequence. A model cannot make that call for you. It does not know that a specific vertical is hiring, or that a specific city just changed a zoning rule, or that a competitor just raised. Founders live in that layer. Stay in it.',
      },
      { type: 'h3', text: 'The reply to a real reply', id: 'reply' },
      {
        type: 'p',
        text:
          'The first email is a template. The reply is a conversation. Auto-replies to warm replies are the fastest way to lose a deal. Read every reply. Answer every reply. It is a small volume compared to sends and it is where revenue lives.',
      },
      { type: 'h3', text: 'The final send decision', id: 'send' },
      {
        type: 'p',
        text:
          'A batch approval before send catches ninety percent of the "wait, that is our biggest customer already" and "wait, that phrasing is wrong" errors. Keep the approval step, even if it is fast.',
      },
      {
        type: 'takeaway',
        title: 'The one thing to remember',
        text: 'Founder-led sales works as a hybrid, not a purity test. Machines do the sixty percent that is mechanical: discovery, enrichment, drafting, sending, follow-ups, and booking. Founders do the forty percent that is judgement: who to target, every real reply, and the final approval before a batch ships. Skip either half and the loop breaks.',
      },
      {
        type: 'link',
        text: 'Buying signal playbook for local B2B',
        href: '/blog/buying-signal-playbook-local-b2b',
        label: 'Signals',
      },
      {
        type: 'link',
        text: 'Find local businesses with no website',
        href: '/blog/find-local-businesses-without-a-website',
        label: 'Local prospecting',
      },
      {
        type: 'link',
        text: 'Signal vs database prospecting',
        href: '/blog/signal-vs-database-prospecting',
        label: 'Method',
      },
      { type: 'h2', text: 'FAQ', id: 'faq' },
      {
        type: 'faq',
        items: [
          {
            q: 'How many hours a week does the hybrid workflow really take?',
            a: 'For a founder running 50 to 100 sends per day: 20 minutes on Monday for ICP, 30 minutes a day on approval + replies, and time on calls. Roughly 5 to 8 hours a week outside of the calls themselves.',
          },
          {
            q: 'Can I skip the approval step once I trust the drafts?',
            a: 'You can, and you should not. The cost of the step is small and it is the last safety net between your reputation and a batch of bad sends.',
          },
          {
            q: 'What if I get too many replies to handle myself?',
            a: 'That is a good problem. Route replies to a shared inbox and handle them yourself until you have enough volume for a real SDR. Do not delegate reply-writing to a model.',
          },
          {
            q: 'Is fully automated prospecting ever the right answer?',
            a: 'Rarely, and only for very short, very transactional offers where the reply is a yes or no. For anything consultative, the hybrid wins on revenue per send.',
          },
          {
            q: 'Does Milo support this exact split?',
            a: 'Yes. That split is how Milo is designed. Discovery, enrichment, drafting, sending, and booking are automated. Reply routing hands the thread to you.',
          },
        ],
      },
    ],
  },
];
