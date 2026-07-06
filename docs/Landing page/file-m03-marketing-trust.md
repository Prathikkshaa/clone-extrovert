# M03 — Trust + Conversion Sections + Secondary Pages

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md`.
2. Read `/docs/M00-marketing-context.md` (trust strategy §7, anti-slop §5, CTA §11, pages §8).
3. Read `/docs/PROGRESS.md`.
4. Execute only this file's scope.

## Preconditions to verify
- M01 + M02 done: shell, tokens, reveal primitive exist; landing top (hero/pain/steps/demo) built and verified.
- Reveal primitive + token classes available; signup CTA route placeholder known.

## Scope of THIS file
Build the lower landing page (the trust + close) and the secondary pages: **differentiators** (asymmetric zigzag), **founder's note** (honest-early trust anchor), **pricing** (free-first, credit model), **FAQ** (accordion, AEO-ready), **final CTA**, plus **secondary pages** (pricing detail, about, legal stubs, blog scaffold). Copy is DIRECTION + examples (anti-slop §5); user refines. No fabricated social proof (M00 §7).

### 1. Differentiators — objection-killers as zigzag (M00 §3/§5)
- **NOT** three symmetric cards. Use **alternating left/right rows** (visual one side, copy the other, direction alternating down the page) — editorial, anti-slop. Each row reveals on scroll. Placeholder product visuals, labeled.
- Frame each as the answer to a specific fear:
  - "Personalized, not spam" — each email is written from the lead's own site + reviews, in your voice. (Kills the AI-spam fear.)
  - "Find businesses with no website" — built-in buying-signal filters surface who actually needs you. (Concrete = believable; your strongest hook.)
  - "Stays out of spam, compliant by default" — sends from your inbox, throttled, with unsubscribe + legal footer built in. (Kills deliverability/legal fear.)
  - "One tool, not five" — search, write, send, follow up, book — pay only for what you use. (Kills cost/stack fatigue.)
- Specific copy, no vague hype.

### 2. Founder's note (trust anchor while no users exist — M00 §7)
- A genuine, short, personal message: why this was built ("I had this exact problem — empty pipeline, no time to do outreach right"). Honest, understated, human. Real photo (placeholder now, labeled).
- This REPLACES fake testimonials. Do NOT add invented quotes/logos/counts. Leave a clearly-labeled, easily-swappable slot beneath for real testimonials/results when they exist.

### 3. Pricing (free-first, honest, anchored — M00 §3)
- Lead with the **free tier** (activation). Show the **credit model** simply ("pay only for what you use — credits cover finding, writing, and sending"). Optional small "estimate your usage" helper (keep light; can be static for now).
- Anchor against the pain: "less than one month of the five tools this replaces." 
- Clean, transparent, no dark patterns; pricing visible (hiding it signals "expensive" to this budget-conscious audience). FAQ directly below (next section).
- Numbers: use the finalized credit/pack values if available from product File 14; if not yet set, use clearly-labeled placeholder pricing and note it for swap. Don't invent final prices silently.

### 4. FAQ (accordion — persuasion + AEO double-duty, M00 §9)
- Accessible accordion (client island; keyboard + screen-reader friendly). Plain answers to the REAL doubts:
  - "Will my emails actually land (not spam)?" — throttling, your-own-inbox, warm-up.
  - "Where do the leads come from? Is this legal?" — Google Places + the lead's own public site; compliant by default.
  - "Do I need to be technical?" — no; connect your inbox, search, send.
  - "What if it doesn't work for my industry?" — works anywhere businesses are on Google Maps; free to try.
  - "What does it cost?" — free to start, credits after.
- Structure for AEO: clean Q/A markup (the `FAQPage` schema is added in M04 — write the markup so M04 can annotate it).

### 5. Final CTA (close — one action, M00 §11)
- Full-width, confident; restate the transformation; the single "Start free" button + friction microcopy. Introduce NO new ideas here. One tasteful accent-toned background motion is allowed (subtle, reduced-motion-safe) — optional.

### 6. Secondary pages (M00 §8)
- **/pricing** — fuller pricing + the FAQ; same honest framing.
- **/about** — founder story expanded (trust for an early company); honest "we're new" tone.
- **/how-it-works** (or product) — depth for researchers: the 4 steps expanded with more real screenshots (placeholders).
- **/privacy** + **/terms** — STUBS with a clear "placeholder — replace with real legal text (user/lawyer)" banner. Do not fabricate legal language.
- **/blog** — scaffold: index + one placeholder post structure (the SEO/AEO engine; real posts later). Set up so posts are easy to add (MDX or a simple content structure — document the approach).
- All secondary pages use the shell, tokens, reveal primitive; mobile-first; anti-slop.

## AI-friendly + anti-slop checks (M00 §5/§7)
- Zigzag (not symmetric cards); specific copy; one accent; honest-early (no fake proof); real (placeholder) imagery; distinctive type; token-driven; `APP_NAME` from shared.

## Verification (must pass before Done)
1. Builds/serves, zero type errors; workspace intact.
2. Differentiators render as alternating zigzag rows with scroll-reveal — not a symmetric card trio; copy is specific and objection-framed.
3. Founder's note is present, honest, human; NO fabricated testimonials/logos/counts anywhere; the real-proof slot is labeled + empty.
4. Pricing leads with free tier, explains credits simply, is transparent; placeholder vs final prices clearly handled.
5. FAQ accordion works (keyboard + screen reader accessible); answers are plain; Q/A markup ready for `FAQPage` schema.
6. Final CTA restates transformation with one action + microcopy; any background motion is subtle + reduced-motion-safe.
7. Secondary pages all resolve, styled, mobile-first; legal pages clearly marked placeholders; blog scaffold supports easy post addition.

### Visual verification (across breakpoints — M00 §12)
- Run §8 on the lower landing (differentiators → founder → pricing → FAQ → final CTA) and the secondary pages via Claude in Chrome at **mobile + desktop**.
- **Expected visual result:** editorial zigzag differentiators (not generic cards); a genuine, understated founder's note with a labeled photo placeholder and NO fake proof; clean free-first pricing with simple credit explanation; an accessible FAQ accordion; a confident single-action final CTA; secondary pages consistent and on-brand; legal stubs clearly marked; fast; reduced-motion respected; human-designed, not AI-generated.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip + per-breakpoint checklist.

## Definition of Done (00-master §9)
- Verification passes (incl. visual/fallback at both breakpoints). `PROGRESS.md` updated (M03 done; list placeholder assets + pricing-number status for the M04 swap-list; note blog content approach; note final-copy is direction pending user refinement). `CODE-MAP.md` updated.
- Commit: `feat(marketing): M03 differentiators, founder note, pricing, faq, final cta, secondary pages`
- Push to `main`.

## What's next
M04 — SEO/AEO + performance + full responsive/visual verification + the placeholder asset swap-list + README. Completes the marketing site (pending real assets + copy refinement).
