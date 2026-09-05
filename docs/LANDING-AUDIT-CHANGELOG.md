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

## 🔄 In progress (read-only audit subagents running)

- **Technical SEO audit** — per-page metadata/canonical/OG, `BlogPosting` schema on
  posts, sitemap `dateModified`, `next.config` (multi-lockfile `outputFileTracingRoot`),
  H1/heading structure, internal linking, breadcrumbs.
- **AEO/GEO + blog-strategy audit** — `llms.txt` (to add), AI-crawler robots coverage,
  answer-extractability, GEO citability/entity definition, schema gaps, and an
  8–12 post source-safe blog program in topic clusters.

## ⏳ Planned (pending the reports above, then implement on go-ahead)

- Add `llms.txt`; confirm `robots.txt` (already allow-lists AI crawlers) references it.
- Per-page SEO metadata gaps (title/description/canonical/OG per route).
- `BlogPosting`/`Article` + `BreadcrumbList` JSON-LD on blog posts.
- Sitemap `dateModified` per post; `next.config` root fix.
- Blog content program for SEO/AEO/GEO.

---

## Still open / decisions for the owner

- **Blog reveal elsewhere?** Homepage + this post are clean. The "Personalized, not
  spam" section still says emails are written "from the lead's own site and reviews"
  (personalization inputs, not the lead source) — left as-is; can soften on request.
- **`FREE_SIGNUP_CREDITS` lives in two places** (shared + API). Comment flags it;
  optional follow-up: wire the API to import the shared constant (touches `apps/api`).
- **Not yet merged/pushed** — everything is on `landing-audit-fixes`, not `main`.
