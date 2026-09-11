import type { BlogPost } from '../posts';

export const WAVE2_POSTS: BlogPost[] = [
  {
    slug: 'buying-signal-examples',
    title: 'Buying signal examples: 15 you can act on this week',
    description:
      'Fifteen concrete buying signals for local, digital, and organizational prospecting. How to spot each one, why it matters, and how to open the email.',
    category: 'Buying signals',
    cluster: 'Buying signals',
    tags: ['buying signals', 'prospecting', 'cold email', 'local b2b', 'sales'],
    related: [
      'buying-signal-playbook-local-b2b',
      'signal-vs-database-prospecting',
      'find-local-businesses-without-a-website',
    ],
    datePublished: '2026-08-04',
    readMinutes: 8,
    body: [
      { type: 'tldr', text: 'A buying signal is a public fact about a business that changes the odds a cold email lands. Below are 15 real signals, split across local, digital, and organizational categories, each with a way to spot it and a first line that references it.' },
      { type: 'p', text: 'Most cold outreach fails because it opens with the seller, not the prospect. A signal flips that. If the first sentence proves you looked at the business, the rest of the email gets read. The signals below are ones you can verify from public data in minutes, not guesses.' },
      { type: 'link', text: 'For the underlying method, read the buying signal playbook for local B2B.', href: '/blog/buying-signal-playbook-local-b2b', label: 'Buying signal playbook' },

      { type: 'h2', text: 'Local signals', id: 'local' },

      { type: 'h3', text: '1. No website on Google Business Profile', id: 'no-website' },
      { type: 'p', text: 'A business ranks on Maps but the profile has no website link, or the link points to a Facebook page. This is the highest-intent local signal for web designers and agencies. Spot it by scanning Places results for the missing website field.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'Saw you rank #3 for plumbers in Coimbatore but the Maps profile links to Facebook. Losing calls to competitors who show a site.' },

      { type: 'h3', text: '2. Thin Google Business Profile', id: 'thin-gbp' },
      { type: 'p', text: 'Fewer than five photos, no service list, no hours, or a generic category. The business is technically listed but effectively invisible for anything beyond a direct name search. Any local SEO or marketing service can point to specifics.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'Your GBP has three photos and no service list. The two roofers ranking above you have 40+ photos each.' },

      { type: 'h3', text: '3. Weak or falling review count', id: 'weak-reviews' },
      { type: 'p', text: 'Under 20 reviews in a market where competitors have 100+, or a long gap since the last review. Signals a broken review-request habit, not a bad business. Reputation tools, review services, or a full local SEO offer all fit.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'Last review was 11 months ago. Two competitors added 40+ in that window.' },

      { type: 'h3', text: '4. Recent one-star cluster', id: 'one-star' },
      { type: 'p', text: 'Three or more one-star reviews in the last 60 days, unanswered. This is urgent for the owner and a real opening for reputation, review-response, or ops-fix consultants. Do not weaponize the reviews themselves. Reference the gap in response, not the content.' },
      { type: 'callout', tone: 'warn', title: 'Opener', text: 'You have four new reviews from the last two months with no owner reply. Prospects reading them see silence.' },

      { type: 'h3', text: '5. Google Ads running with no landing page', id: 'ads-no-lp' },
      { type: 'p', text: 'A business shows up in the sponsored slot but the ad points to the homepage or a Facebook page. Money is being spent on traffic that has nowhere to convert. Landing page designers, CRO consultants, and paid-search managers all have a lane here.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'Your Google ad for emergency plumbing sends clicks to the homepage. That is a 3 to 5x conversion loss on paid traffic.' },

      { type: 'h2', text: 'Digital signals', id: 'digital' },

      { type: 'h3', text: '6. Broken or expired SSL', id: 'ssl' },
      { type: 'p', text: 'Chrome shows "Not Secure" in the address bar. Every visitor sees it. Trivial for a technical partner to fix, catastrophic for conversion. Spot it with a quick HTTPS check across a prospect list.' },
      { type: 'callout', tone: 'warn', title: 'Opener', text: 'Your site is flagged "Not Secure" in Chrome. Any lead form on the page is dead on arrival.' },

      { type: 'h3', text: '7. Slow site (poor Core Web Vitals)', id: 'cwv' },
      { type: 'p', text: 'Largest Contentful Paint over 2.5 seconds, Interaction to Next Paint over 200 ms, or Cumulative Layout Shift over 0.1. Google publishes the thresholds and a public test.' },
      { type: 'link', text: 'Core Web Vitals thresholds (web.dev)', href: 'https://web.dev/articles/vitals', label: 'Core Web Vitals reference' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'Your LCP on the services page is 5.8s on 4G. Two competitors load in under 2s.' },

      { type: 'h3', text: '8. Missing schema markup', id: 'schema' },
      { type: 'p', text: 'No LocalBusiness, Product, or Review schema in the page source. Search engines are guessing at what the site is. Any local SEO offer with a technical bent can lead with this.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'No LocalBusiness schema on your site. Google is inferring your service area from address text alone.' },

      { type: 'h3', text: '9. Missing or duplicate title tags', id: 'titles' },
      { type: 'p', text: 'Homepage title is "Home" or matches every other page. Ten minutes of work, weeks of ranking impact.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'Every page on your site has the same title tag. That is why nothing except the homepage ranks.' },

      { type: 'h3', text: '10. Site not mobile responsive', id: 'mobile' },
      { type: 'p', text: 'Text overflow, tap targets under 40px, forced horizontal scroll on a 375px viewport. Sixty percent-plus of local traffic is mobile. Easy to demo with a screenshot.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'Your booking form on mobile requires horizontal scroll to see the submit button.' },

      { type: 'h2', text: 'Organizational signals', id: 'org' },

      { type: 'h3', text: '11. Hiring for a specific role', id: 'hiring' },
      { type: 'p', text: 'A live job post for a "Head of Growth," "Marketing Manager," or "SDR" tells you the function is a current priority and there is budget. Reference the role by title, not a scraped copy of the JD.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'Saw you are hiring a Head of Growth. The role you posted is the exact person who would own what we do.' },

      { type: 'h3', text: '12. Recent funding round', id: 'funding' },
      { type: 'p', text: 'Seed or Series A in the last 90 days. Not a magic wand, but it changes the risk tolerance for new vendors. Publicly announced rounds only.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'Congrats on the seed round in June. Most teams at that stage over-hire before fixing the top of funnel.' },

      { type: 'h3', text: '13. Expansion to a new city', id: 'expansion' },
      { type: 'p', text: 'A press release, LinkedIn post, or new GBP location in a second city. Local demand generation in the new market is an immediate, concrete need.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'You opened the Pune branch in August. Your Bangalore branch took two years to hit review parity with local competitors. Want to skip that curve.' },

      { type: 'h3', text: '14. New leadership hire', id: 'leadership' },
      { type: 'p', text: 'A CMO, VP Sales, or Head of Marketing joins in the last 60 days. New hires re-evaluate the stack in their first 90 days. LinkedIn "started a new position" is the source.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'Congrats on the CMO role. First 90 days is usually when the outbound stack gets audited.' },

      { type: 'h3', text: '15. Public tender or RFP posted', id: 'rfp' },
      { type: 'p', text: 'For government-adjacent verticals, a live tender tells you exactly what they are buying and by when. Search the state e-procurement portals.' },
      { type: 'callout', tone: 'success', title: 'Opener', text: 'Saw your tender for facilities management services closes on the 22nd. We are not bidding but the scope suggests a bigger gap in your intake process.' },

      { type: 'h2', text: 'How to work these signals', id: 'work' },
      { type: 'p', text: 'Pick two signals that map to what you sell. Build a list of 50 to 100 businesses that match. Reference the signal in the first line of every email. Ninety percent of cold outreach fails at that first line, not the offer.' },
      { type: 'link', text: 'Signal vs database prospecting: why the list matters more than the copy.', href: '/blog/signal-vs-database-prospecting', label: 'Signal vs database' },
      { type: 'link', text: 'Milo runs Places discovery, site crawls, and enrichment to surface these signals automatically.', href: '/', label: 'How Milo works' },

      { type: 'faq', items: [
        { q: 'How many signals should one email reference?', a: 'One. Two if they compound naturally (thin GBP + weak reviews). More than that reads as a background check, not an offer.' },
        { q: 'Are these signals legal to use?', a: 'Everything above is public data. Public data plus a clear opt-out and honest identification is compliant outreach in most jurisdictions. See our post on cold email legality for detail.' },
        { q: 'What if the signal is stale?', a: 'Set a freshness window. A funding round is fresh for 90 days. A slow site is fresh until fixed. A hiring role is fresh while the JD is live.' },
        { q: 'Do these work for enterprise?', a: 'Organizational signals do. Local and digital signals are stronger for SMB and mid-market.' },
        { q: 'Can I automate all of this?', a: 'Discovery and enrichment, yes. Writing the first line, mostly. Deciding whether the signal is real and worth referencing, still human at the top of the funnel.' },
      ]},
    ],
  },

  {
    slug: 'get-web-design-clients-no-ads',
    title: 'How to get web design clients without ads',
    description:
      'A playbook for freelance and agency web designers rooted in real website signals. Open with a fixable problem on their site, not a generic pitch.',
    category: 'Verticals',
    cluster: 'Verticals',
    tags: ['web design', 'freelancing', 'client acquisition', 'cold email', 'agencies'],
    related: [
      'buying-signal-playbook-local-b2b',
      'find-local-businesses-without-a-website',
      'why-cold-emails-go-to-spam',
    ],
    datePublished: '2026-08-07',
    readMinutes: 7,
    body: [
      { type: 'quote', text: 'The best web design pitch I ever wrote was three sentences long and started with the words "your homepage loads in 6.4 seconds." It closed a $9,000 project the same week.', cite: 'A freelancer we know, on why paid ads were never the answer' },

      { type: 'h2', text: 'Why ads do not work for most web designers', id: 'ads' },
      { type: 'p', text: 'Search ads for "web designer" cost $8 to $30 per click in most markets. Even at a 5% landing page conversion and a 20% close rate, you are paying $800 to $3000 to acquire one client. That math kills freelancers and most small agencies. The businesses that need you the most are also not searching Google for "web designer." They are running a business that is quietly losing traffic because their site is broken.' },

      { type: 'h2', text: 'What is a buying signal for a web designer?', id: 'signals' },
      { type: 'p', text: 'A buying signal is a public, verifiable fact that says "this business would benefit from what you sell, right now." For web design, the strongest signals are visible in five minutes with public tools.' },

      { type: 'table', headers: ['Signal', 'How to spot it', 'Why it matters'], rows: [
        ['No website on GBP', 'Public directory listing has no website link', 'They already rank locally; a site converts calls'],
        ['Broken SSL', 'Chrome shows "Not Secure"', 'Every visitor sees a trust warning'],
        ['Slow LCP', 'PageSpeed Insights over 2.5s', 'Google downranks and users bounce'],
        ['No mobile responsiveness', '375px viewport breaks layout', '60%+ of traffic is mobile'],
        ['Facebook page as website', 'GBP or ad links to a FB page', 'They have accepted no site as normal'],
        ['Duplicate title tags', 'Homepage title = "Home"', 'Site cannot rank for anything specific'],
        ['Outdated design (pre-2015)', 'Visual inspection', 'Signals distrust to modern buyers'],
      ]},

      { type: 'h2', text: 'How to build the list', id: 'list' },
      { type: 'steps', items: [
        { title: 'Pick one vertical and one city', text: 'Roofers in Austin. Dentists in Coimbatore. Pilates studios in Melbourne. Narrower is better because your first-line references will be sharper.' },
        { title: 'Pull the top 100 from the public directory', text: 'Manually or with a tool that queries an official business-directory API. You want name, address, phone, category, review count, and website URL.' },
        { title: 'Enrich with a real site check', text: 'For each URL, capture SSL status, LCP, title tag, mobile viewport behavior, and whether a booking form exists.' },
        { title: 'Score and cut', text: 'Keep only businesses with at least one clear, fixable signal. This usually leaves 30 to 60 of the original 100.' },
        { title: 'Find the owner email', text: 'GBP owner-attributed pages, WHOIS on the domain, or LinkedIn. Not scraped generic inboxes.' },
      ]},

      { type: 'h2', text: 'The email template (one signal, one ask)', id: 'template' },
      { type: 'quote', text: 'Subject: quick note on the [service] page\n\nHi [First name],\n\nYour site loads in 5.8 seconds on 4G. The two roofers ranking above you on Maps load in under 2. Google treats that as a ranking signal and users bounce before the page paints.\n\nI redesigned the site for [reference client in same vertical] last quarter and got their LCP to 1.4s. Happy to send a two-minute video showing exactly which three things on your site are causing it, no pitch attached.\n\nWorth 15 minutes next week?\n\n[Your name]', cite: 'Signal-referenced cold email for a web designer' },
      { type: 'callout', tone: 'info', title: 'Why this works', text: 'The first sentence proves you looked. The second sentence quantifies the loss. The third offers value before asking for time. No em dashes, no fluff.' },

      { type: 'h2', text: 'What about replies?', id: 'replies' },
      { type: 'p', text: 'You will get three kinds of replies. "Not interested" (archive, do not argue). "How much" (send a range, ask a diagnostic question, do not quote a fixed number by email). "Tell me more" (this is the meeting, book it inside the reply thread, not after five more messages).' },
      { type: 'link', text: 'If you are hitting spam, read our note on why cold emails go to spam.', href: '/blog/why-cold-emails-go-to-spam', label: 'Cold email deliverability' },

      { type: 'h2', text: 'Scaling without becoming spam', id: 'scale' },
      { type: 'p', text: 'A tight list of 40 businesses per week is more productive than a database blast to 4000. You are trading volume for reply rate. Realistic targets: 8 to 15% reply rate, 20 to 30% of replies convert to a call, 15 to 25% of calls convert to a paid project. On a list of 40 that is one to two projects per week.' },
      { type: 'takeaway', title: 'The one thing to remember', text: 'Web design clients are not searching Google for a web designer. They are running a business that is quietly losing traffic because their site is broken. If the first sentence of your email quantifies a specific defect on their own site, the rest of the offer barely needs to argue.' },

      { type: 'faq', items: [
        { q: 'How long until this produces clients?', a: 'Two to four weeks from first send if the vertical is narrow and the signal is strong. Longer if you spray across five verticals.' },
        { q: 'Do I need a portfolio in the same vertical?', a: 'Helpful but not required. A generic portfolio plus a specific, well-referenced signal outperforms a niche portfolio with a generic email.' },
        { q: 'Should I attach the redesign mockup in the first email?', a: 'No. Offer to send a two-minute video after they reply. Attachments reduce inbox delivery and let them skip the conversation.' },
        { q: 'Is this compliant with CAN-SPAM and GDPR?', a: 'B2B outreach with a clear opt-out and honest identification is compliant in most jurisdictions. See our post on cold email legality.' },
        { q: 'Can I use ChatGPT to write these?', a: 'You can, but the first line has to reference a real signal you verified. Fully generated emails from a scraped list get filtered.' },
      ]},
    ],
  },

  {
    slug: 'get-seo-clients-2026',
    title: 'How to get SEO clients in 2026',
    description:
      'SEO client acquisition rebuilt around real technical defects. Find sites with fixable CWV, schema, and content gaps, then open with the audit itself.',
    category: 'Verticals',
    cluster: 'Verticals',
    tags: ['seo', 'agency growth', 'cold email', 'lead generation', 'client acquisition'],
    related: [
      'buying-signal-playbook-local-b2b',
      'high-intent-local-leads',
      'google-maps-prospecting-not-scraping',
    ],
    datePublished: '2026-08-11',
    readMinutes: 7,
    body: [
      { type: 'tldr', text: 'In 2026, SEO buyers are skeptical and audit-fatigued. What still works is finding sites with specific, quantifiable SEO defects and leading the email with the defect, not the offer. This is the operator playbook.' },

      { type: 'h2', text: 'Why "we do SEO" no longer sells', id: 'why' },
      { type: 'p', text: 'Every business owner has been pitched by 40 SEO agencies. The offer is generic. The audit is templated. Half the time the "free audit" is a PDF full of red bars from a crawl tool with no interpretation. Buyers filter this out reflexively. What breaks through is a first sentence that quantifies a specific problem the owner did not know they had.' },

      { type: 'h2', text: 'What is a real SEO buying signal?', id: 'signals' },

      { type: 'table', headers: ['Signal', 'How to verify', 'Fix category'], rows: [
        ['LCP over 2.5s', 'PageSpeed Insights on top 3 pages', 'Core Web Vitals'],
        ['INP over 200ms', 'PageSpeed Insights, field data', 'Core Web Vitals'],
        ['No LocalBusiness schema', 'View source, search for schema.org', 'Technical SEO'],
        ['Missing or duplicate title tags', 'View source across 10 pages', 'On-page SEO'],
        ['Thin content on money pages', 'Under 300 words on service pages', 'Content'],
        ['No H1 or multiple H1s', 'View source', 'On-page SEO'],
        ['Weak backlink profile', 'Free tool: Ahrefs backlink checker', 'Off-page SEO'],
        ['Not indexed pages', 'site:domain.com search', 'Technical SEO'],
      ]},

      { type: 'link', text: 'Core Web Vitals thresholds are published by Google on web.dev.', href: 'https://web.dev/articles/vitals', label: 'CWV reference' },

      { type: 'h2', text: 'How to build a signal-first SEO prospect list', id: 'list' },
      { type: 'steps', items: [
        { title: 'Choose a vertical with clear service pages', text: 'HVAC, roofing, dental, cosmetic clinics, law firms. Verticals where "service in city" queries drive real revenue.' },
        { title: 'Pull 200 businesses from Places or a local directory', text: 'You want ones that already rank on Maps but underperform in organic results.' },
        { title: 'Crawl the homepage and top service page', text: 'Capture LCP, INP, schema presence, title tag uniqueness, H1 count, and page word count.' },
        { title: 'Score', text: 'Any two of the eight signals is enough. Three or more is a hot prospect.' },
        { title: 'Enrich with an owner or marketing contact', text: 'LinkedIn is the cleanest source. Do not send to a generic info@ inbox.' },
      ]},

      { type: 'h2', text: 'The SEO cold email that works', id: 'template' },
      { type: 'quote', text: 'Subject: quick SEO note on [service] page\n\nHi [First name],\n\nYour [city] [service] page loads in 4.2s on mobile and has no LocalBusiness schema. Two of your top competitors have both, which is why they rank ahead of you for "[keyword]."\n\nThis is a two-week technical fix, not a six-month engagement. If you want, I can send a two-minute Loom walking through the exact three changes.\n\nWorth 15 minutes?\n\n[Your name]', cite: 'Signal-referenced cold email for an SEO consultant' },

      { type: 'callout', tone: 'info', title: 'What this email does not do', text: 'It does not promise page one. It does not attach a 40-slide audit. It does not use the word "leverage." It gives one specific defect, one specific competitor comparison, and one small ask.' },

      { type: 'h2', text: 'Positioning the offer', id: 'offer' },
      { type: 'p', text: 'Lead with a small, fixed-scope engagement. A technical SEO audit and implementation of the top five fixes. Two to three weeks. Fixed price. This gets you in the door without asking for a retainer decision on the first call. Retainer conversion after a successful fixed-scope project is high because you have proven you can deliver.' },
      { type: 'link', text: 'See the general playbook: buying signals for local B2B.', href: '/blog/buying-signal-playbook-local-b2b', label: 'Buying signal playbook' },

      { type: 'h2', text: 'What to skip in 2026', id: 'skip' },
      { type: 'ul', items: [
        'Free audit PDFs generated by a crawler with no human interpretation.',
        'Promises of "page one in 90 days." Buyers stopped believing this in 2019.',
        'AI-generated 40-page audits. The signal-to-noise ratio is what buyers filter on.',
        'Cold LinkedIn DMs with a Calendly link and no context.',
      ]},

      { type: 'faq', items: [
        { q: 'How do I compete with agencies charging $500 a month?', a: 'You do not. Signal-first outreach lets you sell fixed-scope projects at $2k to $8k. Different segment.' },
        { q: 'Is technical SEO still the best wedge?', a: 'For 2026, yes. Content and link building are harder to prove in the first 30 days. A Core Web Vitals fix shows up in Search Console in a week.' },
        { q: 'How do I know a prospect ranks below competitors?', a: 'Search the target keyword in an incognito window from the prospect city. Note positions.' },
        { q: 'What is the reply rate on this kind of outreach?', a: 'Realistic range is 8 to 12% when the signal is specific and the list is under 50. Sub-2% when the signal is generic.' },
        { q: 'Do I need to be technical to send these?', a: 'You need to be able to read a PageSpeed report and view page source. That is the floor.' },
        { q: 'Can I automate the signal detection?', a: 'Most of it. Milo runs the site crawl and enrichment step and drafts the referencing first line. You still approve the send.' },
      ]},

      { type: 'link', text: 'How Milo helps SEO agencies find and enrich the right prospects.', href: '/', label: 'See Milo' },
    ],
  },

  {
    slug: 'roofing-leads-no-ads',
    title: 'How to get roofing leads without paid ads',
    description:
      'Roofing-specific buying signals (storm damage, permits, reviews, no website) and a seasonal playbook for contractors who want off Google Local Services.',
    category: 'Verticals',
    cluster: 'Verticals',
    tags: ['roofing', 'contractors', 'lead generation', 'local marketing', 'cold outreach'],
    related: [
      'find-local-businesses-without-a-website',
      'high-intent-local-leads',
      'buying-signal-playbook-local-b2b',
    ],
    datePublished: '2026-08-14',
    readMinutes: 7,
    body: [
      { type: 'p', text: 'It is 6am on a Tuesday in April. A hail line ran through three zip codes overnight, the county permit portal will start updating by lunch, and forty roofers in the metro are about to spend the day fighting each other for the same Google Local Services impressions at $180 a click. The one who wins April is not the highest bidder. It is the one who knows the storm ran through, who is watching the permit portal, and who sends the first letter before the aggregator lead even lists.' },

      { type: 'h2', text: 'Why roofers overpay for leads', id: 'overpay' },
      { type: 'p', text: 'Lead-gen aggregators sell the same lead to three or four roofers. By the time you call, the homeowner has taken two other quotes. You compete on price. A signal-led approach reverses this. You reach the homeowner or facility manager before they have started shopping, based on a public fact that says they will need a roofer soon.' },

      { type: 'h2', text: 'What is a roofing buying signal?', id: 'signals' },

      { type: 'table', headers: ['Signal', 'Source', 'Window'], rows: [
        ['Recent hail or wind event', 'NOAA storm reports by zip', '0 to 30 days'],
        ['Building permit for reroof filed', 'City or county permit portal', '0 to 90 days'],
        ['Insurance claim public notice', 'State insurance filings (varies)', '0 to 60 days'],
        ['Home sold in last 12 months with roof over 15 years', 'County assessor + sales records', '0 to 12 months'],
        ['Commercial building with visible roof wear', 'Aerial imagery, on-site drive-by', 'Ongoing'],
        ['No website or thin GBP for a competitor', 'Public directory data', 'Ongoing'],
        ['Weak or falling review count after big job', 'GBP review pattern', '30 to 90 days'],
      ]},

      { type: 'h2', text: 'Build the list', id: 'list' },
      { type: 'steps', items: [
        { title: 'Pick two zip codes with recent storm activity', text: 'NOAA publishes storm event data by county. Filter to hail over 1 inch or wind gusts over 60 mph in the last 30 days.' },
        { title: 'Pull the permit portal for reroofs', text: 'Most US counties publish issued permits with owner name and address. This is a direct-intent signal.' },
        { title: 'Match to property records', text: 'Owner name plus mailing address. This is a direct-mail play as much as email for residential.' },
        { title: 'For commercial, pull the CoStar or LoopNet listings plus assessor data', text: 'Building age plus most recent sale gives you roofs likely at end of life.' },
        { title: 'Score', text: 'Storm damage plus permit filed is a same-week call. Old commercial roof plus recent facility manager hire is a 60-day play.' },
      ]},

      { type: 'h2', text: 'The outreach: email, mail, and door', id: 'outreach' },
      { type: 'p', text: 'Roofing is one of the few verticals where direct mail still outperforms email for residential. For commercial and property management, email is the primary channel because there is a named decision-maker with a public email address.' },

      { type: 'quote', text: 'Subject: your reroof permit at [address]\n\nHi [First name],\n\nSaw the reroof permit filed on [date] for [address]. Most homeowners in your zip who filed after the [month] storm are getting three quotes and closing within two weeks.\n\nWe roofed 14 homes on [nearby street] in the last 60 days. Happy to swing by and give a 20-minute assessment, no pressure to book. If you already have a contractor, ignore this and good luck with the project.\n\n[Your name], [Company]\n[Phone]', cite: 'Signal-referenced cold email for a residential roofer' },

      { type: 'callout', tone: 'info', title: 'Why this works for roofing', text: 'The permit is a public filing. Referencing it proves you did homework and are local. Naming a nearby street with recent work makes you the safe choice. The "ignore this" line lowers the pushback.' },

      { type: 'h2', text: 'Seasonality: when to run what', id: 'seasonality' },
      { type: 'ul', items: [
        'Spring (Mar to May): peak storm season across the US Midwest and Southeast. Run storm-damage plays heavily.',
        'Summer (Jun to Aug): permit filings peak. Focus on permit-triggered outreach and commercial roof inspections.',
        'Fall (Sep to Nov): homeowners fixing before winter. Lean on inspection offers and multi-year roof age lists.',
        'Winter (Dec to Feb): slowest job season. Best time for commercial and property management outreach, and for building next years signal pipeline.',
      ]},

      { type: 'h2', text: 'What about the roofing side of digital signals?', id: 'digital' },
      { type: 'p', text: 'If you sell services to other roofers (marketing, software, insurance supplement work), the digital signals from the general playbook apply. Roofers with no website, thin GBPs, and no review-request habit are common. This is a separate ICP from homeowners.' },
      { type: 'link', text: 'See how to find local businesses without a website.', href: '/blog/find-local-businesses-without-a-website', label: 'Businesses without a website' },
      { type: 'link', text: 'General playbook for high-intent local leads.', href: '/blog/high-intent-local-leads', label: 'High-intent local leads' },

      { type: 'takeaway', title: 'The one thing to remember', text: 'Aggregator lead economics only work for whoever calls first, and by then the homeowner has two other quotes. Reach them before the lead lists at all, based on a public fact (permit, storm, roof age) that says a decision is coming. A nearby street reference and honest tone will beat a storm chaser every time.' },

      { type: 'faq', items: [
        { q: 'Is it legal to contact homeowners based on permit filings?', a: 'In most US states, permit records are public and outreach based on them is legal. Some states have specific rules for insurance claim signals; check your state.' },
        { q: 'Does direct mail still work for roofing?', a: 'For residential in a targeted zip after a storm, yes. Response rates of 1 to 3% are typical, which beats aggregator lead economics.' },
        { q: 'How do I compete with storm chasers?', a: 'Local reference streets and named recent jobs. Storm chasers cannot fake that.' },
        { q: 'How many touches before I move on?', a: 'For residential permit signals, one letter plus one door knock inside seven days. For commercial, three emails over three weeks.' },
        { q: 'Can Milo help with residential roofing outreach?', a: 'Milo is strongest for email-based B2B outreach: commercial roofing, property managers, and roofer-to-roofer service sales. Residential direct mail is outside the loop.' },
      ]},
    ],
  },
];
