import type { BlogPost } from '../posts';

export const WAVE4C_POSTS: BlogPost[] = [
  {
    slug: 'prospecting-list-from-google-maps',
    title: 'How to build a prospecting list from a Google Maps search',
    category: 'Local prospecting',
    cluster: 'Local prospecting',
    tags: ['google maps', 'prospecting', 'local sales', 'signals', 'list building'],
    datePublished: '2026-09-10',
    readMinutes: 10,
    excerpt: 'A five step method for turning a Google Maps search into a prospecting list that is actually worth working.',
    related: [
      'local-business-outbound-playbook',
      'buying-signals-checklist',
      'cold-email-first-line-signals',
    ],
    body: [
      { type: 'tldr', text: 'Google Maps is a great starting point for local prospecting, but a raw scrape is not a list. We use a five step method we call The signal-first list build: pick a tight market, pull public data, apply buying signals, qualify by fit, then shape the outreach around the signal. Worked example inside: roofing companies in Peoria, Illinois.' },

      { type: 'h2', text: 'Why Google Maps is underrated for B2B' },
      { type: 'p', text: 'For any business that serves a physical geography, Google Maps is the closest thing to a live directory of the real economy. Every listing has a name, category, address, phone, website, hours, review count, and often a photo of the storefront. That is more first party context than most paid databases will give you for a local operator.' },
      { type: 'p', text: 'The problem is that a raw export from Maps is a phonebook, not a prospect list. If you email 500 roofers with the same pitch you are doing telemarketing with extra steps. What turns a phonebook into a list is signal work.' },

      { type: 'callout', tone: 'info', title: 'The signal-first list build', text: 'A five step framework: (1) pick a tight market, (2) pull public data from Google Maps and the target websites, (3) apply buying signals so only businesses with a reason to buy stay in, (4) qualify by fit against your actual delivery capacity, (5) shape outreach around the specific signal you found. Skipping step 3 is why most Maps lists never convert.' },

      { type: 'diagram', kind: 'workflow', title: 'The signal-first list build', caption: 'Five steps, in order. Steps 3 and 5 are the ones most teams skip.', nodes: [
        { id: 'n1', label: '1. Pick market', sub: 'Vertical + geography' },
        { id: 'n2', label: '2. Pull public data', sub: 'Maps + website crawl' },
        { id: 'n3', label: '3. Apply signals', sub: 'Filter to reason-to-buy', emphasis: true },
        { id: 'n4', label: '4. Qualify by fit', sub: 'Match your capacity' },
        { id: 'n5', label: '5. Shape outreach', sub: 'One signal per email', emphasis: true },
      ], edges: [
        { from: 'n1', to: 'n2' }, { from: 'n2', to: 'n3' }, { from: 'n3', to: 'n4' }, { from: 'n4', to: 'n5' },
      ] },

      { type: 'h2', text: 'Step 1: pick a tight market' },
      { type: 'p', text: 'A tight market is one vertical, one geography, one size band. Not "contractors in the Midwest". Something like "residential roofing companies in Peoria, Illinois with 5 to 40 employees". Tight enough that your email can reference something specific, wide enough that there are 60 to 200 companies to work.' },
      { type: 'p', text: 'For this article we will use residential roofing in Peoria as the running example.' },

      { type: 'h2', text: 'Step 2: pull the public data' },
      { type: 'p', text: 'Search Maps for the vertical and city. Capture: business name, category, website, phone, address, review count, average rating, hours, and the Place ID. The Place ID is the stable key you want to dedupe on later.' },
      { type: 'p', text: 'Then crawl each website for a few extra fields: services offered, service area pages, staff or team page, careers page, any mention of financing partners, and the CMS or website builder in use. Every one of those becomes a possible signal.' },
      { type: 'table', caption: 'Fields to pull for a local prospecting list', headers: ['Field', 'Source', 'Why it matters'], rows: [
        ['Business name, address, phone', 'Google Maps', 'Basic identity, dedupe key'],
        ['Category and services', 'Maps + site crawl', 'Fit filter'],
        ['Review count and rating', 'Google Maps', 'Proxy for company maturity'],
        ['Careers or hiring page', 'Website crawl', 'Growth signal'],
        ['Financing partners', 'Website footer', 'Ticket size signal'],
        ['Website CMS or age', 'Site crawl', 'Buying window signal'],
      ] },
      { type: 'link', label: 'Google Places API docs', href: 'https://developers.google.com/maps/documentation/places/web-service/overview', text: 'The official interface for programmatic Maps data. Read the terms before you build anything.' },

      { type: 'h2', text: 'Step 3: apply signals' },
      { type: 'p', text: 'Signals are the reason a specific business would buy from you this quarter. For roofing in Peoria, three that work: (a) hiring for a project manager (growth stress on scheduling), (b) financing partner listed (they sell bigger tickets), (c) website last redesigned before 2020 (they are already in a refresh mindset).' },
      { type: 'p', text: 'Drop everything that does not carry at least one signal. It feels wasteful and it is not. A 40 company signal list will beat a 400 company blast every time.' },

      { type: 'h2', text: 'Step 4: qualify by fit' },
      { type: 'p', text: 'Fit is about you, not them. Do you actually want to serve a five person roofer? Can your onboarding handle a shop that answers the phone by first name? If you sell software with a $12k floor, cut anything under about 15 crews. Better to have 30 qualified than 300 blurred.' },

      { type: 'h2', text: 'Step 5: shape outreach around the signal' },
      { type: 'p', text: 'One email, one signal, one ask. If the signal was the hiring page, the first line names it. If it was the financing partner, the first line names that. The pitch is the same but the entry point is not. This is where a signal-first list finally pays off.' },

      { type: 'link', label: 'How Milo works', href: '/how-it-works', text: 'Milo runs this exact loop end to end: discover the businesses that match your signal, personalize the outreach, and send it from your own inbox.' },

      { type: 'h2', text: 'Ethics note' },
      { type: 'callout', tone: 'warn', title: 'Stay on the right side of the line', text: 'Public data is fair to collect. Personal emails scraped through workarounds are not. Respect robots directives, respect the Google Maps terms of service, and never buy consumer data. If your outreach would embarrass you if the recipient forwarded it to a competitor, rewrite it.' },

      { type: 'faq', items: [
        { q: 'Can I just export from Google Maps directly?', a: 'There is no first party export. Use the Places API within its terms, or a purpose-built tool. Manual copy-paste is legal and painful.' },
        { q: 'How large should a local list be?', a: 'For a single seller working one vertical in one metro, 60 to 200 signal-qualified accounts is the sweet spot per quarter.' },
        { q: 'Do I need emails for every contact?', a: 'No. Owner-operator businesses often respond to the general inbox. Send to info@ with the owner named in the greeting.' },
      ] },
    ],
  },

  {
    slug: 'freelance-clients-cold-email',
    title: 'How a freelancer books the first 10 to 20 clients through cold email',
    category: 'Cold email',
    cluster: 'Cold email',
    tags: ['freelance', 'cold email', 'client acquisition', 'positioning', 'outbound'],
    datePublished: '2026-09-10',
    readMinutes: 11,
    excerpt: 'A concrete first-100 leads workflow, a real cold email template, and how to price the offer so replies convert.',
    related: [
      'cold-email-first-line-signals',
      'positioning-fixed-scope-offer',
      'prospecting-bootstrapped-founder',
    ],
    body: [
      { type: 'tldr', text: 'You do not need a big list. You need 100 well chosen prospects, one email rooted in a real signal, and a fixed-scope offer that is easy to say yes to. This is the playbook we would run today if we were a freelancer starting from zero.' },

      { type: 'h2', text: 'The math is friendlier than you think' },
      { type: 'p', text: 'Freelancers do not need enterprise pipelines. If you send 100 well targeted emails and get an honest 8 percent reply rate, that is 8 conversations. Convert one in four into paid work and you have two clients from one week of prospecting. That is a working freelance business.' },

      { type: 'h2', text: 'The first-100 leads workflow' },
      { type: 'diagram', kind: 'workflow', title: 'First-100 leads sequence for a freelancer', caption: 'One vertical, one week to build, one week to send.', nodes: [
        { id: 'a', label: 'Pick niche' },
        { id: 'b', label: 'Build 100 list', sub: 'Public sources' },
        { id: 'c', label: 'Find signals', sub: 'Site, hiring, launches' },
        { id: 'd', label: 'Write template', sub: 'One signal, one ask' },
        { id: 'e', label: 'Send from own inbox', sub: '20/day, warmed up' },
        { id: 'f', label: 'Book calls' },
      ], edges: [
        { from: 'a', to: 'b' }, { from: 'b', to: 'c' }, { from: 'c', to: 'd' }, { from: 'd', to: 'e' }, { from: 'e', to: 'f' },
      ] },

      { type: 'h2', text: 'Pick a niche you can defend in one sentence' },
      { type: 'p', text: 'Not "web developer". Something like "Webflow to Framer migrations for Series A SaaS marketing sites". If a stranger cannot repeat your niche back after one line, keep tightening. Freelancers underprice because their positioning is soft. Fix the words first.' },

      { type: 'h2', text: 'Build 100 prospects' },
      { type: 'p', text: 'Sources: LinkedIn search, YC directory, Product Hunt weekly launches, Indie Hackers profiles, industry Slack member lists, funding announcements, Google Maps if your niche is local. Deliverable is a spreadsheet with company, first name, role, website, and one signal per row.' },

      { type: 'h2', text: 'The signal is the whole email' },
      { type: 'p', text: 'A signal is a specific observable fact about that company: a recent hire, a stack change, a broken page, a launched product, a job post, a podcast mention. If your email would still make sense sent to a competitor, it has no signal. Rewrite it.' },

      { type: 'h2', text: 'A cold email template that actually works' },
      { type: 'callout', tone: 'info', title: 'Template · signal: slow LCP on new pricing page', text: 'Subject: your new pricing page. Hi Priya, saw you shipped the new pricing page last week and it now loads in 4.1s on mobile (mostly the hero video). For a Framer site that number usually lives under 1.5s. I do Webflow to Framer performance passes as a fixed 2 week engagement. Two recent ones: cut LCP from 3.8s to 1.2s for Rally, and from 5.1s to 1.6s for Kestrel. Worth a 15 minute look next week? Happy to send a Loom teardown either way. Arun' },
      { type: 'p', text: 'What is doing the work here: a real observation, a specific metric, two named references, a small ask, and a fallback (the Loom) so a no still ends warm. No em dashes, no hype, no calendar link in the first message.' },

      { type: 'h2', text: 'Positioning the offer: fixed-scope beats hourly' },
      { type: 'p', text: 'Hourly pricing forces the buyer to underwrite your speed. Fixed-scope pricing forces you to underwrite it, which is the trade the buyer wants. For your first 20 clients, package the work as a two week or four week engagement with one clear deliverable and one clear price.' },
      { type: 'table', caption: 'Fixed-scope vs hourly for new freelancers', headers: ['Dimension', 'Hourly', 'Fixed-scope'], rows: [
        ['Buyer decision', 'Slow, needs approvals', 'Fast, single price'],
        ['Your incentive', 'Slow down', 'Ship faster'],
        ['Scope creep', 'Constant', 'Contained by contract'],
        ['Best for', 'Ongoing retainers with trust', 'First 10 to 20 clients'],
      ] },

      { type: 'h2', text: 'Sending mechanics' },
      { type: 'p', text: 'Send from your own domain, warmed up for at least two weeks before volume. Cap at 20 to 30 per day per inbox for the first month. Reply routing back to a real inbox you actually read. Anything that looks like a mass send in the raw email will land in spam eventually.' },
      { type: 'link', label: 'Google bulk sender guidelines', href: 'https://support.google.com/mail/answer/81126', text: 'The rules Gmail actually enforces for senders. Read this before you send.' },
      { type: 'link', label: 'Milo for freelancers', href: '/how-it-works', text: 'Milo drafts from your own Gmail or Outlook, with warm-up and reply routing built in. Pay-as-you-go credits, no seat cost.' },

      { type: 'callout', tone: 'success', title: 'One rule that saved us a year', text: 'Never send an email you would not be proud to have a friend forward. Cold does not mean careless. If the observation is real and the offer is real, the email will feel human even at volume.' },

      { type: 'h2', text: 'What to expect in weeks one to four' },
      { type: 'p', text: 'Week 1: build list, warm inboxes, write template. Week 2: send 100 emails at 20 per day. Week 3: run replies, book 4 to 8 calls. Week 4: close 1 to 3 clients, ask each for one intro. Iterate the template based on what actually got replies.' },

      { type: 'faq', items: [
        { q: 'Should I use a personal Gmail or a business domain?', a: 'Business domain. Personal Gmail sending is fine for one-off notes but not for a hundred outbound emails a week.' },
        { q: 'How long should a cold email be?', a: '80 to 130 words. Long enough to prove you read something specific, short enough to answer on a phone.' },
        { q: 'Do I need a case study to send cold?', a: 'Two named references are enough. If you have no clients yet, use two unpaid teardowns done well and named as pro-bono work.' },
      ] },
    ],
  },

  {
    slug: 'apollo-alternative-small-teams',
    title: 'Milo vs Apollo for small teams: an honest comparison',
    category: 'Comparison',
    cluster: 'Comparison',
    tags: ['apollo alternative', 'comparison', 'small teams', 'sales tools'],
    datePublished: '2026-09-10',
    readMinutes: 10,
    excerpt: 'Where Apollo wins, where Milo wins, and how to pick between them without hype.',
    related: [
      'milo-vs-clay',
      'prospecting-list-from-google-maps',
      'buying-signals-checklist',
    ],
    body: [
      { type: 'tldr', text: 'Apollo is a strong choice if you need a large contact database and you have a real SDR team to work it. Milo is a better choice if you are a small team doing signal-first outbound, especially local, and you want to pay per use instead of per seat. Both tools are legitimate. Pick by team shape.' },

      { type: 'h2', text: 'Why write this at all' },
      { type: 'p', text: 'We get asked "how are you different from Apollo" every week. The honest answer is that we are not competing for the same buyer most of the time. Apollo is built for larger sales teams who want database-led prospecting. Milo is built for a founder or a two to five person team who want signal-led prospecting. Different jobs.' },

      { type: 'h2', text: 'Where Apollo genuinely wins' },
      { type: 'p', text: 'Apollo has a large B2B contact database, seat based pricing that scales predictably for SDR teams, deep filters on firmographics and job change data, and mature CRM integrations. If you have five or more SDRs pulling lists every week and pushing to a CRM, Apollo is a sensible pick.' },
      { type: 'link', label: 'Apollo pricing', href: 'https://www.apollo.io/pricing', text: 'Primary source for Apollo plan tiers and per-seat pricing.' },
      { type: 'link', label: 'Apollo on G2', href: 'https://www.g2.com/products/apollo-io/reviews', text: 'Independent reviews. Skim the three-star ones for the honest read.' },

      { type: 'h2', text: 'Where Milo wins' },
      { type: 'p', text: 'Milo is signal-first: Google Places discovery, public-web research-based site crawls, LLM enrichment for buying signals, and drafts sent from your own Gmail or Outlook with warm-up and reply routing. Pricing is pay-as-you-go credits, not per seat. That maps well to a solo founder or a small team who prospects in bursts and cares more about "why buy now" than "who else fits the ICP".' },
      { type: 'callout', tone: 'info', title: 'Milo does not have a contact database', text: 'We are transparent about this. Milo queries public sources live per search rather than resell a static B2B database. That is a feature if you are chasing signal quality; it is a real limitation if you need to filter 50 million contacts by job title.' },

      { type: 'h2', text: 'Side by side' },
      { type: 'diagram', kind: 'compare', title: 'Milo vs Apollo at a glance', nodes: [
        { id: 'm', label: 'Milo', sub: 'Signal-first, PAYG, own inbox' },
        { id: 'a', label: 'Apollo', sub: 'Database-first, per seat, mid-market' },
      ] },
      { type: 'table', caption: 'Milo vs Apollo for small teams', headers: ['Dimension', 'Milo', 'Apollo'], rows: [
        ['Pricing model', 'Pay-as-you-go credits', 'Per seat, tiered'],
        ['Data source', 'Live from public sources per search', 'Large proprietary B2B DB'],
        ['Seat model', 'No seat cost', 'Priced per seat'],
        ['Personalization', 'Signal-first, LLM drafted', 'Template-first, sequence based'],
        ['Sending', 'Your own Gmail or Outlook, warm-up included', 'Own inbox or Apollo sending'],
        ['CRM sync', 'Not offered today', 'Salesforce, HubSpot, others'],
        ['Best-fit team size', '1 to 5, founder or small team', '5+ SDRs, mid-market'],
        ['Local prospecting', 'Native via Google Places', 'Possible but not core'],
      ] },

      { type: 'h2', text: 'How to choose without regret' },
      { type: 'p', text: 'Ask three questions. One, do you have people whose full job is to work a list? If yes, database tools earn their seat cost. Two, is your ICP local or physical? If yes, a Maps-native tool beats a national DB. Three, do you personalize per account or per sequence? Per account maps to Milo, per sequence maps to Apollo.' },
      { type: 'link', label: 'Milo product page', href: '/how-it-works', text: 'Full feature list and pricing.' },

      { type: 'h2', text: 'Common misreads' },
      { type: 'p', text: 'A few things we hear that are not quite right. Milo is not "Apollo but cheaper". The data model is different. Milo is not going to hand you two million contacts. Apollo is not "unusable for small teams". It is usable, just priced for a team that has more headcount than a two person startup usually does. Pick the shape, not the marketing.' },

      { type: 'faq', items: [
        { q: 'Can I use both?', a: 'Yes. Some teams use Apollo for national ICP research and Milo for signal-first outreach on the accounts that survive filtering.' },
        { q: 'Is Milo cheaper?', a: 'For a solo founder sending a few hundred emails a month, almost always. For a five seat SDR team sending tens of thousands, the seat model can win on unit cost.' },
        { q: 'Does Milo have CRM sync?', a: 'Not today. If a CRM push is non negotiable for you, that is a real reason to use Apollo instead.' },
      ] },
    ],
  },

  {
    slug: 'prospecting-bootstrapped-founder',
    title: 'Sales prospecting for bootstrapped founders: the first 90 days',
    category: 'Prospecting',
    cluster: 'Prospecting',
    tags: ['bootstrapped', 'founder', 'prospecting', '90 day plan', 'outbound'],
    datePublished: '2026-09-10',
    readMinutes: 11,
    excerpt: 'What we would do in the first 90 days of outbound as a bootstrapped founder with no headcount and no ad budget.',
    related: [
      'freelance-clients-cold-email',
      'prospecting-list-from-google-maps',
      'buying-signals-checklist',
    ],
    body: [
      { type: 'tldr', text: 'We are Arun and the team behind Milo, based in India, and we have run this loop ourselves. If you are a bootstrapped founder with no SDR and no ad budget, the answer is not "hire an agency". It is 90 days of signal-first outbound run by you, in your own inbox, with a rhythm that survives the rest of your job.' },

      { type: 'h2', text: 'The premise' },
      { type: 'p', text: 'A VC backed startup can afford to spend to learn. A bootstrapped founder cannot. Every outbound hour has to either produce a conversation or produce a lesson that changes the next batch. That constraint is a gift. It forces you to write better emails, pick tighter markets, and cut activity that does not pay.' },

      { type: 'h2', text: 'The 90 day plan' },
      { type: 'diagram', kind: 'ladder', title: '90 day bootstrapped founder plan', caption: 'Three months, three modes. Each builds on the last.', nodes: [
        { id: 'm1', label: 'Month 1: Discovery', sub: '30 calls, no pitch' },
        { id: 'm2', label: 'Month 2: Outreach', sub: '400 emails, one niche', emphasis: true },
        { id: 'm3', label: 'Month 3: Iterate', sub: 'Double down on what replied' },
      ], edges: [
        { from: 'm1', to: 'm2' }, { from: 'm2', to: 'm3' },
      ] },

      { type: 'table', caption: 'What we do each month', headers: ['Month', 'Focus', 'Weekly volume', 'Success signal'], rows: [
        ['Month 1', 'Discovery calls, no pitch', '8 calls, 0 sends', '30 recorded calls, a written ICP'],
        ['Month 2', 'Signal-first outbound', '100 emails/week', '8 to 12 replies/week, 2 to 4 calls'],
        ['Month 3', 'Iterate and narrow', '150 emails/week', '3 to 6 paying customers total'],
      ] },

      { type: 'h2', text: 'Month 1: discovery, not selling' },
      { type: 'p', text: 'We book 30 discovery calls with people who look like our ICP. No demo, no pitch, no calendar link labeled "sales call". We ask about the last time they tried to solve this problem, what they used, why they stopped, and what the workaround costs them a month. We take notes and we tag every pattern.' },
      { type: 'p', text: 'At the end of the month we can write our ICP in one sentence, our top three buying signals as observable facts, and our pitch as a paragraph that names a specific pain in the buyer\'s own words. Without that paragraph, month 2 is a coin flip.' },

      { type: 'h2', text: 'Month 2: outbound with a rhythm you can hold' },
      { type: 'p', text: 'We pick one niche and we run signal-first outbound. 100 emails a week, sent from our own domain, one signal per email. We send Tuesday and Thursday, we read replies at 4pm, and we do not touch the sequence during the day. Everything else in the business has to fit around this because a bootstrapped founder does not have an SDR to cover the gap.' },
      { type: 'callout', tone: 'info', title: 'One niche at a time', text: 'The pull to run three niches in parallel is strong and almost always wrong at this stage. Depth beats spread when you are the one doing the work. Prove you can close in one niche before you fork.' },

      { type: 'h2', text: 'Month 3: iterate, do not re-plan' },
      { type: 'p', text: 'By month three we have data. We know which signals produced replies and which produced silence. We double down on the top two signals, we rewrite the template based on the actual language buyers used on calls, and we push volume to 150 a week. We do not add a new channel. We do not "start LinkedIn". We finish the loop we started.' },

      { type: 'h2', text: 'What we do not do' },
      { type: 'p', text: 'We do not buy a database. We do not hire an agency. We do not run paid ads before we know the message works cold. We do not add a second product wedge in month two because a customer asked. All of these look like progress and none of them are.' },

      { type: 'h2', text: 'What tools we would use' },
      { type: 'p', text: 'A live way to discover businesses in your ICP, a way to read their public profile, a way to draft in your voice, your own Gmail or Outlook for sending, and a spreadsheet for tracking. That is enough. Milo bundles the first four so you can spend the founder hour writing and reading replies instead of stitching tools.' },
      { type: 'link', label: 'How Milo works', href: '/how-it-works', text: 'The tool we built for exactly this loop.' },

      { type: 'faq', items: [
        { q: 'Should we hire an SDR at day 90?', a: 'Only if you can hand them a written playbook that already produced revenue in your own hands. Hiring before that is expensive tuition.' },
        { q: 'What if month 2 gets no replies?', a: 'The template is wrong or the niche is wrong. Do not raise volume. Redo two discovery calls and rewrite from what you heard.' },
        { q: 'Is 100 emails a week enough?', a: 'For a founder testing a market, yes. Volume is a lever for after the message works, not before.' },
        { q: 'Do we need a warm-up tool?', a: 'Yes if you are sending from a fresh domain. Two weeks of gradual sending before the first cold batch is the minimum we would run.' },
      ] },

      { type: 'callout', tone: 'success', title: 'The honest truth', text: 'We built Milo because this is how we prospect. If you follow the 90 day plan with a spreadsheet and Gmail you will still get there. The tool saves hours, not outcomes. The outcome comes from doing the loop.' },
    ],
  },
];
