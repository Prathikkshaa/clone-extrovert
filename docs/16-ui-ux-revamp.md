# 16 — UI/UX Revamp (App shell, navigation, component kit, dark mode, polish)

> **How to use this file:** Upload it into a fresh Claude Code session. It is self-contained and **self-tracking** — the executing agent reads the codebase, then runs the phases below **in order, one after another, without pausing for confirmation between phases**, updating a progress ledger as it goes so it can resume exactly where it left off if interrupted.

---

## 0. Session start (do this FIRST, every session — including resumes)

1. Read `/docs/00-master-context.md` fully — especially the design system & UX rules (§7) and the locked decisions (§2). **Everything in this revamp must obey §7.**
2. Read `/docs/PROGRESS.md` and `/docs/CODE-MAP.md` to understand the app as built (Files 01–15, MVP complete).
3. Read `/docs/UI-REVAMP-PROGRESS.md` — the **revamp ledger**. If it does not exist yet, create it from the template in §0.3 below (this is the very first run). If it exists, this is a **resume**.
4. Skim the web app so you understand the starting point (see §1 "Current state"). At minimum open: `apps/web/src/app/app.ts`, `app.routes.ts`, `app.config.ts`, `styles.css`, `tailwind.config.*`, one representative page (`pages/dashboard/`), and `core/theme.service.ts`.
5. Determine the **next action** (see §0.2 Resume logic) and continue executing.

### 0.1 Autonomous execution rules
- Execute phases **strictly in the order given** (Phase 0 → 1 → 2 → … → 7). Each phase is independently shippable.
- **Do NOT stop for user confirmation between phases.** After a phase passes its verification and is committed + pushed, immediately begin the next phase.
- Only stop if **genuinely blocked**: a dependency that cannot be installed, a destructive conflict, or a product decision not answered by this file. If blocked: record the blocker clearly in `UI-REVAMP-PROGRESS.md`, push what safely builds, and tell the user exactly what's needed. Otherwise keep going until all phases are done.
- **Never break the build.** `npm run build` and `npm run lint` must pass at the end of every phase before committing. If a change breaks them, fix it before moving on.
- This is a **frontend-only** revamp: touch `apps/web` only. Do **not** change API/worker/server/shared logic, the DB, credits, compliance, or any backend behavior. (You may read them to understand data shapes.)
- Respect §7: calm/minimal, **one teal/green accent only on primary actions + positive states**, semantic colors (green=positive, amber=warning, red=danger), **no purple, no gradients, no AI-slop**, 150–250ms motion, skeletons over spinners, plain verb-based copy, honor `prefers-reduced-motion`, accessibility throughout. Use `APP_NAME` from `@extrovertai/shared` — never hardcode "ExtrovertAI" in components.

### 0.2 Resume logic (how to pick up where you left off)
1. Open `UI-REVAMP-PROGRESS.md`. Read the **Current status** line and the **Phase checklist**.
2. Find the first phase whose status is not `done`.
3. If that phase is `in-progress`: re-derive what's actually done by inspecting the code against that phase's task checklist (the ledger tracks per-task checkboxes). Complete the remaining tasks only. Do not redo finished work.
4. If `not-started`: begin it.
5. Cross-check with `git log --oneline` — each completed phase has a commit `feat(ui): 16.<phase> …`. The last such commit tells you the last fully-finished phase.
6. Continue per §0.1.

### 0.3 Progress ledger template (create `docs/UI-REVAMP-PROGRESS.md` on first run)

```markdown
# UI-REVAMP-PROGRESS — File 16 execution ledger

> Updated continuously by the executing agent. On resume, read this first (see 16-ui-ux-revamp.md §0.2).

## Current status
- Active phase: 0
- Active task: (none yet)
- State: not-started   <!-- not-started | in-progress | done | blocked -->
- Last updated: <date>
- Blocker (if any): none

## Phase checklist
- [ ] Phase 0 — Foundation: icons, dark/light tokens + ThemeModeService, ui/ + layout/ scaffolding
- [ ] Phase 1 — Component kit (Button, PageHeader, Card, EmptyState, StatusBadge, Skeleton, Field, Toast, ConfirmDialog)
- [ ] Phase 2 — App shell + route restructure (Sidebar, Topbar, breadcrumb/back) + dark-mode toggle wired
- [ ] Phase 3 — Home launchpad + first-run checklist + pipeline stepper
- [ ] Phase 4 — Per-screen layout pass (all 15 screens onto the kit + shell + next-step CTAs)
- [ ] Phase 5 — Visual polish (icons everywhere, type/spacing/density, micro-interactions, responsive drawer + mobile nav, a11y)
- [ ] Phase 6 — Full visual verification sweep + fixes
- [ ] Phase 7 — Docs (README, CODE-MAP, PROGRESS) + final acceptance

## Phase notes (append per phase: what was done, decisions, deviations, commit hash)
- Phase 0:
```

**Update discipline (critical for resume):** update the **Current status** block whenever you start a phase, start a notable task, or finish a phase. Tick the **Phase checklist** box when a phase is committed. Append a one-paragraph note + the commit hash under **Phase notes**. Commit the ledger as part of each phase's commit.

---

## 1. Current state (what you're starting from — grounding)

- **Shell:** `apps/web/src/app/app.ts` is `template: '<router-outlet />'` — **no persistent navigation chrome**. There is no layout/sidebar/topbar.
- **Routes:** `apps/web/src/app/app.routes.ts` — all screens are flat, lazy `loadComponent` routes, each guarded by `authGuard` (or `guestGuard` for login/signup). Routes: `'' (landing)`, `login`, `signup`, `home`, `mailboxes`, `onboarding`, `settings`, `search`, `enrich`, `draft`, `send`, `campaigns/:id`, `inbox`, `dashboard`, `billing`, `** → ''`.
- **Pages:** `apps/web/src/app/pages/<name>/<name>.ts` + `.html`, standalone components using signals. Each page improvises its own header + a "Home"/"Back to home" link (inconsistent labels; `onboarding` has none; `inbox`/`mailboxes`/`billing` are near dead-ends).
- **Home** (`pages/home/home.html`) is a flat grid of ~10 equal buttons in an illogical order (the launchpad to replace).
- **Core services:** `apps/web/src/app/core/*.service.ts` — `auth.service`, `auth.guard`, `theme.service` (brand-accent override from File 05), `me.service`, `credits.service`, `billing.service`, `company-profile.service`, `dashboard.service`, `inbox.service`, `campaigns.service`, `drafting.service`, `enrichment.service`. Reuse these; don't duplicate API calls.
- **Design tokens:** `apps/web/src/styles.css` defines CSS custom properties (`--color-ink/canvas/surface/muted/line/accent/accent-strong/positive/warning/danger`, `--radius-md/lg`, spacing scale) **and already has a dark-mode token block** under `[data-theme='dark'], .dark` (untuned). Tailwind maps semantic utilities to these vars — templates use `bg-canvas text-ink text-muted bg-surface border-line bg-accent text-accent hover:bg-accent-strong text-positive text-warning text-danger text-heading-lg text-heading-sm rounded-md rounded-lg`. **Keep using these semantic classes** — never hardcode hex.
- **Brand theming:** `ThemeService` overrides `--color-accent` from the user's brand color (File 05). Dark mode is **orthogonal** (it swaps neutral tokens via the `data-theme` attribute). Keep them independent and make sure both work together.
- **Stack:** Angular v22 standalone components + Tailwind. Build: `npm run build` (root). Lint: `npm run lint`. Dev: `npm run dev:web` (port 4200) and `npm run dev:api` (3000).

---

## 2. Target design (the north star — reproduce this)

A calm, enterprise-grade **app shell** wrapping all authenticated screens:

- **Left sidebar (≈184px):** app logo + name at top. Two grouped sections:
  - **Workflow:** Find leads · Enrich · Write · Send (this is the core pipeline, in order).
  - **Manage:** Inbox (with an unread-count badge) · Dashboard.
  - Pinned at the bottom: Billing · Settings.
  - Each item: a line icon + label; the active route is highlighted (subtle teal-tinted background + teal text/icon). Collapses to an off-canvas drawer on narrow screens.
- **Top bar:** a back arrow + breadcrumb (e.g. `Home › Find leads`) on the left; on the right a **credits chip** (links to Billing, turns red at 0), a **dark/light mode toggle**, a notifications bell, and an **account menu** (profile, mailboxes, log out).
- **Pipeline stepper** on the four workflow screens: `Find ① → Enrich ② → Write ③ → Send ④`, current step highlighted.
- **Consistent page header** on every screen: title + one-line subtitle, breadcrumb/back, and a single **primary action** top-right.
- **A "what's next" card** at the bottom of flow screens pointing to the next stage ("Next: enrich your saved leads →").
- **Home** = a launchpad: a first-run "Getting started" checklist + quick stats + a "Continue where you left off" CTA (not 10 equal buttons).
- Auth screens (`landing`, `login`, `signup`) stay **outside** the shell (no sidebar).
- **Dark + light mode**, toggleable, persisted, defaulting to the OS preference.

Visual language stays exactly within §7: warm near-black ink on warm off-white canvas (inverted in dark), one teal/green accent used sparingly, semantic green/amber/red, hairline borders, 8/14px radii, generous whitespace, subtle 150–250ms motion, line icons (no emoji), sentence case, plain verb labels.

---

## 3. Locked decisions for this revamp (do not relitigate)
- **Navigation:** left sidebar + top bar (as above). Not a top-only nav.
- **Icons:** use **`lucide-angular`** (MIT, tree-shakeable, Angular-native). Install it (`npm install lucide-angular -w web`). If the install is blocked, fall back to a tiny inline-SVG `Icon` component using Lucide SVG paths — but prefer the package. One icon system everywhere.
- **Scope:** implement **all phases**.
- **Theme:** ship a **dark/light mode toggle** (persisted in `localStorage`, default = `prefers-color-scheme`), coexisting with brand-accent theming.
- **Framework:** plain Angular standalone components + Tailwind (no new UI framework). Components live in `apps/web/src/app/ui/` (kit) and `apps/web/src/app/layout/` (shell).

---

## PHASE 0 — Foundation (icons, theme mode, tokens, scaffolding)

**Goal:** put the plumbing in place so later phases are fast and consistent.

**Tasks**
1. **Icons:** `npm install lucide-angular -w web`. Verify it imports in a standalone component. (Fallback per §3 if blocked — record the choice in the ledger.)
2. **Theme tokens:** in `apps/web/src/styles.css`, refine the existing `[data-theme='dark'], .dark` token block so EVERY semantic token has a tuned dark value with good contrast (ink/canvas/surface/muted/line/accent/positive/warning/danger). Add a smooth `transition` on `background-color`/`color`/`border-color` (respecting `prefers-reduced-motion`). Do not remove or rename existing tokens.
3. **ThemeModeService:** create `apps/web/src/app/core/theme-mode.service.ts` — a service that: reads saved mode from `localStorage` (`'light' | 'dark' | 'system'`), falls back to `prefers-color-scheme`, applies it by toggling the `data-theme` attribute on `document.documentElement`, exposes a signal for the current resolved mode, and a `set(mode)` / `toggle()` method that persists. Apply on app start (call it from `app.config.ts` providers or an `APP_INITIALIZER`, or from the shell component's constructor). Must coexist with `ThemeService` (brand accent) — they touch different tokens.
4. **Scaffolding:** create empty folders/barrels `apps/web/src/app/ui/` and `apps/web/src/app/layout/`. Add an `apps/web/src/app/ui/index.ts` barrel (populated in Phase 1).
5. **Icon wrapper (optional but recommended):** a thin `IconComponent` or agreed convention for using lucide icons at consistent sizes (16/18/20px) and `aria-hidden`/`aria-label` rules.

**Acceptance**
- `lucide-angular` (or fallback) usable. Toggling `data-theme="dark"` on `<html>` visibly flips the whole app to a tuned dark palette with no contrast failures. Mode persists across reload and defaults to OS setting.

**Verify:** `npm run build` + `npm run lint` clean. Start `npm run dev:web`, confirm dark/light token swap by setting the attribute (toggle UI comes in Phase 2).

**Commit:** `feat(ui): 16.0 foundation — lucide icons, tuned dark tokens, ThemeModeService`. Push. Update ledger → Phase 0 done. Continue.

---

## PHASE 1 — Component kit

**Goal:** one reusable, consistent set of UI primitives in `apps/web/src/app/ui/`, all standalone, all themable via tokens, all accessible. Every later screen uses these instead of bespoke markup.

**Build these standalone components/services** (selector → purpose → key inputs):
1. `ui-button` → primary/secondary/ghost/danger button. Inputs: `variant` (`primary|secondary|ghost|danger`, default `secondary`), `size` (`sm|md`), `loading` (bool → shows spinner + disables), `iconLeft`/`iconRight` (lucide name), `type`. Primary = teal accent; only ONE primary per screen region. Full focus-visible ring, disabled styles.
2. `ui-page-header` → standard screen header. Inputs: `title`, `subtitle?`, `breadcrumb?` (array of `{label, link?}`). Content-projection slot for right-aligned actions (`<ng-content select="[actions]">`). Renders the back affordance.
3. `ui-card` → raised surface container (white/surface bg, hairline border, radius-lg, padding). Optional `title`/header slot.
4. `ui-empty-state` → icon + headline + teaching line + projected CTA. Inputs: `icon`, `title`, `message`. For "no data yet, here's the next action" everywhere.
5. `ui-status-badge` → the pill for lead/message states. Input: `status` (`new|contacted|replied|bounced|meeting|won|lost|sent|queued|stopped|positive|negative|…`) → maps to semantic color (green positive, amber pending, red error, neutral default). Sentence case.
6. `ui-skeleton` → shimmer block(s) for loading. Inputs: `lines`/`height`/`width`. Honors reduced-motion.
7. `ui-field` → label + control slot + hint + error. Inputs: `label`, `hint?`, `error?`, `for`. Wraps inputs/textareas/selects consistently.
8. `ToastService` + `ui-toast-host` → non-blocking notifications (success/info/warn/error) with auto-dismiss; replaces inline ad-hoc status messages. Host mounted once in the shell.
9. `ui-confirm-dialog` + a `ConfirmService` (or simple component) → accessible confirm modal for destructive/irreversible actions (focus-trapped, ESC to close, returns a promise/observable).

Export all via `apps/web/src/app/ui/index.ts`.

**Acceptance**
- Each component renders in both light and dark mode, uses only semantic tokens, is keyboard-accessible (focus rings, ARIA), and matches §7. Build a throwaway demo route OR temporarily drop them on an existing page to eyeball, then remove the temporary usage.

**Verify:** `npm run build` + `npm run lint` clean. `npm run dev:web`; screenshot the kit in light + dark via the preview tools (or §8 fallback). Fix visual issues.

**Commit:** `feat(ui): 16.1 component kit — button, page-header, card, empty-state, status-badge, skeleton, field, toast, confirm`. Push. Ledger → Phase 1 done. Continue.

---

## PHASE 2 — App shell + route restructure + dark-mode toggle

**Goal:** every authenticated screen renders inside a persistent shell with sidebar + top bar; navigation is consistent and back/breadcrumb exists everywhere.

**Tasks**
1. **Layout components** in `apps/web/src/app/layout/`:
   - `app-shell` → CSS grid/flex: `sidebar` + (`topbar` over `<router-outlet />`). Mounts the `ui-toast-host`. Reads collapse state for responsive.
   - `app-sidebar` → the grouped nav from §2 (Workflow / Manage / pinned Billing+Settings), lucide icons, active-route highlight via `routerLinkActive`, Inbox unread badge (wire to a count source if cheaply available, else a placeholder that's easy to connect). Off-canvas drawer on `< md`.
   - `app-topbar` → back button (history back) + breadcrumb (derive from the route, or accept via a small breadcrumb service / `ui-page-header` coordination), credits chip (reuse `credits.service`; red at ≤0; links to `/billing`), **dark/light toggle** (wire `ThemeModeService` from Phase 0 with a sun/moon lucide icon), notifications bell (placeholder ok), account menu (profile → settings, mailboxes, log out via `auth.service`).
2. **Route restructure** in `app.routes.ts`: wrap all authed routes as **children of a parent route** that renders `app-shell` (parent `canActivate: [authGuard]`, children = the existing lazy pages **minus** their own `authGuard` since the parent guards them). Keep `''`(landing), `login`, `signup` OUTSIDE the shell. Keep lazy loading. Preserve all existing paths (`/home`, `/search`, … `/campaigns/:id`, `/billing`) so no links break.
3. **Remove the now-duplicated per-page header/back links** only where the shell replaces them (you'll finish this per-screen in Phase 4; here just ensure no double chrome on 2–3 screens as a proof).
4. **Mobile:** sidebar becomes a drawer (hamburger in topbar) under a breakpoint; ensure it's usable on a ~380px viewport.

**Acceptance**
- From any authed screen you can reach every section via the sidebar, see where you are (active highlight + breadcrumb), go back (topbar), see your credit balance, toggle dark/light (persists), and open the account menu to log out. Landing/login/signup have no shell. No route paths changed.

**Verify:** `npm run build` + `npm run lint` clean. `npm run dev:web`; verify navigation, active states, dark toggle, and responsive drawer via preview tools (light + dark, desktop + ~380px). §8 fallback if Chrome unavailable. Fix deviations.

**Commit:** `feat(ui): 16.2 app shell — sidebar, topbar, breadcrumb/back, dark-mode toggle, nested layout routes`. Push. Ledger → Phase 2 done. Continue.

---

## PHASE 3 — Home launchpad + first-run checklist + pipeline stepper

**Goal:** make the entry screen orient a beginner and always show the next step.

**Tasks**
1. **Pipeline stepper component** (in `ui/` or `layout/`): `pipeline-stepper` with input `current` (`find|enrich|write|send`). Renders the 4 steps with the current one highlighted (per §2). Used on the four workflow screens (added there in Phase 4) and optionally on Home.
2. **Home → launchpad** (`pages/home/`): replace the flat button grid with:
   - A **"Getting started" checklist** that reflects real state and ticks off as completed: (a) connect a mailbox (from `mailboxes`/me data), (b) set up company profile (`company-profile.service`), (c) add mailing address (`me.service.physical_address` — required to send), (d) have credits (`credits.service`), (e) find your first leads. Each item links to the relevant screen; completed items show a check.
   - A primary **"Continue where you left off"** / "Find leads" CTA.
   - A compact stats row (reuse `dashboard.service` summary if cheap: meetings/replies/credits) — or links to Dashboard.
   - Friendly empty/first-run copy using `ui-empty-state` where nothing exists yet.
3. Ensure Home uses the shell + `ui-page-header` (title "Home"/welcome) and the kit.

**Acceptance**
- A brand-new user lands on Home and immediately sees what to do first; each step is one click away and visibly completes. No 10-button wall. Returning users get a clear "continue" path + at-a-glance numbers.

**Verify:** build + lint clean; visual check (light/dark) of the checklist in both "fresh account" and "some steps done" states (simulate by toggling the data sources if needed). Fix issues.

**Commit:** `feat(ui): 16.3 home launchpad — getting-started checklist, pipeline stepper, next-step CTAs`. Push. Ledger → Phase 3 done. Continue.

---

## PHASE 4 — Per-screen layout pass (all 15 screens)

**Goal:** every screen uses the shell + component kit, has its primary action in a predictable place (top-right), a clear next-step, and proper empty/loading/error states. Fix button ordering and remove dead-ends.

For **each** screen below: replace the bespoke header with `ui-page-header` (title + subtitle + breadcrumb), move the main action into the header's `actions` slot as a single `ui-button variant="primary"`, demote secondary actions to `secondary`/`ghost`, convert ad-hoc status text to `ToastService`, convert loading blocks to `ui-skeleton`, convert empty states to `ui-empty-state` with a teaching CTA, convert state pills to `ui-status-badge`, and add the **"what's next"** card / stepper where it's a workflow screen. Keep all existing behavior and data wiring intact.

**Screen-by-screen primary action + next step:**
1. **search** (Find leads) — primary: "Search leads"; stepper `find`; next: "Enrich saved list" → `/enrich`.
2. **enrich** — primary: "Enrich all"/"Enrich selected"; stepper `enrich`; next: "Write emails" → `/draft`. (Preserve the existing in-flight/disable logic — see PROGRESS note about the `inFlight` set; do not regress it.)
3. **draft** (Write) — keep the keyboard-first review queue; primary: "Approve & continue"; stepper `write`; next: "Start sending" → `/send`.
4. **send** — primary: "Start sending"; stepper `send`; next: "View campaign" → `/campaigns/:id` and "Inbox".
5. **campaign** (`campaigns/:id`) — primary: pause/resume; next: "Open inbox" → `/inbox`. Breadcrumb `Send › Campaign`.
6. **inbox** — list + thread; ensure empty/loading/error; next: "Dashboard". Wire the sidebar unread badge source if feasible.
7. **dashboard** — header + refresh; keep the honest metrics; "Top up" → `/billing`; next: "Find more leads".
8. **mailboxes** — primary: "Connect" (per provider); clear connected state; back into flow.
9. **onboarding** — give it shell + header + a clear finish/continue action (remove the dead-end). 
10. **settings** — sections (Theme / Mailing address / Booking / Profile) as `ui-card`s; consistent save buttons + toasts.
11. **billing** — already in good shape (File 14): refit to `ui-page-header`/`ui-card`/`ui-button`/badges; keep low/zero-balance banners + packs + usage breakdown.
12. **landing**, **login**, **signup** — outside the shell: apply the kit (`ui-button`, `ui-field`) and tidy for a polished first impression, but keep them shell-less and simple.

**Acceptance**
- Every screen: shell + `ui-page-header` + one obvious primary action top-right + a next-step affordance + kit-based empty/loading/error. No screen is a dead-end. Button order is logical. Behavior unchanged.

**Verify:** build + lint clean after each screen (or batch, but keep it green). Visual sweep of each screen light/dark via preview tools; §8 fallback otherwise. Fix deviations. Spot-check that no API call or signal logic was lost.

**Commit:** `feat(ui): 16.4 per-screen layout pass — page headers, primary actions, next-step CTAs, kit states across all screens`. (You may split into a few commits, e.g. `16.4a`, `16.4b`, recorded in the ledger.) Push. Ledger → Phase 4 done. Continue.

---

## PHASE 5 — Visual polish (enterprise feel, responsive, a11y)

**Goal:** the finishing layer that makes it feel like a polished product.

**Tasks**
1. **Icons everywhere:** lucide icons in nav, primary buttons, status badges, empty states, section headers — consistent sizes (16/18/20px), `aria-hidden` for decorative, `aria-label` for icon-only buttons.
2. **Typography & spacing rhythm:** consistent heading scale (22/18/16 @ weight 500, body 16/400 per §7), consistent vertical rhythm and card padding, denser tables for long lists (leads, inbox, ledger) with comfortable row height + hover.
3. **Micro-interactions:** 150–250ms transitions on hover/active/focus, button press (`active:scale-[.98]`), skeleton shimmer, toast slide-in, drawer slide — all gated by `prefers-reduced-motion`.
4. **Responsive:** verify every screen at ~380px (mobile drawer + bottom-or-hamburger nav), tablet, and desktop. No overflow, no clipped actions.
5. **Accessibility:** visible focus-visible rings on all interactive elements, logical tab order, ARIA roles/labels on nav/menu/dialog/toast, color-contrast checks in BOTH modes, keyboard operability (preserve and extend the draft queue's keyboard support).
6. **Dark mode final tuning:** walk every screen in dark mode; fix any low-contrast or token gaps; ensure brand-accent + dark mode combine cleanly.

**Acceptance**
- Cohesive, calm, enterprise-grade look in both modes, fully responsive, keyboard- and screen-reader-friendly, motion subtle and reduced-motion-safe. Still unmistakably the §7 design language (no purple/gradients/slop).

**Verify:** build + lint clean. Full visual pass light/dark + mobile via preview tools; §8 fallback otherwise. Fix all deviations.

**Commit:** `feat(ui): 16.5 visual polish — icons, type/spacing rhythm, micro-interactions, responsive, accessibility, dark-mode tuning`. Push. Ledger → Phase 5 done. Continue.

---

## PHASE 6 — Full visual verification sweep + fixes

**Goal:** a deliberate end-to-end pass to catch anything missed.

**Tasks**
1. Run `npm run dev:web` (and `npm run dev:api` if needed for data). Walk the entire app **in order**: landing → signup/login → home → mailboxes → onboarding → settings → search → enrich → draft → send → campaign → inbox → dashboard → billing — in **both light and dark**, **desktop and ~380px**.
2. For each screen confirm: shell present (authed), one clear primary action, next-step obvious, back/breadcrumb works, empty/loading/error states correct, icons/spacing/contrast right, no console errors.
3. Use the preview tools (`preview_start`, `preview_screenshot`, `preview_snapshot`, `preview_console_logs`, `preview_resize`) to verify and capture proof. If Claude-in-Chrome/preview is unavailable, use the §8 fallback: confirm each screen builds/renders and write a per-screen manual checklist into the session output.
4. Fix every deviation found, re-verify.

**Acceptance:** the whole app matches the §2 north star; no broken nav, no dead-ends, no contrast failures, no console errors, build + lint clean.

**Commit:** `fix(ui): 16.6 verification sweep fixes`. Push. Ledger → Phase 6 done. Continue.

---

## PHASE 7 — Docs + final acceptance

**Goal:** record the revamp and close it out.

**Tasks**
1. Update `docs/CODE-MAP.md`: add the `app/ui/` kit and `app/layout/` shell components (one line each), `ThemeModeService`, the route restructure, and note that pages now use the shared kit + shell.
2. Update `README.md`: mention the app shell / navigation, the component kit location, dark/light mode, and the icon set.
3. Update `docs/PROGRESS.md`: add a short "File 16 — UI/UX revamp complete" entry summarizing what changed (shell, nav, kit, dark mode, per-screen pass, polish) and any deviations.
4. Finalize `docs/UI-REVAMP-PROGRESS.md`: mark all phases done with commit hashes; note anything deferred.

**Acceptance:** docs accurate; `npm run build` + `npm run lint` clean across the repo; all phases ticked in the ledger.

**Commit:** `docs(ui): 16.7 revamp docs — code-map, readme, progress`. Push. Ledger → Phase 7 done.

---

## Definition of Done (whole file)
- All 7 phases committed + pushed; `UI-REVAMP-PROGRESS.md` shows every phase `done` with hashes.
- `npm run build` and `npm run lint` pass repo-wide.
- The app matches the §2 target: persistent left sidebar + top bar on all authed screens; consistent `ui-page-header` with one primary action + next-step on every screen; pipeline stepper on workflow screens; Home launchpad with first-run checklist; dark/light toggle (persisted, OS-default); lucide icons throughout; responsive + accessible; entirely within the §7 design system; **no backend/logic changes**; no route paths broken; behavior preserved.
- A beginner can move through Find → Enrich → Write → Send → Inbox → Dashboard without ever hunting for the next button.

## Guardrails recap (read before each phase)
- Frontend only (`apps/web`). No API/worker/server/shared/DB/credits/compliance changes.
- §7 always: one teal accent, semantic colors, no purple/gradients/slop, calm + minimal, plain verb copy, `APP_NAME` not hardcoded, reduced-motion + a11y respected.
- Keep the build green; commit + push per phase; update the ledger continuously; **don't stop between phases** unless genuinely blocked.
