# M02 — Above-the-Fold + Core Sections

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md`.
2. Read `/docs/M00-marketing-context.md` (message spine §3, anti-slop §5, motion §6, trust §7, CTA §11).
3. Read `/docs/PROGRESS.md`.
4. Execute only this file's scope.

## Preconditions to verify
- M01 done: `apps/marketing` builds/serves; shell (sticky header + footer), Tailwind+shared tokens, distinctive fonts, and the reveal primitive exist; reduced-motion respected; routes scaffolded.
- The `<Reveal>` primitive and the documented "client island slot" from M01 exist.

## Scope of THIS file
Build the top of the landing page — the persuasion core and the "wow": **hero** (asymmetric, primary CTA, the ONE constrained 3D/parallax island), **pain** section, **how-it-works** (4 steps), and the **demo centerpiece** (autoplay silent captioned video). Copy here is DIRECTION + examples — write strong, specific, on-brand copy (anti-slop §5); the user will refine final words. Use clearly-labeled placeholder assets (M00 §13).

### 1. Hero (asymmetric, M00 §5/§11)
- **Layout:** left-aligned (NOT centered). Headline + subhead + primary CTA + quiet secondary on one side; a real product visual on the other (desktop), stacked on mobile (headline → visual → CTA).
- **Copy direction (transformation, specific — refine, don't ship verbatim):**
  - Headline ≈ "Find the right businesses, email them like a pro, and book meetings — on autopilot."
  - Subhead names the audience + wedge ≈ "For founders and agencies who need clients, not another tool to learn."
  - No "supercharge/unleash/elevate", no emoji, no vague claims.
- **Primary CTA:** "Start free" → product signup route (from M01 placeholder). Microcopy beneath: "No card needed · Free to start." **Secondary:** "See how it works" → smooth-scroll to the demo section.
- **Product visual:** the most concrete hook — a real screenshot of the lead list showing the "no website" badge (placeholder image now, clearly labeled). 
- **Entrance motion:** subtle staggered rise-in on load (fast, §6); respects reduced-motion.

### 2. The ONE 3D / parallax hero island (constrained — M00 §6)
- A self-contained **client island** providing a tasteful depth/parallax treatment — e.g. a subtle parallax/tilt or layered-depth presentation of the real product visual, or a restrained interactive accent. **NOT** a stock floating blob/orb/gradient mesh.
- Hard constraints: lazy-loaded; **simplified or disabled on mobile**; disabled under `prefers-reduced-motion`; never blocks content paint; swappable/removable without touching other code (isolated component + clear doc comment).
- If in doubt, err toward subtle. The product demo is the wow — this is polish, not spectacle.

### 3. Pain section (density drop for rhythm, M00 §5)
- Tighter, quieter than the hero (deliberate density variation). 
- **Copy direction:** name what they feel before they admit it ≈ "You know you need outreach. But finding leads eats hours, every email feels generic, and half of them bounce or hit spam." Empathetic, plain, short.
- Minimal visuals; this section's job is the "that's exactly me" moment (§2 psychology). Reveal on scroll.

### 4. How it works — 4 steps (reduce perceived effort, M00 §3)
- Steps: **Find → Personalize → Send → Book.** Each one short sentence + a small real UI snippet (placeholder screenshots, labeled).
  - Find: "Search any industry + city. Filter for buying signals like 'no website'."
  - Personalize: "AI writes each email from the lead's site and reviews — in your voice."
  - Send: "Sends from your own inbox, throttled to stay out of spam. Auto follow-ups."
  - Book: "Replies land in your inbox; meetings book straight to your calendar."
- **Layout:** horizontal stepped/connected on desktop (asymmetric, not 3 identical centered cards), vertical on mobile. Staggered scroll-reveal as each step enters.

### 5. Demo centerpiece (the wow — seeing-is-believing, M00 §4/§13)
- Give it room + a **dark ground** so the product glows (intentional dark section for rhythm).
- **Autoplay silent product video**, implemented correctly: `muted`, `loop`, `autoPlay`, `playsInline`; a **poster** image for instant paint; **lazy-loaded** so it doesn't block LCP; a **static screenshot fallback** if video can't play. Since it's silent, add on-screen **captions/labels** that carry the meaning ("type a city → leads appear → email writes itself").
- Placeholder video + poster now (clearly labeled in M00 §13 swap-list). 
- **Post-demo CTA** (peak-intent placement, M00 §11): "Start free" immediately after the demo — do not omit this; it's the highest-converting CTA spot.

## AI-friendly + anti-slop checks (M00 §5)
- Specific real copy (no vague hype); asymmetric layouts (not centered card rows); one accent; real product imagery (placeholders labeled); distinctive type; deliberate density variation. Token-driven styles; `APP_NAME` from shared.

## Verification (must pass before Done)
1. `apps/marketing` builds/serves, zero type errors; doesn't break the workspace.
2. Hero renders asymmetric (left-aligned), with primary + secondary CTAs; primary links to signup, secondary smooth-scrolls to demo; entrance motion subtle and reduced-motion-safe.
3. The 3D/parallax island is tasteful, lazy-loaded, disabled/simplified on mobile + reduced-motion, non-blocking, and isolated (removable).
4. Pain section reads empathetic/specific with a deliberate density drop.
5. How-it-works shows 4 steps, asymmetric on desktop / vertical on mobile, with staggered reveals.
6. Demo video autoplays muted+looping+inline with a poster, lazy-loads (doesn't block LCP), has a screenshot fallback and on-screen captions; the post-demo "Start free" CTA is present.
7. Anti-slop: no purple/gradients/blobs, no symmetric generic card trio, no vague copy, distinctive font in use.

### Visual verification (across breakpoints — M00 §12)
- Run §8 on the landing top (hero → pain → steps → demo) via Claude in Chrome at **mobile + desktop**.
- **Expected visual result:** asymmetric left-aligned hero with a real (placeholder) product screenshot and one tasteful depth/parallax touch (not a blob); persistent + secondary CTAs working; quieter pain section (density variation); 4 clean steps with real UI snippets; a dark demo section where an autoplaying silent captioned video makes the product pop, with a "Start free" CTA right after; fast load; reduced-motion respected; reads human-designed, on-brand, not AI-generated.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip + per-breakpoint checklist.

## Definition of Done (00-master §9)
- Verification passes (incl. visual/fallback at both breakpoints). `PROGRESS.md` updated (M02 done; list placeholder assets used + add them to the swap-list note for M04; record the 3D-island approach chosen; note final-copy is direction pending user refinement). `CODE-MAP.md` updated.
- Commit: `feat(marketing): M02 hero + 3d island, pain, how-it-works, demo video centerpiece`
- Push to `main`.

## What's next
M03 — Trust + conversion sections: differentiators (asymmetric zigzag), the honest founder's note, pricing (free-tier-forward, credit model), FAQ accordion, final CTA, and the secondary pages (pricing/about/legal stubs, blog scaffold).
