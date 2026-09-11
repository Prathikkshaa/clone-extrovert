import type { BlogPost } from '../posts';

export const WAVE1_POSTS: BlogPost[] = [
  {
    slug: 'buying-signal-playbook-local-b2b',
    title: 'The buying-signal playbook for local B2B',
    description:
      'A field guide to buying signals for local B2B: the taxonomy Milo watches for, how to score them, and how to turn a signal into a first meeting.',
    category: 'Buying signals',
    cluster: 'Buying signals',
    tags: ['buying signals', 'local prospecting', 'outbound', 'intent data', 'sales playbook'],
    excerpt:
      'The complete taxonomy of local buying signals, how to score them, and how to turn each one into a real first meeting.',
    datePublished: '2026-07-10',
    readMinutes: 11,
    body: [
      {
        type: 'stat',
        value: '72 hours',
        label: 'the window most local buying signals stay hot before the trigger goes cold and you are competing on offer, not timing',
      },
      {
        type: 'p',
        text: 'Most "local prospecting" advice is written by people who have never sold anything to a plumber. They lift a SaaS playbook, swap the logos for a ZIP code, and act surprised when funding-round triggers do not fire on a family-owned dental office. Local B2B has its own signal layer. It is louder and cheaper than anything Apollo will ever sell you, but you have to stop pretending Main Street runs on Crunchbase.',
      },
      {
        type: 'p',
        text: 'This is the taxonomy we use at Milo to score every local prospect before a single email goes out. It is opinionated, and it is the same framework we teach customers who are running outbound to SMBs for the first time.',
      },
      { type: 'h2', text: 'What counts as a buying signal?', id: 'definition' },
      {
        type: 'p',
        text: 'The clearest working definition comes from the intent-data teams that pioneered this vocabulary. UserGems calls a signal "an observable event that indicates a prospect is a good fit and likely to buy soon." Outreach frames signals as "trigger events that reveal timing." Put more plainly, signals answer the question "why now?" for a given account.',
      },
      {
        type: 'link',
        text: 'UserGems on buying signals',
        href: 'https://www.usergems.com/blog/buying-signals',
        label: 'Read the UserGems primer',
      },
      { type: 'h3', text: 'The three local why-nows' },
      {
        type: 'p',
        text: 'For local B2B the "why now?" is usually one of three things: a visible operational gap, a growth move, or an environmental trigger. The trick is knowing which specific artifacts each of those produces on the public internet.',
      },
      { type: 'h2', text: 'What signals make up the Milo local-signal taxonomy?', id: 'taxonomy' },
      {
        type: 'table',
        headers: ['Signal', 'What it means', 'Where it appears', 'Freshness'],
        rows: [
          ['No website', 'Business is running without a digital storefront', 'Google Business Profile with no site link', 'Static'],
          ['Thin online presence', 'One-page site, no SSL, or Facebook-only', 'Domain WHOIS, site crawl', 'Static'],
          ['Weak reviews', 'Under 20 reviews or rating below 4.0', 'Google Maps, Yelp', 'Weekly drift'],
          ['No Google Business Profile', 'Unclaimed or missing listing', 'Google Maps search', 'Static'],
          ['Hiring signal', 'Open role for a function you augment', 'Indeed, LinkedIn, company site', 'Days to weeks'],
          ['Storm or weather event', 'Roofing, tree, restoration demand spike', 'NOAA, local news', 'Hours to days'],
          ['Permit filed', 'Construction, HVAC, electrical scope', 'City permit portals', 'Days to weeks'],
          ['Seasonal window', 'Tax season, back-to-school, fiscal year end', 'Calendar', 'Predictable'],
          ['Ownership change', 'New owner listed on state records', 'Secretary of State filings', 'Weeks'],
          ['Menu or service change', 'New service line advertised', 'Site diff, social', 'Days'],
        ],
        caption: 'The ten signals Milo watches for local B2B prospecting.',
      },
      { type: 'h2', text: 'What is the difference between static and event signals?', id: 'static-vs-event' },
      {
        type: 'p',
        text: 'Two categories, two playbooks. Static signals (no website, weak reviews, no Google Business Profile) describe a persistent gap. They are always true until the business fixes them, so competition on these signals is a race on quality of outreach, not speed. Event signals (permits, storms, hires) have a decay curve. A roofing lead 48 hours after a hailstorm is worth ten leads a week later. If your workflow cannot reach event signals inside their freshness window, treat them as static and stop paying premium prices for real-time feeds.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'The 72-hour rule',
        text: 'For event signals, if you cannot personalize and send within 72 hours of the trigger, you are competing on offer, not timing. Choose your signals accordingly.',
      },
      { type: 'h2', text: 'How do you score a signal with the Milo FTR Score?', id: 'scoring' },
      {
        type: 'p',
        text: 'Not every signal is equal. Score each one on three axes and add them up. We call this the Milo FTR Score: Fit, Timing, Reachability. Each axis scores 1 to 3, so a signal maxes at 9 out of 9. Anything under 6 out of 9 goes to a nurture list, not the send queue.',
      },
      {
        type: 'ul',
        items: [
          'Fit (1 to 3): does the signal imply the business needs your specific offer, or is it just generic pain?',
          'Timing (1 to 3): how fresh is the trigger, and how narrow is the window before it goes cold?',
          'Reachability (1 to 3): can you contact the decision maker, or does the signal only touch a proxy?',
        ],
      },
      { type: 'h3', text: 'A worked score: clinic hire vs weak reviews' },
      {
        type: 'p',
        text: 'A hiring signal for a "Marketing Director" at a 30-person clinic is a strong fit if you sell fractional marketing, a strong timing signal (they will pick a partner in 6 weeks), and moderately reachable (the CEO usually approves). A weak-reviews signal for the same clinic scores lower on timing and often lower on reachability if the front-desk manager is the reader.',
      },
      { type: 'h2', text: 'How do you go from signal to first meeting?', id: 'workflow' },
      {
        type: 'steps',
        items: [
          {
            title: 'Detect',
            text: 'Pull candidates that match at least one signal, not a generic ICP filter. In Milo this scopes to public map data and reads their public web footprint that tags each business against the taxonomy above.',
          },
          {
            title: 'Enrich',
            text: 'Confirm the signal is real. A missing site on Google Business Profile is not proof; check WHOIS, LinkedIn, and Facebook. Discard businesses that already fixed the gap.',
          },
          {
            title: 'Score',
            text: 'Apply the Milo FTR Score (Fit + Timing + Reachability, each 1 to 3). Anything under 6 out of 9 goes to a nurture list, not the send queue.',
          },
          {
            title: 'Personalize',
            text: 'The email must reference the specific signal in the first line. "Noticed you are running without a site" beats "hope this finds you well" every time.',
          },
          {
            title: 'Send from a real inbox',
            text: 'Do not blast from a fresh domain. Warm up, throttle, and route replies to a human. Milo does this from your own Gmail or Outlook.',
          },
          {
            title: 'Book',
            text: 'One CTA per email. A Cal.com or Calendly link, or a soft ask for a reply. Do not stack asks.',
          },
        ],
      },
      { type: 'h2', text: 'What signals should you skip on purpose?', id: 'skip' },
      {
        type: 'p',
        text: 'Some signals popular in mid-market outbound (technographic changes, Series B announcements, LinkedIn engagement spikes) do not translate to local B2B. A hair salon does not use a CDP. A local law firm does not raise a Series B. Chasing these signals for local accounts wastes credits and produces awkward personalization. If a signal cannot plausibly apply to a 5 to 50 person business in your target vertical, drop it.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Signal fatigue is real',
        text: 'Sending five outreach threads to the same business across five signals in a month reads as spam, no matter how personalized each one is. Cap outreach at two signals per business per quarter.',
      },
      { type: 'h2', text: 'How does Milo automate this?', id: 'milo' },
      {
        type: 'p',
        text: 'Milo runs the whole taxonomy on autopilot. You describe your ICP in plain English, and we discover businesses on the public map, read their public footprint, tag every applicable signal, score the fit, draft the email, and send from your inbox. You pay per credit, not per seat, and the first 100 credits are free.',
      },
      {
        type: 'link',
        text: 'See the pipeline end to end',
        href: '/how-it-works',
        label: 'How Milo works',
      },
      {
        type: 'faq',
        items: [
          {
            q: 'Are buying signals the same as intent data?',
            a: 'Intent data is one flavor of signal, usually second-party topic-consumption data from B2B publishers. Signals is the broader category that also includes hires, permits, reviews, and any other observable trigger.',
          },
          {
            q: 'Do buying signals work for very small businesses?',
            a: 'Yes, but the signal mix changes. The corporate signals (funding, exec hires) largely disappear and are replaced by the local operational signals in the table above.',
          },
          {
            q: 'How many signals should I track at once?',
            a: 'Start with two. Pick one static signal that maps to your offer and one event signal you can react to fast. Add more only after each is producing meetings.',
          },
          {
            q: 'Where do storm and permit signals come from?',
            a: 'NOAA publishes storm event data, and most US city and county governments publish permit records through open portals. Both are free and public.',
          },
          {
            q: 'What is the strongest single signal for local B2B?',
            a: 'It depends on your offer. For web agencies, "no website" is unmatched. For roofers, storm events. For staffing firms, open roles. Match signal to offer, not the other way around.',
          },
        ],
      },
    ],
    related: [
      'google-maps-prospecting-not-scraping',
      'signal-vs-database-prospecting',
      'find-local-businesses-without-a-website',
    ],
  },
  {
    slug: 'google-maps-prospecting-not-scraping',
    title: 'Google Maps for prospecting, not scraping',
    description:
      'Google Maps is the best live directory of local B2B, and this walks the ethical workflow: query the official API, tag signals, skip the scrapers.',
    category: 'Local prospecting',
    cluster: 'Local prospecting',
    tags: ['google maps', 'prospecting', 'lead generation', 'scraping', 'ethics'],
    excerpt:
      'Scraping Google Maps is a legal grey zone and a technical dead end. Signal-based prospecting from Places is the real workflow.',
    datePublished: '2026-07-17',
    readMinutes: 10,
    body: [
      {
        type: 'p',
        text: 'A seller opens a Chrome tab, types "dentists in Austin" into Google Maps, and stares at 400 pins across the city. Somewhere in that grid is next quarter\'s pipeline. The tempting move is to reach for a scraper: paste a CSV into your sender, hit go, wait. The move that actually pays is quieter. It uses the same map, treats the data as reading not stealing, and layers the one thing a scraper never gives you.',
      },
      { type: 'h2', text: 'Why do sellers keep reaching for scrapers?', id: 'why-scrapers' },
      {
        type: 'p',
        text: 'A search like "dentists in Austin" on Google Maps returns hundreds of businesses with names, addresses, phone numbers, websites, ratings, and review counts. That is a lead list sitting in plain sight, so it is easy to see why tools like Apify actors and Outscraper get pitched as the shortcut. Copy the results into a CSV, upload to your sender of choice, done.',
      },
      { type: 'h3', text: 'Three hidden costs behind the shortcut' },
      {
        type: 'p',
        text: 'The problem is that the shortcut has three costs that only show up later: legal, technical, and quality.',
      },
      { type: 'h2', text: 'Is scraping Google Maps legal?', id: 'legality' },
      {
        type: 'p',
        text: 'The honest answer is "it depends, and Google actively disallows it." Google\'s Terms of Service prohibit automated access to Maps outside the official APIs. The public-data question was reopened by hiQ Labs v. LinkedIn (Ninth Circuit, 2022), which held that scraping public data is not by itself a Computer Fraud and Abuse Act violation. But CFAA is one law of many, and hiQ\'s case did not bless breach of contract, DMCA, or state-level claims.',
      },
      {
        type: 'link',
        text: 'Google Maps Platform Terms of Service',
        href: 'https://cloud.google.com/maps-platform/terms',
        label: 'Read the official terms',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Public does not mean unrestricted',
        text: 'A business phone number on Google Maps is public information anyone can look up. Downloading a million of them through a scraper that violates Google\'s ToS is a different question, and the risk sits with you, not the tool vendor.',
      },
      { type: 'h2', text: 'The technical treadmill', id: 'technical' },
      {
        type: 'p',
        text: 'Even if you accept the legal risk, scraping Maps is a moving target. Google rotates DOM structures, rate limits aggressively, uses reCAPTCHA on suspicious sessions, and blocks datacenter IP ranges. Every scraper vendor is running a residential proxy pool and a headless-browser farm to keep up. When their infrastructure has a bad day, your pipeline has a bad day.',
      },
      {
        type: 'p',
        text: 'Official directory data returns the same underlying business information, with a documented schema, a stable rate limit, and a real support contract. It costs more per record than a shady scraper, and much less than a Google-flagged domain.',
      },
      { type: 'h2', text: 'What is the difference between scraper and signal-based prospecting?', id: 'comparison' },
      {
        type: 'table',
        headers: ['Dimension', 'Scraper workflow', 'Signal-based prospecting'],
        rows: [
          ['Data source', 'Unofficial Maps scrape', 'Official directory data + public web research'],
          ['Legal posture', 'Grey zone, ToS violation', 'Supported API + public info'],
          ['Reliability', 'Breaks with DOM changes', 'Stable schema'],
          ['Enrichment', 'Name, phone, address', 'Signals + emails + context'],
          ['Personalization', 'Mail merge tokens', 'Signal-aware opening lines'],
          ['Reply rate', 'Low, spammy tone', 'Higher, contextual'],
          ['Cost model', 'Per record + proxies', 'Per verified lead'],
          ['Long-term risk', 'Domain + sender reputation', 'Manageable'],
        ],
        caption: 'The tradeoffs between scraping and signal-based prospecting.',
      },
      { type: 'h2', text: 'What workflow do we actually run?', id: 'workflow' },
      {
        type: 'steps',
        items: [
          {
            title: 'Describe the ICP in plain English',
            text: 'Not a filter tree. "Independent dental practices in Austin with under 15 reviews and no website." The description drives the query and the signal filters.',
          },
          {
            title: 'Query the public directory',
            text: 'Milo uses official public map data. Same data any human sees on Maps, but returned as structured JSON with a stable rate limit.',
          },
          {
            title: 'Crawl the public footprint',
            text: 'For every result, fetch the website (if any), the Google Business Profile, and up to two social profiles. This is where signals get confirmed.',
          },
          {
            title: 'Tag signals',
            text: 'No website, thin site, weak reviews, unclaimed listing, and so on. Businesses that already fixed a gap fall out.',
          },
          {
            title: 'Find the right contact',
            text: 'Owner or manager name from public sources, verified email, and a fallback to the contact form only when nothing else exists.',
          },
          {
            title: 'Draft, send, and route replies',
            text: 'Signal-aware first line, single CTA, sent from your own Gmail or Outlook with warmup. Replies land back in your inbox like a real conversation.',
          },
        ],
      },
      { type: 'h2', text: 'What about Apify and Outscraper?', id: 'competitors' },
      {
        type: 'p',
        text: 'Both are real products with legitimate use cases. Apify runs a marketplace of actors, some of which are Maps scrapers and some of which use official APIs cleanly. Outscraper offers a hosted Maps extraction service and is transparent about its methods. If your only requirement is a raw list of businesses with phone numbers, they work.',
      },
      { type: 'h3', text: 'What they leave undone' },
      {
        type: 'p',
        text: 'What they do not do is enrichment, signal tagging, drafting, or sending. You still need three more tools, three more subscriptions, and a way to keep them from stepping on each other. That is the gap Milo fills.',
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'The ethical version of "scraping"',
        text: 'Everything a human can see on Google Maps is fair to reference in outreach. "I noticed your practice does not have a site linked on Google" is honest and useful. It is not scraping, it is reading.',
      },
      {
        type: 'takeaway',
        title: 'The one thing to remember',
        text: 'Everything a human can see on Google Maps is fair to reference in outreach. Reading a public listing is not the same as scraping it, and the workflows that survive quarterly ToS changes are the ones built on supported directory data plus a signal layer, not on rotating proxy pools.',
      },
      {
        type: 'link',
        text: 'The buying-signal playbook for local B2B',
        href: '/blog/buying-signal-playbook-local-b2b',
        label: 'Pillar: buying signals',
      },
      {
        type: 'faq',
        items: [
          {
            q: 'Is it illegal to scrape Google Maps?',
            a: 'It violates Google\'s Terms of Service, which is a contractual claim rather than a criminal one in most jurisdictions. The CFAA question was narrowed by hiQ v. LinkedIn, but ToS breach, DMCA, and state torts remain live risks.',
          },
          {
            q: 'Can I get sued for using a Maps scraper?',
            a: 'Google has sent cease and desist letters and has sued repeat commercial scrapers. Individual sellers rarely see enforcement, but the sending domain and account risks are usually the bigger issue in practice.',
          },
          {
            q: 'Does the official directory API cost more than scraping?',
            a: 'Per record, yes. Per meeting booked, usually less, because the data is cleaner and the workflow is stable.',
          },
          {
            q: 'How do I get an owner email from a Google Maps listing?',
            a: 'You do not. You use the website and social links on the listing to find the owner through public sources, then verify the address. Milo does this automatically.',
          },
          {
            q: 'Can I use a scraped list for cold email if I comply with CAN-SPAM?',
            a: 'CAN-SPAM in the US does not require prior consent, but many state laws and GDPR do. The source of the list also matters for deliverability, not just legality.',
          },
        ],
      },
    ],
    related: [
      'buying-signal-playbook-local-b2b',
      'signal-vs-database-prospecting',
      'is-cold-email-legal',
    ],
  },
  {
    slug: 'signal-vs-database-prospecting',
    title: 'Signal-based prospecting vs lead databases',
    description:
      'Apollo and ZoomInfo sell contact databases. Milo sells buying signals. An honest side by side, where each category wins, and how to avoid both traps.',
    category: 'Prospecting',
    cluster: 'Prospecting',
    tags: ['prospecting', 'apollo', 'zoominfo', 'cognism', 'sales tools'],
    excerpt:
      'A fair comparison of database-first tools like Apollo and ZoomInfo against tools like Milo that trigger on live signals, with a clear guide to when each one wins.',
    datePublished: '2026-07-24',
    readMinutes: 10,
    body: [
      {
        type: 'tldr',
        text: 'Half the people arguing about Apollo versus timing tools online have never run a real outbound month. Databases sell you breadth on a seat license. Tools like Milo sell you a why-now on credits. If you already know exactly who to email, a database is the right tool and I am not going to talk you out of it. If you keep hearing "good list, wrong week" from your reps, buy timing instead.',
      },
      { type: 'h2', text: 'What does each category actually sell?', id: 'categories' },
      {
        type: 'p',
        text: 'A lead database is a large, structured contact set: emails, phone numbers, titles, and firmographics for tens or hundreds of millions of people. ZoomInfo pioneered the category at the enterprise tier. Apollo brought a self-serve version to mid-market. Cognism focused on EU coverage and GDPR compliance. All three price on annual seats and gate premium data behind higher tiers.',
      },
      { type: 'h3', text: 'The Milo product shape' },
      {
        type: 'p',
        text: 'A signal tool is a smaller, denser workflow: discover accounts that just did something relevant, enrich the trigger, personalize the outreach, and send it. The database is a byproduct of the workflow, not the product.',
      },
      {
        type: 'p',
        text: 'Neither is dishonest about what it sells. The mistake is buying one when you needed the other.',
      },
      { type: 'h2', text: 'The comparison, honestly', id: 'table' },
      {
        type: 'table',
        headers: ['Dimension', 'Apollo / ZoomInfo / Cognism', 'Milo'],
        rows: [
          ['Core promise', 'Every contact you might want', 'Contacts likely to buy now'],
          ['Pricing model', 'Annual seats, data-tier gates', 'PAYG credits, no seats'],
          ['Data freshness', 'Bulk refresh cycles', 'Live pull per query'],
          ['Local B2B coverage', 'Weak for under-50-person', 'Native focus'],
          ['Signal support', 'Add-on in enterprise tiers', 'Built into every lead'],
          ['Sending', 'Bring your own tool', 'Your Gmail or Outlook'],
          ['Reply handling', 'Bring your own tool', 'Routed to your inbox'],
          ['Best for', 'Mid-market SDR teams with defined ICPs', 'Founders and small teams on local B2B'],
        ],
        caption: 'Category comparison, unhyped.',
      },
      { type: 'h2', text: 'Where do databases genuinely win?', id: 'db-wins' },
      {
        type: 'p',
        text: 'If you sell into a well-mapped market (say, VP-level buyers at 500-to-5000 employee SaaS companies in North America), a database is the correct tool. The universe is finite, the personas are stable, and the value of exhaustively listing every account outweighs the value of timing. A ZoomInfo seat pays for itself the first quarter you use it correctly.',
      },
      { type: 'h3', text: 'When team size flips the math' },
      {
        type: 'p',
        text: 'Databases also win when you have a large SDR team. Seat pricing looks bad in a spreadsheet, but pooled licenses distribute the fixed cost. If you have twenty SDRs each dialing 80 accounts a day, the per-contact math flips in your favor.',
      },
      { type: 'h2', text: 'Where do databases quietly fail?', id: 'db-fails' },
      {
        type: 'p',
        text: 'Three places, all specific to local B2B.',
      },
      {
        type: 'ul',
        items: [
          'Coverage: sub-50-person businesses have inconsistent LinkedIn coverage, few tracked emails, and often no listed executives. Database enrichment rates fall off a cliff below 50 headcount.',
          'Staleness: SMB personnel churn is high and the databases refresh on quarterly cycles. By the time you email the "Marketing Manager" listed, they left six months ago.',
          'Signal gap: knowing that ABC Dental exists is not the same as knowing they just opened a second location and are hiring hygienists. Databases show you the state, not the change.',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'The seat-license trap',
        text: 'If you are a two-person team paying for four seats "in case we grow," you are financing the vendor\'s revenue predictability, not your pipeline.',
      },
      { type: 'h2', text: 'Where does signal-first win?', id: 'signal-wins' },
      {
        type: 'p',
        text: 'These tools win when the timing dimension matters more than the coverage dimension. That is almost always true in local B2B, and often true in SMB SaaS. A local roofing company that just weathered a hailstorm is worth ten roofing companies picked at random. A dental practice hiring their first office manager is a better lead than a matched-ICP practice you cold-mailed last quarter.',
      },
      {
        type: 'p',
        text: 'They also win on total cost of ownership for small teams. There are no seats to buy for the intern who occasionally helps, no annual commitment, no data-tier upsell. You pay per lead you actually work.',
      },
      { type: 'h2', text: 'How do you choose between them?', id: 'choose' },
      {
        type: 'steps',
        items: [
          {
            title: 'Write down the trigger you care about',
            text: 'If you can name a specific "why now" (a hire, a permit, a storm, a review drop), signals are your tool. If your only trigger is "matches the ICP," databases are.',
          },
          {
            title: 'Count your users',
            text: 'One or two people, PAYG wins on math. Ten or more, seat licenses are efficient.',
          },
          {
            title: 'Check coverage where it matters',
            text: 'Run the same 50-account test against a database trial and a signal tool. Compare hit rates and freshness on your actual ICP.',
          },
          {
            title: 'Decide on the workflow',
            text: 'A database gives you rows. A signal tool gives you a queue. Match to how your team actually operates.',
          },
        ],
      },
      { type: 'h2', text: 'The hybrid stack', id: 'hybrid' },
      {
        type: 'p',
        text: 'Some teams run both, and it is a defensible choice. Use the database for named-account penetration and a signal tool for opportunistic top-of-funnel. The one thing to avoid is running both against the same lead universe. That is how you burn a domain: two systems each sending "just one more" follow-up on the same account.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'A note on fairness',
        text: 'Apollo, ZoomInfo, and Cognism are serious products with serious engineering behind them. They are not our enemy. They are a different job.',
      },
      { type: 'h2', text: 'Where does Milo fit?', id: 'milo' },
      {
        type: 'p',
        text: 'Milo sits on the timing side of this comparison. Discovery, crawl, enrichment, draft, send from your inbox, reply routing, and booking, priced per credit. The first 100 credits are free, and there is no seat cost.',
      },
      {
        type: 'link',
        text: 'See the full workflow',
        href: '/how-it-works',
        label: 'How Milo works',
      },
      {
        type: 'link',
        text: 'Pricing and credits',
        href: '/pricing',
        label: 'Milo pricing',
      },
      {
        type: 'faq',
        items: [
          {
            q: 'Is Milo cheaper than Apollo?',
            a: 'Depends on volume. For solo founders and small teams, PAYG credits usually cost less than an annual Apollo seat. For teams over ten SDRs, Apollo is often cheaper per contact.',
          },
          {
            q: 'Can I import a database export into Milo?',
            a: 'Not directly today. Milo pulls its own leads from public map data and the public web because that is what the signal layer runs on.',
          },
          {
            q: 'Do databases have buying signals?',
            a: 'The enterprise tiers do, usually as intent-topic data licensed from Bombora or G2. It is a different flavor of signal than what Milo watches locally.',
          },
          {
            q: 'What about ZoomInfo Copilot or Apollo Play?',
            a: 'Both are moves toward signal-driven workflows on top of a database foundation. If you already own the database, they are worth trying.',
          },
          {
            q: 'Which category has better email deliverability?',
            a: 'Neither, structurally. Deliverability is a function of how you send, not where the list came from. Both categories can burn a domain if used badly.',
          },
        ],
      },
    ],
    related: [
      'buying-signal-playbook-local-b2b',
      'google-maps-prospecting-not-scraping',
      'why-cold-emails-go-to-spam',
    ],
  },
  {
    slug: 'high-intent-local-leads',
    title: 'How to identify high-intent local leads',
    description:
      'A decision tree, scoring rubric, and three worked examples for spotting the local businesses most likely to buy from you inside the next 90 days.',
    category: 'Local prospecting',
    cluster: 'Buying signals',
    tags: ['lead qualification', 'local prospecting', 'buying signals', 'sales frameworks'],
    excerpt:
      'The decision tree, scoring rubric, and worked examples we use to separate high-intent local leads from noise.',
    datePublished: '2026-07-31',
    readMinutes: 11,
    body: [
      {
        type: 'p',
        text: 'Every seller has a version of the same complaint: "our list is fine, the replies just are not there." Usually the list is not fine. It is a matched-ICP export where every row has an equal claim on the send queue, so nothing gets priority and the calendar stays quiet. High intent is what separates a row from a queue position, and in local B2B it is not a mood or a vibe. It is a stack of observable facts you can score.',
      },
      { type: 'h2', text: 'What does "high intent" mean in local B2B?', id: 'define' },
      {
        type: 'p',
        text: 'The mid-market intent vendors define intent as "topic-level content consumption above a baseline." That definition does not travel to local. A plumber does not read G2 reviews before buying software. High intent for a local business is a change in their operational reality that makes buying now more likely than buying next quarter.',
      },
      { type: 'h3', text: 'Why the change is observable' },
      {
        type: 'p',
        text: 'That change is almost always visible. The job is to see it, weight it correctly, and reach the person who can decide.',
      },
      { type: 'h2', text: 'How do you build the decision tree?', id: 'tree' },
      {
        type: 'steps',
        items: [
          {
            title: 'Is there a signal?',
            text: 'No signal, no priority. Move to a nurture list. Do not send an ICP-only email at the top of the queue.',
          },
          {
            title: 'Is the signal fresh?',
            text: 'Under 30 days for event signals, current for static signals. Stale event signals lose their edge and belong with the nurture list.',
          },
          {
            title: 'Does the signal match your offer?',
            text: 'A hiring signal is high intent for staffing firms and low intent for accountants. Match, or drop.',
          },
          {
            title: 'Can you reach the decision maker?',
            text: 'Owner or manager email, direct dial, or verified LinkedIn. Anything else scores lower.',
          },
          {
            title: 'Is the business the right size?',
            text: 'Too small and there is no budget. Too large and you are talking to a procurement gatekeeper. Define your band and enforce it.',
          },
        ],
      },
      { type: 'h2', text: 'How do you score a signal?', id: 'rubric' },
      {
        type: 'table',
        headers: ['Axis', '1 point', '3 points', '5 points'],
        rows: [
          ['Signal strength', 'Weak or generic', 'Clear operational gap', 'Time-bound event trigger'],
          ['Reachability', 'Only info@ address', 'Manager verified', 'Owner or GM verified'],
          ['Offer fit', 'Tangential', 'Reasonable match', 'Direct solve for the signal'],
        ],
        caption: 'Score each axis 1, 3, or 5. Skip 2 and 4 to force decisiveness.',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Work the queue by score, not by list order',
        text: 'A 13 today beats a 15 in three days. But a 7 today is not worth an email if a 13 is waiting.',
      },
      { type: 'h2', text: 'Worked example: a web agency selling to no-website businesses', id: 'example-1' },
      {
        type: 'p',
        text: 'ICP: independent professional services businesses in a metro, 3 to 25 employees, no website or a Facebook-only presence. Signal: "no website" (static, strong for this offer).',
      },
      {
        type: 'ul',
        items: [
          'Signal strength: 5 (direct offer solve).',
          'Reachability: 3 to 5 (owner name is often on the Google Business Profile or Secretary of State record).',
          'Offer fit: 5.',
          'Total: 13 to 15. Every business in this list gets worked.',
        ],
      },
      { type: 'h3', text: 'The opener that writes itself' },
      {
        type: 'p',
        text: 'Personalization line writes itself: "Noticed [Business] does not have a site linked on Google. Happy to send a two-page draft so you can decide if it is worth doing."',
      },
      {
        type: 'link',
        text: 'Deep dive on this specific ICP',
        href: '/blog/find-local-businesses-without-a-website',
        label: 'Find local businesses without a website',
      },
      { type: 'h2', text: 'Worked example: an HVAC parts supplier during storm season', id: 'example-2' },
      {
        type: 'p',
        text: 'ICP: independent HVAC contractors in storm-affected zip codes. Signal: NOAA severe weather event within 14 days plus a related permit filing.',
      },
      {
        type: 'ul',
        items: [
          'Signal strength: 5 (event trigger, narrow window).',
          'Reachability: 3 (owners answer their phones during storm season, emails less so).',
          'Offer fit: 5 (parts availability is the bottleneck after storms).',
          'Total: 13. Work same day.',
        ],
      },
      {
        type: 'p',
        text: 'Note the offer changes the send channel. During a storm, a two-line SMS or a phone call outperforms a paragraph email. Milo drafts and sends email; for storm-driven work, pair it with a phone dial in the first 48 hours.',
      },
      { type: 'h2', text: 'Worked example: a fractional CFO firm targeting local growth', id: 'example-3' },
      {
        type: 'p',
        text: 'ICP: 15 to 60 person local services businesses, hiring a controller or "head of finance." Signal: open finance-leadership role posted in the last 21 days.',
      },
      {
        type: 'ul',
        items: [
          'Signal strength: 5 (hiring for a role a fractional CFO offsets).',
          'Reachability: 3 (usually the CEO or COO approves the hire, and they read LinkedIn DMs).',
          'Offer fit: 5 (fractional CFOs are a direct substitute during the hiring window).',
          'Total: 13. Reach out before the role closes.',
        ],
      },
      {
        type: 'p',
        text: 'The pitch is not "hire us instead of a controller." It is "run fractional for 90 days while you complete the search, then decide."',
      },
      { type: 'h2', text: 'What do you do with low-score leads?', id: 'low-score' },
      {
        type: 'p',
        text: 'Nurture, do not delete. A 6 today can become a 13 next quarter when a new signal fires. Two rules keep the nurture list healthy: cap the send volume so the low-score list does not eat your domain reputation, and set a re-scoring cadence (monthly for static signals, weekly for event-eligible ICPs).',
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'The right first line',
        text: 'The first line of your email should reference the specific signal by name. If the reader cannot tell why you picked them out of a directory, the score does not matter.',
      },
      {
        type: 'takeaway',
        title: 'The one thing to remember',
        text: 'High intent in local B2B is not a mood, it is a stack of observable facts scored across three axes: signal strength, buyer reachability, and offer fit. Work the queue by score, not list order. A 13 today beats a 15 in three days, and a 7 today is not worth the send while the 13 is waiting.',
      },
      {
        type: 'link',
        text: 'The pillar on buying signals',
        href: '/blog/buying-signal-playbook-local-b2b',
        label: 'Signal playbook',
      },
      {
        type: 'faq',
        items: [
          {
            q: 'What is a "good" score threshold?',
            a: 'We use 10 as the working threshold. Anything under 10 goes to nurture. Anything over 12 gets same-week treatment.',
          },
          {
            q: 'Can I score by hand or do I need a tool?',
            a: 'You can absolutely score by hand for the first 50 accounts to internalize the rubric. Past that, automation pays for itself quickly.',
          },
          {
            q: 'What if a business has multiple signals at once?',
            a: 'Take the strongest single signal, do not stack. Stacking inflates scores and produces long, unfocused first emails.',
          },
          {
            q: 'How often should signals be refreshed?',
            a: 'Event signals daily. Static signals monthly. Reachability data quarterly, or whenever bounce rates rise.',
          },
          {
            q: 'Should I score leads before or after enrichment?',
            a: 'After. Scoring on pre-enrichment fields (name, phone, category) throws away most of the reachability and offer-fit signal.',
          },
          {
            q: 'What about buyer psychographics?',
            a: 'For local B2B, ignore them. The observable operational signals dominate. Psychographic layering is a mid-market SaaS habit that does not translate.',
          },
        ],
      },
    ],
    related: [
      'buying-signal-playbook-local-b2b',
      'google-maps-prospecting-not-scraping',
      'find-local-businesses-without-a-website',
    ],
  },
];
