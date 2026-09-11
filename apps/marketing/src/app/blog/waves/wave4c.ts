import type { BlogPost } from '../posts';

export const WAVE4C_POSTS: BlogPost[] = [
  {
    slug: 'prospecting-list-from-google-maps',
    title: 'How to build a prospecting list from a Google Maps search',
    category: 'Local prospecting',
    cluster: 'Local prospecting',
    tags: ['google maps', 'prospecting', 'local sales', 'signals', 'list building'],
    datePublished: '2026-09-05',
    readMinutes: 10,
    description:
      'A five step method for turning a raw Google Maps search into a signal filtered prospecting list local sellers can actually work without burning a domain.',
    excerpt: 'A five step method for turning a Google Maps search into a prospecting list that is actually worth working.',
    related: [
      'buying-signal-playbook-local-b2b',
      'buying-signals-taxonomy',
      'high-intent-local-leads',
    ],
    body: [
      { type: 'p', text: 'A founder pulls 900 roofers out of Google Maps on a Sunday night, loads them into a sender, and by Wednesday the domain is on a warmup timeout and the reply folder is empty. The list was not the problem. Google Maps returned exactly what it was asked for. What the founder built was a phonebook, and phonebooks do not book meetings. This piece is about what has to happen between the export and the send to turn one into the other.' },

      { type: 'h2', text: 'Why is Google Maps underrated for B2B?' },
      { type: 'p', text: 'For any business that serves a physical geography, Google Maps is the closest thing to a live directory of the real economy. Every listing has a name, category, address, phone, website, hours, review count, and often a photo of the storefront. That is more first party context than most paid databases will give you for a local operator.' },
      { type: 'p', text: 'The problem is that a raw export from Maps is a phonebook, not a prospect list. If you email 500 roofers with the same pitch you are doing telemarketing with extra steps. What turns a phonebook into a list is signal work.' },

      { type: 'callout', tone: 'info', title: 'The signal-first list build', text: 'A five step framework: (1) pick a tight market, (2) pull public data from Google Maps and the target websites, (3) apply buying signals so only businesses with a reason to buy stay in, (4) qualify by fit against your actual delivery capacity, (5) shape outreach around the specific signal you found. Skipping step 3 is why most Maps lists never convert.' },

      { type: 'diagram', kind: 'workflow', title: 'The five-step list build', caption: 'Five steps, in order. Steps 3 and 5 are the ones most teams skip.', nodes: [
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

      { type: 'h2', text: 'Step 2: how do you pull the public data?' },
      { type: 'p', text: 'Search Maps for the vertical and city. Capture: business name, category, website, phone, address, review count, average rating, hours, and the Place ID. The Place ID is the stable key you want to dedupe on later.' },
      { type: 'h3', text: 'Enrich each site with a quick crawl' },
      { type: 'p', text: 'Then crawl each website for a few extra fields: services offered, service area pages, staff or team page, careers page, any mention of financing partners, and the CMS or website builder in use. Every one of those becomes a possible signal.' },
      { type: 'table', caption: 'Fields to pull for a local prospecting list', headers: ['Field', 'Source', 'Why it matters'], rows: [
        ['Business name, address, phone', 'Public map data', 'Basic identity, dedupe key'],
        ['Category and services', 'Public map data + site review', 'Fit filter'],
        ['Review count and rating', 'Public map data', 'Proxy for company maturity'],
        ['Careers or hiring page', 'Website review', 'Growth signal'],
        ['Financing partners', 'Website footer', 'Ticket size signal'],
        ['Website CMS or age', 'Public site review', 'Buying window signal'],
      ] },

      { type: 'h2', text: 'Step 3: how do you apply buying signals?' },
      { type: 'p', text: 'Signals are the reason a specific business would buy from you this quarter. For roofing in Peoria, three that work: (a) hiring for a project manager (growth stress on scheduling), (b) financing partner listed (they sell bigger tickets), (c) website last redesigned before 2020 (they are already in a refresh mindset).' },
      { type: 'h3', text: 'Cut ruthlessly by signal' },
      { type: 'p', text: 'Drop everything that does not carry at least one signal. It feels wasteful and it is not. A 40 company signal list will beat a 400 company blast every time.' },

      { type: 'h2', text: 'Step 4: do they actually fit your delivery?' },
      { type: 'p', text: 'Fit is about you, not them. Do you actually want to serve a five person roofer? Can your onboarding handle a shop that answers the phone by first name? If you sell software with a $12k floor, cut anything under about 15 crews. Better to have 30 qualified than 300 blurred.' },

      { type: 'h2', text: 'Step 5: how do you shape outreach around the signal?' },
      { type: 'p', text: 'One email, one signal, one ask. If the signal was the hiring page, the first line names it. If it was the financing partner, the first line names that. The pitch is the same but the entry point is not. This is where the work of curating a signal list finally pays off.' },

      { type: 'link', label: 'How Milo works', href: '/how-it-works', text: 'Milo runs this exact loop end to end: discover the businesses that match your signal, personalize the outreach, and send it from your own inbox.' },

      { type: 'h2', text: 'Ethics note' },
      { type: 'callout', tone: 'warn', title: 'Stay on the right side of the line', text: 'Public data is fair to collect. Personal emails scraped through workarounds are not. Respect robots directives, respect the Google Maps terms of service, and never buy consumer data. If your outreach would embarrass you if the recipient forwarded it to a competitor, rewrite it.' },

      { type: 'faq', items: [
        { q: 'Can I just export from public map data directly?', a: 'There is no first party export. Use the public map API within its terms, or a purpose-built tool. Manual copy-paste is legal and painful.' },
        { q: 'How large should a local list be?', a: 'For a single seller working one vertical in one metro, 60 to 200 signal-qualified accounts is the sweet spot per quarter.' },
        { q: 'Do I need emails for every contact?', a: 'No. Owner-operator businesses often respond to the general inbox. Send to info@ with the owner named in the greeting.' },
      ] },
    ],
  },

  {
    slug: 'freelance-clients-cold-email',
    seoTitle: 'Freelancer cold email: booking the first 10-20 clients',
    title: 'How a freelancer books the first 10 to 20 clients through cold email',
    category: 'Cold email',
    cluster: 'Cold email',
    tags: ['freelance', 'cold email', 'client acquisition', 'positioning', 'outbound'],
    datePublished: '2026-09-07',
    readMinutes: 11,
    description:
      'A concrete first 100 leads workflow for freelancers on cold email: pick a niche, build the list, send from your own inbox, and price the offer to close.',
    excerpt: 'A concrete first-100 leads workflow, a real cold email template, and how to price the offer so replies convert.',
    related: [
      'cold-email-first-line-signals',
      'positioning-fixed-scope-offer',
      'prospecting-bootstrapped-founder',
    ],
    body: [
      { type: 'p', text: 'Every freelancer who has ever tried cold email has the same first instinct: build the biggest list possible, blast it, and hope the numbers do the work. It never does. What actually books the first ten clients is smaller than that, quieter than that, and more boring than that. A hundred prospects. One email. One offer someone can say yes to over lunch. This is the version of the playbook we would run tomorrow if we started over.' },

      { type: 'h2', text: 'Why is the math friendlier than you think?' },
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

      { type: 'h2', text: 'Can you defend your niche in one sentence?' },
      { type: 'p', text: 'Not "web developer". Something like "Webflow to Framer migrations for Series A SaaS marketing sites". If a stranger cannot repeat your niche back after one line, keep tightening. Freelancers underprice because their positioning is soft. Fix the words first.' },

      { type: 'h2', text: 'How do you build 100 prospects?' },
      { type: 'p', text: 'Sources: LinkedIn search, YC directory, Product Hunt weekly launches, Indie Hackers profiles, industry Slack member lists, funding announcements, Google Maps if your niche is local. Deliverable is a spreadsheet with company, first name, role, website, and one signal per row.' },

      { type: 'h2', text: 'Why is the signal the whole email?' },
      { type: 'p', text: 'A signal is a specific observable fact about that company: a recent hire, a stack change, a broken page, a launched product, a job post, a podcast mention. If your email would still make sense sent to a competitor, it has no signal. Rewrite it.' },

      { type: 'h2', text: 'What does a working cold email look like?' },
      { type: 'callout', tone: 'info', title: 'Template · signal: slow LCP on new pricing page', text: 'Subject: your new pricing page. Hi Priya, saw you shipped the new pricing page last week and it now loads in 4.1s on mobile (mostly the hero video). For a Framer site that number usually lives under 1.5s. I do Webflow to Framer performance passes as a fixed 2 week engagement. Two recent ones: cut LCP from 3.8s to 1.2s for Rally, and from 5.1s to 1.6s for Kestrel. Worth a 15 minute look next week? Happy to send a Loom teardown either way. Arun' },
      { type: 'h3', text: 'Why this email works' },
      { type: 'p', text: 'What is doing the work here: a real observation, a specific metric, two named references, a small ask, and a fallback (the Loom) so a no still ends warm. No em dashes, no hype, no calendar link in the first message.' },

      { type: 'h2', text: 'Positioning the offer: fixed-scope beats hourly' },
      { type: 'p', text: 'Hourly pricing forces the buyer to underwrite your speed. Fixed-scope pricing forces you to underwrite it, which is the trade the buyer wants. For your first 20 clients, package the work as a two week or four week engagement with one clear deliverable and one clear price.' },
      { type: 'h3', text: 'Compare the two side by side' },
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

      { type: 'h2', text: 'What should you expect in weeks one to four?' },
      { type: 'p', text: 'Week 1: build list, warm inboxes, write template. Week 2: send 100 emails at 20 per day. Week 3: run replies, book 4 to 8 calls. Week 4: close 1 to 3 clients, ask each for one intro. Iterate the template based on what actually got replies.' },

      { type: 'faq', items: [
        { q: 'Should I use a personal Gmail or a business domain?', a: 'Business domain. Personal Gmail sending is fine for one-off notes but not for a hundred outbound emails a week.' },
        { q: 'How long should a cold email be?', a: '80 to 130 words. Long enough to prove you read something specific, short enough to answer on a phone.' },
        { q: 'Do I need a case study to send cold?', a: 'Two named references are enough. If you have no clients yet, use two unpaid teardowns done well and named as pro-bono work.' },
      ] },
    ],
  },

  {
    slug: 'prospecting-bootstrapped-founder',
    seoTitle: 'Sales prospecting for bootstrapped founders (90 days)',
    title: 'Sales prospecting for bootstrapped founders: the first 90 days',
    category: 'Prospecting',
    cluster: 'Prospecting',
    tags: ['bootstrapped', 'founder', 'prospecting', '90 day plan', 'outbound'],
    datePublished: '2026-09-09',
    readMinutes: 11,
    description:
      'The exact 90 day outbound plan a bootstrapped founder can run alone: month one discovery calls, month two signal outreach, month three iterate and narrow.',
    excerpt: 'What we would do in the first 90 days of outbound as a bootstrapped founder with no headcount and no ad budget.',
    related: [
      'freelance-clients-cold-email',
      'prospecting-list-from-google-maps',
      'buying-signal-playbook-local-b2b',
    ],
    body: [
      { type: 'quote', text: 'We built Milo because the advice we kept hearing as bootstrapped founders was some version of "hire an agency." We could not, and honestly we did not want to. What worked was 90 days of outbound we ran ourselves, out of our own inbox, in a rhythm that survived the rest of the job.', cite: 'Arun, co-founder, Milo' },

      { type: 'h2', text: 'What is the premise?' },
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
      { type: 'h3', text: 'What we write down at month end' },
      { type: 'p', text: 'At the end of the month we can write our ICP in one sentence, our top three buying signals as observable facts, and our pitch as a paragraph that names a specific pain in the buyer\'s own words. Without that paragraph, month 2 is a coin flip.' },

      { type: 'h2', text: 'Month 2: outbound with a rhythm you can hold' },
      { type: 'p', text: 'We pick one niche and we run outbound anchored in real signals. 100 emails a week, sent from our own domain, one signal per email. We send Tuesday and Thursday, we read replies at 4pm, and we do not touch the sequence during the day. Everything else in the business has to fit around this because a bootstrapped founder does not have an SDR to cover the gap.' },
      { type: 'h3', text: 'One niche, not three' },
      { type: 'callout', tone: 'info', title: 'One niche at a time', text: 'The pull to run three niches in parallel is strong and almost always wrong at this stage. Depth beats spread when you are the one doing the work. Prove you can close in one niche before you fork.' },

      { type: 'h2', text: 'Month 3: how do you iterate without re-planning?' },
      { type: 'p', text: 'By month three we have data. We know which signals produced replies and which produced silence. We double down on the top two signals, we rewrite the template based on the actual language buyers used on calls, and we push volume to 150 a week. We do not add a new channel. We do not "start LinkedIn". We finish the loop we started.' },

      { type: 'h2', text: 'What do we not do?' },
      { type: 'p', text: 'We do not buy a database. We do not hire an agency. We do not run paid ads before we know the message works cold. We do not add a second product wedge in month two because a customer asked. All of these look like progress and none of them are.' },

      { type: 'h2', text: 'What tools would we use?' },
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
