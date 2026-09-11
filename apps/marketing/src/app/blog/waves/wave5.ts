import type { BlogPost } from '../posts';

export const WAVE5_POSTS: BlogPost[] = [
  {
    slug: 'what-milo-does-not-do',
    title: 'What Milo does not do, and why each absence is on purpose',
    seoTitle: 'What Milo does not do (and why)',
    category: 'Positioning',
    cluster: 'Comparison',
    tags: ['positioning', 'anti-features', 'product philosophy', 'milo'],
    datePublished: '2026-09-04',
    readMinutes: 6,
    description:
      'The features Milo refuses to build, and the reason each refusal is a product decision, not a roadmap gap. A short manifesto about what we will not ship.',
    excerpt: 'The features Milo refuses to build, and why each refusal is a product decision, not a gap on the roadmap.',
    related: [
      'prospecting-bootstrapped-founder',
      'manual-vs-automated-prospecting',
      'signal-vs-database-prospecting',
    ],
    body: [
      { type: 'tldr', text: 'Milo does not host a contact database, does not sync with your CRM, does not scrape LinkedIn, does not place cold calls, does not sell EU personal data lists, and does not integrate with Slack. Each of those is a choice. This is the page where we say which choice, and why.' },

      { type: 'who-this-is-for', items: [
        'Founders comparing Milo to a full sales stack and wondering what is missing.',
        'Buyers who have been burned by tools that grew into everything and did nothing well.',
        'Teams who want to understand the product before they trust it with a sending domain.',
      ] },

      { type: 'p', text: 'Most sales tools sell you a feature list. This page sells you an absence list. If you want a tool that does everything, Milo is not it. If you want a tool that refuses to do the six things below, keep reading.' },

      { type: 'definition', items: [
        { term: 'Anti-feature', def: 'A capability the product deliberately does not offer, where the absence is load bearing to the promise of the product. Removing an anti-feature makes the product worse, not better.' },
      ] },

      { type: 'h2', text: 'No contact database' },
      { type: 'p', text: 'Milo does not host a database of B2B contacts you can query. There is no seat that unlocks a hundred million rows. This is the biggest single line on our anti-feature list, and the reason for the whole company.' },
      { type: 'p', text: 'A database sells the fantasy that every business you might want to reach is already sitting in a table, waiting. That fantasy is what puts your domain on Spamhaus. The people in those rows never asked to be there, the rows are stale within a quarter, and every buyer of that database is emailing the same rows on the same Tuesday. We do not want to be that Tuesday.' },
      { type: 'p', text: 'What Milo does instead is watch public signals, in real time, and surface companies at the moment they show a reason to buy. The list is smaller. The list is fresher. The list is yours, not the vendor next to you.' },

      { type: 'h2', text: 'No CRM sync' },
      { type: 'p', text: 'Milo does not push contacts, deals, activities, or notes into Salesforce, HubSpot, Pipedrive, or Close. No two way sync, no field mapping wizard, no webhook queue for account owner assignment. If you want the meeting on your calendar and the reply in your inbox, we have you. If you want a CRM to pretend that Milo owned the deal, look elsewhere.' },
      { type: 'p', text: 'The reason is that CRM sync is where sales tools go to become a middleware company. Two thirds of a category leader\'s engineering time ends up on connector maintenance instead of the actual product. We would rather ship a better signal, not a better field map.' },

      { type: 'h2', text: 'No LinkedIn scraping' },
      { type: 'p', text: 'Milo does not scrape LinkedIn profiles, Sales Navigator searches, or InMail threads. We do not run a headless browser fleet with a rotating cookie jar. We do not sell you a Chrome extension that reads the profile you are looking at and drops it into a warm email queue.' },
      { type: 'p', text: 'LinkedIn is very clear that automated scraping violates their terms, and the case law around hiQ v LinkedIn cut both ways. More importantly, a scraped profile is not a signal. It is a snapshot of what one person put on their public resume years ago. Milo indexes what a company is doing this month, not what an SDR listed on their profile in 2021.' },

      { type: 'h2', text: 'No cold calling dialer' },
      { type: 'p', text: 'Milo does not place phone calls. No power dialer, no parallel dialer, no local presence spoofing. If you want to call the numbers you find, call them yourself, from a phone your prospect can pick up. We are not going to help you spoof a Peoria area code while calling from Delaware.' },
      { type: 'p', text: 'The pitch of the modern dialer is throughput, and throughput without a signal is telemarketing. If we shipped a dialer, we would be selling the same "call more people faster" idea we built Milo to argue against.' },

      { type: 'h2', text: 'No EU personal data prospect DB' },
      { type: 'p', text: 'Milo does not sell you a database of individually named EU citizens with their work emails, roles, and phone numbers. Under GDPR, the legitimate interest test for cold outreach to a named natural person is a bar most B2B sales teams cannot actually clear, especially not when the source is a scraped enrichment vendor.' },
      { type: 'p', text: 'What Milo does show, for EU targets, is the company level signal and the public business email at the domain. If you want to email a role account at a business that is actively hiring for a mobile developer, that is a defensible cold outreach. If you want a personal email for a named engineer at that company, we are not the tool.' },

      { type: 'h2', text: 'No Slack integration' },
      { type: 'p', text: 'Milo does not have a Slack app. No slash command, no daily digest bot, no channel that pings when a signal fires. If you want signals in your workflow, they arrive in your Milo inbox and in the daily email. That is the whole surface.' },
      { type: 'p', text: 'Slack integrations are how sales tools get you to open the tool without opening the tool. We would rather you check Milo when you are ready to work a list, and ignore it the rest of the day.' },

      { type: 'callout', tone: 'info', title: 'The pattern', text: 'Every item on this page is a place a competitor spent an engineer year to ship. We spent that year on the signal graph instead. If you would rather buy the signal graph, that is what Milo is for. If you would rather buy the connector map, buy the tool that shipped the connectors.' },

      { type: 'takeaway', title: 'The absence is the product', text: 'What a tool refuses to do is a stronger signal about what it will be good at than its feature page. Milo refuses six things on purpose. If any of the six are non negotiable for your team, we are the wrong pick, and we would rather you know that on the pricing page than in month two.' },
    ],
  },

  {
    slug: 'cold-email-to-booked-call-with-cal-com',
    title: 'From cold email to booked call with Cal.com, end to end',
    seoTitle: 'Cold email to booked call with Cal.com',
    category: 'Cold email',
    cluster: 'Cold email',
    tags: ['cold email', 'cal.com', 'booking', 'meetings', 'workflow'],
    datePublished: '2026-09-05',
    readMinutes: 9,
    description:
      'The full booking flow behind a cold email that actually gets a call on the calendar: landing, Cal.com event type, confirmation email, routing, and follow up.',
    excerpt: 'The full booking flow behind a cold email that gets a call on the calendar: landing, event type, confirmation, routing, follow up.',
    related: [
      'cold-email-follow-up-cadence',
      'freelance-clients-cold-email',
      'prospecting-list-from-google-maps',
    ],
    body: [
      { type: 'stat', value: '38%', label: 'of replies that agreed to a call did not book, because the booking flow was broken or friction filled. Cal.com fixes most of that if you set it up correctly.' },

      { type: 'p', text: 'A cold email that gets a reply is only halfway to a call. Between "yes, I am open to a chat" and a slot on your calendar there is a booking flow, and if any single step of that flow is wrong, the reply dies. This piece walks the whole thing, from the send to the confirmation, using Cal.com as the booking layer.' },

      { type: 'who-this-is-for', items: [
        'Founders who reply to their own cold email replies and want the meeting on the calendar today, not next Tuesday.',
        'Small teams using Cal.com as the meeting layer and Milo or another tool as the send layer.',
        'Anyone whose reply to book ratio is under fifty percent.',
      ] },

      { type: 'h2', text: 'The full flow, in five nodes' },

      { type: 'diagram', kind: 'workflow', title: 'Cold email to booked call', caption: 'Five nodes. Every one is a place a booking can silently die.', nodes: [
        { id: 'e1', label: '1. Cold email', sub: 'One signal, one ask' },
        { id: 'e2', label: '2. Reply lands', sub: 'Positive intent detected' },
        { id: 'e3', label: '3. Reply with link', sub: 'One Cal.com URL, no menu', emphasis: true },
        { id: 'e4', label: '4. Booked slot', sub: 'Event type, buffers, routing' },
        { id: 'e5', label: '5. Confirmation', sub: 'Email, calendar, reminder' },
      ], edges: [
        { from: 'e1', to: 'e2' }, { from: 'e2', to: 'e3' }, { from: 'e3', to: 'e4' }, { from: 'e4', to: 'e5' },
      ] },

      { type: 'h2', text: 'Step 1: the cold email itself' },
      { type: 'p', text: 'The email needs to end with a soft ask, not a booking link. A booking link in a first touch email reads as sales automation and drops your reply rate by roughly a third. The ask is "worth a quick call" or "open to a fifteen minute chat", nothing more.' },
      { type: 'p', text: 'The link comes out in the reply, after the prospect has already said yes.' },

      { type: 'h2', text: 'Step 2: what a good reply looks like' },
      { type: 'p', text: 'The reply is short, references the signal you led with in the first email, and includes exactly one Cal.com URL. Not three. Not a "here are three times" list plus a link. One URL, and let the prospect pick the slot themselves.' },
      { type: 'callout', tone: 'success', title: 'Reply template', text: 'Great, thanks for coming back. Grab whatever works on this link: {{cal_link}}. Fifteen minutes, no deck, I will come with two specific ideas about your careers page.' },

      { type: 'h2', text: 'Step 3: the Cal.com event type' },

      { type: 'steps', items: [
        { title: 'Create a fifteen minute event type', text: 'Not thirty. A cold reply is not a thirty minute meeting. Name it "Intro chat" or something equally boring. The URL becomes cal.com/{{you}}/intro.' },
        { title: 'Set a two day minimum notice', text: 'Anything shorter and you will book calls you have not prepared for. Anything longer and the reply goes cold before the meeting.' },
        { title: 'Add a fifteen minute buffer after', text: 'Cold intro calls run over. If you back to back these, the second call starts late and both feel rushed.' },
        { title: 'Require exactly two fields on booking', text: 'Company name and one line about what they want to talk about. Any more fields and drop off climbs above twenty percent.' },
        { title: 'Turn on email and SMS reminders', text: 'Twenty four hours before and one hour before. No shows drop by roughly half when both are on.' },
      ] },

      { type: 'h2', text: 'Step 4: routing and round robin' },
      { type: 'p', text: 'If you are a solo founder, the event type maps to you and you are done. If you are a two or three person team, use Cal.com routing forms to send the booking to the right person by vertical or size band. Do not let a prospect from your best vertical land on your junior teammate because a round robin was fair.' },
      { type: 'p', text: 'Set the routing on the same page as the booking, not after. A separate qualification page is a place bookings drop.' },

      { type: 'h2', text: 'Step 5: the confirmation email' },
      { type: 'p', text: 'The confirmation Cal.com sends is fine as a default. Rewrite it once, then leave it. What the default gets wrong is the tone: it reads like a Zoom meeting invite from a five hundred person company. Rewrite it to sound like you.' },
      { type: 'callout', tone: 'info', title: 'What to put in the confirmation', text: 'A one line reminder of what you agreed to talk about, the meeting link at the top, one sentence about how to reschedule, and your direct email in case they need to reach you outside Cal.com.' },

      { type: 'h2', text: 'Where bookings quietly die' },
      { type: 'ul', items: [
        'Two calendar accounts, only one connected to Cal.com. Slots you have blocked on the other calendar show as free, and you double book.',
        'Time zone set to your travel zone, not your usual zone. Prospects book at 6am your time and no show.',
        'Buffer set only before, not after. Every meeting runs over and the next one starts late.',
        'Booking page requires more than two fields. Every extra field drops completion by around six to ten percent.',
        'Confirmation sent from a noreply address. If the prospect wants to move the meeting they cannot reply, and they no show instead.',
      ] },

      { type: 'product-moment', hook: 'Where Milo fits in this flow', text: 'If Milo is your send layer, the reply arrives in your Milo inbox and the Cal.com link is one variable in the reply template. When the booking fires, Milo marks the thread as booked and stops the follow up cadence automatically. You do not have to remember to shut off the sequence for one prospect at a time.' },

      { type: 'h2', text: 'What to do when they book but do not show' },
      { type: 'p', text: 'Send a one line email from the same address within two hours. Not a hostile one. "Hey, missed you at the slot, no worries, want to grab another one?" and paste the same Cal.com link. About one in three no shows rebooks on that reply.' },
      { type: 'p', text: 'If they do not rebook after two of those, they were not going to buy from a cold email. Move on.' },

      { type: 'faq', items: [
        { q: 'Should I put the Cal.com link in the first cold email?', a: 'No. It reads as sales automation and reply rate drops. Send the link only after the prospect has said yes.' },
        { q: 'Fifteen or thirty minute meetings for cold intros?', a: 'Fifteen. It is easier for the prospect to say yes, and if there is real interest the call runs to twenty five anyway.' },
        { q: 'What about phone versus video?', a: 'Default to video, offer phone as a fallback in the confirmation. About a fifth of prospects will take the phone option and they show up more reliably.' },
      ] },

      { type: 'takeaway', title: 'The booking flow is part of the email', text: 'Cold email reply rate is a vanity number if the booking flow leaks. A good cold email plus a bad Cal.com setup gets you a reply, then a shrug. Fix the five nodes above once and the same volume of replies turns into roughly twice as many calls on the calendar.' },
    ],
  },

  {
    slug: 'milo-vs-clay-signal-first-prospecting',
    title: 'Milo vs Clay for signal-first prospecting',
    category: 'Comparison',
    cluster: 'Comparison',
    tags: ['comparison', 'clay', 'signals', 'prospecting', 'milo'],
    datePublished: '2026-09-06',
    readMinutes: 10,
    description:
      'Where Milo and Clay actually differ, once you strip the marketing. Clay is a data toolkit. Milo is an opinion. This piece names both, and picks a side.',
    excerpt: 'Where Milo and Clay actually differ, once you strip the marketing. One is a toolkit. One is an opinion. This piece names both.',
    related: [
      'what-is-an-ai-sdr',
      'signal-vs-database-prospecting',
      'manual-vs-automated-prospecting',
    ],
    body: [
      { type: 'p', text: 'The most common inbound question at Milo is a version of "is this Clay". It is a reasonable question, because both products talk about signals, both talk about enrichment, and both sit in the same slice of the sales stack. This piece is the answer, from the founder chair, and it is not neutral.' },

      { type: 'who-this-is-for', items: [
        'Buyers evaluating Milo against Clay and want the honest tradeoffs.',
        'Teams already on Clay wondering if Milo replaces it, complements it, or neither.',
        'Founders who have three hours a week for outbound and cannot spend them wiring waterfalls.',
      ] },

      { type: 'h2', text: 'Clay is a toolkit. Milo is an opinion.' },
      { type: 'p', text: 'Clay is the best data toolkit in the sales stack right now. It gives you a spreadsheet where every column can be a call to a data provider, an AI model, a webhook, or a script, and you compose them into an enrichment waterfall that runs on your list. If you want to build the enrichment step you have in your head, Clay is where you build it.' },
      { type: 'p', text: 'Milo does not do that. Milo runs one opinion, hard coded, about which public signals matter, refreshes them daily, and ships you the list. You do not compose a waterfall. You do not pick which enrichment provider fires first. You get the Milo view of the world, and either it fits your motion or it does not.' },
      { type: 'p', text: 'Both are legitimate products. They are for different buyers.' },

      { type: 'diagram', kind: 'compare', title: 'Toolkit versus opinion', nodes: [
        { id: 'clay', label: 'Clay', sub: 'A spreadsheet plus every data provider and AI you can wire. You build the workflow.' },
        { id: 'milo', label: 'Milo', sub: 'One opinionated pipeline: public signals, daily refresh, list at the end. You do not build anything.', emphasis: true },
      ] },

      { type: 'h2', text: 'What each one is actually good at' },

      { type: 'table', caption: 'Where each product wins, and where it does not', headers: ['Dimension', 'Milo', 'Clay'], rows: [
        ['Primary buyer', 'Founder or two person team without ops time', 'Growth engineer or RevOps person with time to compose'],
        ['Signal source', 'Public web, job posts, tech stack, hiring pace, review deltas', 'Whatever you wire into the waterfall'],
        ['Learning curve', 'Under an hour', 'Real learning curve, weeks to master'],
        ['Enrichment cost model', 'Flat monthly, one seat', 'Per credit, plus the underlying provider costs'],
        ['Best output', 'A worked list with reasons to reach out', 'A custom enrichment pipeline that runs on your list'],
        ['Worst output', 'A list you did not want because our opinion is not your opinion', 'A pipeline that costs $600 in credits and returns 40 rows'],
        ['Where it hurts', 'You cannot swap the signal set out for your own', 'You have to build the thing, and maintain it'],
      ] },

      { type: 'h2', text: 'The pricing question' },
      { type: 'p', text: 'Clay is priced per credit, on top of a seat. The credits are consumed by the enrichment steps in your waterfall, and the underlying data provider costs pass through. A single well built waterfall on a 1,000 row list can burn several hundred dollars in credits, and the math shifts every time you add a step.' },
      { type: 'p', text: 'Milo is a flat monthly. There is no credit meter, because there is no waterfall for you to run. You are paying for the opinion and the refresh cadence, not the compute.' },
      { type: 'link', text: 'See Clay pricing for current credit math', href: 'https://clay.com/pricing', label: 'External' },

      { type: 'h2', text: 'When to buy Clay instead of Milo' },
      { type: 'p', text: 'Buy Clay if you have a growth engineer or an ops person whose job is to build the enrichment pipeline. Buy Clay if your signal set is unusual enough that the Milo opinion does not cover it. Buy Clay if you want to combine three data providers into a single view your SDRs work off, and you are willing to maintain the wiring.' },

      { type: 'h2', text: 'When to buy Milo instead of Clay' },
      { type: 'p', text: 'Buy Milo if you are a founder who has three hours a week for outbound and cannot spend them in a spreadsheet. Buy Milo if the Milo opinion, which is that public buying signals beat scraped databases, is one you already agree with. Buy Milo if you would rather pay a flat monthly and have someone else make the enrichment decisions.' },

      { type: 'h2', text: 'The overlap case' },
      { type: 'p', text: 'Some teams run both. They use Milo to surface the target list every week, then push that list into Clay for a custom enrichment layer their SDRs work off. That is a legitimate stack. It is also a stack that costs more than either tool alone, and it is not the stack we would design for a small team.' },

      { type: 'h2', text: 'What Clay cannot do that Milo does' },
      { type: 'p', text: 'Clay does not host a signal graph. It hosts a place for you to build one. If you want the signal graph handed to you, refreshed nightly, with the "why" attached to every row, Clay is not the shape of the product. Milo is.' },
      { type: 'p', text: 'This is not a knock on Clay. It is the design tradeoff Clay made when it chose to be a toolkit.' },

      { type: 'h2', text: 'What Milo cannot do that Clay does' },
      { type: 'p', text: 'Milo does not let you swap the enrichment stack out. You cannot say "for this campaign, use Apollo for emails and Datagma for phones and OpenAI for the summary column". You take the Milo pipeline as it ships. If the shape of the pipeline is wrong for you, Clay is the better call.' },

      { type: 'callout', tone: 'info', title: 'The blunt version', text: 'Clay is the better spreadsheet. Milo is the better list. If you want to build the spreadsheet, buy Clay. If you want to skip the spreadsheet and work the list, buy Milo.' },

      { type: 'takeaway', title: 'Pick by shape, not by feature', text: 'Feature comparisons between Milo and Clay miss the actual choice, because the products are different shapes. One is a toolkit that assumes you will build. One is an opinion that assumes you will trust the build. The right pick is the one whose shape matches the time you actually have.' },
    ],
  },

  {
    slug: 'what-to-say-when-they-reply-cold-email-response-playbook',
    title: 'What to say when they reply to a cold email: the response playbook',
    seoTitle: 'What to say when they reply to a cold email',
    category: 'Cold email',
    cluster: 'Cold email',
    tags: ['cold email', 'reply handling', 'templates', 'response', 'objections'],
    datePublished: '2026-09-07',
    readMinutes: 10,
    description:
      'Five reply types you will see after a cold email, and the exact response template for each. Triage first, respond second, do not blur the two steps.',
    excerpt: 'Five reply types you will see after a cold email, and the exact response template for each. Triage first, respond second.',
    related: [
      'cold-email-follow-up-cadence',
      'why-cold-emails-go-to-spam',
      'freelance-clients-cold-email',
    ],
    body: [
      { type: 'tldr', text: 'Positive with a question, referral out, not a fit, not now, and angry. Those are the five reply shapes. Triage every reply into one of the five within thirty seconds, then send the matching template. Do not draft from scratch for the first response, ever.' },

      { type: 'who-this-is-for', items: [
        'Founders who send fewer than 200 cold emails a week and reply to each one by hand.',
        'Small teams whose reply rate is fine but whose booking rate is not.',
        'Anyone who has stared at a reply for twenty minutes trying to draft the response.',
      ] },

      { type: 'h2', text: 'Why templates are the right answer here' },
      { type: 'p', text: 'The instinct on the first reply is to write something bespoke. That instinct is wrong. The prospect is not evaluating your writing yet. They are evaluating whether you respond quickly and whether the response makes it easy to say yes. Both of those are template problems, not writing problems.' },
      { type: 'p', text: 'Write bespoke on the second reply, once there is a real conversation. On the first reply, ship the template and move on.' },

      { type: 'h2', text: 'The triage step' },

      { type: 'steps', items: [
        { title: 'Read the whole reply once', text: 'Not just the first line. Reply intent is often in the second sentence, and the first sentence is a pleasantry.' },
        { title: 'Classify into one of five buckets', text: 'Positive with a question, referral out, not a fit, not now, angry. If the reply does not fit one of these, re read it once more before you invent a sixth bucket.' },
        { title: 'Note the specific ask if any', text: 'A positive reply with "can you send me a case study" is not the same as a positive reply with "worth a call". Different template, same bucket.' },
        { title: 'Pick the template', text: 'Grab the matching template from your saved snippets or from the list below. Do not draft from scratch.' },
        { title: 'Personalize one line, ship', text: 'One line, no more. Reference the specific thing they said. Ship the reply within an hour of the inbound.' },
      ] },

      { type: 'h2', text: 'Bucket 1: positive with a question' },
      { type: 'p', text: 'These are the replies that say "interesting, but tell me more about X". X is usually pricing, timeline, or a specific feature you did not mention. The reply is thoughtful. Match that.' },
      { type: 'callout', tone: 'success', title: 'Template: positive with a question', text: 'Thanks for coming back. Short answer on {{their_question}}: {{one_sentence_answer}}. Longer answer is easier on a call, and I can also show you the specific piece I mentioned about {{their_signal}}. Grab a slot here if you are open: {{cal_link}}.' },
      { type: 'p', text: 'The trick is answering the question directly in one sentence, then pivoting to the call. If you refuse to answer and only push for the call, half of these die. If you answer completely and drop the call, the other half die.' },

      { type: 'h2', text: 'Bucket 2: referral out' },
      { type: 'p', text: 'The reply says "wrong person, try Alice". These are gold. A referral inside the same company converts at three to five times the rate of a fresh cold email.' },
      { type: 'callout', tone: 'success', title: 'Template: referral out', text: 'Really appreciate the pointer. Mind if I mention you sent me over when I reach out to {{referred_name}}? I will keep it short.' },
      { type: 'p', text: 'Wait for their yes before you send the referral email. Sending without confirmation, even when the reply seems to imply consent, poisons the referral about a quarter of the time. Two extra hours to confirm is cheap.' },

      { type: 'h2', text: 'Bucket 3: not a fit' },
      { type: 'p', text: 'The reply is polite and closes the door. "Thanks, we already use X" or "not something we need". The instinct is to argue. Do not.' },
      { type: 'callout', tone: 'info', title: 'Template: not a fit', text: 'Totally fair, thanks for the quick reply. If it ever changes, my email is right here. Have a good rest of the week.' },
      { type: 'p', text: 'You are protecting the future reply. About one in twenty of these will circle back within the year, and they only circle back if the last touch was gracious.' },

      { type: 'h2', text: 'Bucket 4: not now' },
      { type: 'p', text: 'The reply is warm but timing is off. "Ping me in Q1" or "not until we hire our next engineer". Do not argue with the timing. Book the follow up in your calendar for a week after the date they named.' },
      { type: 'callout', tone: 'success', title: 'Template: not now', text: 'Great, thanks for the honesty. Putting a note in my calendar to circle back in {{their_timing}}. If anything shifts before then, my inbox is open.' },
      { type: 'p', text: 'When you circle back, reference the original conversation directly and the specific date they gave. "You mentioned Q1, and we are in the second week of January" is stronger than a generic "checking in" line by a large margin.' },

      { type: 'h2', text: 'Bucket 5: angry' },
      { type: 'p', text: 'The reply is hostile. "Take me off this list", "how did you get my email", or a two paragraph rant about cold email in general. There is a real person on the other side of that reply and they are having a bad Tuesday.' },
      { type: 'callout', tone: 'warn', title: 'Template: angry', text: 'You are right to be frustrated, apologies for the intrusion. Removing you from any future contact from me now. If it helps, your address is not on any list I bought, it came from a public signal about {{signal_source}}. Either way, I will not be reaching out again.' },
      { type: 'p', text: 'Take them off the list before you reply, not after. If the reply gets caught in a spam filter and you did not suppress them, the second automated follow up goes out and you have a much bigger problem.' },

      { type: 'h2', text: 'What not to send in any of the five' },
      { type: 'ul', items: [
        'Any variant of "circling back" or "bumping this to the top of your inbox". Cliches read as automation.',
        'A calendar link in the first reply to an angry reply or a not a fit reply. Wrong ask, wrong moment.',
        'A twelve line paragraph. If the prospect wrote three sentences, you write three sentences.',
        'An attachment. Even a one page PDF. Attachments in a first reply from an unknown domain hit spam filters hard.',
        'A CC to a teammate the prospect has never met. Loop your teammate in on the third message, not the first.',
      ] },

      { type: 'h2', text: 'Speed matters more than polish' },
      { type: 'p', text: 'A same day reply, on average, doubles the odds the conversation continues past the second message. A three day reply gets you a polite "sorry, lost track of this" from about half the prospects who wrote back. Ship the template inside two hours, then take your time on message two.' },

      { type: 'faq', items: [
        { q: 'What if the reply is a one word "who?"', a: 'Treat it as positive with a question. The prospect is asking who you are, and a two sentence answer plus the signal you led with gets a real reply about a third of the time.' },
        { q: 'Do I need different templates for each vertical?', a: 'Not for the first response. Personalize one line inside the template. Vertical specific templates are a message two problem, not a message one problem.' },
        { q: 'Should I use AI to draft the first response?', a: 'Only if it drafts from a template you approved. AI drafting from scratch on the first reply produces slightly worse language than a good template, and slightly worse language is worse than a boring template.' },
      ] },

      { type: 'takeaway', title: 'The reply is a routing problem, not a writing problem', text: 'The five buckets cover almost every first reply you will ever see. If you triage inside thirty seconds and ship the matching template inside two hours, your reply to book ratio climbs without a single word of new copy. Save the bespoke writing for the second message, where it earns its keep.' },
    ],
  },

  {
    slug: 'cold-email-deliverability-from-gmail-workspace-2026',
    title: 'Cold email deliverability from Gmail Workspace in 2026',
    seoTitle: 'Cold email deliverability from Gmail Workspace (2026)',
    category: 'Deliverability',
    cluster: 'Deliverability',
    tags: ['deliverability', 'gmail', 'google workspace', 'dkim', 'spf', 'postmaster'],
    datePublished: '2026-09-08',
    readMinutes: 11,
    description:
      'DKIM signing, SPF alignment with google.com, MX verification, Postmaster Tools, and the 200 per day soft cap for new Workspace senders. The 2026 setup.',
    excerpt: 'DKIM signing, SPF alignment, MX verification, Postmaster Tools, and the 200 per day soft cap for new Workspace senders. The full 2026 setup.',
    related: [
      'why-cold-emails-go-to-spam',
      'cold-email-reply-rate-benchmarks-2026',
      'is-cold-email-legal',
    ],
    body: [
      { type: 'stat', value: '200/day', label: 'The soft cap Google Workspace applies to new senders in 2026 before reputation scoring lets you climb. Blow past it in week one and the domain lands in spam for months.' },

      { type: 'p', text: 'Google tightened sender requirements in 2024 with the bulk sender rules, and quietly kept ratcheting through 2025. In 2026 the practical setup for cold email from a Workspace domain has five moving parts, and if any one of them is wrong the mail lands in Promotions on a good day and spam on a bad one. This is the RFC and Postmaster reading, applied.' },

      { type: 'who-this-is-for', items: [
        'Founders sending cold email from a Google Workspace inbox.',
        'Teams whose primary domain also serves marketing traffic and cannot risk it.',
        'Anyone whose reply rate cratered after a domain change or a Workspace migration.',
      ] },

      { type: 'h2', text: 'The five part setup' },

      { type: 'steps', items: [
        { title: 'Turn on DKIM signing in Workspace admin', text: 'Under Apps, Google Workspace, Gmail, Authenticate email. Generate a 2048 bit key, publish the TXT record at google._domainkey.{{yourdomain}}, wait for propagation, and then click Start authentication. Without DKIM, RFC 6376 signature verification fails and every downstream reputation check runs on a weaker signal.' },
        { title: 'Publish an SPF record that aligns with google.com', text: 'The TXT at the apex should be exactly v=spf1 include:_spf.google.com ~all. RFC 7208 defines alignment via the Return-Path domain, and Gmail evaluates SPF pass on _spf.google.com being in the include chain. Do not add third party ESPs to this record unless they actually send from the domain. Every extra include is a DNS lookup, and SPF caps at ten.' },
        { title: 'Verify MX records point at Google', text: 'Five MX records at 1, 5, 5, 10, 10, all under aspmx.l.google.com and alt*.aspmx.l.google.com. If a legacy Postini or third party MX is still in the record set, inbound will route incorrectly and DMARC reports will look wrong even when your outbound is fine.' },
        { title: 'Enable Postmaster Tools for the domain', text: 'Add and verify the domain at postmaster.google.com. It will not show useful data until you cross about 100 messages a day to Gmail addresses, but the account has to exist before the data starts. Watch the domain reputation, IP reputation, spam rate, and authentication panels.' },
        { title: 'Cap sending at 200 per day for the first four weeks', text: 'Google Workspace has a hard cap around 2,000 per day per account, but the soft cap for a new sender is closer to 200 per day, with reputation scoring pulling that ceiling up or down. Volume above 200 in week one, from a fresh sender, is the fastest way to land in spam for the next three months.' },
      ] },

      { type: 'h2', text: 'DKIM: what actually has to be right' },
      { type: 'p', text: 'DKIM is defined in RFC 6376 and it signs a set of headers plus the body with a private key held by the sender. The public key lives at the DNS selector, in your case google._domainkey.{{yourdomain}}. Gmail on the receiving side fetches that key, verifies the signature, and passes the DKIM=pass result into DMARC evaluation.' },
      { type: 'p', text: 'Common failure: the key is published but Workspace was never toggled to Start authentication. The record exists, the signature is not generated, and every message goes out DKIM=none. Verify by sending yourself a test from the domain and reading the Authentication-Results header in the raw source. It should say dkim=pass header.d={{yourdomain}}.' },

      { type: 'h2', text: 'SPF alignment: the RFC 7208 detail people miss' },
      { type: 'p', text: 'SPF checks the envelope sender, not the From header. When you send from Workspace, the envelope sender is under google.com, and _spf.google.com covers it. That is why the include is required and why third party senders you are not using should not be in the record.' },
      { type: 'p', text: 'For DMARC alignment (RFC 7489), the SPF domain in the envelope must align with the domain in the From header. Because Google rewrites the envelope, this works out of the box when you use _spf.google.com and send From your own domain. The place teams break it is by relaying through a third party that does not align, at which point DMARC treats it as SPF=fail even though the raw SPF check passed.' },
      { type: 'callout', tone: 'warn', title: 'Do not stack includes', text: 'Every include: in your SPF adds DNS lookups. SPF caps at 10 lookups. Adding your ESP, your marketing tool, your transactional tool, and your support tool blows past the cap and the whole record fails permerror. Keep the record minimal and rely on DKIM alignment for anything sending from a subdomain.' },

      { type: 'h2', text: 'MX record verification' },
      { type: 'p', text: 'The five Google MX records are documented in the Workspace setup guide. If you have any others, remove them. Legacy MX entries from a migration are the most common inbound routing problem, and they also confuse DMARC report aggregators, which show up as ghost failures in your reports.' },
      { type: 'p', text: 'Verify from a shell with dig MX {{yourdomain}}. If you see anything not under aspmx.l.google.com, that is your first fix, not your last.' },

      { type: 'h2', text: 'Postmaster Tools: what to actually watch' },
      { type: 'p', text: 'Once the domain is verified in Postmaster, four panels matter.' },
      { type: 'ul', items: [
        'Domain reputation. Should read High or Medium. Low is a warning. Bad means you are in spam and it will take weeks of low volume high engagement mail to climb out.',
        'Spam rate. Google publishes a 0.3% threshold in the bulk sender rules. Practical target for cold email is under 0.1%. Above 0.3% at any volume and reputation collapses.',
        'Authentication results. DKIM, SPF, and DMARC should all trend at or near 100% pass. Anything under 95% is a config bug, not a receiver decision.',
        'Encryption. TLS should be at 100%. If it is not, you have a mail routing bug somewhere upstream.',
      ] },
      { type: 'link', text: 'Postmaster Tools', href: 'https://postmaster.google.com/', label: 'Reference' },

      { type: 'h2', text: 'The 200 per day soft cap in practice' },
      { type: 'p', text: 'Google does not publish the exact reputation scoring formula. What is observable, across a large sample of new senders, is that volumes above 200 per day from a domain with no sender history correlate strongly with Promotions placement in week one and spam placement in week two. Under 200 with strong engagement (opens where you have a legitimate reason to measure them, replies, no complaints) keeps you out of that trap.' },
      { type: 'p', text: 'The right ramp is 20 per day in week one, 50 in week two, 100 in week three, 200 in week four, and only then climbing toward 500. Skip a step and the domain reputation dips. Once it dips, the recovery is measured in weeks, not days.' },
      { type: 'callout', tone: 'info', title: 'Use a subdomain for cold email', text: 'Do the cold sending from mail.{{yourdomain}} or reach.{{yourdomain}}, not from the apex. If the sending domain reputation dips, your primary marketing and product domain is not on the same reputation account, and you keep the ability to send transactional mail from the apex without collateral damage.' },

      { type: 'h2', text: 'Common failures and their fixes' },
      { type: 'ul', items: [
        'DKIM record published but authentication never enabled in Workspace admin. Fix: click Start authentication.',
        'Multiple SPF records at the apex. RFC 7208 says only one is allowed. Fix: merge into one v=spf1 record.',
        'DMARC policy set to p=none forever. Move to p=quarantine once alignment is stable, then to p=reject once report volume is clean.',
        'Sending From a look alike domain that is not the same as the reply to. Every Gmail heuristic treats this as a phishing signal.',
        'A single account sending to 800 addresses on day one of a new Workspace. Domain reputation collapses within 72 hours.',
      ] },

      { type: 'h2', text: 'What to do when you are already in spam' },
      { type: 'p', text: 'Stop sending for a week. Fix any authentication or SPF issue you find. Restart at 20 per day, only to addresses that have engaged with the domain before (previous customers, warm inbound, personal contacts) so early engagement is high. Climb the ramp again. Expect four to six weeks to fully recover, longer if the spam rate ever crossed 0.3%.' },

      { type: 'faq', items: [
        { q: 'Does BIMI matter for cold email?', a: 'Only after DMARC is at p=reject and reputation is stable. BIMI is a trust badge on the receiving side. It does not repair a broken sender, and setting it up on a broken sender is wasted work.' },
        { q: 'What about ARC signing?', a: 'ARC (RFC 8617) matters when your mail is forwarded through an intermediary that re signs. For a direct Workspace send to Gmail, ARC is not the fix. If your mail is going through a security gateway or a mailing list on the way to Gmail, then yes.' },
        { q: 'Should I warm up with a third party warmup tool?', a: 'Not in 2026. Google publicly deprecated the reputation benefit of automated warmup exchanges, and Gmail can detect the pattern. Warm up with real correspondence: reply to your existing threads, send personal notes to actual humans, and ramp real volume slowly.' },
      ] },

      { type: 'takeaway', title: 'Deliverability is a checklist, not a mystery', text: 'DKIM on, SPF minimal and aligned, MX clean, Postmaster verified, volume ramp under 200 for the first month. Get those five right and you are in the inbox on merit. Miss any one of them and the rest of your cold email strategy is a rounding error, because the mail never gets read.' },
    ],
  },
];
