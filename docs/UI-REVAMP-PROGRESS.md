# UI-REVAMP-PROGRESS — File 16 execution ledger

> Updated continuously by the executing agent. On resume, read this first (see 16-ui-ux-revamp.md §0.2).

## Current status
- Active phase: 4
- Active task: per-screen layout pass (all screens onto kit + shell)
- State: in-progress   <!-- not-started | in-progress | done | blocked -->
- Last updated: 2026-06-15
- Blocker (if any): none

## Phase checklist
- [x] Phase 0 — Foundation: icons, dark/light tokens + ThemeModeService, ui/ + layout/ scaffolding
- [x] Phase 1 — Component kit (Button, PageHeader, Card, EmptyState, StatusBadge, Skeleton, Field, Toast, ConfirmDialog)
- [x] Phase 2 — App shell + route restructure (Sidebar, Topbar, breadcrumb/back) + dark-mode toggle wired
- [x] Phase 3 — Home launchpad + first-run checklist + pipeline stepper
- [ ] Phase 4 — Per-screen layout pass (all 15 screens onto the kit + shell + next-step CTAs)
- [ ] Phase 5 — Visual polish (icons everywhere, type/spacing/density, micro-interactions, responsive drawer + mobile nav, a11y)
- [ ] Phase 6 — Full visual verification sweep + fixes
- [ ] Phase 7 — Docs (README, CODE-MAP, PROGRESS) + final acceptance

## Phase notes (append per phase: what was done, decisions, deviations, commit hash)
- Phase 0: **DONE.** (1) **Icons — fallback chosen (§3).** lucide-angular caps its peer
  range at Angular 13–21.x; this repo is on Angular **22**, so `npm install lucide-angular`
  is blocked by the peer conflict (a forced `--legacy-peer-deps` install resolves but
  mis-declares the peer — rejected as a robustness risk across 7 phases). Implemented the
  sanctioned inline-SVG fallback instead: `ui/icon/icon-paths.ts` (Lucide MIT path data,
  ~55 icons, tree-shake-friendly) + `ui/icon/icon.ts` (`ui-icon`: size/strokeWidth/label
  inputs, renders an inline SVG inheriting `currentColor`, aria-hidden by default / role=img
  when labelled). One icon system everywhere. (2) **Dark tokens tuned** in `styles.css`:
  every semantic token now has a contrast-tuned dark value (ink/canvas/surface/muted/line/
  accent/accent-strong + positive/warning/danger lightened for dark); added soft tints
  (`--color-accent-soft`, `--color-{positive,warning,danger}-soft`) for badges/active-nav/
  "what's next"; added a 200ms colour-only transition on `*` for a smooth swap (neutralised
  by the existing reduced-motion block). Mapped the soft tokens in `tailwind.config.js`.
  (3) **ThemeModeService** (`core/theme-mode.service.ts`): light|dark|system, persisted in
  localStorage (`extrovertai.theme-mode`), defaults to OS via `prefers-color-scheme`,
  applies by toggling `<html data-theme>`, exposes `mode`/`resolved` signals + `set`/`toggle`,
  reacts live to OS changes while 'system'. Instantiated at bootstrap by injecting it in the
  root `App` so the theme is applied before first paint. Orthogonal to `ThemeService` (brand
  accent) — different tokens. (4) **Scaffolding:** `ui/index.ts` barrel (exports Icon +
  IconName) and `layout/index.ts` placeholder barrel. **Verify:** `npm run build` + `npm run
  lint` clean. Browser-verified on the landing page (temp preview on :4300, launch.json
  restored): CSS vars flip correctly light↔dark (accent #0f766e↔#2dd4bf, danger #b91c1c↔
  #f87171, positive #15803d↔#4ade80); page loaded in dark (OS=dark) with the lightened teal
  button on warm near-black canvas; no console warnings/errors. Commit: 9306857.
- Phase 1: **DONE.** Built the full kit under `ui/`, all standalone, token-themed,
  a11y-minded: `ui-button` (attribute selector `button[ui-button]`; primary/secondary/
  ghost/danger, sm/md, loading-spinner-that-disables, iconLeft/iconRight, focus-visible
  ring, `disabled` input reflected to the DOM); `ui-card` (surface + hairline + lg radius,
  optional title + [header] slot); `ui-page-header` (title + subtitle + [actions] slot);
  `ui-empty-state` (soft-accent icon chip + title + teaching line + projected CTA);
  `ui-status-badge` (status→tone map: positive/warning/danger/neutral, sentence-case label,
  unknown→neutral); `ui-skeleton` (1 or N pulse bars, reduced-motion safe); `ui-field`
  (label + control slot + hint/error, error replaces hint with role=alert) + shared
  `.ui-input/.ui-textarea/.ui-select` classes in styles.css; `ToastService` + `ui-toast-host`
  (success/info/warn/error, auto-dismiss 4s/7s, role=alert for errors, slide-in); `ConfirmService`
  + `ui-confirm-dialog` (role=dialog + aria-modal, focus into dialog on open + Tab trap + ESC
  cancel + backdrop cancel + focus restore, returns Promise<boolean>). Exported all via
  `ui/index.ts`. **Decision (breadcrumb/back ownership):** §2 lists breadcrumb in BOTH the
  topbar and page-header inputs — to avoid double chrome (Phase 2 task 3), back+breadcrumb
  live ONLY in the topbar; `ui-page-header` pushes its trail to a new `BreadcrumbService`
  (`core/breadcrumb.service.ts`) via an effect and renders only title/subtitle/actions itself.
  **Verify:** build + lint clean. Browser-verified via a throwaway `/ui-demo` route (since
  removed; launch.json restored) in BOTH light + dark: every component renders correctly,
  badge tones map right, inputs styled, confirm dialog opens with aria-modal + focus on
  Cancel + ESC closes, toasts render with role=alert + correct text, icons render; no console
  errors. Commit: adf475e.
- Phase 2: **DONE.** Built the persistent shell in `layout/`: `app-shell` (Shell — flex
  sidebar + (topbar over router-outlet), mounts ui-toast-host + ui-confirm-dialog, applies
  the user's brand accent once for the whole authed area, owns the mobile drawer state);
  `app-sidebar` (grouped nav — Workflow: Find leads/Enrich/Write/Send · Manage: Inbox(+badge)/
  Dashboard · pinned Billing/Settings; lucide icons; routerLinkActive teal-soft highlight;
  off-canvas drawer < md, slides over a backdrop, closes on nav-click); `app-topbar` (history
  back + breadcrumb from BreadcrumbService; credits chip via CreditsApiService, red at ≤0,
  links /billing, refreshed on NavigationEnd; dark/light toggle via ThemeModeService sun/moon;
  notifications bell placeholder; account menu — email + Settings/Mailboxes/Log out, click-
  outside close). New `NavBadgeService` for the inbox unread count (set by the Inbox screen in
  Phase 4; badge hidden at 0). **Route restructure** (`app.routes.ts`): all authed screens are
  now children of one shell parent route guarded once by `authGuard` (children dropped their
  own guard); landing/login/signup stay outside the shell; every path preserved; lazy loading
  kept. Removed home's duplicated header/back chrome as the no-double-chrome proof (home gets
  fully rebuilt in Phase 3). **Verify:** build + lint clean. Browser-verified (temp preview
  :4300, authGuard temporarily lifted then restored, launch.json restored) at desktop 1280 +
  mobile 375, light + dark: grouped sidebar renders, active route highlights teal, account
  menu opens with the 3 items, credits chip shows real balance (89), dark toggle flips the
  whole shell, mobile hamburger opens the drawer over a backdrop (sidebar x: -240→0), home has
  no double chrome; no console errors. **Note:** pre-existing initial-bundle budget WARNING
  (517kB vs 500kB) — dominated by Angular core + @supabase/supabase-js pulled in eagerly by
  the route guards; File 16 adds only ThemeModeService (~2KB) to the eager path, so this is not
  a revamp regression. It's a warning (build passes); left as-is (code-splitting supabase is
  out of scope/risky). Commit: b8ab61b.
- Phase 3: **DONE.** (1) **pipeline-stepper** (`ui/pipeline-stepper/`): input `current`
  (find|enrich|write|send); renders the 4 ordered steps with completed=check+accent,
  current=accent+ring, todo=muted; connectors fill accent for done legs; each step links to
  its screen. (2) **Home → launchpad** (`pages/home/*` rebuilt): a "Getting started" checklist
  computed from REAL state — (a) mailbox connected (mailboxes.list), (b) company profile set
  (company-profile.services), (c) mailing address (me.physical_address), (d) credits>0
  (dashboard.summary.creditBalance), (e) first leads (lists.length). Completed items show a
  green check + strike-through; incomplete show icon+hint+chevron and link to the fix. A
  computed `nextStep` (first incomplete) drives the "what's next" banner + primary CTA; when
  all done, a "You're all set" card + the returning-user view. A 3-stat row (meetings/positive
  replies/credits) links to dashboard/inbox/billing. The pipeline-stepper overview sits at the
  bottom. Uses the shell + `ui-page-header` (title "Home", breadcrumb [Home]) + kit (card,
  button, skeleton, icon). Replaced the old 10-button grid. (3) home.ts trimmed to the new
  data sources (dropped the old HttpClient/ThemeService/credits wiring — the shell applies the
  brand theme now). **Verify:** build + lint clean. Browser-verified (temp preview :4300,
  restored) at desktop 1280, light + dark: real account renders the "You're all set" + stats
  (0/0/89) + pipeline; simulated partial accounts (via Angular debug `ng.applyChanges`) render
  the checklist with correct checks/strike-through and the "what's next" banner correctly
  tracking the first incomplete step (mailing address @ 3/5, company profile @ 2/5); breadcrumb
  "Home" shows in the topbar (ui-page-header→BreadcrumbService working); no console errors.
  Commit: <pending>.
