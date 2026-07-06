# M00 — Marketing Site Context & Design Addendum

> **READ THIS FIRST, EVERY MARKETING SESSION** — alongside `/docs/00-master-context.md` and `/docs/PROGRESS.md`. This file governs the marketing site (`apps/marketing`) specifically. It is a companion to the product spine, not a replacement: the monorepo layout, commit/push ritual, cross-session continuity, code conventions, and Definition-of-Done in `00-master-context.md` all still apply.
>
> Lives at `/docs/M00-marketing-context.md`. Append-only amendments at the bottom; never remove content.

---

## 0. How marketing files fit the existing build system

- The marketing site is a **parallel track** to the product build (Files 01–15). It can be built before, after, or interleaved with them.
- Same continuity mechanism: every marketing file (`M01`–`M04`) starts by reading `00-master-context.md` + `M00` (this file) + `PROGRESS.md`, and ends by updating `PROGRESS.md` + committing + pushing to `main`.
- Track marketing progress in the SAME `/docs/PROGRESS.md` under a clearly labeled "Marketing site" section (add it in M01).
- The marketing site is its OWN Next.js app at `apps/marketing` in the existing npm-workspaces monorepo. It does NOT share a framework with `apps/web` (Angular) — they are separate apps that happen to share `packages/shared` (tokens, `APP_NAME`).

---

## 1. What the marketing site is for (one paragraph)

A high-conversion marketing site for ExtrovertAI whose job is to turn cold visitors (solo founders, freelancers, small SaaS/IT/agency owners) into trial signups. Because there are **no real users yet**, the site converts through **demonstration and transparency**, not social proof: a product demo and an honest founder's note carry the persuasive weight. It must load fast (mobile-first), rank well (SEO), be quotable by AI assistants (AEO), and — explicitly — **must not look AI-generated**.

---

## 2. Audience & psychology (the persuasion foundation)

- Visitors arrive **desperate** (need leads/clients) AND **skeptical** (burned by overpriced tools, "AI" that's generic spam, emails that land in spam). Every page must create desire AND dismantle distrust, interleaved.
- Two sophistication levels on one page: freelancer ("will this get me clients without me becoming a salesperson?") and agency owner ("can I run this at volume?"). Handle via **progressive disclosure** — simple promise up top, depth on scroll — not separate pages.
- **Scarcest currency = belief** (no users to point to). So: lead with the transformation, prove it with a real demo, and be honest about being early. Honest-early beats fake-polished for this audience.

---

## 3. Message spine (don't drift from this)

- **Sell the transformation, not the tool:** "empty calendar → booked meetings, without learning to sell or paying for five tools." The product is the bridge.
- **Strongest hooks, ranked:** (1) buying-signal targeting — "find local businesses with no website and pitch them" (concrete = believable); (2) "personalized like your best salesperson wrote each one" (kills the AI-spam fear); (3) "stays out of spam & compliant by default" (kills deliverability/legal fear, builds trust); (4) "one tool, not five — pay for what you use" (kills cost/stack fatigue).
- **One primary CTA, repeated:** "Start free" (verb, benefit implied). Friction-reducing microcopy beneath ("No card needed · Free to start").

---

## 4. Locked tech stack (marketing site)

- **Framework:** Next.js (App Router). **RSC-first** — Server Components by default; `"use client"` ONLY for genuine interactive islands (sticky header, FAQ accordion, hero 3D element, scroll-reveal wrappers, video controls). Statically generate every marketing page. This discipline is mandatory — Next.js defaults drift toward JS bloat, which kills the mobile-LCP/conversion goal.
- **Styling:** Tailwind CSS wired to the **shared ExtrovertAI design tokens** (`packages/shared` / the product's token values). Override stock Tailwind defaults (palette, spacing, fonts) — using stock defaults is the #1 reason sites look AI-generated. Import `APP_NAME` from shared; never hardcode the name.
- **Motion:** GSAP + ScrollTrigger for scroll-reveals; optional Lenis for smooth scroll. One constrained 3D/parallax hero island (Three.js or a light parallax — NOT a stock floating blob). All motion honors `prefers-reduced-motion`.
- **Centerpiece demo:** autoplay **silent, looping, muted, playsInline** product video with a poster image + static screenshot fallback. Placeholder asset now.
- **Hosting:** Vercel (or Netlify). Free tier fine.
- **Images/video:** Next/Image, lazy-load below the fold, never block LCP.

---

## 5. Anti-"AI-generated-look" rules (ENFORCED on every section)

These are hard constraints, not suggestions. A section that violates them is not Done.

**Forbidden (the AI-slop tells):**
- Purple/indigo hero gradients; mesh/blob backgrounds; glassmorphism everywhere.
- Three perfectly-symmetric feature cards with one generic icon each.
- Stock 3D blobs / floating gradient orbs.
- "Supercharge / Unleash / Elevate / Revolutionize your X" copy; emoji in headings.
- Default Inter-on-stark-white with a violet accent; monotonously even spacing; everything centered.
- Vague feature copy ("Powerful lead generation", "Seamless workflow").

**Required (the human-designed signals):**
- **Asymmetry** — left-aligned heroes, alternating zigzag rows; not everything centered.
- **Density variation** — some sections tight, some breathing; deliberate rhythm, not uniform.
- **One confident, distinctive type choice** (not default Inter) — a characterful sans, or a tasteful serif/sans pairing. Document the choice.
- **Specific, real copy** — "Find construction firms in your city with no website" beats "Powerful lead generation". Specificity is the single biggest anti-slop lever.
- **Real product imagery** — screenshots/video (placeholders now), not abstract illustrations.
- **Color restraint** — the one teal/green accent doing real work; semantic colors sparingly; dark sections used intentionally for rhythm (e.g. the demo), not dark-everything.
- **Considered micro-details** — a real, thoughtful hover; tasteful section transitions; genuine spacing rhythm.
- Principle: looking human-designed comes from **fewer, more deliberate** choices, not more effects.

---

## 6. Motion & 3D policy (purpose over spectacle)

- **Scroll-reveals, not scroll-jacking.** Content animates in as it enters view (fast, subtle, 150–400ms, staggered). Never hijack scroll or force cinematic sequences that fight the user's pace.
- **One 3D/parallax hero moment**, tightly constrained: tasteful, on-brand (a depth/parallax treatment of a real product visual or a restrained interactive accent — NOT a blob), lazy-loaded, a self-contained client island that can be swapped/removed without touching other code, **simplified or disabled on mobile** and under `prefers-reduced-motion`, and never blocking content paint.
- Motion must explain or delight with purpose; if it's decoration that slows the page, cut it. Fast > cinematic for B2B conversion.

---

## 7. Honest-early trust strategy (because there are no users yet)

- **No fabricated social proof.** No fake logos, invented testimonials, or made-up user counts. The audience detects these instantly and trust is destroyed permanently.
- Trust is built instead by: the **product demo** (seeing-is-believing), an **honest founder's note** ("I built this because I had this problem"), **transparency** ("we're new — here's our roadmap"), the **compliance/security positioning** as a feature, and **risk reversal** (free to try, easy cancel, no lock-in).
- Leave clearly-marked, easily-swappable slots for real proof (testimonials, results, logos, user counts) to drop in the moment they exist.

---

## 8. Page inventory

- **Landing page** (the main conversion page; sections in M02/M03).
- **Pricing page** (deeper detail + FAQ).
- **How-it-works / product page** (depth for researchers).
- **About page** (founder story = trust for an early company).
- **Blog/resources hub** (SEO/AEO engine; scaffold only in this build — structure + one placeholder post).
- **Legal:** privacy + terms (stubs; real text is the user's/lawyer's job — mark clearly).
- **Optional free-tool lead magnet** (e.g. "find businesses with no website in any city") — note as a future growth lever; not built in this pass unless a file says so.
- App/auth lives in `apps/web` (Angular) — the marketing CTA links to it; do not rebuild auth here.

---

## 9. SEO + AEO requirements (applied in M04, kept in mind throughout)

- The marketing site is SSR/SSG (Next.js) — fast, semantic HTML, server-rendered for crawlers. (The Angular app needs no SEO; this site needs all of it.)
- **SEO:** target ICP search intent ("cold email tool for agencies", "find local business leads", "[competitor] alternative", "find businesses without a website"); meta + Open Graph; sitemap; clean semantic structure; the blog as the content engine.
- **AEO (be cited by AI assistants):** specific factual structured content; a strong FAQ (AI loves structured Q&A); schema.org `SoftwareApplication` + `FAQPage` markup; `robots.txt` allowing AI crawlers (GPTBot, ClaudeBot, PerplexityBot) and a sitemap.
- The FAQ does double duty: persuasion + AEO.

---

## 10. Responsiveness & performance budget

- **Mobile-first** — most ICP traffic is on phones. Build mobile layouts first, enhance up.
- Fluid type (clamp-based), thumb-sized touch targets, CTAs always reachable, asymmetric desktop layouts re-stack cleanly to single column. Hero and demo are the screens most likely to break on mobile — verify them hardest.
- Performance: fast LCP, minimal client JS (RSC-first), images/video lazy-loaded with posters, no motion that blocks paint. A fast site converts and ranks better — treat speed as a feature.

---

## 11. CTA mechanics

- One primary action ("Start free") repeated at: hero, sticky header, immediately after the demo (peak-intent moment — don't miss this one), pricing, and final CTA.
- One quiet secondary ("See how it works" → smooth-scroll to demo) in the hero only.
- Friction-reducing microcopy under primary CTAs. CTAs link to the product app signup (`apps/web` route) — confirm the URL/route when wiring.

---

## 12. Visual verification (every marketing file with UI)

Per `00-master-context.md` §8, but for marketing also verify across **breakpoints** (mobile + desktop at minimum) using Claude in Chrome:
- Check against the anti-slop rules (§5), the motion policy (§6), responsiveness (§10), and that the section reads as human-designed and on-brand.
- Confirm `prefers-reduced-motion` disables/simplifies motion; confirm the page is fast (no blocking assets).
- Fallback per §8 if Chrome unavailable: confirm build/serve, write a per-breakpoint manual checklist, note the skip in `PROGRESS.md`.

---

## 13. Placeholder assets (mark every one; swap-list maintained in M04)

Use clearly-labeled placeholders, never fabricated real-looking proof:
- Product **video** (autoplay silent) + **poster** image + screenshot fallback.
- Product **screenshots** for hero/steps/differentiators.
- **Founder photo** + founder's-note text (a real draft direction; user finalizes).
- Any future testimonial/logo/result slots: leave empty, labeled, easy to fill.
Each placeholder must be obvious in code (clear filename/alt/comment) so nothing fake ships and the user knows what to replace.

---

## 14. Marketing build file index

- **M00** — This file. Read every marketing session; not executed.
- **M01** — Scaffold + design system + layout shell (Next app in workspace, Tailwind + shared tokens, fonts, header/footer, scroll-reveal infra, routing).
- **M02** — Above-the-fold + core: hero (+ 3D island), pain, how-it-works (4 steps), demo centerpiece (video).
- **M03** — Trust + conversion: differentiators (zigzag), founder's note, pricing, FAQ, final CTA, secondary pages (pricing/about/legal stubs, blog scaffold).
- **M04** — SEO/AEO + performance + full responsive/visual verification + placeholder swap-list + README section.

*(Split with suffixes — `M02a`/`M02b` — if a session would run long; record in PROGRESS.)*

---

## 15. Amendments log
*(Append-only. Date + one line each.)*
- (none yet)
