# 05 — Onboarding + Website-to-Profile + Theming

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (theming rules in §7; profile fields in §5).
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01–04 done: build passes; auth works; mailbox connect works (or Gmail done + Outlook stubbed); `company_profiles` table exists.
- `.env` has `FIRECRAWL_API_KEY` and `OPENROUTER_API_KEY` + `LLM_MODEL`. If a free OpenRouter model id isn't set, ask the user to pick a current free model (note it in `PROGRESS.md`).
- A `CrawlService` and `LlmService` do not exist yet — this file creates them as reusable providers (Files 08/09 reuse them).

## Scope of THIS file
The activation-critical flow: the user pastes their website, we crawl it, an LLM extracts a company profile, we extract a logo + one accent color, we show it all **prefilled and editable**, and we apply their logo + accent as the default theme (on top of our neutral base). Plus the "no website" manual path. This is the "wow in 60 seconds" moment — make it feel like magic but always confirmable (§7).

### 1. CrawlService (reusable provider, §10)
- `CrawlService.fetchSite(url)` returns clean text/markdown of the site (and key pages like /about, /services/contact if reachable).
- Primary: Firecrawl (free tier). Fallback: Playwright/Cheerio (for when Firecrawl credits run out or fail). Same interface; pick via config/availability. Document the fallback behavior.
- Cache the raw crawl on `company_profiles.raw_crawl` so we can re-extract later without re-crawling.
- Robustness: timeouts, unreachable site, non-HTML, empty content — each returns a clear typed result, never throws unhandled.

### 2. LlmService (reusable provider, §10)
- `LlmService.complete({ system, prompt, ... })` calling OpenRouter with `LLM_MODEL`. Behind this one abstraction so swapping to Gemini Flash later is a one-value change (§2).
- Add a structured-extraction helper that prompts the model to return JSON only and safely parses it (strip code fences; validate shape; on parse failure, retry once then degrade gracefully).
- This file uses it for profile extraction; File 09 reuses it for drafting.

### 3. Profile extraction
- Given the crawled text, extract into `company_profiles` fields (§5): `services`, `about`, `value_prop`, `tone`, `proof_points` (jsonb array). Keep prompts clear and grounded ("use only what's on the site; leave blank if unknown — do not invent").
- Store extraction results; mark which fields were auto-filled vs blank.

### 4. Logo + accent extraction (theming)
- Extract a `logo_url` (favicon/og:image/header logo — best effort) and a single `brand_color` accent (from logo or site CSS — best effort).
- Apply theming per §7 strictly: use the user's **logo + accent on top of our solid, accessibility-checked neutral base**. Do NOT repaint backgrounds/text in their palette. If the extracted accent fails a contrast check for use as an accent, fall back to our official accent and note it.
- Set `theme_source = 'fetched'`. Persist tokens so the app re-themes via token values only (no component edits).

### 5. Onboarding UI flow (web)
- A short, friendly multi-step onboarding:
  1. "What's your website?" (URL input) → on submit, show a clean progressive "reading your site…" state (skeleton, not spinner) while crawl+extract run in the background.
  2. **Prefilled, editable profile**: show extracted services/about/value-prop/tone/proof-points as editable fields with a header like "Here's what we found — does this look right?" User edits and confirms. (This is the magic moment — make the reveal smooth, §7 motion rules.)
  3. Show the detected logo + accent preview with "Use my branding" (default) and a note they can switch to the official theme anytime in Settings.
- **"I don't have a website" path:** a clear link/button to skip the URL step and fill a short manual form (same fields, empty). Never wall out website-less users (§7).
- Settings: a one-click "Reset to ExtrovertAI theme" toggling `theme_source` to `official` (and back).
- Copy/error rules (§7): plain language; if crawl fails → "We couldn't read that site. You can paste your details by hand instead." (offer the manual path); never lose entered data; extraction is always "confirm/edit", never silently trusted.

### 6. API endpoints (behind auth guard)
- `POST /onboarding/crawl` { url } → kicks off crawl+extract (may run inline for MVP or as a job; if inline, keep it responsive with a loading state; if it risks long runtimes, queue it and poll). Returns the prefilled profile draft.
- `PUT /company-profile` → save the confirmed/edited profile + theme choice.
- `GET /company-profile` → fetch current profile + theme.

## Verification (must pass before Done)
1. `npm run build` passes, zero type errors.
2. Paste a real website → profile fields prefill with plausible, grounded content; raw crawl is cached; logo + accent detected (or graceful fallback).
3. Edits save correctly; reload shows saved profile.
4. Theme applies: app shows the user's logo and accent on the neutral base (and reverts via Settings "Reset to ExtrovertAI theme").
5. Contrast guard works: a garish brand color does NOT break legibility (falls back to official accent; note it).
6. "No website" path lets a user complete the profile manually.
7. Failure cases (unreachable/empty site, LLM parse failure) degrade to the manual path with plain messaging; nothing crashes; no fabricated profile data.

### Visual verification (UI present — important screen)
- Run §8 on the onboarding steps via Claude in Chrome: URL step, the "reading your site" state, the prefilled editable profile, and the theming preview; plus the "no website" path.
- **Expected visual result:** calm, guided, few fields per step; skeleton loading (not spinner); the prefilled reveal feels smooth and clearly editable with "does this look right?" framing; logo + accent visibly applied on the neutral base WITHOUT broken contrast; "Reset to ExtrovertAI theme" present in Settings; plain copy; no purple/gradients/clutter.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip.

## Definition of Done (§9)
- Verification passes (incl. visual or fallback). `PROGRESS.md` updated (File 05 done; note CrawlService fallback behavior, LLM model used, theming contrast-guard behavior). `CODE-MAP.md` updated with CrawlService + LlmService (flag them as reused by 08/09).
- Commit: `feat(onboarding): 05 website-to-profile extraction + branding theme`
- Push to `main`.

## What's next
File 06 — Credit ledger + metering core: ledger/usage services, atomic reserve→commit→refund, balance = sum(ledger), and the BullMQ gate scaffold that all paid actions (07/08/09/10) will call before any external API.
