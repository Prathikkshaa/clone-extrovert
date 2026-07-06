# ExtrovertAI — Marketing site (`apps/marketing`)

The public, high-conversion marketing site: landing, pricing, how-it-works, about, blog, and legal pages. A **separate Next.js app** from the product (`apps/web`, Angular) that shares only `packages/shared` (design tokens + `APP_NAME`). Built per the marketing spec in [`docs/Landing page/`](../../docs/Landing%20page/) (files M00–M04).

## Stack

- **Next.js (App Router), RSC-first** — Server Components by default; client JS only in the five documented islands.
- **Tailwind CSS v3.4** wired to the shared ExtrovertAI design tokens (CSS variables mirroring `apps/web`), with an overridden palette + a fluid, clamp-based type scale (anti-slop).
- **Fonts** — Space Grotesk (headings) + IBM Plex Sans (body), self-hosted via `next/font` (no layout shift).
- **Motion** — GSAP + ScrollTrigger scroll-reveals + one constrained parallax hero island; all reduced-motion-safe.
- **SEO/AEO** — per-page metadata + OpenGraph/Twitter, build-generated `sitemap.xml` + `robots.txt` (welcomes AI crawlers), a build-generated OG image (`next/og`), and JSON-LD (`SoftwareApplication` / `Organization` / `FAQPage`).
- Statically generated (every route is Static/SSG).

## Run / build

From the **monorepo root** (so the shared package builds first):

```bash
npm run build:shared          # build @extrovertai/shared once
npm run dev -w marketing      # dev server → http://localhost:4321
npm run build -w marketing    # production build
npm run start -w marketing    # serve the production build → :4321
```

Repo-wide lint: `npm run lint` (from root).

## RSC-first rule (important)

Server Components by default. `"use client"` is allowed **only** for genuine interactive islands, each with a top-of-file doc comment explaining why:

- `components/site-header.tsx` — scroll-condense + mobile menu
- `components/reveal.tsx` — the one scroll-reveal primitive (GSAP)
- `components/hero-visual.tsx` — the one parallax/tilt island (desktop-only)
- `components/sections/demo-player.tsx` — the autoplay-silent video + fallback
- `components/sections/faq.tsx` — the accessible FAQ accordion

Don't add client components casually — it regresses the mobile-LCP/conversion goal.

## Where things come from

- **Design tokens** — CSS variables in `src/app/globals.css`, mapped to Tailwind names in `tailwind.config.ts`; the same palette as `apps/web`. No hardcoded hex in components.
- **Product name** — `APP_NAME` from `@extrovertai/shared` (never hardcoded).
- **Pricing** — real File 14 values (`CREDIT_PACKS` / `CREDIT_COSTS` / `CREDIT_USD_CENTS`) from `@extrovertai/shared`.
- **Site config** — `src/lib/site.ts` (`SIGNUP_URL`, `SITE_URL`, nav/footer). Both URLs are env-driven placeholders — see the swap-list.

## Deploy (Vercel)

Set the Vercel project root to `apps/marketing`. Configure env `NEXT_PUBLIC_APP_URL` (product signup route) and `NEXT_PUBLIC_SITE_URL` (this site's origin). Then deploy and point the domain.

## Before launch

Work through **[`docs/MARKETING-SWAP-LIST.md`](../../docs/MARKETING-SWAP-LIST.md)** — every placeholder asset, the two URLs, the legal text, and the copy-refinement items, with launch-blocking flags. All current copy is *direction*; finalize it in your voice. Add real proof only when it exists (no fabricated testimonials/logos/counts).
