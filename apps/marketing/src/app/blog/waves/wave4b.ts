import type { BlogPost } from '../posts';

// Wave 4B extends the base Block union with a `diagram` block. The base type
// in ../posts.ts does not yet include it, so we cast at export time. The
// renderer for wave 4B is expected to handle the new kind.
type DiagramBlock = {
  type: 'diagram';
  kind: 'workflow' | 'decision-tree' | 'matrix' | 'ladder' | 'compare';
  title: string;
  caption?: string;
  nodes: { id: string; label: string; sub?: string; emphasis?: boolean }[];
  edges?: { from: string; to: string; label?: string }[];
};

// Local post type that widens `body` to include the diagram block.
type WavePost = Omit<BlogPost, 'body'> & { body: Array<BlogPost['body'][number] | DiagramBlock> };

const POST_1: WavePost = {
  slug: 'cold-email-follow-up-cadence',
  title: 'The stop-on-reply cadence: a 4-step cold email follow-up sequence that actually respects replies',
  description:
    'A named follow-up framework for cold outbound. Four messages, clear day gaps, distinct intent per step, and a hard rule: the moment someone replies, the cadence ends. No exceptions.',
  category: 'Cold email',
  cluster: 'Cold email',
  tags: ['cold email', 'follow-up', 'cadence', 'deliverability', 'sales'],
  excerpt:
    'The stop-on-reply cadence: four follow-ups, four intents, one rule. If the prospect replies, the sequence stops the same minute.',
  datePublished: '2026-09-10',
  readMinutes: 9,
  related: [
    'cold-email-templates-seo',
    'hvac-leads-no-ads',
    'plumbing-leads-no-ads',
  ],
  body: [
    { type: 'tldr', text: 'Most cold email sequences fail one of two ways. Either they stop after the first message and leave 60 percent of replies on the table, or they keep firing follow-ups after the prospect has already answered. The stop-on-reply cadence fixes both. Four messages across fourteen days, each with a different intent, and a hard stop the instant a reply lands in the inbox.' },

    { type: 'p', text: 'Sales teams argue about follow-up counts the way developers argue about tabs versus spaces. Six touches. Nine. Twelve. The number is the wrong debate. The right question is what each follow-up is actually for, and how the sequence knows when to shut up.' },
    { type: 'p', text: 'This piece names a specific framework we use at Milo and ship as a product feature: the stop-on-reply cadence. Four messages, four intents, hard stop on any reply. It is opinionated on purpose. You can lengthen it, but you cannot skip the stop rule.' },

    { type: 'h2', text: 'Why most follow-up sequences leak', id: 'why-most-leak' },
    { type: 'p', text: 'Backoff.ai and similar deliverability studies keep landing on the same finding: single-touch outbound gets a small fraction of the responses that a proper cadence gets. Woodpecker looked at millions of sent messages and found reply rates climb materially between message one and message four, then plateau. The upside is real, but only if the last three messages are not clones of the first.' },
    { type: 'link', text: 'Woodpecker cold email response rate research', href: 'https://woodpecker.co/blog/cold-email-response-rate/', label: 'Cold email response rate research' },
    { type: 'p', text: 'The other leak is worse. Sequences that keep sending after a reply. A prospect writes back with a real question, and 48 hours later your tool sends the "did you see my last note" bump. You look like a bot. You are a bot. Every deliverability guide from Google Postmaster to the M3AAWG sender BCP treats "recipient signals ignored" as a reputation issue, not a copy issue.' },
    { type: 'link', text: 'M3AAWG Sender Best Common Practices', href: 'https://www.m3aawg.org/sites/default/files/m3aawg_senders_bcp_ver3-2015-02.pdf', label: 'M3AAWG Sender BCP (PDF)' },

    { type: 'h2', text: 'The stop-on-reply cadence, in one picture', id: 'the-framework' },
    {
      type: 'diagram',
      kind: 'ladder',
      title: 'The stop-on-reply cadence',
      caption: 'Four rungs plus one exit condition. The exit condition is not optional.',
      nodes: [
        { id: 'd0', label: 'Day 0: Signal-anchored open', sub: 'Name the signal you saw. One ask.' },
        { id: 'd3', label: 'Day 3: Short nudge', sub: 'Reply to your own thread. Two lines.' },
        { id: 'd7', label: 'Day 7: Value-add', sub: 'Send something useful. No ask.', emphasis: true },
        { id: 'd14', label: 'Day 14: Last call', sub: 'Explicit close. Permission to end.' },
        { id: 'stop', label: 'Reply detected -> cadence stops', sub: 'Any human reply, at any step, ends the sequence.', emphasis: true },
      ],
      edges: [
        { from: 'd0', to: 'd3' },
        { from: 'd3', to: 'd7' },
        { from: 'd7', to: 'd14' },
        { from: 'd0', to: 'stop', label: 'reply' },
        { from: 'd3', to: 'stop', label: 'reply' },
        { from: 'd7', to: 'stop', label: 'reply' },
        { from: 'd14', to: 'stop', label: 'reply' },
      ],
    },

    { type: 'h2', text: 'The cadence table', id: 'cadence-table' },
    {
      type: 'table',
      caption: 'Four messages, four distinct intents. Each message earns its send.',
      headers: ['#', 'Day', 'Intent', 'Template shape'],
      rows: [
        ['1', 'Day 0', 'Signal-anchored open', 'One sentence naming the signal, one sentence with your angle, one question. Under 90 words.'],
        ['2', 'Day 3', 'Short nudge in-thread', 'Reply to your own message. Two lines. Restate the ask in different words. No new attachments.'],
        ['3', 'Day 7', 'Value-add, no ask', 'Send a specific artifact: a checklist, a competitor teardown, a link to a fix. The email closes without a CTA.'],
        ['4', 'Day 14', 'Last call with permission to end', 'Explicit close. "If this is not a fit right now, I will stop here. Otherwise, one line and I will send a Cal link."'],
      ],
    },

    { type: 'h3', text: 'Message 1: the signal-anchored open (Day 0)' },
    { type: 'p', text: 'The first email is the whole game. If it does not name a real signal, follow-ups will not save it. A signal is something concrete you observed: a permit filed, a job posting live, a page missing schema, a review that just landed, a service page with no phone number. If your first line reads like it could go to anyone in the industry, rewrite it.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Template shape (Day 0)',
      text: 'Subject: quick note on {specific signal}. Body: I saw {signal, one sentence with source}. Most {vertical} folks fix this by {one-sentence angle}. Worth a 12 minute call this week to walk you through what we did for {peer}?',
    },

    { type: 'h3', text: 'Message 2: the two-line nudge (Day 3)' },
    { type: 'p', text: 'Reply to your own thread. Not a new subject line. Two lines maximum. If message 1 was crisp, this one is almost boring, and that is the point. You are lifting the thread back to the top of the inbox without adding cognitive load.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Template shape (Day 3)',
      text: 'Bumping this in case it slipped. Same ask as above: 12 minutes this week to show what we did for {peer}?',
    },

    { type: 'h3', text: 'Message 3: the value-add with no ask (Day 7)' },
    { type: 'p', text: 'This is where most cadences quietly die. The third touch is another version of "just checking in" and it deserves to be ignored. Instead, send something the prospect can use even if they never talk to you. A one-pager. A tear-down of a competitor page. A specific fix for the signal you named on day zero. Then close the email. No call to action. This message earns the fourth.' },
    {
      type: 'callout',
      tone: 'success',
      title: 'Template shape (Day 7)',
      text: 'Sharing a short teardown of {peer} in case it is useful even if we never speak. Two things they got right, one thing you could beat them on: {link or bullets}. No ask, just wanted to send this over.',
    },

    { type: 'h3', text: 'Message 4: the last call (Day 14)' },
    { type: 'p', text: 'Explicitly give the prospect permission to end the conversation. This one line does more work than any subject line trick: "if this is not a fit right now, I will stop here." It also protects your reputation. You told them you would stop. Stop.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Template shape (Day 14)',
      text: 'Last note from me on this. If this is not a fit right now, no problem, I will stop here. If it is, reply with any word and I will send a Cal link.',
    },

    { type: 'h2', text: 'The stop rule is a product feature, not a policy', id: 'stop-rule' },
    { type: 'p', text: 'A policy that says "stop sending when the prospect replies" is worth exactly as much as the tool enforcing it. In Milo, reply detection is wired directly to sequence state. When Gmail or Outlook logs an inbound reply on the thread, the queued follow-ups are cancelled the same minute. There is no "confirm cancellation" button. No 24-hour lag. If the prospect writes back at 2:07 pm, the 2:30 pm bump does not send.' },
    { type: 'link', text: 'Milo product page', href: 'https://usemilo.com/', label: 'How Milo handles reply routing and stop-on-reply' },
    { type: 'p', text: 'This matters because "reply then bump" is the single most common way a cold email operator burns a domain. Postmaster tools call it "user complaints" when the recipient responds by hitting spam instead of writing back a second time. Google is explicit about this in their sender guidelines.' },
    { type: 'link', text: 'Google email sender guidelines', href: 'https://support.google.com/mail/answer/81126', label: 'Google sender guidelines' },

    { type: 'h2', text: 'Day gaps: why 0, 3, 7, 14', id: 'day-gaps' },
    { type: 'p', text: 'The gaps are not arbitrary but they are also not sacred. The principle is that each gap doubles roughly, which mirrors how humans forget and re-remember. Day 3 catches the "meant to reply, got busy" cohort. Day 7 catches "was traveling that week." Day 14 catches "budget cycle just opened." Beyond 14 days, response probability collapses and every additional touch trades reply rate for spam risk.' },
    { type: 'p', text: 'If your industry is slow (procurement, education, public sector), stretch to 0, 5, 12, 21. If it is fast (agencies, ecommerce ops, local services), compress to 0, 2, 5, 10. Keep four rungs. Keep the stop rule.' },

    { type: 'h2', text: 'What each message is NOT', id: 'anti-patterns' },
    { type: 'ul', items: [
      'Message 2 is not a repeat of message 1 with a different subject line. Same thread, two lines, different words.',
      'Message 3 is not "just floating this to the top." It is a useful artifact with no ask. If you have nothing useful, skip to message 4.',
      'Message 4 is not "one last time before I close the file." It is explicit permission to end the conversation.',
      'None of the messages contain "did you get my last email." That phrase is a tell.',
    ] },

    { type: 'h2', text: 'Metrics to watch', id: 'metrics' },
    { type: 'p', text: 'The cadence is working when reply rate climbs from message 1 to message 3 and the total sequence complaint rate stays under Google\'s 0.10 percent hard threshold. If message 4 is producing your highest complaint rate, the last-call line is too aggressive; soften it. If message 3 is producing near-zero replies, your value-add is not specific enough.' },
    { type: 'link', text: 'Google Postmaster spam rate guidance', href: 'https://support.google.com/mail/answer/81126', label: 'Postmaster spam rate thresholds' },

    { type: 'h2', text: 'FAQ', id: 'faq' },
    {
      type: 'faq',
      items: [
        { q: 'Can I go past four messages?', a: 'You can. Reply rates plateau after touch four in most studies, and complaint rates start climbing. If you extend, add rungs that carry new intent (a case study, a peer comparison), not another "checking in."' },
        { q: 'What counts as a "reply" for the stop rule?', a: 'Any human-authored inbound on the thread. Out-of-office autoresponders do not count; the sequence pauses until the OOO end date, then resumes. Anything from a real person, including "not interested," stops the cadence for good.' },
        { q: 'Should follow-ups be in the same thread or a new one?', a: 'Same thread for messages 2, 3, and 4. It keeps the conversation coherent for the prospect and lowers the chance a follow-up looks like a fresh cold email to spam filters.' },
        { q: 'Does Milo enforce the stop rule automatically?', a: 'Yes. Reply detection is tied to sequence state; queued follow-ups are cancelled the moment an inbound reply is logged on the thread by Gmail or Outlook. It is not a manual toggle.' },
        { q: 'How do I know if my Day 0 signal is strong enough?', a: 'Read the first sentence out loud. If it could plausibly have been sent to a hundred other companies with a search-and-replace, the signal is too weak.' },
      ],
    },
  ],
};

const POST_2: WavePost = {
  slug: 'hvac-leads-no-ads',
  title: 'HVAC leads without ads: buying signals, seasonality, and one cold email that actually converts',
  description:
    'A field manual for HVAC contractors: the specific signals that flag a homeowner or property manager ready to replace a system, how to time outreach to the seasons, and a real cold email rooted in a permit-filing signal.',
  category: 'Verticals',
  cluster: 'Verticals',
  tags: ['hvac', 'contractors', 'lead generation', 'cold email', 'local services'],
  excerpt:
    'Signals-first HVAC prospecting. Permit filings, SEER ratings, weather timing, and one cold email that reads like a neighbor, not a marketer.',
  datePublished: '2026-09-10',
  readMinutes: 10,
  related: [
    'plumbing-leads-no-ads',
    'cold-email-follow-up-cadence',
    'cold-email-templates-seo',
  ],
  body: [
    { type: 'tldr', text: 'HVAC lead gen through Google Ads is a bidding war against national aggregators. Cold outbound wins if it is signal-first: an aging SEER unit, a filed permit, a heat or cold snap, a weak Google Business Profile, or a missing certification badge on the site. This piece maps those signals to seasons and gives you a permit-anchored email you can send tomorrow.' },

    { type: 'p', text: 'Every HVAC contractor with a decent truck and a real license has heard the same pitch from ad platforms: bid on "AC repair near me," pay 40 to 90 dollars a click, hope the lead is not a tire kicker. It is a tax, not a strategy. The alternative is not sexy. It is a spreadsheet of signals and a short email.' },

    { type: 'h2', text: 'The signals that actually predict a job', id: 'signals' },
    { type: 'p', text: 'Signals for HVAC come in two flavors. The first is homeowner-side: something in the physical system or the paperwork is aging out. The second is business-side: property managers, small commercial landlords, and multi-site operators have their own tells.' },
    {
      type: 'table',
      caption: 'HVAC buying signals mapped to the source you can pull them from.',
      headers: ['Signal', 'What it tells you', 'Where to find it'],
      rows: [
        ['SEER rating of installed unit is 13 or lower', 'Unit is likely 10+ years old and burning 20-30% more energy than a modern equivalent', 'ENERGY STAR labeling records; visible on unit nameplate during inspection'],
        ['Building permit filed for kitchen or addition', 'Ductwork or capacity change likely; owner is already spending', 'Municipal permit portals (Accela, OpenGov, Socrata datasets)'],
        ['3-day heat index above 95F in ZIP', 'Cooling systems fail under load; call volume spikes 48-72 hours in', 'National Weather Service alerts'],
        ['3-day mean temp below 20F', 'Heating systems fail; furnace and heat pump calls follow', 'NOAA daily summaries'],
        ['Google Business Profile has fewer than 20 reviews or under 4.2 stars', 'Local competitor is beatable in search; your offer stands out', 'Google Maps API / manual review'],
        ['Website missing NATE or EPA 608 certification mentions', 'Owner probably has certs but does not advertise them; you can', 'public web research or manual review of site'],
        ['Property manager site lists 3+ multifamily properties in same metro', 'Portfolio-level maintenance contract opportunity, not one-off', 'Public property records; company site'],
        ['R-22 refrigerant referenced anywhere on invoices or site', 'System predates 2010 phaseout; parts are scarce and expensive', 'Site copy, customer paperwork'],
      ],
    },
    { type: 'link', text: 'ENERGY STAR SEER guidance', href: 'https://www.energystar.gov/products/heating_cooling/central_air_conditioners', label: 'ENERGY STAR central AC efficiency ratings' },
    { type: 'link', text: 'NOAA National Weather Service', href: 'https://www.weather.gov/', label: 'Weather data for heat and cold snap signals' },

    { type: 'h2', text: 'Seasonality: two selling seasons, two different offers', id: 'seasonality' },
    { type: 'p', text: 'HVAC is one of the few businesses where the calendar tells you exactly what to sell. Spring is AC preseason. Fall is heating preseason. The mistake is running the same email in both.' },
    {
      type: 'diagram',
      kind: 'matrix',
      title: 'HVAC signals by season',
      caption: 'Left column: signal type. Top row: season the signal is most actionable.',
      nodes: [
        { id: 'h', label: 'Header' },
        { id: 'spring', label: 'Spring (Feb-May)', sub: 'AC preseason' },
        { id: 'summer', label: 'Summer (Jun-Aug)', sub: 'Peak cooling load' },
        { id: 'fall', label: 'Fall (Sep-Nov)', sub: 'Heating preseason' },
        { id: 'winter', label: 'Winter (Dec-Feb)', sub: 'Peak heating load' },
        { id: 'seer', label: 'SEER 13 or lower', emphasis: true },
        { id: 'permit', label: 'Kitchen/addition permit', emphasis: true },
        { id: 'weather', label: 'Weather event', emphasis: true },
        { id: 'gbp', label: 'Weak Google Business Profile' },
        { id: 'r22', label: 'R-22 references' },
      ],
      edges: [
        { from: 'seer', to: 'spring', label: 'best' },
        { from: 'seer', to: 'fall', label: 'good' },
        { from: 'permit', to: 'spring', label: 'best' },
        { from: 'permit', to: 'fall', label: 'best' },
        { from: 'weather', to: 'summer', label: 'heat' },
        { from: 'weather', to: 'winter', label: 'cold' },
        { from: 'gbp', to: 'spring', label: 'year-round' },
        { from: 'r22', to: 'spring', label: 'replace before peak' },
      ],
    },
    { type: 'h3', text: 'Spring: pre-cooling tune-ups and replacement quotes' },
    { type: 'p', text: 'February through May, the pitch is "get ahead of summer." A tune-up now costs a fraction of an emergency call in July. Homes with SEER 13 or lower units are candidates for full replacement, and the federal 25C tax credit (up to 2,000 dollars for qualifying heat pumps) is a real reason to buy now, not later.' },
    { type: 'link', text: 'IRS 25C Energy Efficient Home Improvement Credit', href: 'https://www.irs.gov/credits-deductions/energy-efficient-home-improvement-credit', label: 'IRS 25C credit details' },
    { type: 'h3', text: 'Fall: heating checks and heat pump swaps' },
    { type: 'p', text: 'September through November, the pitch flips. Furnace safety inspections, heat pump upgrades before the cold hits, and any homeowner who filed a permit for insulation, roofing, or an addition is a strong candidate for a system rethink.' },

    { type: 'h2', text: 'A real cold email, rooted in a permit signal', id: 'email' },
    { type: 'p', text: 'Here is a template we have watched work. The signal is a filed kitchen remodel permit. The angle is that any real kitchen remodel touches the return duct, and doing HVAC work while the walls are already open costs a third of what it costs afterward.' },
    {
      type: 'quote',
      text: 'Subject: {street name} kitchen permit + your HVAC while the walls are open\n\nHi {first name},\n\nSaw the kitchen remodel permit filed at {street address} last week. Congrats on getting started.\n\nQuick note from someone who has watched a lot of these: if the return duct or any refrigerant line runs through the kitchen wall, doing the HVAC work now costs roughly a third of what it costs after the drywall goes back up. And if your current condenser is a SEER 13 or lower (we could check the nameplate in 5 minutes), you would also qualify for up to $2,000 in the federal 25C credit on a heat pump swap this year.\n\nWorth a 15 minute walk-through this week? Happy to send a couple of options with photos.\n\n{Signature}',
      cite: 'Signal: municipal permit portal. Angle: cost-of-access while walls are open.',
    },
    { type: 'callout', tone: 'success', title: 'Why this works', text: 'The email names a specific address, references a public record the homeowner already knows about, and gives a real cost logic that a homeowner cannot easily dismiss as marketing. The offer is a walk-through, not a hard quote. The mention of the 25C credit is verifiable.' },

    { type: 'h2', text: 'Discovery: how to build the target list', id: 'discovery' },
    { type: 'ol', items: [
      'Pull municipal permit filings from your metro. Most large US cities publish these via Socrata or OpenGov. Filter for HVAC, remodel, addition, and kitchen keywords.',
      'Layer a residential Google Places pull for homes and small multifamily buildings in the ZIPs you already service. Milo does this natively via its map-based discovery.',
      'For each address, enrich with owner contact via the county assessor if available, or capture the property manager if it is a multifamily.',
      'Score each row: 3 points for a permit filed in the last 60 days, 2 for a weather event forecast in the next 10 days, 1 for a weak GBP presence, 1 for R-22 references.',
      'Only send to rows scoring 3 or higher. The rest are lower-intent and burn your sender reputation.',
    ] },
    { type: 'link', text: 'Milo product page', href: 'https://usemilo.com/', label: 'How Milo discovers, enriches, and drafts these' },

    { type: 'h2', text: 'What to avoid', id: 'avoid' },
    { type: 'ul', items: [
      'Buying a "homeowners in {city}" list. It is stale, it is often illegally scraped, and CAN-SPAM does not save you from state statutes.',
      'Generic subject lines like "HVAC service in your area." They pattern-match to spam filters trained on aggregator email.',
      'Running the same template into spring and fall. The offer must shift with the season.',
      'Sending on Sundays. HVAC recipients open on weekday mornings; weekend sends drop reply rates and raise complaint rates.',
    ] },

    { type: 'h2', text: 'FAQ', id: 'faq' },
    {
      type: 'faq',
      items: [
        { q: 'Is cold emailing homeowners legal in the US?', a: 'CAN-SPAM permits commercial email to any address as long as the message identifies itself, uses a real physical postal address, and offers an unsubscribe. Some states (notably California) have layered rules; consult counsel if you are sending at scale.' },
        { q: 'How many emails per day are safe from a new HVAC domain?', a: 'Ramp slowly. 20 to 40 per day for the first two weeks on a warmed inbox, doubling weekly as long as complaint rate stays under 0.10 percent. Milo\'s built-in warm-up handles the ramp for you.' },
        { q: 'What signal is highest intent?', a: 'A permit filed for a kitchen or addition in the last 60 days. The homeowner is already in a spending posture and the physical work often overlaps HVAC.' },
        { q: 'Should I email commercial property managers or residential homeowners first?', a: 'Property managers if you want fewer, larger contracts. Homeowners if you want higher unit-count volume. Both work; pick one for your first 90 days and stay disciplined.' },
        { q: 'How do I know a lead is real before I drive out?', a: 'Book a 15 minute video walk-through first. Ask them to show the outdoor condenser. The nameplate tells you SEER, refrigerant, and age. A prospect who will not do a video call is often not a serious lead.' },
      ],
    },
  ],
};

const POST_3: WavePost = {
  slug: 'plumbing-leads-no-ads',
  title: 'Plumbing leads without ads: signals, storm timing, and a real cold email for service-area plumbers',
  description:
    'A field manual for plumbing contractors: the specific signals that flag a homeowner or property manager ready to spend, how to time outreach around storms and burst-pipe events, and a real cold email rooted in a missing-emergency-line signal.',
  category: 'Verticals',
  cluster: 'Verticals',
  tags: ['plumbing', 'contractors', 'lead generation', 'cold email', 'local services'],
  excerpt:
    'Signals-first plumbing prospecting. Missing 24/7 lines, storm forecasts, review gaps after big jobs, and one email that lands.',
  datePublished: '2026-09-10',
  readMinutes: 10,
  related: [
    'hvac-leads-no-ads',
    'cold-email-follow-up-cadence',
    'cold-email-templates-seo',
  ],
  body: [
    { type: 'tldr', text: 'Plumbing is a service industry that lives and dies on urgency. The signals that predict a job are almost all about how a competitor is failing under load: no 24/7 emergency line advertised, no service-area schema, bad reviews right after a burst pipe event, no financing page. Time outreach around storms and burst-pipe windows and the same template outperforms a full Google Ads budget.' },

    { type: 'p', text: 'The plumbing homeowner is not shopping. They are panicking. That reframes the entire outbound problem. You are not selling a service; you are trying to be the operator a property manager or homeowner has in their phone before the pipe bursts. Everything below is about earning that slot.' },

    { type: 'h2', text: 'The signals that actually predict a job', id: 'signals' },
    {
      type: 'table',
      caption: 'Plumbing buying signals mapped to source and urgency band.',
      headers: ['Signal', 'What it tells you', 'Where to find it'],
      rows: [
        ['No 24/7 emergency phone number visible on homepage', 'A competitor is losing 2am calls. A property manager reading their site notices this fast', 'public web research or manual review of local competitor sites'],
        ['Missing LocalBusiness or Plumber schema with areaServed', 'Local pack visibility is weak; homeowners cannot find them via Maps', 'Site source; Schema.org validator'],
        ['Google reviews trend under 4.0 in the last 90 days after a storm', 'Competitor bit off more than they could chew; homeowners are looking for a replacement', 'Google Maps API; manual review scan'],
        ['No financing page for jobs above $2,000', 'They are losing repipe and water heater jobs to bigger operators who offer 24-month terms', 'Site crawl'],
        ['NOAA severe weather alert for the metro', 'Burst pipes in 24-72 hours; call volume triples', 'National Weather Service alerts'],
        ['Freeze warning below 20F for 12+ hours', 'Frozen pipe calls spike; unprepared homes fail first', 'NOAA'],
        ['Property manager site lists rental units without a "how to report an emergency" page', 'Portfolio is understaffed for after-hours; contract opportunity', 'Manager site'],
        ['Recent building permit for a bathroom remodel', 'Owner is already spending; upsell water heater, softener, or fixture package', 'Municipal permit portal'],
      ],
    },
    { type: 'link', text: 'NOAA severe weather', href: 'https://www.weather.gov/', label: 'National Weather Service alerts' },
    { type: 'link', text: 'Schema.org Plumber type', href: 'https://schema.org/Plumber', label: 'Plumber schema reference' },

    { type: 'h2', text: 'Signals by urgency', id: 'urgency-matrix' },
    {
      type: 'diagram',
      kind: 'matrix',
      title: 'Plumbing signals by urgency',
      caption: 'Urgency band on top. Signals on the left. Emphasized cells are the ones we actually pull outbound from.',
      nodes: [
        { id: 'now', label: 'Now (0-72 hours)', sub: 'Weather-triggered' },
        { id: 'soon', label: 'Soon (this quarter)', sub: 'Permit + review triggers' },
        { id: 'evg', label: 'Evergreen', sub: 'Site quality signals' },
        { id: 's_storm', label: 'Storm/freeze forecast', emphasis: true },
        { id: 's_review', label: 'Post-storm review dip', emphasis: true },
        { id: 's_permit', label: 'Bathroom permit', emphasis: true },
        { id: 's_247', label: 'No 24/7 line on site', emphasis: true },
        { id: 's_schema', label: 'Missing plumber schema' },
        { id: 's_fin', label: 'No financing page' },
      ],
      edges: [
        { from: 's_storm', to: 'now', label: 'best' },
        { from: 's_review', to: 'soon', label: 'best' },
        { from: 's_permit', to: 'soon', label: 'best' },
        { from: 's_247', to: 'evg', label: 'always' },
        { from: 's_schema', to: 'evg' },
        { from: 's_fin', to: 'evg' },
      ],
    },

    { type: 'h2', text: 'Storm timing: the 72-hour window', id: 'storm-timing' },
    { type: 'p', text: 'NOAA issues freeze warnings and severe weather alerts with 24 to 72 hours of lead time. That window is your outbound window for property managers. The pitch is not "we do plumbing." It is "here is a one-page tenant advisory you can send tonight, and here is our after-hours line if anything goes wrong tomorrow."' },
    { type: 'p', text: 'This works for two reasons. First, you are solving a problem the property manager did not know they had yet (tenant communication before the storm). Second, you are moving your after-hours line into their phone before the pipe bursts, which is when 90 percent of the competitive decisions actually happen.' },

    { type: 'h2', text: 'A real cold email, rooted in a missing-emergency-line signal', id: 'email' },
    {
      type: 'quote',
      text: 'Subject: your site does not show a 24/7 line, freeze warning Thursday\n\nHi {first name},\n\nQuick heads up. NOAA is calling for a hard freeze Thursday night in {metro} and I was looking at plumbers in your service area. Your site does not have a 24/7 emergency line on the homepage, which is the number one thing property managers screen for right now.\n\nTwo options.\n\n1. If you already run after-hours coverage, add a single line to your homepage header ("24/7 emergency: {number}") and you will be back in the running for those calls. Takes ten minutes.\n\n2. If you do not run after-hours yet, we (or a partner in your area) can back-stop those calls for a fixed monthly fee and route them to your dispatch in the morning.\n\nEither way, worth a 12 minute call before Thursday? Happy to send a one-pager on option 2.\n\n{Signature}',
      cite: 'Signal: no 24/7 line on homepage + NOAA freeze warning within 72 hours.',
    },
    { type: 'callout', tone: 'success', title: 'Why this works', text: 'It names a specific weather event with a real date, points to a concrete gap on their own site, and offers two paths, one of which is free advice. The recipient does not feel prospected; they feel warned.' },

    { type: 'h2', text: 'Discovery: how to build the target list', id: 'discovery' },
    { type: 'ol', items: [
      'Pull plumbers in your target metros via Google Places, filtering for those with under 50 reviews or under 4.2 stars.',
      'Crawl each competitor site for the presence or absence of a 24/7 phone number in the header, a financing page, and Plumber schema.',
      'Cross-reference NOAA alerts for the metro for the next 72 hours.',
      'For property manager outbound, pull commercial multifamily addresses from public records and match to their management company site.',
      'Score each row: 3 points for storm warning in the window, 2 for missing 24/7 line, 2 for review dip in last 90 days, 1 for missing schema.',
    ] },
    { type: 'link', text: 'Milo product page', href: 'https://usemilo.com/', label: 'How Milo runs the discovery + crawl + draft loop' },

    { type: 'h2', text: 'What to avoid', id: 'avoid' },
    { type: 'ul', items: [
      'Do not email homeowners cold during a live storm event. It is tone-deaf and complaint rates spike.',
      'Do not pretend to be local if you are not. Homeowners check.',
      'Do not send a template that names the storm but does not include a real gap on the recipient\'s site. It reads as fishing.',
      'Do not send from a domain that does not have SPF, DKIM, and DMARC set up. See our deliverability guide.',
    ] },

    { type: 'h2', text: 'FAQ', id: 'faq' },
    {
      type: 'faq',
      items: [
        { q: 'Are property managers the best plumbing target?', a: 'For contract revenue, yes. For one-shot repipes and water heaters, homeowners still lead. Pick your revenue shape first, then pick the audience.' },
        { q: 'How far in advance of a storm should I send?', a: '48 to 72 hours. Beyond 72, the forecast still shifts. Under 24, the property manager is already in reactive mode and will not read email.' },
        { q: 'Does the "no 24/7 line" signal really matter?', a: 'It matters as a filter more than as a pitch. A plumber that will not post an after-hours line is often not set up for after-hours work, which is where the highest-margin calls live.' },
        { q: 'What about the yard sign and door hanger route?', a: 'Still works in dense residential ZIPs. It complements outbound; it does not replace it. Yard signs win familiarity; email wins the property-manager contract.' },
        { q: 'Can Milo handle plumbing-specific enrichment?', a: 'Yes. public map data for discovery, a web-research layer including schema and phone-number extraction, AI enrichment for tone and gap detection, and drafts sent from your own Gmail or Outlook with warm-up.' },
      ],
    },
  ],
};

const POST_4: WavePost = {
  slug: 'cold-email-templates-seo',
  title: 'Cold email templates for SEO agencies: 5 templates, each rooted in a real ranking signal',
  description:
    'Not a template dump. Five SEO outreach emails, each anchored in a specific technical or content signal you can pull from a target site: Core Web Vitals, missing schema, thin content, broken sitemap, and weak backlinks.',
  category: 'Verticals',
  cluster: 'Verticals',
  tags: ['seo', 'agency', 'cold email', 'templates', 'core web vitals'],
  excerpt:
    'Five SEO cold email templates, each tied to a specific technical signal. Includes the Core Web Vitals thresholds you should be quoting.',
  datePublished: '2026-09-10',
  readMinutes: 10,
  related: [
    'cold-email-follow-up-cadence',
    'hvac-leads-no-ads',
    'plumbing-leads-no-ads',
  ],
  body: [
    { type: 'tldr', text: 'Generic SEO outreach is dead. Every prospect has seen the "I noticed some issues with your site" opener. What still works is a template anchored in one specific, verifiable signal you pulled from their site: their LCP, their missing schema, their thin category pages, their broken sitemap, their weak backlink profile. Five templates below, each named to its signal.' },

    { type: 'p', text: 'The SEO agency cold email market is saturated because the barrier to sending is zero. What most senders miss is that specificity is the entire moat. If the first sentence of your email could plausibly have been written by any of the 400 agencies that sent something last week, it will not be read. If it references a real number pulled from the prospect\'s own site, it will.' },

    { type: 'h2', text: 'The signal-to-template pipeline', id: 'pipeline' },
    {
      type: 'diagram',
      kind: 'workflow',
      title: 'Signal-to-template pipeline',
      caption: 'Every good SEO cold email starts with a signal. Everything downstream is mechanical.',
      nodes: [
        { id: 'spot', label: '1. Spot signal', sub: 'CWV, schema, thin content, sitemap, backlinks', emphasis: true },
        { id: 'pick', label: '2. Pick template', sub: 'One per signal type' },
        { id: 'pers', label: '3. Personalize', sub: 'Insert the exact number/URL' },
        { id: 'send', label: '4. Send', sub: 'From warmed domain, with SPF/DKIM/DMARC' },
        { id: 'reply', label: '5. Route replies', sub: 'Stop-on-reply cadence' },
      ],
      edges: [
        { from: 'spot', to: 'pick' },
        { from: 'pick', to: 'pers' },
        { from: 'pers', to: 'send' },
        { from: 'send', to: 'reply' },
      ],
    },

    { type: 'h2', text: 'Core Web Vitals thresholds you should be quoting', id: 'cwv' },
    { type: 'p', text: 'Half of the templates below reference specific Core Web Vitals numbers. Get them right. Google publishes exact thresholds on web.dev and treats these as ranking-relevant page-experience signals.' },
    {
      type: 'table',
      caption: 'Core Web Vitals thresholds per web.dev. Field data (75th percentile) is what Google\'s Chrome UX Report actually uses.',
      headers: ['Metric', 'Good', 'Needs improvement', 'Poor'],
      rows: [
        ['LCP (Largest Contentful Paint)', '≤ 2.5s', '2.5s - 4.0s', '> 4.0s'],
        ['INP (Interaction to Next Paint)', '≤ 200ms', '200ms - 500ms', '> 500ms'],
        ['CLS (Cumulative Layout Shift)', '≤ 0.1', '0.1 - 0.25', '> 0.25'],
      ],
    },
    { type: 'link', text: 'web.dev Core Web Vitals', href: 'https://web.dev/articles/vitals', label: 'web.dev: Web Vitals' },
    { type: 'link', text: 'web.dev LCP thresholds', href: 'https://web.dev/articles/lcp', label: 'web.dev: LCP' },
    { type: 'link', text: 'web.dev INP thresholds', href: 'https://web.dev/articles/inp', label: 'web.dev: INP' },
    { type: 'link', text: 'web.dev CLS thresholds', href: 'https://web.dev/articles/cls', label: 'web.dev: CLS' },

    { type: 'h2', text: 'Template 1: Poor Core Web Vitals', id: 'tpl-cwv' },
    { type: 'p', text: 'Signal: their LCP or INP is in the "poor" band per CrUX. Pull it from PageSpeed Insights, screenshot for evidence.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Template 1 (signal: poor CWV)',
      text: 'Subject: your LCP is {X.Xs} on mobile, Google\'s threshold is 2.5s\n\nHi {name}, ran your homepage through PageSpeed Insights this morning. Your mobile LCP is {X.X seconds}. Google\'s "good" threshold is 2.5 seconds per web.dev, and pages that stay in the "poor" band ({over 4s}) are demonstrably down-weighted in mobile rankings. The typical culprit on {CMS} sites is {hero image not preloaded / third-party script}. 20 minute call this week to walk you through the fix list?',
    },

    { type: 'h2', text: 'Template 2: Missing schema', id: 'tpl-schema' },
    { type: 'p', text: 'Signal: their product, article, or local business pages are missing the appropriate schema.org markup. Verify with the Rich Results Test.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Template 2 (signal: missing schema)',
      text: 'Subject: your {product/article} pages are missing schema Google actually uses\n\nHi {name}, I looked at {specific URL} through the Rich Results Test and it is not returning any structured data. For {vertical}, {schema type} markup is what unlocks rich results ({stars, price, FAQ}) in the SERP. Your top three competitors ({names}) all have it. Rough estimate: adding {schema type} to your top 20 pages is 4-6 hours of work and typically moves CTR 10-15%. Worth a look?',
    },
    { type: 'link', text: 'Google Rich Results Test', href: 'https://search.google.com/test/rich-results', label: 'Rich Results Test' },

    { type: 'h2', text: 'Template 3: Thin content', id: 'tpl-thin' },
    { type: 'p', text: 'Signal: category or service pages under 300 words with no unique substance. This maps directly to Google\'s "helpful content" guidance.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Template 3 (signal: thin content)',
      text: 'Subject: your {category} page is 180 words, top competitor is 1,800\n\nHi {name}, your {URL} clocks in at {~180 words} with mostly navigation. {Competitor URL} is at {~1,800 words} with FAQ, pricing signals, and internal links. Google\'s helpful content system explicitly rewards depth on commercial-intent queries. We could rewrite that page against the top three ranking pages for the target query and hand it back in a week. No lock-in on the trial page.',
    },
    { type: 'link', text: 'Google helpful content guidance', href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content', label: 'Google Search Central: helpful content' },

    { type: 'h2', text: 'Template 4: Broken sitemap', id: 'tpl-sitemap' },
    { type: 'p', text: 'Signal: their sitemap.xml is missing, returns non-200, includes noindex pages, or is not referenced in robots.txt.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Template 4 (signal: broken or missing sitemap)',
      text: 'Subject: your sitemap is {returning 404 / referencing noindex pages}\n\nHi {name}, hit {domain}/sitemap.xml this morning. {It 404s / It references pages that noindex}. That is one of the most common reasons Google Search Console shows "crawled - currently not indexed" for otherwise fine pages. Free fix, and I can send you the exact steps if you want, or we can pick it up as part of a broader technical audit. Either way, worth pulling into Search Console before your next Googlebot crawl.',
    },
    { type: 'link', text: 'Google sitemaps documentation', href: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview', label: 'Google Search Central: sitemaps' },

    { type: 'h2', text: 'Template 5: Weak backlink profile', id: 'tpl-backlinks' },
    { type: 'p', text: 'Signal: their referring domain count is materially lower than the top three ranking competitors for their target keyword. Pull from Ahrefs, Semrush, or Moz.' },
    {
      type: 'callout',
      tone: 'info',
      title: 'Template 5 (signal: weak backlinks vs. SERP top 3)',
      text: 'Subject: your competitors rank on {X} referring domains, you have {Y}\n\nHi {name}, checked the top three results for "{target keyword}" this week. They average {X} referring domains ({competitor sites}). Your site is at {Y}, which is why you are stuck on page 2 despite better content. We run a digital PR loop that lands 3-5 real editorial mentions per month, no PBNs. Worth showing you the last three campaigns we ran for {peer}?',
    },

    { type: 'h2', text: 'Rules of the road', id: 'rules' },
    { type: 'ul', items: [
      'Every template above must include a real number or URL specific to the recipient. Placeholders in the actual send are a tell.',
      'Send from a domain with SPF, DKIM, and DMARC configured, and with recent warm-up traffic. Cold-inbox sends from a fresh domain get filtered before they reach human eyes.',
      'Pair every template with the stop-on-reply cadence. See the linked framework post.',
      'If a prospect writes back with "how did you get my email," answer honestly. Public data, and you can point at the specific site page that produced the signal.',
    ] },

    { type: 'h2', text: 'FAQ', id: 'faq' },
    {
      type: 'faq',
      items: [
        { q: 'Do I need Ahrefs or Semrush to send template 5?', a: 'For serious referring-domain analysis, yes. For a first-pass filter, Google\'s own "link:" operator is largely dead but a free tool like Moz Link Explorer gives usable directional data.' },
        { q: 'How do I verify CWV for template 1?', a: 'PageSpeed Insights, which reads from the Chrome User Experience Report (CrUX) for real-world field data. That is the data Google itself uses for ranking signals; lab tools are directional only.' },
        { q: 'Is it fine to send screenshots in a cold email?', a: 'Text-only in the first message; screenshots make attachments and inline images which some filters penalize. Offer the screenshot in the reply.' },
        { q: 'How many of these templates should one prospect see?', a: 'One. Pick the strongest signal and lead with it. Additional signals go into follow-ups only if there is no reply.' },
        { q: 'Can Milo pull these signals automatically?', a: 'Milo\'s crawl step (public-web research-backed) covers schema presence, sitemap health, thin-content flags, and phone/CTA gaps. Core Web Vitals and backlink profile still route through their native APIs (PageSpeed Insights, Ahrefs).' },
      ],
    },
  ],
};

// Cast to BlogPost[]. The wave 4B renderer is responsible for handling the
// diagram block type. Base type in ../posts.ts does not yet include diagram.
export const WAVE4B_POSTS: BlogPost[] = [POST_1, POST_2, POST_3, POST_4] as unknown as BlogPost[];
