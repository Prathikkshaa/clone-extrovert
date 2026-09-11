import type { BlogPost } from '../posts';

// Wave 7. Higher-margin local verticals the earlier waves ignored: legal
// (solo and small firm), dental, med-spa, and veterinary. Each post is
// written for the operator of the practice, not the agency selling to them.

const POST_1: BlogPost = {
  slug: 'legal-firm-lead-generation-signals',
  seoTitle: 'Legal firm lead generation: signals for solo attorneys',
  title: 'Legal firm lead generation: five buying signals for solo and small-firm attorneys in 2026',
  description:
    'Solo and small-firm attorney lead-gen: five public buying signals, an Avvo drift check, and a cold email that opens on a specific docket line.',
  category: 'Verticals',
  cluster: 'Verticals',
  tags: ['legal', 'law firm', 'attorney', 'lead generation', 'cold email'],
  excerpt:
    'Signals-first attorney lead gen. County dockets, Avvo drift, bar registry moves, and a cold email that opens on a filing you can name.',
  datePublished: '2026-09-01',
  readMinutes: 10,
  related: [
    'find-local-businesses-without-a-website',
    'high-intent-local-leads',
    'is-cold-email-legal',
  ],
  body: [
    { type: 'stat', value: '$120 to $600', label: 'per personal-injury or family-law lead through paid channels in most US metros, sold to three or four other firms before your intake picks up the phone' },

    { type: 'p', text: 'Most attorneys I have worked with treat lead-gen the way they treat cardio: they know they should do it, they resent the vendor, and they pay retainer fees to make the guilt go away. The uncomfortable truth is that solo and small-firm lead-gen is not a marketing problem. It is a signal problem. The public record already tells you which residents in your county just became a plaintiff, which competing firm just lost a senior associate, and which practice area page on your competitor is quietly ranking for the search terms you should own.' },
    { type: 'p', text: 'This is a field manual for that. Five signals you can pull from public sources today, an Avvo drift check most firms never run on themselves, and a cold email template that opens on a specific filing rather than a generic "we noticed you are a law firm."' },

    { type: 'who-this-is-for', items: [
      'Solo practitioners buying leads from Nolo, Avvo, or Google LSA and watching cost-per-signed-case climb',
      'Two-to-eight attorney firms with an intake coordinator who has bandwidth for outbound calls but no list to work',
      'Managing partners who tried a marketing agency retainer and cancelled after six months of "brand awareness"',
    ] },

    { type: 'h2', text: 'Which signals actually predict a case?', id: 'signals' },
    { type: 'p', text: 'Signals for legal come in two shapes. The first is claimant-side: something happened in a public docket or a court filing that names a person who now needs a lawyer. The second is competitor-side: a firm across the county is weakening in a specific practice area, and that weakness is visible in review velocity, staff turnover, or a stale website.' },
    {
      type: 'table',
      caption: 'Five public signals for solo and small-firm attorneys.',
      headers: ['Signal', 'Where to find it', 'Why it matters'],
      rows: [
        ['New civil filings by pro se plaintiff', 'County clerk online docket (most counties publish weekly)', 'A person filing without counsel is your warmest possible outbound audience for family, small-claims, or landlord-tenant.'],
        ['Foreclosure or eviction filings', 'County recorder or clerk, weekly download', 'Signals urgent need for real-estate or debt work. Filing includes attorney of record on the plaintiff side, so you know who is already staffed.'],
        ['Avvo rating drift or missing profile', 'Avvo.com search by ZIP and practice area', 'A firm with a stale 6.5 or no photo is a firm losing intake calls. That is your opening.'],
        ['Competing attorney leaves firm', 'State bar public registry (annual license renewals list employer)', 'When a senior associate switches firms, their book of business is briefly up for grabs. So is their old firm.'],
        ['Missing practice-area page on a competitor', 'Screaming Frog crawl of the top five firms in your county for your practice area', 'A firm with no dedicated "Chapter 7 bankruptcy" page is not ranking for it. You can.'],
      ],
    },
    { type: 'link', text: 'PACER: federal court records', href: 'https://pacer.uscourts.gov/', label: 'PACER federal docket search' },

    { type: 'h3', text: 'The county docket signal in practice' },
    { type: 'p', text: 'Every county in the US that I have looked at publishes a weekly civil docket online, and most of them let you filter by case type. If you practice family law in a mid-size county, pulling last week\'s new dissolution-of-marriage filings takes about twenty minutes and gives you a list of thirty to sixty households now paying an attorney or about to. If the filing lists the petitioner as pro se, that is a person you can ethically contact under most state bar rules for information about counsel. Check your specific state rule 7.3 (solicitation) before sending anything.' },
    { type: 'p', text: 'The rule of thumb: dockets that are useful for lead-gen are the ones that name a specific event that generates legal need. New civil suit, foreclosure notice, eviction, small-claims plaintiff, probate opening. Docket entries that only reference existing cases (motion filed, hearing continued) are not signals; they are noise.' },

    { type: 'h3', text: 'Avvo drift and why it is your best local wedge' },
    { type: 'p', text: 'Avvo remains the sleeper directory for consumer legal search. It ranks in the top three organic results for "{practice area} attorney {city}" in most US markets, and its rating algorithm rewards claim-and-update behavior. Firms that claimed their Avvo profile in 2014 and stopped touching it have drifted from a 9.0 to a 6.8 while their newer competitors climbed. Pull the top ten Avvo profiles in your county for your practice area, sort by last-updated, and you will find three to five firms visibly weakening. When you call, you already know the wound: "I noticed your Avvo shows a 6.8 with no recent client reviews. Every other family law firm in the county is between 8.5 and 9.5. Want to know what changed in their profiles?"' },

    { type: 'h2', text: 'How do you weaponize the bar registry?', id: 'bar-registry' },
    { type: 'p', text: 'Every state bar publishes its licensed-attorney registry with employer and practice area. When an attorney moves firms, both firms show up in the diff between this quarter\'s registry and last quarter\'s. That diff is a lead source most firms have never touched. The attorney who just left is a hiring target or a referral partner. The firm they left is a client target with a hole in the roster and (usually) a stalled marketing calendar.' },
    { type: 'p', text: 'Practical version: download the registry every quarter, save the CSV, diff against last quarter. Highlight rows where the employer changed within your county. Route the list to the intake coordinator for a phone call and to the managing partner for a coffee.' },

    { type: 'h2', text: 'What does the cold email actually say?', id: 'cold-email' },
    { type: 'p', text: 'A cold email to another law firm that opens with "we help law firms grow" is dead on arrival. Managing partners get twenty of those a week and their spam filter is trained on the vocabulary. The email that gets a reply names one specific defect in the recipient\'s public presence and asks a direct question.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Cold email template (managing partner, small firm)',
      text: 'Subject: your Avvo rating in {county}. Body: {Managing partner first name}, I pulled the Avvo profiles for family law firms in {county} this week. Yours shows a {rating}, no reviews since {year}, and no photo. The three firms above you in the ranking updated their profiles in the last 90 days and average an 8.9. I have a 20-minute walkthrough of exactly what they changed. Worth a call Thursday or Friday?',
    },
    { type: 'p', text: 'The email works because the first sentence names something the recipient can verify in ten seconds. No claims about ROI, no case studies, no "we work with firms like yours." The opener passes the "could this have gone to a thousand other firms" test only if you actually did pull the profile. If you did not, the recipient will smell it.' },

    { type: 'callout', tone: 'warn', title: 'Bar rule 7.3 warning', text: 'Direct solicitation of a specific person you know needs legal services is regulated in every US state under some version of Model Rule 7.3. Contacting other law firms about business services is generally exempt. Contacting a pro se plaintiff you found on a docket is not. Read your state rule before sending; some states require the words "Advertising Material" on the envelope or subject line, some prohibit real-time contact entirely.' },

    { type: 'h2', text: 'What does a monthly cadence look like?', id: 'cadence' },
    { type: 'ol', items: [
      'Week 1: pull last month\'s civil docket, filter to your practice area, extract pro se filings. Send letters that comply with state rule 7.3.',
      'Week 2: run Avvo drift on the top ten firms in your county for your practice area. Cold email the three weakest managing partners on the referral-partner angle.',
      'Week 3: diff the state bar registry against last quarter. Identify attorneys who switched firms. Coffee outreach to the movers, cold email to the firms they left.',
      'Week 4: crawl the top five competitor sites. Identify missing practice-area pages. Ship a page on your site that fills the gap and submit to Google Search Console.',
    ] },

    { type: 'faq', items: [
      { q: 'Is it legal to contact a pro se plaintiff I found on a docket?', a: 'It depends on your state. Most states permit written solicitation with the words "Advertising Material" prominently placed and prohibit in-person or telephone solicitation to a specific known claimant. Read your state\'s version of Model Rule 7.3 before you send.' },
      { q: 'How often does the state bar registry update?', a: 'Most states publish the licensed-attorney list annually with employer refreshed at license renewal, and a handful update quarterly. Set a calendar reminder for the renewal month and diff then.' },
      { q: 'Which practice areas produce the best signals?', a: 'Family, bankruptcy, personal injury, and landlord-tenant produce docket signals that name a specific person or property. Corporate, tax, and IP produce signals through bar registry moves and competitor website weakness rather than dockets.' },
      { q: 'What if my county docket is not online?', a: 'About 15 percent of US counties still require in-person clerk visits. In those counties the signal is more valuable because fewer firms are using it. Send an intake clerk once a month with a laptop.' },
    ] },

    { type: 'takeaway', title: 'The one thing to remember', text: 'Solo and small-firm attorney lead-gen is a public-record problem, not a marketing problem. The county docket, the state bar registry, and an Avvo drift report together produce more warm outbound than any paid retainer at a lower total spend. The email that gets a reply names one thing the recipient can verify in ten seconds. Everything else is a tax on your time.' },
  ],
};

const POST_2: BlogPost = {
  slug: 'dental-practice-new-patient-leads-2026',
  seoTitle: 'Dental practice new-patient leads for 2026',
  title: 'Dental practice new-patient leads in 2026: hiring signals, booking widgets, and a cold email that starts on the hygienist hire',
  description:
    'Dental practice new-patient acquisition: hygienist-hire signals, board filings for acquisitions, GBP photo audits, and one cold email that opens on the hire.',
  category: 'Verticals',
  cluster: 'Verticals',
  tags: ['dental', 'dentist', 'new patient', 'lead generation', 'cold email'],
  excerpt:
    'Signals-first dental prospecting. Hygienist hires, state board filings, GBP photo weakness, and a cold email that names the new hire by first name.',
  datePublished: '2026-09-02',
  readMinutes: 10,
  related: [
    'get-web-design-clients-no-ads',
    'find-local-businesses-without-a-website',
    'roofing-leads-no-ads',
  ],
  body: [
    { type: 'stat', value: '$150 to $350', label: 'average acquisition cost per new dental patient through Google Ads in US metros in 2026, before you subtract the ones who cancel their second appointment' },

    { type: 'p', text: 'A practice that just hired a hygienist has 40 extra appointment slots per week to fill starting in about six weeks. That is a real number, not a marketing hypothetical. If you sell any service to dental practices, from patient-recall software to a whitening supply line, the six-week window between the hire announcement and the first Monday the new operator sits down is the most economically motivated moment a practice manager will experience all year. Miss it and you are back to competing with the eighty other vendors who email cold every Tuesday morning.' },
    { type: 'p', text: 'This is a field manual for dental new-patient acquisition and for outbound to dental practices. Signals you can pull today, the compliance line most agencies quietly cross, and a cold email that starts on the specific hire.' },

    { type: 'h2', text: 'Which signals predict a practice is buying?', id: 'signals' },
    { type: 'p', text: 'Signals split into two shapes. The first is capacity: the practice just added a chair, hired a hygienist, or bought another practice, and it now has more supply than demand. The second is quality: the practice has visible weakness in its online presence that maps to a measurable dip in new-patient calls.' },
    {
      type: 'table',
      caption: 'Five signals for outbound to a dental practice.',
      headers: ['Signal', 'Where to find it', 'Why it matters'],
      rows: [
        ['New hygienist or associate hire', 'LinkedIn "new hire" filter by employer, Indeed listing removed from board', 'Practice has ~40 new weekly appointment slots to fill starting 4 to 6 weeks after start date.'],
        ['Practice acquisition or DSO rollup', 'State dental board ownership filings, DSO press releases', 'Owner is under a growth mandate and buying marketing services with post-close capital.'],
        ['Insurance network change', 'Delta Dental / MetLife provider directory diff, quarterly', 'Practice dropping a major network needs to replace 15 to 30 percent of its patient base.'],
        ['Weak Google Business Profile photos', 'GBP profile inspection: photo count, staff photos present, exterior photo age', 'GBP profiles with under 15 photos and no staff shots consistently underperform on new-patient calls.'],
        ['No online booking widget on site', 'Manual check of practice site homepage and services pages', 'Practice is losing every prospective patient who wants to book at 10pm. That is 30 to 50 percent of consumer intent in 2026.'],
      ],
    },
    { type: 'link', text: 'ADA state dental board directory', href: 'https://www.ada.org/resources/licensure/licensure-dental-boards', label: 'State dental board directory' },

    { type: 'h3', text: 'The hygienist-hire signal in practice' },
    { type: 'p', text: 'LinkedIn\'s "new hire" filter is the fastest source. Filter by industry (Medical Practices) and geography, sort by recently added, and you get a stream of dental hygienists starting new roles. Cross-reference with Indeed listings the practice recently pulled down. When both signals agree, the hire is confirmed and the start date is usually within 30 days. That is your entry window for anything that fills schedule: patient-recall SMS, referral programs, membership plans, sleep-apnea screening kits.' },
    { type: 'p', text: 'Practical version: pull the LinkedIn list Monday morning, dedupe against last week, and export a CSV with practice name, new hire first name, start date if visible, and the practice manager\'s name (usually the second dental hygienist or the office manager listed on the practice site). That is your call list for Tuesday.' },

    { type: 'h3', text: 'GBP photo audit and why it is a real signal' },
    { type: 'p', text: 'Google Business Profile is where new patients decide. Google\'s own local ranking documentation is explicit that photo count, staff photos, and recency correlate with call volume. Practices with under 15 photos or no staff shots consistently underperform. Pull the top 20 dental practices in your ZIP by GBP ranking. Sort by photo count ascending. The three or four at the bottom of that list are practices losing calls right now. They will pay to fix it if you can show them the gap.' },

    { type: 'h2', text: 'How do you weaponize state dental board filings?', id: 'board-filings' },
    { type: 'p', text: 'Every state dental board publishes changes in ownership, license transfers, and new practice openings. Most publish these as PDFs on the board meeting agenda pages. Set a monthly reminder to pull the last agenda and grep for "change of ownership" and "new practice." The former is a DSO rollup or a private-practice sale. The latter is a greenfield practice that will not have a single patient on the books at open. Both are aggressive buyers of new-patient marketing for the first 12 months.' },
    { type: 'p', text: 'The rollup signal is especially strong because DSOs raise capital on a promise of same-store revenue growth. That growth line has to come from somewhere, and post-close it usually comes from marketing and referral spend. If you sell into dental and you are not tracking the DSO acquisition calendar in your state, you are leaving the highest-intent buyers on the table.' },

    { type: 'h2', text: 'What does the cold email actually say?', id: 'cold-email' },
    { type: 'p', text: 'A cold email to a dental practice manager that opens with "we help dental practices grow" is deleted before the first sentence finishes rendering. The email that gets a reply names the new hire by first name and refers to a real capacity number.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Cold email template (practice manager)',
      text: 'Subject: {new hire first name} starting in {month}? Body: {Practice manager first name}, saw {new hire first name} joins {practice name} on {start date}. That is roughly 40 new weekly hygiene slots to fill in the first 6 weeks. We just did a recall SMS run for {peer practice in same city} that filled 78 percent of the equivalent block in month one. Worth a 15 minute call this Thursday?',
    },

    { type: 'callout', tone: 'warn', title: 'HIPAA compliance line', text: 'Anything that touches actual patient records (recall lists, appointment history, treatment plans) triggers HIPAA. If your product handles PHI, you need a signed BAA before the first data import. Marketing outreach that does not touch PHI is unregulated, but the moment you promise to "clean up their patient list," you are inside HIPAA scope. Practice managers know this. Bring it up in the first call rather than making them ask.' },

    { type: 'h2', text: 'What does a monthly cadence look like?', id: 'cadence' },
    { type: 'ol', items: [
      'Week 1: LinkedIn new-hire pull, dedupe, first-touch email to practice manager on the hygienist-hire angle.',
      'Week 2: state dental board filing pull, tag DSO acquisitions and new practices, first-touch to the owner or new owner.',
      'Week 3: insurance directory diff (Delta, MetLife, Cigna). Identify practices that dropped a major network in the last 30 days. First-touch on the patient-replacement angle.',
      'Week 4: GBP photo audit of the bottom 20 practices in your metro. First-touch with a screenshot attached showing the gap.',
    ] },

    { type: 'faq', items: [
      { q: 'How fast should I move after the hire is announced?', a: 'Within 10 business days of the LinkedIn announcement is the sweet spot. Earlier and the practice manager has not yet accepted that capacity is coming. Later and every other vendor with the same list has already emailed.' },
      { q: 'Do DSO-owned practices buy differently from independents?', a: 'Yes. DSOs centralize marketing decisions at the regional or corporate level. Get past the practice manager to the regional director; the practice manager often cannot approve the spend but can make the introduction if you frame the pitch as "help me hit my new-patient target."' },
      { q: 'Is a GBP audit enough to open a conversation?', a: 'Only if you can quantify the gap. "Your GBP has 8 photos and the top three practices in your ZIP have 40+" is a real opener. "You should update your Google profile" is not.' },
      { q: 'What if the practice has no website at all?', a: 'That is a signal in itself and a different sale. Route it to your web-design offer and skip the recall or booking pitch until they own a working site.' },
    ] },

    { type: 'takeaway', title: 'The one thing to remember', text: 'Dental practices buy on capacity, not on brand. The hygienist hire, the acquisition close, the network drop, the new chair: each of those creates a specific, dated, unfilled schedule. Outbound that names the event by date and quantifies the gap gets a reply. Outbound that talks about "growing your practice" gets deleted. And keep HIPAA in the frame: if your product touches PHI, say so before they have to ask.' },
  ],
};

const POST_3: BlogPost = {
  slug: 'med-spa-cold-outreach-playbook',
  seoTitle: 'Med-spa cold outreach playbook for operators',
  title: 'The med-spa cold outreach playbook: device installs, seasonality, and one email that respects HIPAA',
  description:
    'Med-spa lead-gen field manual: device install signals, cosmetology board hires, Yelp category drift, pre-summer seasonality, and a HIPAA-safe cold email.',
  category: 'Verticals',
  cluster: 'Verticals',
  tags: ['med spa', 'aesthetics', 'botox', 'lead generation', 'cold email'],
  excerpt:
    'Signals-first med-spa outbound. Device installs, cosmetology board hires, Yelp drift, seasonal windows, and one email that respects HIPAA and state medical board rules.',
  datePublished: '2026-09-03',
  readMinutes: 10,
  related: [
    'is-cold-email-legal',
    'why-cold-emails-go-to-spam',
    'buying-signal-playbook-local-b2b',
  ],
  body: [
    { type: 'stat', value: '$180 to $520', label: 'per new Botox or laser consultation lead through Meta ads in most US metros in 2026, and the industry average consult-to-booking rate is under 40 percent' },

    { type: 'p', text: 'Med-spas are one of the highest-margin local businesses in the country and one of the worst-served by outbound. The industry is younger than plumbing, less consolidated than dental, and just regulated enough that most agencies steer clear. That is your opening. If you sell software, financing, injectables, staff training, or booking flows into aesthetics, the operators are largely running on Instagram intuition and Yelp roulette. They will pay for anything that shows up with a real signal and does not sound like a bot.' },
    { type: 'p', text: 'This is a field manual for med-spa outbound. Signals you can pull today, the two compliance lines that will kill an account if you cross them, and a cold email that opens on a device install the operator did not realize was public.' },

    { type: 'h2', text: 'Which signals predict a med-spa is buying?', id: 'signals' },
    { type: 'p', text: 'Signals for aesthetics fall into three buckets. Capital events (new device install, new build-out, new practitioner). Directory drift (Yelp category change, Google review velocity dropping). Seasonality (six-week windows before summer, holidays, and wedding season). A strong outbound program touches all three.' },
    {
      type: 'table',
      caption: 'Five signals for med-spa outbound.',
      headers: ['Signal', 'Where to find it', 'Why it matters'],
      rows: [
        ['New aesthetic device install', 'Distributor press releases (Cutera, Cynosure, Allergan Aesthetics), industry newsletters (Modern Aesthetics, AmSpa)', 'Owner just financed $80k to $250k of equipment. Utilization pressure starts week one.'],
        ['New injector or nurse practitioner hire', 'State cosmetology or nursing board license lookup, LinkedIn new-hire filter', 'Practice added chair capacity and has 4 to 6 weeks before the calendar fills organically.'],
        ['Yelp category drift', 'Yelp business page: category order changes quarterly', 'When "med spa" drops below "hair salon" in a listing\'s category order, the listing loses aesthetic search share.'],
        ['Pre-summer or pre-wedding window', 'Calendar: March, April, and October are peak booking pressure', 'Operators feel the demand spike and buy tools that fill or convert it faster than referrals do.'],
        ['Google review velocity drop', 'GBP review dates over trailing 60 days vs prior 60 days', 'A practice going from 8 monthly reviews to 2 is losing follow-through. The owner knows and is looking for a fix.'],
      ],
    },
    { type: 'link', text: 'AmSpa: American Med Spa Association', href: 'https://americanmedspa.org/', label: 'AmSpa industry resources' },

    { type: 'h3', text: 'The device install signal in practice' },
    { type: 'p', text: 'When a med-spa installs a new laser or an RF microneedling device, the distributor almost always posts about it: a case study, a press release, an Instagram tag, a webinar with the operator on camera. Set Google Alerts for the top ten aesthetic device names in your metro plus the word "installed" or "welcomes." Within a quarter you will have a running list of practices in the first 90 days of a six-figure capital commitment. That is the highest-intent buying window in aesthetics.' },

    { type: 'h3', text: 'Cosmetology and nursing board hires' },
    { type: 'p', text: 'Every state cosmetology board and nursing board publishes new-license lookups. When an injector moves practices, the license lookup reflects the new employer within 30 to 60 days. Diff quarterly the same way you would with the state bar registry for the legal playbook. The practice that just added an injector is a practice with excess capacity for exactly the treatments that injector runs.' },

    { type: 'h2', text: 'How does seasonality actually work in aesthetics?', id: 'seasonality' },
    { type: 'p', text: 'Med-spa demand is seasonal in a way that most outbound programs ignore. March through May is the "pre-summer body" cycle: CoolSculpting, laser hair removal, IV drips. September through November is the "pre-wedding and pre-holiday" cycle: Botox, filler, chemical peels. Outreach in the 6-week window before each spike gets an operator who has calendar pressure. Outreach in the trough weeks gets an operator who has time to read your email and no reason to buy.' },
    { type: 'p', text: 'The practical version: your Q1 outbound leads with body-contouring devices and IV drip fulfillment. Your Q3 outbound leads with injectables inventory, patient-financing partnerships, and pre-holiday marketing tools. Same prospect list, different pitch, driven by the calendar rather than your quota.' },

    { type: 'h2', text: 'What does the cold email actually say?', id: 'cold-email' },
    { type: 'p', text: 'A cold email to a med-spa owner that opens with "we help med-spas grow" is deleted faster than any other vertical I have written for. Owners are pattern-matched on that opener. The email that gets a reply names the exact device by model number and the distributor by name.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Cold email template (owner or medical director)',
      text: 'Subject: your new {device model} at {practice name}? Body: {Owner first name}, saw {distributor} posted about your {device model} install last {month}. Most operators I have worked with hit utilization pressure by month three on a device that size. We just ran a pre-summer campaign for {peer practice in same metro} that booked 44 {treatment} consults in the first 30 days after their install. Worth 15 minutes Thursday to walk through the exact flow?',
    },

    { type: 'callout', tone: 'warn', title: 'HIPAA and state medical board compliance', text: 'Two lines every med-spa vendor must know. First, HIPAA applies the moment your product touches patient records, before-and-after photos, or treatment history. Sign a BAA before you import a single file. Second, in most states a med-spa must be owned or medically directed by a licensed physician, and marketing that implies medical outcomes ("we cure acne") crosses into medical board scope. Never draft marketing copy that makes a therapeutic claim; stick to aesthetic outcomes and let the practice\'s medical director review anything close to the line.' },
    { type: 'link', text: 'HHS: HIPAA for business associates', href: 'https://www.hhs.gov/hipaa/for-professionals/covered-entities/index.html', label: 'HIPAA business associate rules' },

    { type: 'h2', text: 'What does a quarterly cadence look like?', id: 'cadence' },
    { type: 'ol', items: [
      'Month 1: Google Alerts pull for device installs in the metro, first-touch on the device-model angle.',
      'Month 2: state board license diff, identify practices that added injectors, first-touch on the capacity angle.',
      'Month 3: Yelp category drift and Google review velocity pull, first-touch on the "reviews are slowing" angle.',
      'Ongoing: seasonal pitch swap (body Q1, injectables Q3) driven by calendar, not by whichever email template converted last month.',
    ] },

    { type: 'faq', items: [
      { q: 'Do I need to be HIPAA compliant to email a med-spa cold?', a: 'No. HIPAA applies to how you handle patient data after the sale, not to the cold email itself. But the moment the operator asks about integrating with their patient records, you need to have a BAA template ready.' },
      { q: 'Can I mention a competitor practice by name in the email?', a: 'Yes, and it works, but keep it factual. "We ran a campaign for {competitor}" is fine. "We helped {competitor} beat you in reviews" is a lawsuit waiting.' },
      { q: 'How much does device-install intent actually decay?', a: 'From what I have seen across five metros, the window is roughly 90 days. After that, the operator has either found utilization or resigned themselves to slow ramp. Month one is the strongest touchpoint.' },
      { q: 'What if the practice is a solo NP with no marketing budget?', a: 'Different sale. Route those to a financing partner or a booking platform on a percentage-of-appointment model instead of a monthly retainer. Solo NPs cannot fund a $3k/mo retainer but will happily pay 8 percent of a booked consult.' },
    ] },

    { type: 'takeaway', title: 'The one thing to remember', text: 'Med-spa outbound is a signals game with two compliance rails. Signals: device installs, injector hires, seasonal calendar, review velocity. Rails: HIPAA the moment you touch patient data, state medical board the moment you draft marketing claims. Operators are running high margin, high emotion businesses and will engage with any outbound that respects those rails and opens on a real event. Everything else is a tax on their inbox and yours.' },
  ],
};

const POST_4: BlogPost = {
  slug: 'veterinary-clinic-outbound-playbook',
  seoTitle: 'Veterinary clinic outbound playbook for operators',
  title: 'Veterinary clinic outbound: DVM hires, referral gaps, and a cold email that reads like a neighbor',
  description:
    'Veterinary clinic new-client acquisition: DVM hire signals, new-practice openings, 24-hour emergency referral gaps, Yelp drift, and a real cold email template.',
  category: 'Verticals',
  cluster: 'Verticals',
  tags: ['veterinary', 'vet clinic', 'DVM', 'lead generation', 'cold email'],
  excerpt:
    'Signals-first vet clinic outbound. State vet board hires, new-practice openings, distance to nearest 24-hour emergency vet, and one cold email that lands.',
  datePublished: '2026-09-04',
  readMinutes: 10,
  related: [
    'find-local-businesses-without-a-website',
    'high-intent-local-leads',
    'plumbing-leads-no-ads',
  ],
  body: [
    { type: 'stat', value: '$40 to $120', label: 'average acquisition cost per new client for a general-practice veterinary clinic in 2026, and the average lifetime value per pet is well over $2,000' },

    { type: 'p', text: 'Veterinary is the most durable local vertical I know. Every pet needs a vet, most owners pick one within three miles of home, and consolidation by corporate rollups (Mars Petcare, VCA, National Veterinary Associates) has made independent clinics unusually motivated to defend their patch. If you sell into vet clinics, the operators are chronically under-served by outbound because vets themselves are notoriously hard to reach and their practice managers get pitched daily on the same three products. The winner in this vertical is whoever shows up with a signal that names the clinic\'s specific situation.' },
    { type: 'p', text: 'This is a field manual for that. Signals you can pull today, the referral-gap analysis most clinics have never seen, and a cold email that reads like a neighbor who noticed something rather than a vendor with a template.' },

    { type: 'h2', text: 'Which signals predict a vet clinic is buying?', id: 'signals' },
    { type: 'p', text: 'Signals for veterinary fall into three buckets. Staff events (new DVM, new tech, retirement). Practice events (new location opening, remodel, acquisition by a corporate group). Local competitive gaps (distance to the nearest 24-hour ER, no dentistry offered, review velocity dropping).' },
    {
      type: 'table',
      caption: 'Five signals for veterinary clinic outbound.',
      headers: ['Signal', 'Where to find it', 'Why it matters'],
      rows: [
        ['New DVM hire', 'State veterinary board license lookup, AVMA member directory, LinkedIn', 'Clinic added exam-room capacity and needs 30 to 60 new active clients per month to break even on the hire.'],
        ['New practice opening', 'State vet board license issuance, city business license filings', 'Greenfield clinic with zero active patients on day one. Highest possible intent for marketing and referral tools.'],
        ['Nearest 24-hour ER over 20 miles', 'Google Maps distance search from clinic ZIP to closest 24-hour emergency vet', 'General-practice clinics in an ER gap lose after-hours cases and referral goodwill. Solutions here sell fast.'],
        ['Yelp or Google review velocity drop', 'Trailing 60-day review count on GBP compared to prior 60 days', 'Signals a service or intake issue the owner may already be aware of and is trying to fix.'],
        ['Corporate acquisition rollup activity', 'VCA / NVA / Mars Veterinary Health press pages, state board ownership filings', 'Independent clinics in a metro with heavy rollup activity are actively defending, and receptive to differentiation tools.'],
      ],
    },
    { type: 'link', text: 'AVMA: American Veterinary Medical Association', href: 'https://www.avma.org/', label: 'AVMA member directory' },

    { type: 'h3', text: 'The DVM hire signal in practice' },
    { type: 'p', text: 'Every state veterinary board publishes new license issuances and license transfers. Diff quarterly and you get a clean list of DVMs who just started at a new clinic. That clinic added a full exam room worth of weekly capacity, which translates to roughly 30 to 60 new active clients per month required to make the hire pencil. If your product fills or converts client-acquisition demand (referral programs, wellness plan software, community outreach kits), the hire announcement is the six-week window when the practice manager is actively looking for tools.' },

    { type: 'h3', text: 'The referral-gap analysis, and why it lands' },
    { type: 'p', text: 'Most general-practice clinics do not have a 24-hour emergency room on staff. When an after-hours case walks in, the clinic refers to the nearest 24-hour ER. If that ER is 30 minutes away, the client experience is bad and the clinic loses referral goodwill on both ends. Pull the map. For every general-practice clinic in a target metro, measure the drive time to the nearest 24-hour vet ER. Any clinic more than 20 minutes out is in a gap. Products that address this (telehealth triage, mobile after-hours partnership, delivery-based emergency meds) sell into these clinics faster than any other pitch I have seen in the vertical.' },

    { type: 'h2', text: 'How do you weaponize corporate rollup activity?', id: 'rollups' },
    { type: 'p', text: 'Mars Petcare owns VCA, Banfield, and BluePearl. NVA owns hundreds of independents under retained brands. Private equity acquired most of the remainder. Independents in metros with heavy rollup activity feel it: their old associates are getting recruited, their techs are getting poached with signing bonuses, and their local Google search share is under pressure from corporate marketing budgets. The independent owner who refuses to sell (which is most of them, until they retire) is receptive to any tool that lets them punch above their weight.' },
    { type: 'p', text: 'Practical version: for a target metro, pull the list of clinics owned by Mars, NVA, and any regional PE-backed group. Every independent clinic within a five-mile radius of one of those locations is a defense-mode buyer. Lead with differentiation: online booking, wellness plans, better texting UX, transparent pricing pages. Do not lead with "grow your practice." They are not trying to grow; they are trying to hold.' },

    { type: 'h2', text: 'What does the cold email actually say?', id: 'cold-email' },
    { type: 'p', text: 'A cold email to a vet practice manager that opens with generic "grow your clinic" language is deleted before the second sentence. The email that gets a reply names either the new hire or the 24-hour ER gap and reads like a neighbor.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Cold email template (practice manager)',
      text: 'Subject: {clinic name} and the {distance} miles to {nearest 24-hour ER}. Body: {Practice manager first name}, I mapped every general-practice vet in {metro} against the closest 24-hour ER. {Clinic name} is {distance} miles from {nearest 24-hour ER}, which is one of the widest gaps in the metro. That is roughly {N} after-hours calls a year going to the wrong place. We are running a small pilot with two clinics in {city} on a triage-and-referral tool that keeps the case (and the follow-up visit) at the primary. Worth a 15-minute walkthrough this Thursday?',
    },

    { type: 'callout', tone: 'success', title: 'Why this template works', text: 'Two things. First, the opener names a metric (drive-time gap) that the practice manager cannot dispute and probably has not measured. Second, the CTA is a walkthrough, not a demo, not a discovery call. Practice managers hate the word "discovery." They love "walkthrough" because it implies you have already done the work.' },

    { type: 'h2', text: 'What does a quarterly cadence look like?', id: 'cadence' },
    { type: 'ol', items: [
      'Month 1: state vet board license diff. Identify DVM hires in target metros. First-touch on the capacity angle.',
      'Month 2: map every general-practice clinic in the metro to the nearest 24-hour ER. First-touch clinics with drive-time gaps over 20 minutes on the ER-gap angle.',
      'Month 3: pull GBP review velocity over trailing 60 days for target clinics. First-touch clinics with velocity drops on the "reviews are slowing" angle.',
      'Ongoing: monitor corporate acquisition news. Route every independent within five miles of a new rollup site into a defense-mode outbound track.',
    ] },

    { type: 'faq', items: [
      { q: 'How fast does the DVM hire window close?', a: 'Practical window is 30 to 60 days from the state board update. Faster than dental because vet practice managers move fast on capacity-fill decisions and slower than legal because DVMs are rarely rainmakers on day one.' },
      { q: 'Is the AVMA directory worth paying for?', a: 'For sales purposes, no. State board license lookups are free and more current. Use AVMA only for demographic cross-reference.' },
      { q: 'Do corporate-owned clinics buy from outbound?', a: 'Rarely at the clinic level. Corporate marketing procurement lives at HQ. Sell into independents; use the corporate rollup as your positioning wedge, not your target list.' },
      { q: 'What if the clinic has no online booking?', a: 'That is your opener. Booking-tool outbound to vet clinics has one of the highest conversion rates of any vertical I have seen, because pet owners increasingly refuse to phone during business hours and the owner has been told by staff.' },
    ] },

    { type: 'takeaway', title: 'The one thing to remember', text: 'Veterinary is a defense-mode vertical for independents, and defense-mode buyers respond to signals that name a specific weakness (a DVM hire that needs to pencil, a 20-mile ER gap, a review-velocity drop) rather than to generic growth language. The email that reads like a neighbor who noticed something beats the email that reads like a vendor who bought a list every single time. Pull the map, name the gap, ask for a walkthrough.' },
  ],
};

export const WAVE7_POSTS: BlogPost[] = [POST_1, POST_2, POST_3, POST_4];
