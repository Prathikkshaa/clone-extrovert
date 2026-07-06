# M04 — SEO/AEO + Performance + Verification + Swap-List

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md`.
2. Read `/docs/M00-marketing-context.md` (SEO/AEO §9, performance §10, placeholders §13).
3. Read `/docs/PROGRESS.md` (review M01–M03 notes, placeholder assets, pricing-number status).
4. Execute this file's scope. May split (`M04a`/`M04b`) if long — record in PROGRESS.

## Preconditions to verify
- M01–M03 done: full landing page + secondary pages built and visually verified; FAQ has clean Q/A markup awaiting schema; shell metadata defaults exist.
- List every placeholder asset and any placeholder pricing from PROGRESS — this file consolidates them into the swap-list.

## Scope of THIS file
Make the site discoverable (SEO), quotable by AI assistants (AEO), fast (performance budget), and fully verified across breakpoints — then produce the consolidated placeholder swap-list and README so the user knows exactly what to replace before launch. No new sections; this is discoverability, speed, correctness, and finishing.

### 1. SEO (M00 §9)
- **Per-page metadata** via Next.js Metadata API: unique title + meta description for every page (landing, pricing, how-it-works, about, blog index + post, privacy, terms), targeting ICP search intent ("cold email tool for agencies", "find local business leads", "find businesses without a website", "[competitor] alternative"). Document the target keyword per page.
- **Open Graph + Twitter cards** for every page (title, description, image — placeholder OG image, labeled).
- **Sitemap** (`sitemap.xml`) generated for all public routes.
- **`robots.txt`**: allow normal crawlers AND AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.); reference the sitemap. (Allowing AI crawlers serves AEO — M00 §9.)
- Semantic HTML throughout (proper headings hierarchy, landmarks, alt text on images) — verify, fix any gaps from M02/M03.
- Canonical URLs; clean, readable slugs.

### 2. AEO (be cited by AI assistants — M00 §9)
- **Schema.org structured data** (JSON-LD):
  - `SoftwareApplication` (or `Product`) on the landing/product pages — name (`APP_NAME`), description, category, offers/price (use placeholder/free-tier info, labeled), audience.
  - `FAQPage` on the FAQ (annotate the M03 Q/A markup) — this is high-value for AI assistants and rich results.
  - `Organization` for the brand (logo placeholder, founder).
- Ensure content is **specific and factual** (M00 §5) — the structured, clear "what it does / who it's for / pricing" framing that AI assistants summarize accurately. Fix any vague hero/feature copy that survived M02/M03.
- Confirm the FAQ answers are self-contained and quotable (each answer makes sense out of context).

### 3. Performance pass (M00 §10 — speed = conversion + ranking)
- **Confirm RSC-first held:** audit client bundles; ensure only the documented islands (header/menu, reveal primitive, 3D hero, FAQ accordion, video controls) ship client JS. Remove any accidental client bloat.
- **LCP:** the hero renders fast; the hero product image is optimized (Next/Image, right sizes, priority where appropriate); the demo VIDEO is lazy-loaded with a poster and never blocks LCP.
- Images: Next/Image, responsive sizes, lazy below the fold, modern formats.
- Fonts: `next/font` self-hosted, no layout shift (confirm from M01).
- Motion: confirm GSAP/reveals + the 3D island are lazy/non-blocking and reduced-motion-safe.
- Run a Lighthouse-style check (perf/SEO/accessibility/best-practices); record scores in PROGRESS; fix regressions. Target strong mobile performance especially.

### 4. Full responsive + visual verification sweep (M00 §12)
- Walk EVERY page at **mobile and desktop** (and tablet if feasible) via Claude in Chrome:
  - hero + 3D island (simplified/disabled on mobile), pain, 4 steps, demo video (autoplays muted/inline, poster, captions, fallback), differentiators zigzag (re-stacks cleanly), founder's note, pricing, FAQ accordion, final CTA, secondary pages, legal stubs, blog scaffold.
  - Confirm: asymmetric layouts re-stack to clean single-column; CTAs always reachable (incl. sticky header on mobile); touch targets thumb-sized; no horizontal scroll; type scales fluidly; reduced-motion disables motion; nothing looks AI-generated (anti-slop §5 holds everywhere).
- Fix any breakpoint/visual issue, re-verify. Fallback per §8 if Chrome unavailable: confirm each page builds/renders and write a per-page, per-breakpoint manual checklist; note the skip.

### 5. Consolidated placeholder swap-list (so the user knows what to replace — M00 §13)
- Produce `/docs/MARKETING-SWAP-LIST.md` listing EVERY placeholder with its file location and what to replace it with:
  - product demo **video** + **poster** image (the centerpiece);
  - hero + steps + differentiators + how-it-works **screenshots**;
  - **founder photo** + final **founder's-note** copy;
  - **OG/social images** + favicon/logo;
  - **pricing numbers** (swap placeholders for finalized credit/pack values once product File 14 sets them);
  - **legal text** (privacy/terms — real text from user/lawyer);
  - the **signup CTA route** (confirm the real product app URL);
  - **final marketing copy** refinement (all section copy is direction — user finalizes voice);
  - empty **real-proof slots** (testimonials/logos/results) to fill when they exist;
  - **blog** real posts.
- Each item: location, current placeholder, what's needed, and whether it blocks launch.

### 6. README + docs
- Add a marketing section to the root `README.md` (or a `apps/marketing/README.md`): what it is, stack, how to run/build/deploy (Vercel), where tokens come from (shared), the RSC-first rule, and a pointer to the swap-list.
- Update `CODE-MAP.md` (marketing pages, islands, schema, sitemap/robots).
- Final `PROGRESS.md`: mark the marketing site build complete; link the swap-list; list anything deferred + what's needed.

## Verification (must pass before Done)
1. Builds/serves, zero type errors; workspace intact.
2. Every page has unique title/description + OG tags; sitemap + robots present; robots allows AI crawlers + references sitemap.
3. JSON-LD valid: `SoftwareApplication` + `FAQPage` (+ `Organization`) present and well-formed; FAQ answers self-contained/quotable.
4. Performance: client JS limited to documented islands; LCP fast; video lazy + poster + non-blocking; images optimized; Lighthouse-style scores recorded and healthy (esp. mobile).
5. Full responsive sweep passes at mobile + desktop on every page (or fallback completed + noted); anti-slop holds everywhere; reduced-motion respected; no horizontal scroll; CTAs reachable.
6. `MARKETING-SWAP-LIST.md` exists and is complete (every placeholder + pricing + legal + CTA route + copy-refinement item, with launch-blocking flags).
7. README + CODE-MAP + PROGRESS updated.

### Visual verification
- Covered by the full sweep in step 4 above (mobile + desktop, every page).

## Definition of Done (00-master §9)
- All verification passes. `PROGRESS.md` marks the marketing site complete + links the swap-list + lists remaining LATER items (real assets, final copy, legal text, finalized pricing, real proof). 
- Commit: `feat(marketing): M04 seo/aeo, schema, performance, full verification, swap-list — marketing site complete`
- Push to `main`.

## After this file
The marketing site is code-complete and verified locally with placeholders. Before launch, work through `MARKETING-SWAP-LIST.md`: capture the real product video + screenshots, write the final founder's note + photo, finalize copy in your own voice, drop in finalized pricing (from product File 14), add real legal text, confirm the signup CTA points at the live app, and add real proof as it arrives. Then deploy to Vercel and point the domain. Recommended: validate messaging with a few real ICP visitors (do they understand the offer in 5 seconds?) before scaling traffic.
