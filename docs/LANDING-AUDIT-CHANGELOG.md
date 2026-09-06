# Landing / marketing site — audit changelog

Branch: `landing-audit-fixes` (off `main`). Scope: `apps/marketing` + one shared
constant. All changes came out of a multi-persona critical audit of the landing
page (B2B/B2C, US/UK/India, buyer-skeptic, deliverability, privacy, non-technical).

Status legend: ✅ done & committed · 🔄 in progress · ⏳ planned (pending report)

---

## ✅ Completed (committed on this branch)

### 1. Trust, pricing clarity & geo/compliance fixes — `8225d7f`
Persona-audit items 2, 3, 4, 5, 6, 7, 8, 13.

- **Free-credit number (was "a batch")** → states **100 free credits**, sourced
  from a new `FREE_SIGNUP_CREDITS` constant in `packages/shared` that mirrors the
  API signup grant (`SIGNUP_CREDITS` / `DEFAULT_SIGNUP_CREDITS = 100`).
  - `packages/shared/src/constants/index.ts`, `apps/marketing/src/components/sections/pricing.tsx`
- **Pricing contradiction fixed** — dropped the misleading `1 credit ≈ $0.10`;
  now shows **"from $0.074/credit — cheaper by the pack"** plus a worked example
  (**~5 credits/lead → $45 Growth ≈ 110 leads**), all derived from `CREDIT_COSTS`
  so the numbers can never drift.
  - `apps/marketing/src/components/sections/pricing.tsx`
- **FAQ top answers open by default** — deliverability, lead-source/legality, and
  "do I need to be technical?" now render expanded (accordion refactored from
  single-open to multi-open).
  - `apps/marketing/src/components/sections/faq.tsx`
- **Compliance overclaim reframed (region-aware)** — split "Compliant by default"
  into **"Built for deliverability"** (own inbox, ~30/day warm-up ramp, sequential
  sends with randomized spacing, bounce monitoring — only behaviour that exists in
  code) and **"Compliance tools built in"** (CAN-SPAM for US; PECR/GDPR /
  legitimate-interest for UK/EU; unsubscribe + address + suppression).
  - `apps/marketing/src/components/sections/differentiators.tsx`, `apps/marketing/src/lib/faq.ts`
- **Non-US fit** — hero line "**Works in any country and city**".
- **No-tech-setup reassurance** — hero line "**Connect your inbox once — no code,
  nothing to install**".
- **Payments/currency note** — "**Billed in USD; cards accepted from any country**"
  (honest note; no invented local methods).
  - `apps/marketing/src/components/sections/hero.tsx`, `pricing.tsx`, `faq.ts`

Not changed: founder note kept intact (audit item 15). Social proof/testimonials
(audit item 1) intentionally out of scope — needs real customer quotes/metrics.

### 2. FAQ — source removed + 8 new answers — `33d2ee2`
- Scrubbed the named lead source from the "where do leads come from" and
  "what industries" answers (now: "public business information anyone can look up").
- Added 8 FAQs grounded in real product behaviour: review-before-send + 3-step
  sequence; how the voice/offer personalization works; replies land in your inbox
  and **follow-ups auto-stop on reply** (verified via `stopLeadSequence`); meeting
  booking via your scheduling link; multiple inboxes/clients; per-inbox daily send
  ramp; OAuth + encrypted-token security; no-subscription pay-as-you-go.
  Total FAQs: 5 → 13.
  - `apps/marketing/src/lib/faq.ts`

### 3. Blog — source disclosure removed — `8774d28`
- The only blog post named the exact sourcing method ("the single best source is
  Google Maps / Google Business Profiles") with a step-by-step recipe. Reframed the
  "where to find" section around generic public presence + qualification signals;
  the post keeps its SEO target ("find local businesses without a website") without
  revealing the moat. Genericized the two other mentions.
  - `apps/marketing/src/app/blog/posts.ts`

**Verification:** `tsc --noEmit` clean, `next lint` clean, page renders HTTP 200,
homepage + blog contain no "Google Maps" / source disclosure.

---

## ✅ Completed — SEO / AEO / GEO batch — `645ecb2`
From two read-only audit subagents (technical SEO; AEO/GEO + blog strategy).

- **P1 canonicals** — `/pricing`, `/how-it-works`, `/about`, `/blog` were inheriting
  `canonical: '/'` (self-canonicalizing to the homepage → deindex risk). Added
  self-referential canonicals to each.
- **P1 `/llms.txt`** — new build-time static route (`src/app/llms.txt/route.ts`)
  with a curated, **source-safe** entity summary for answer engines; reads from
  single sources (`APP_NAME`, `SITE_URL`, `SITE_DESCRIPTION`, `FREE_SIGNUP_CREDITS`).
- **P2 `next.config.mjs`** — `outputFileTracingRoot` (silences multi-lockfile
  warning / wrong-root tracing) + security headers (HSTS, nosniff, Referrer-Policy,
  X-Frame-Options, Permissions-Policy).
- **P2 sitemap** — dropped noindex `/privacy` and `/terms`.
- **P2 blog schema** — `BlogPosting` now has `image` + real `dateModified` (new
  optional field; existing post marked modified 2026-09-05); OG `modifiedTime`;
  added **BreadcrumbList** JSON-LD (Home › Blog › Post).
- **P2 `WebSite` JSON-LD** site-wide (no SearchAction — no search endpoint yet).
- **P2 internal linking** — in-content links from posts to `/how-it-works` + `/pricing`.

**Verification:** `next build` clean (15 routes, `/llms.txt` static, lockfile
warning gone), `tsc` + `next lint` clean; headers, canonical, llms.txt and
BlogPosting/BreadcrumbList/WebSite schema confirmed live via curl.

## ✅ Completed — GEO stats, question-H2s & blog program — `d9412a8`, `c89db84`, `d093852`
Implemented via subagent; `tsc` + `next lint` + `next build` (18 routes) all clean;
no forbidden source terms anywhere (leads = "public business information anyone can
look up").

- **Quotable stats + entity definition (GEO)** — new `by-the-numbers.tsx` section on
  `/how-it-works` with 6 extractable, self-contained facts (100 free credits ·
  ~5 credits/lead · 550 credits ≈ 110 leads ($45) · ~30 emails/day ramping ·
  3-email sequence · 0 subscriptions), derived from `FREE_SIGNUP_CREDITS`/`CREDIT_PACKS`.
  Plus a literal "ExtrovertAI is a…" lead sentence on `/about` for LLM entity extraction.
- **Question-shaped H2s (AEO)** on the shared sections — "How does it work?" (answer:
  "Four steps from search to booked…") and "Why does this outreach actually work?"
  (answer: "…built to kill the reasons cold outreach fails…").
- **Blog program** — 3 source-safe pillar posts added to `blog/posts.ts`:
  `how-to-find-local-business-leads`, `why-cold-emails-go-to-spam`, `is-cold-email-legal`.
  Each uses the AEO template: answer-first TL;DR, question H2s, a "Key takeaways" list,
  soft closing CTA.

## ⏳ Planned — needs owner input or is a bigger effort (not yet done)

- **Real founder/author name** — `FOUNDER_NAME = 'the founder'` flows into
  BlogPosting `author` + Organization `founder` (weak E-E-A-T). Needs a real name.
- **Organization `sameAs`** — add real social profile URLs (X, LinkedIn) for entity
  trust. Needs the URLs.
- **Deploy env** — set `NEXT_PUBLIC_SITE_URL` + `NEXT_PUBLIC_APP_URL` in Vercel;
  otherwise every absolute URL ships as `extrovertai.example`. (Launch-blocker.)
- **Remaining blog posts** — ~10 more across the 3 clusters (supporting posts under
  each pillar); optional `HowTo` schema + `Block`-type extensions (dedicated TL;DR /
  key-takeaways block types).
- **Question-H2s / comparison content** on `/pricing` (it already carries the FAQ);
  definitional "what is X" standalone snippets.
- **Social proof / testimonials** (audit item 1) — needs real customer quotes/metrics.

---

## Still open / decisions for the owner

- **Blog reveal elsewhere?** Homepage + this post are clean. The "Personalized, not
  spam" section still says emails are written "from the lead's own site and reviews"
  (personalization inputs, not the lead source) — left as-is; can soften on request.
- **`FREE_SIGNUP_CREDITS` lives in two places** (shared + API). Comment flags it;
  optional follow-up: wire the API to import the shared constant (touches `apps/api`).
- **Not yet merged/pushed** — everything is on `landing-audit-fixes`, not `main`.
