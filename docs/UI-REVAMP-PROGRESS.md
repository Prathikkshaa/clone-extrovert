# UI-REVAMP-PROGRESS — File 16 execution ledger

> Updated continuously by the executing agent. On resume, read this first (see 16-ui-ux-revamp.md §0.2).

## Current status
- Active phase: 2
- Active task: app shell + route restructure + dark-mode toggle
- State: in-progress   <!-- not-started | in-progress | done | blocked -->
- Last updated: 2026-06-15
- Blocker (if any): none

## Phase checklist
- [x] Phase 0 — Foundation: icons, dark/light tokens + ThemeModeService, ui/ + layout/ scaffolding
- [x] Phase 1 — Component kit (Button, PageHeader, Card, EmptyState, StatusBadge, Skeleton, Field, Toast, ConfirmDialog)
- [ ] Phase 2 — App shell + route restructure (Sidebar, Topbar, breadcrumb/back) + dark-mode toggle wired
- [ ] Phase 3 — Home launchpad + first-run checklist + pipeline stepper
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
  errors. Commit: <pending>.
