# M01 — Marketing Scaffold + Design System + Layout Shell

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` (product spine — conventions, monorepo layout, commit ritual).
2. Read `/docs/M00-marketing-context.md` (marketing rules — stack, anti-slop, motion, trust strategy).
3. Read `/docs/PROGRESS.md`.
4. Execute only this file's scope.

## Preconditions to verify
- The monorepo exists with npm workspaces and `packages/shared` (from product File 01). If the product scaffold doesn't exist yet, you can still create `apps/marketing` as a workspace, but ensure `packages/shared` (with `APP_NAME` + design tokens) exists or create a minimal shared token source and note it in `PROGRESS.md`.
- Node 20+, git authenticated, `main` branch.

## Scope of THIS file
Stand up `apps/marketing` as a Next.js (App Router) site in the monorepo, wired to the shared ExtrovertAI design tokens, with the global layout shell (sticky header + footer), the scroll-reveal infrastructure, fonts, and placeholder routing — styled so the EMPTY shell already looks intentional and on-brand (not generic). No marketing section content yet (that's M02/M03).

### 1. Workspace + Next.js app
- Add `apps/marketing` to the npm workspaces. Scaffold **Next.js App Router**, TypeScript.
- Enforce **RSC-first** (M00 §4): Server Components by default; a clear, documented convention for when `"use client"` is allowed (interactive islands only). Add a top-of-file doc comment to any client component stating why it must be client.
- Configure static generation for marketing pages.
- Confirm it builds and runs independently (`apps/marketing` dev server) without touching `apps/web` (Angular).

### 2. Design tokens → Tailwind (the key anti-slop step, M00 §5)
- Install + configure Tailwind in `apps/marketing`.
- Wire Tailwind to the **shared ExtrovertAI tokens** (import/derive from `packages/shared` or the product's token values): warm ink `#1A1A18`, warm canvas `#FAFAF8`, the single teal/green accent, semantic colors, the spacing scale, radii, and the 400/500 type weights. **Override stock Tailwind defaults** (palette/spacing/font) so nothing uses generic Tailwind look.
- Import `APP_NAME` from `packages/shared`; never hardcode "ExtrovertAI" in markup.
- Set up CSS variables + Tailwind theme so the site can re-theme via tokens (consistency with the product app).

### 3. Typography (distinctive, not default Inter — M00 §5)
- Choose ONE confident, distinctive heading typeface (a characterful sans, or a tasteful serif/sans pairing) + a clean readable body sans. Load via `next/font` (self-hosted, no layout shift). Document the choice + rationale in `PROGRESS.md`.
- Set a fluid type scale (clamp-based) for responsive sizing; headings weight 500, body 400 (two weights only, per the product design system).

### 4. Layout shell
- **Root layout** with the canvas background, ink text, base type, and global metadata defaults (full SEO metadata comes in M04 — set sane defaults now).
- **Sticky header** (client island): logo/`APP_NAME`, minimal nav (Product/How it works, Pricing, About, Blog), and the persistent primary CTA ("Start free"). Slim, appears/condenses on scroll. Mobile: a clean menu (accessible). The CTA links to the product signup route (use a documented placeholder URL/route now; note it for wiring).
- **Footer**: real link groups (product, pricing, blog, about, legal, contact), the compliance/trust line, honest "built by [founder]" (placeholder), `APP_NAME`. No fake badges.

### 5. Scroll-reveal + motion infrastructure (M00 §6)
- Set up GSAP + ScrollTrigger (and optionally Lenis smooth scroll) as a reusable client-side reveal mechanism: a small `<Reveal>` (or hook) wrapper that fades/translates children in on enter (fast, subtle, staggered), used by later sections.
- **Honor `prefers-reduced-motion`**: when set, disable transforms/reveals (content shows immediately). Build this into the reveal primitive so every later section inherits it.
- Ensure motion is lazy/non-blocking and never delays content paint.
- Do NOT build the 3D hero island here (that's M02) — but leave a clear, documented slot/convention for a self-contained client island so M02 can drop it in.

### 6. Routing placeholders
- Create routes (empty/skeleton, styled with the shell): `/` (landing), `/pricing`, `/how-it-works` (or product), `/about`, `/blog` (+ a placeholder post structure), `/privacy`, `/terms`. Each renders the header/footer shell and a clearly-labeled "section coming in M02/M03" placeholder so the structure is navigable and verifiable now.

### 7. Progress tracking
- Add a **"Marketing site"** section to `/docs/PROGRESS.md` (separate from the product file checklist) with M01 marked done and the marketing file index (M00–M04) status.
- Update `/docs/CODE-MAP.md` with `apps/marketing` and one line on its purpose + the reveal primitive + token wiring.

## AI-friendly code requirements (00-master §10 + M00)
- RSC by default; client islands documented + minimal. Explicit types. Small single-purpose components. Token-driven styles (no hardcoded hex in components — use the Tailwind/token classes). `APP_NAME` from shared.

## Verification (must pass before Done)
1. `apps/marketing` builds and serves with **zero type/compile errors**; does not break the workspace build of other apps.
2. The shell renders: sticky header with persistent CTA, footer, on warm canvas/ink with the distinctive heading font and the teal/green accent on the CTA — visibly NOT generic Tailwind/Inter/violet.
3. Nav routes all resolve to styled placeholders; mobile menu works.
4. Scroll-reveal primitive works on a test element and is disabled under `prefers-reduced-motion`.
5. RSC-first respected: client components are only the header/menu/reveal primitive (+ documented); the rest are server components. Minimal client JS shipped.
6. `APP_NAME` comes from shared (changing it re-labels the site); no hardcoded app name; no hardcoded hex in components.

### Visual verification (UI present — across breakpoints, M00 §12)
- Run §8 of `00-master-context.md` on the shell via Claude in Chrome, at **mobile and desktop** widths.
- **Expected visual result:** calm warm-canvas shell; distinctive (non-Inter) headings; single teal/green accent only on the CTA; sticky header condenses on scroll with the CTA always reachable; footer with real link groups and no fake badges; placeholders clearly labeled; layout clean and intentional (asymmetry-ready, not centered-everything); fast; reduced-motion respected. No purple/gradients/blobs/slop.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip + per-breakpoint checklist.

## Definition of Done (00-master §9)
- Verification passes (incl. visual/fallback at both breakpoints). `PROGRESS.md` updated (Marketing section added; M01 done; record the chosen fonts + rationale, the CTA target route placeholder, any shared-token setup notes). `CODE-MAP.md` updated.
- Commit: `feat(marketing): M01 next.js scaffold, shared-token design system, layout shell, scroll-reveal infra`
- Push to `main`.

## What's next
M02 — Above-the-fold + core sections: hero (asymmetric, primary CTA, the one constrained 3D/parallax island), pain section, how-it-works (4 steps), and the demo centerpiece (autoplay silent captioned video with poster + fallback).
