# 12 — Dashboard

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (tracking metrics §2/§7; event tables §5; UX §7).
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01–11 done: build passes; sends, replies, bounces happen; `click_events`, `reply_events`, `bounce_events`, `booking_events` tables exist (booking_events will be populated in File 13 — dashboard should handle zero gracefully); `messages` carry states; credit balance available (File 06).

## Scope of THIS file
A calm, trustworthy overview that answers one question at a glance: "is my outreach working, and what needs my attention?" Lead with the **real, money-linked metrics** (meetings, replies); demote unreliable ones (opens shown muted as "approximate"). Add the deliverability health strip. Restraint over density (§7).

### 1. Tracking events — ensure they're captured
- **Link clicks:** wrap links in outbound emails so a click routes through an API redirect endpoint that records a `click_events` row (lead/message id) then 302s to the real URL. (Add the wrapping at send time — coordinate with File 10's send path via the shared pre-send step; if not already wrapping, add it here.) Clicks are a trustworthy signal (§2).
- **Replies / bounces:** already produce `reply_events` / `bounce_events` (File 11). 
- **Bookings:** `booking_events` populated in File 13 — read defensively (may be zero now).
- Do NOT rely on opens; if an open pixel exists at all, treat it as soft/approximate only.

### 2. Aggregation (performance — §7)
- Provide a `GET /dashboard/summary` (auth) returning the headline counts over a selectable window (default last 30 days): meetings booked, positive replies, total replies, link clicks, emails sent, follow-ups pending, bounces, and opens (approx, if tracked).
- Aggregate efficiently — do NOT scan every message per page load. Use periodic/cached counters or aggregate queries with the indexes from §5. Document the approach. Per-campaign and per-lead drill-down endpoints too.
- Deliverability health: compute send volume vs cap, bounce rate, complaint rate (if available) per mailbox/overall; return a status (healthy/warning/danger) with thresholds (document them).

### 3. Web UI — dashboard (apply the agreed layout)
- **Metric hierarchy, top to bottom (§7):**
  1. Meetings booked (the goal) and positive replies + total replies — full emphasis, accent/positive colors.
  2. Activity: emails sent, follow-ups pending, bounces.
  3. Link clicks (trustworthy engagement). 
  4. Opens LAST, visually **muted** (tertiary color) and labeled "approximate" — never presented as a headline metric (§2/§7).
- **Deliverability health strip:** volume vs cap bar + bounce/complaint rates + healthy/warning/danger state (green/amber/red). Frame as protection.
- **Credit balance** visible with a "Top up" affordance (full billing in File 14; here link/route to it).
- Per-campaign and per-lead drill-down below the fold.
- Empty states teach (§7): no data yet → "Start a campaign to see results here →". 
- Keep the top to ~4 headline numbers; don't overwhelm (§7).

### 4. Honesty in metrics (a trust USP — §ideation)
- The dashboard must not inflate or mislead: opens clearly approximate; rates computed correctly; "where did my credits go" answerable (link to the usage breakdown from File 06/14). This honesty is intentional positioning — document it.

## Verification (must pass before Done)
1. `npm run build` passes, zero type errors.
2. Click tracking: clicking a wrapped link in a sent test email records a `click_events` row and redirects correctly to the real URL.
3. `GET /dashboard/summary` returns correct counts for a window; numbers reconcile with the underlying events/messages.
4. Aggregation does not scan all rows per load (verify the cached/aggregate approach; reasonable performance with many messages).
5. Dashboard renders the hierarchy correctly: meetings/replies emphasized; opens muted + "approximate"; deliverability strip shows the right status against thresholds.
6. Zero-data state shows a teaching empty state, not a broken/blank screen; booking count handles zero (pre-File-13) gracefully.
7. Drill-down to a campaign/lead works.

### Visual verification (UI present — key screen)
- Run §8 on the dashboard via Claude in Chrome (with some seeded/real events).
- **Expected visual result:** calm overview; meetings + replies are the visually dominant numbers (accent/positive); activity numbers secondary; link clicks present; **opens clearly muted and labeled "approximate"**; deliverability health strip with a green/amber/red state framed as protection; credit balance + top-up affordance; teaching empty state when no data; ~4 headline numbers max; no clutter/purple/gradients.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip.

## Definition of Done (§9)
- Verification passes (incl. visual/fallback). `PROGRESS.md` updated (File 12 done; note aggregation approach, deliverability thresholds, that click-wrapping is now in the send path). `CODE-MAP.md` updated (dashboard summary + click redirect endpoint).
- Commit: `feat(dashboard): 12 trustworthy metrics, click tracking, deliverability health strip`
- Push to `main`.

## What's next
File 13 — Booking: connect Cal.com + Google Calendar, inject a booking link into emails, and handle the Cal.com webhook to record `booking_events` and advance the lead pipeline to "meeting booked" (which the dashboard's meetings metric then reflects).
