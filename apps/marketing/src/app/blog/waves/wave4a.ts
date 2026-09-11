import type { BlogPost } from '../posts';

export const WAVE4A_POSTS: BlogPost[] = [
  {
    slug: 'what-is-an-ai-sdr',
    title: 'What is an AI SDR (and what it cannot do yet)',
    description:
      'A working definition of the AI SDR category, what shipping products like 11x, Regie, and Alta actually do, and where a human still has to sit in the loop.',
    excerpt: 'A direct definition of the AI SDR category, what current products actually do, and where the human still has to sit in the loop.',
    category: 'AI SDR',
    cluster: 'AI SDR',
    tags: ['ai sdr', 'sales automation', 'autobound', '11x', 'regie', 'alta'],
    datePublished: '2026-08-17',
    readMinutes: 9,
    related: [
      'manual-vs-automated-prospecting',
      'buying-signals-taxonomy',
      'cold-email-reply-rate-benchmarks-2026',
    ],
    body: [
      { type: 'tldr', text: 'An AI SDR is software that automates parts of the outbound sales development role: prospecting, research, personalisation and email drafting, and sometimes reply handling and booking. It is not an autonomous salesperson. In 2026 the reliable use is as a drafting and prospecting layer with a human still approving the send.' },

      { type: 'h2', text: 'Definition', id: 'definition' },
      { type: 'p', text: 'An AI SDR is a software system that performs the mechanical parts of an outbound sales development representative. That set typically includes finding prospects, researching accounts, writing personalised opening emails, sending follow-ups on a cadence, and in some cases parsing replies and booking meetings.' },
      { type: 'p', text: 'It is not, in any current shipping product, a replacement for a competent human SDR on a complex sale. Anyone who tells you otherwise is selling a slide, not a shipped system.' },

      { type: 'h2', text: 'What current AI SDR products actually do', id: 'capabilities' },
      { type: 'p', text: 'The category clusters into two shapes. One shape is the drafting copilot that sits on top of an existing sales stack, exemplified by Autobound and Regie.ai. The other is the fuller autonomous positioning taken by 11x and Alta, which market a virtual worker persona.' },
      { type: 'link', text: 'Autobound', href: 'https://www.autobound.ai/', label: 'Vendor' },
      { type: 'link', text: 'Regie.ai', href: 'https://www.regie.ai/', label: 'Vendor' },
      { type: 'link', text: '11x', href: 'https://www.11x.ai/', label: 'Vendor' },
      { type: 'link', text: 'Alta', href: 'https://www.altahq.com/', label: 'Vendor' },

      { type: 'table', caption: 'What current AI SDRs can and cannot do reliably', headers: ['Capability', 'Reliable today', 'Not yet reliable'], rows: [
        ['Prospect discovery from a market definition', 'Yes, if the source data is good', ''],
        ['Personalised opening line from public data', 'Yes, when the source is real', ''],
        ['Multi-touch cadence with follow-ups', 'Yes', ''],
        ['Inbox warm-up and deliverability handling', 'Yes', ''],
        ['Reply classification (interested vs not)', 'Partly, needs human review', ''],
        ['Objection handling in a live thread', '', 'No, quality drops fast'],
        ['Complex discovery calls or demos', '', 'No'],
        ['Negotiation and commercial terms', '', 'No'],
        ['Judgment calls on when not to send', '', 'No'],
      ]},

      { type: 'diagram', kind: 'matrix', title: 'AI SDR capability matrix',
        caption: 'Axes: task structure vs required judgment. Emphasis marks where current products land.',
        nodes: [
          { id: 'a', label: 'Prospecting', sub: 'Structured, low judgment', emphasis: true },
          { id: 'b', label: 'Drafting first touch', sub: 'Structured, medium judgment', emphasis: true },
          { id: 'c', label: 'Follow-up cadence', sub: 'Structured, low judgment', emphasis: true },
          { id: 'd', label: 'Reply triage', sub: 'Unstructured, medium judgment' },
          { id: 'e', label: 'Objection handling', sub: 'Unstructured, high judgment' },
          { id: 'f', label: 'Discovery call', sub: 'Unstructured, high judgment' },
        ],
      },

      { type: 'h2', text: 'Where the human still has to sit', id: 'human-loop' },
      { type: 'ol', items: [
        'Final approval on send, so a bad draft never leaves the domain.',
        'Reply handling once a real conversation starts, because tone and commercial context matter.',
        'ICP definition and market carve-out, because the AI cannot decide who you should sell to.',
      ]},

      { type: 'takeaway', title: 'The one thing to remember', text: 'An AI SDR is drafting and prospecting software, not a virtual worker. In current deliverability conditions the reliable configuration keeps a human on the send-approval step and on every reply. The failure mode is not a bad email, it is a bad email at scale from a domain you also use to talk to real customers.' },

      { type: 'h2', text: 'Why the "autonomous SDR" framing is dangerous today', id: 'autonomous-risk' },
      { type: 'p', text: 'Autonomy means an agent that decides who to email, when, and with what, and executes without a human in the loop. In a world where Google Postmaster, Yahoo and Microsoft have tightened bulk sender rules, a fully autonomous mis-step burns the sending domain, not just the campaign.' },
      { type: 'link', text: 'Google email sender guidelines', href: 'https://support.google.com/mail/answer/81126', label: 'Reference' },
      { type: 'p', text: 'The failure mode is not a bad email. It is a bad email at scale from a domain you also use to talk to customers.' },

      { type: 'h2', text: 'How to evaluate an AI SDR product', id: 'evaluation' },
      { type: 'steps', items: [
        { title: 'Ask where the data comes from', text: 'Resold static database, live web crawl, or your own CRM. Each has different failure modes.' },
        { title: 'Ask what the human approves', text: 'Per-send approval, per-batch approval, or nothing. Match this to your risk appetite.' },
        { title: 'Ask about the sending domain', text: 'Their pooled infra or your own inbox. Pooled infra shares reputation across their whole customer base.' },
        { title: 'Ask what happens on reply', text: 'Routed to a human, auto-replied, or dropped. Auto-reply is where the wheels come off.' },
        { title: 'Price it against a real SDR', text: 'Fully loaded cost including inbox warm-up, deliverability tools and integration work.' },
      ]},

      { type: 'h2', text: 'FAQ', id: 'faq' },
      { type: 'faq', items: [
        { q: 'Will an AI SDR replace a human SDR?', a: 'Not in 2026. It will replace parts of the role: list building, first-draft personalisation, cadence execution. The judgment layer and reply layer stay with a person.' },
        { q: 'Is Milo an AI SDR?', a: 'Milo does the prospecting and drafting parts of the AI SDR job. It does not send autonomously and does not close deals. That is deliberate.' },
        { q: 'Which product should I buy?', a: 'Depends on motion. Enterprise ABM leans toward Regie or Autobound as a copilot. Local and SMB signal work is where Milo is built for.' },
      ]},

      { type: 'link', text: 'Manual vs automated prospecting', href: '/blog/manual-vs-automated-prospecting', label: 'Internal' },
      { type: 'link', text: 'Buying signal playbook for local B2B', href: '/blog/buying-signal-playbook-local-b2b', label: 'Internal' },
    ],
  },

  {
    slug: 'buying-signals-taxonomy',
    title: 'Buying signals: local, digital, and organisational',
    description:
      'A three axis taxonomy for buying signals: local, digital, organisational. Score each 0 to 3, act on totals of 5 or more, and stop guessing which lead is warm.',
    excerpt: 'A three-axis taxonomy for buying signals with a scoring rubric you can adopt directly.',
    category: 'Buying signals',
    cluster: 'Buying signals',
    tags: ['buying signals', 'intent data', 'prospecting', 'framework', 'scoring'],
    datePublished: '2026-08-20',
    readMinutes: 10,
    related: [
      'buying-signal-examples',
      'buying-signal-playbook-local-b2b',
      'high-intent-local-leads',
    ],
    body: [
      { type: 'tldr', text: 'Buying signals split cleanly across three axes: local (physical world evidence), digital (web and ad footprint) and organisational (people and structure changes). Score each axis 0 to 3 and act on totals of 5 or more. This piece introduces that rubric as The three-axis signal score.' },

      { type: 'h2', text: 'Why the category needs a taxonomy', id: 'why-taxonomy' },
      { type: 'p', text: 'Most "buying signal" content flattens the concept into a single list. That is why teams end up chasing a mix of weak digital breadcrumbs and strong organisational events with the same urgency. A taxonomy fixes that.' },

      { type: 'callout', tone: 'info', title: 'Framework', text: 'The three-axis signal score. Rate each prospect 0 to 3 on Local signals, Digital signals and Organisational signals. Sum to a 0 to 9 score. Act on 5 and above, watch 3 to 4, ignore 0 to 2.' },

      { type: 'h2', text: 'The Milo framework glossary', id: 'glossary' },
      { type: 'p', text: 'This post introduces one framework. Two more show up across the Milo blog, and it helps to see all three in one place.' },
      { type: 'definition', items: [
        { term: 'Milo FTR Score', def: 'A per-signal quality score on three axes (Fit, Timing, Reachability), 1 to 3 each, 9 total. Anything under 6 goes to a nurture list. Introduced in the [buying-signal playbook for local B2B](/blog/buying-signal-playbook-local-b2b).' },
        { term: 'Three-axis signal score', def: 'A per-account intent score across Local, Digital and Organisational axes, 0 to 3 each, 9 total. Act on 5 or more. Introduced in this post.' },
        { term: 'Signal-first list build', def: 'A five-step framework for turning a raw local search into a working prospect list: pick market, pull public data, apply signals, qualify by fit, shape outreach. Introduced in [How to build a prospecting list from a Google Maps search](/blog/prospecting-list-from-google-maps).' },
        { term: 'Stop-on-reply cadence', def: 'A four-message follow-up policy for cold email where the sequence terminates the moment a human replies. Introduced in [The stop-on-reply cadence](/blog/cold-email-follow-up-cadence).' },
      ]},

      { type: 'h2', text: 'Axis 1: Local signals', id: 'local' },
      { type: 'p', text: 'Physical world evidence about a business. Anything you could in principle verify by walking past the shop, opening Google Maps or reading a local newspaper.' },
      { type: 'ul', items: [
        'A new location has opened or is under fit-out.',
        'The business has changed name or brand on the storefront.',
        'Review volume has jumped sharply in the last 60 days.',
        'A permit or licence filing appears in a public register.',
        'A Google Business Profile has changed category or hours.',
      ]},

      { type: 'h2', text: 'Axis 2: Digital signals', id: 'digital' },
      { type: 'p', text: 'Anything the business is doing on the open web.' },
      { type: 'ul', items: [
        'A new page appears on the website (services, careers, pricing).',
        'The business has started running paid search or Meta ads.',
        'A tech stack change is visible (new booking widget, new CMS).',
        'A social account posts a launch or hiring notice.',
        'Website copy changes to mention a new service area.',
      ]},

      { type: 'h2', text: 'Axis 3: Organisational signals', id: 'organisational' },
      { type: 'p', text: 'People and structure changes.' },
      { type: 'ul', items: [
        'A new head of a relevant function is announced.',
        'A funding round or acquisition is filed publicly.',
        'A specific role is opened on a jobs board.',
        'Executive team page changes.',
        'A parent company or franchise relationship changes.',
      ]},

      { type: 'h2', text: 'The three-axis signal score, in a table', id: 'rubric' },
      { type: 'table', caption: 'Scoring rubric per axis (0 to 3)', headers: ['Score', 'Local axis', 'Digital axis', 'Organisational axis'], rows: [
        ['0', 'No evidence', 'No evidence', 'No evidence'],
        ['1', 'Stable, minor change', 'Static site, no ads', 'No visible people change'],
        ['2', 'One clear event in 90 days', 'One clear change in 90 days', 'One relevant hire or filing'],
        ['3', 'Multiple compounding events', 'Multiple compounding changes', 'Named role change plus one more'],
      ]},

      { type: 'diagram', kind: 'matrix', title: 'The three-axis signal score', caption: 'Three axes, each 0 to 3. Act on totals of 5 or more.',
        nodes: [
          { id: 'l', label: 'Local', sub: 'Physical world evidence' },
          { id: 'd', label: 'Digital', sub: 'Web and ad footprint' },
          { id: 'o', label: 'Organisational', sub: 'People and structure' },
          { id: 'act', label: 'Act now', sub: 'Score >= 5', emphasis: true },
          { id: 'watch', label: 'Watch', sub: 'Score 3 to 4' },
          { id: 'ignore', label: 'Ignore', sub: 'Score 0 to 2' },
        ],
        edges: [
          { from: 'l', to: 'act' },
          { from: 'd', to: 'act' },
          { from: 'o', to: 'act' },
          { from: 'l', to: 'watch' },
          { from: 'd', to: 'watch' },
          { from: 'o', to: 'ignore' },
        ],
      },

      { type: 'h2', text: 'Worked example', id: 'example' },
      { type: 'p', text: 'A physiotherapy clinic in Bengaluru opens a second location (Local 2), starts running Google Ads on "sports injury" (Digital 2), and posts a job for a lead physio (Organisational 2). Total score: 6. That is an act-now record. The opener writes itself, because all three anchors are already in the record.' },

      { type: 'callout', tone: 'success', title: 'Why three axes matter', text: 'A single-axis signal is easy to fake to yourself. Three axes filter out coincidences. A business doing one visible thing might be noise. A business doing three at once is almost never noise.' },

      { type: 'h2', text: 'How Milo produces these scores', id: 'milo-scoring' },
      { type: 'p', text: 'Milo pulls Local signals from public map data and business listings, Digital from a public site reads and public ad footprints, and Organisational from public web pages and news. The three-axis score is computed per record before drafting begins.' },
      { type: 'link', text: 'Buying signal examples', href: '/blog/buying-signal-examples', label: 'Internal' },
      { type: 'link', text: 'Buying signal playbook for local B2B', href: '/blog/buying-signal-playbook-local-b2b', label: 'Internal' },
      { type: 'link', text: 'High intent local leads', href: '/blog/high-intent-local-leads', label: 'Internal' },
      { type: 'link', text: 'LinkedIn Economic Graph mobility research', href: 'https://economicgraph.linkedin.com/research', label: 'Primary source' },

      { type: 'h2', text: 'FAQ', id: 'faq' },
      { type: 'faq', items: [
        { q: 'Is this the same as intent data?', a: 'No. Intent data usually means third-party topic surges from cookie networks. The three-axis signal score is built from first-party public evidence about the business itself, not about anonymous visitor cohorts.' },
        { q: 'Why 5 as the action threshold?', a: 'Because a total of 5 forces at least two axes to be non-trivial. Single-axis signals are too easy to over-index on.' },
        { q: 'Can I use this without Milo?', a: 'Yes. Score manually per axis and write the opener from the highest scoring axis first. Milo just automates the scoring and drafting steps.' },
      ]},
    ],
  },

  {
    slug: 'cold-email-reply-rate-benchmarks-2026',
    title: 'Cold email reply rate benchmarks 2026',
    description:
      'Real cold email reply rate ranges from Woodpecker, Sendr, GMass, and Clay reports, broken down by daily volume and persona, with what counts as a red flag.',
    excerpt: 'Real reply rate benchmarks from primary source reports, broken down by volume and persona, with what counts as good, great and red-flag.',
    category: 'Cold email',
    cluster: 'Cold email',
    tags: ['cold email', 'benchmarks', 'reply rate', 'sendr', 'woodpecker'],
    datePublished: '2026-08-23',
    readMinutes: 9,
    related: [
      'why-cold-emails-go-to-spam',
      'is-cold-email-legal',
      'what-is-an-ai-sdr',
    ],
    body: [
      { type: 'tldr', text: 'Across primary source reports from Woodpecker, Sendr, GMass and Clay, average cold email reply rates sit in the 1 to 5 percent band. Good campaigns run 5 to 10 percent. Great, tightly targeted campaigns run above 10 percent. Anything above 25 percent should be audited for tracking artefacts.' },

      { type: 'h2', text: 'How to read this page', id: 'how-to-read' },
      { type: 'p', text: 'Every number below links to the primary report it came from. Vendor reports carry their own selection bias, so we quote ranges rather than a single hero number. Where a report gives a median and an average, we use the median.' },

      { type: 'h2', text: 'Headline benchmarks', id: 'headline' },
      { type: 'stat', value: '1 to 5%', label: 'Average cold email reply rate across major vendor reports' },
      { type: 'stat', value: '5 to 10%', label: 'Good campaigns with tight targeting and personalisation' },
      { type: 'stat', value: '10%+', label: 'Great campaigns, usually narrow ICP and warm domain' },

      { type: 'table', caption: 'Cold email reply rate benchmarks by source', headers: ['Source', 'Segment', 'Average reply rate', 'Notes'], rows: [
        ['Woodpecker Cold Email Report', 'All B2B cold email in-platform', '~1 to 5%', 'Averaged across large customer cohort'],
        ['Sendr benchmark report', 'Agencies and lean outbound teams', '~2 to 8%', 'Skews toward smaller volume, tighter lists'],
        ['GMass benchmark reports', 'Gmail-based senders', '~1 to 5%', 'Mixed marketing and sales use cases'],
        ['Clay usage reports', 'High-personalisation workflows', '5 to 15%', 'Small n, strong ICP, heavy enrichment'],
      ]},
      { type: 'callout', tone: 'info', title: 'Where these numbers come from', text: 'The bands below are triangulated from vendor benchmark posts published by Woodpecker, GMass, Sendr and Clay across 2023 to 2025. Each vendor reports on its own customer base, so we cite ranges rather than a single hero number. Search each vendor blog for their most recent "cold email benchmarks" post to see the current figures.' },
      { type: 'link', text: 'Woodpecker blog (search for their cold email benchmarks post)', href: 'https://woodpecker.co/blog/', label: 'Vendor research' },
      { type: 'link', text: 'GMass blog', href: 'https://www.gmass.co/blog/', label: 'Vendor research' },
      { type: 'link', text: 'Clay learning hub', href: 'https://www.clay.com/learn', label: 'Vendor research' },

      { type: 'h2', text: 'Benchmarks by volume', id: 'by-volume' },
      { type: 'table', caption: 'Reply rate expectations by daily send volume', headers: ['Daily volume per inbox', 'Expected reply rate range', 'Comment'], rows: [
        ['0 to 20', '5 to 15%', 'Hand-picked, highly personalised'],
        ['20 to 50', '3 to 8%', 'Personalised at scale with signals'],
        ['50 to 100', '1 to 4%', 'Semi-personalised, template-driven'],
        ['100+', '<2% typically', 'Pushes against sender guidelines'],
      ]},

      { type: 'h2', text: 'Benchmarks by persona', id: 'by-persona' },
      { type: 'table', caption: 'Reply rate expectations by target persona', headers: ['Persona', 'Expected reply rate range', 'Why'], rows: [
        ['Local business owner', '5 to 12%', 'Reads own inbox, decides fast'],
        ['SMB operator (10 to 50 staff)', '3 to 8%', 'Owner or ops lead reads, some filtering'],
        ['Mid-market director', '2 to 5%', 'Assistants and filters common'],
        ['Enterprise VP or C-level', '1 to 3%', 'Heavy filtering, gated inbox'],
      ]},

      { type: 'diagram', kind: 'ladder', title: 'Reply rate ladder',
        caption: 'Bands to calibrate against. Above 25 percent usually indicates a tracking artefact.',
        nodes: [
          { id: 'redlow', label: 'Red flag low', sub: '<1% sustained' },
          { id: 'avg', label: 'Average', sub: '1 to 5%' },
          { id: 'good', label: 'Good', sub: '5 to 10%', emphasis: true },
          { id: 'great', label: 'Great', sub: '10 to 25%', emphasis: true },
          { id: 'redhigh', label: 'Red flag high', sub: '>25% sustained' },
        ],
        edges: [
          { from: 'redlow', to: 'avg' },
          { from: 'avg', to: 'good' },
          { from: 'good', to: 'great' },
          { from: 'great', to: 'redhigh' },
        ],
      },

      { type: 'callout', tone: 'warn', title: 'When a "great" number is a lie', text: 'Reply rates above 25 percent sustained across hundreds of sends usually mean bots, catch-all inboxes replying with auto-responders, or tracking pixels counting opens as replies. Audit the actual thread contents before you celebrate.' },

      { type: 'h2', text: 'What actually moves the number', id: 'what-moves-it' },
      { type: 'ol', items: [
        'Narrower ICP. Halving the target list roughly doubles the reply rate in most reports.',
        'Signal-anchored opener. Reference something the business did in the last 30 days.',
        'One clear ask. A single low-friction question outperforms a pitch plus a calendar link.',
        'Domain health. A cold domain with weak SPF and DKIM will not reach the inbox, so the reply rate cannot start.',
      ]},
      { type: 'link', text: 'Google email sender guidelines', href: 'https://support.google.com/mail/answer/81126', label: 'Reference' },
      { type: 'link', text: 'Why cold emails go to spam', href: '/blog/why-cold-emails-go-to-spam', label: 'Internal' },
      { type: 'link', text: 'Is cold email legal', href: '/blog/is-cold-email-legal', label: 'Internal' },

      { type: 'h2', text: 'How Milo users tend to sit on this ladder', id: 'milo-position' },
      { type: 'p', text: 'Milo runs signal-led prospecting with sends from the operator own Gmail or Outlook inbox and per-send approval. Users typically sit in the 5 to 12 percent band on local and SMB motions, in line with the "good to great" range in the ladder above. That is a function of narrow lists and copy that names the specific trigger, not a magic number in the product.' },

      { type: 'h2', text: 'FAQ', id: 'faq' },
      { type: 'faq', items: [
        { q: 'What is a good reply rate for cold email in 2026?', a: 'Anything from 5 percent upward is good, above 10 percent is great, and sustained above 25 percent should be audited for artefacts.' },
        { q: 'Why do vendor reports disagree?', a: 'Different customer mixes and different definitions of reply. Some count auto-replies, some do not.' },
        { q: 'Are open rates a useful benchmark?', a: 'Not since Apple Mail Privacy Protection and Gmail image proxying. Track reply rate and positive reply rate instead.' },
      ]},
    ],
  },
];
