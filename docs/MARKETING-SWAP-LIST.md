# Marketing site — placeholder swap-list

> Everything in `apps/marketing` that ships as a **clearly-labeled placeholder** and must be replaced before (or shortly after) launch. Generated at M04. Each row: what it is · where it lives · what to replace it with · whether it **blocks launch**.
>
> The site is **code-complete and verified locally**; these are content/asset/config swaps, not code work. Most are drop-in (swap the file/value, no code changes).

## Launch-blocking

| # | Item | Location | Replace with | Blocks launch? |
|---|------|----------|--------------|----------------|
| 1 | **Signup CTA URL** | `src/lib/site.ts` → `APP_URL` / env `NEXT_PUBLIC_APP_URL` (default `https://app.extrovertai.example/signup`) | The real `apps/web` (Angular) signup route/host. Every "Start free" button uses this. | **Yes** |
| 2 | **Marketing site origin** | `src/lib/site.ts` → `SITE_URL` / env `NEXT_PUBLIC_SITE_URL` (default `https://extrovertai.example`) | The real production domain. Feeds `metadataBase`, canonical URLs, `sitemap.xml`, `robots.txt`, absolute OG URLs. | **Yes** |
| 3 | **Privacy policy text** | `src/app/privacy/page.tsx` | Real legal text (founder + lawyer). Currently a marked stub, `noindex`. | **Yes** |
| 4 | **Terms of service text** | `src/app/terms/page.tsx` | Real legal text (founder + lawyer). Currently a marked stub, `noindex`. | **Yes** |
| 5 | **Compliance footer address** | Shown as an example ("123 Main St, Austin, TX") in `src/components/sections/differentiators.tsx` (`ComplianceVisual`) | The real mailing address, or keep generic — it's illustrative marketing copy, but don't imply a fake address. | **Yes** (accuracy) |

## Recommended before launch (not hard blockers)

| # | Item | Location | Replace with | Blocks launch? |
|---|------|----------|--------------|----------------|
| 6 | **Product demo video** | `public/demo/product-demo.mp4` (not shipped) | The real autoplay-silent walkthrough (~15–25s, muted). Until present, `DemoPlayer` shows the static fallback + captions. | No (fallback active) |
| 7 | **Demo poster** | `public/demo/poster.svg` | A real first-frame poster (`.jpg`/`.webp`); update `poster` prop in `src/components/sections/demo.tsx`. | No |
| 8 | **Founder photo** | `src/components/sections/founder-note.tsx` (dashed circle placeholder) | A real founder headshot. | No |
| 9 | **Founder's-note copy** | `src/components/sections/founder-note.tsx` + `src/app/about/page.tsx` | Final words in the founder's own voice (current text is honest direction). | No |
| 10 | **Founder name** | `src/lib/site.ts` → `FOUNDER_NAME` ("the founder") | The real name (also flows into `Organization` JSON-LD + footer). | No |
| 11 | **Product screenshots** | DOM mocks: `src/components/product-panel.tsx`, the how-it-works snippets, the differentiator visuals | Real product screenshots/frames if desired. The DOM mocks are on-brand and sharp, so this is optional polish. | No |
| 12 | **All section marketing copy** | every file in `src/components/sections/` | Final copy in your voice. All current copy is **direction** (specific, on-brand) per M02/M03. | No |
| 13 | **OG / social image** | generated at build by `src/app/opengraph-image.tsx` (real on-brand PNG) | A richer designed image only if wanted — the generated one is production-usable. | No |
| 14 | **Favicon / logo** | none yet (wordmark is text + accent dot) | A favicon (`src/app/icon.png`) + logo mark if desired. | No |
| 15 | **Real proof slot** | `src/components/sections/founder-note.tsx` (empty, labeled `SWAP-SLOT`) | Real testimonials / results / logos **once they exist** — never fabricated (M00 §7). | No |
| 16 | **Blog posts** | `src/app/blog/posts.ts` (one typed placeholder post) | Real posts. Approach: swap the typed array for MDX or a CMS; the index + `[slug]` route + sitemap already read from this source. | No |

## Status: NOT placeholder (already final)

- **Pricing numbers** — `src/components/sections/pricing.tsx` reads the **finalized File 14 values** from `@extrovertai/shared` (`CREDIT_PACKS`, `CREDIT_COSTS`, `CREDIT_USD_CENTS`). If product File 14 prices change, they update here automatically.
- **Design tokens** — shared with `apps/web` via CSS variables (no swap needed).
- **SEO/AEO** — metadata, sitemap, robots (AI crawlers), and JSON-LD (`SoftwareApplication` / `Organization` / `FAQPage`) are wired and valid; they only need the real `SITE_URL` (#2).

## Deploy checklist (after swaps)

1. Set `NEXT_PUBLIC_APP_URL` + `NEXT_PUBLIC_SITE_URL` in the host (Vercel) env.
2. Deploy `apps/marketing` to Vercel (root dir `apps/marketing`; it builds `@extrovertai/shared` via the workspace).
3. Point the domain; confirm `sitemap.xml` + `robots.txt` resolve at the real origin.
4. Validate the JSON-LD (Google Rich Results Test) and the OG image (social debuggers).
5. Run a real Lighthouse pass on the deployed URL (esp. mobile); see PROGRESS for the local audit.
