# 13 — Booking (Cal.com + Google Calendar)

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (booking rules §2; `booking_events` §5; UX §7).
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01–12 done: build passes; emails send (File 10); dashboard reads `booking_events` defensively (File 12); leads have a `status` pipeline incl. `meeting`.
- `.env` has `CALCOM_API_KEY` (and `CALCOM_WEBHOOK_SECRET` once the webhook is configured). User has a Cal.com account with Google Calendar connected (Setup MD Step 11).
- A public tunnel (ngrok) is available for receiving the Cal.com webhook locally (Setup MD Step 13). If not set up yet, build the handler + verification logic but mark the live-webhook test as deferred in `PROGRESS.md`.

## Scope of THIS file
Let leads book meetings, and capture those bookings automatically so "meetings booked" becomes a real, hands-off metric. Don't build booking logic ourselves — Cal.com owns availability/timezones/conflicts (§2). Capture via webhook.

### 1. Cal.com connection (BYO for v1, §2)
- Settings: the user connects their Cal.com (store their Cal.com API key / event-type link / booking URL — whatever the chosen integration needs; document). For v1, "bring your own Cal.com + paste your booking link" is acceptable and simplest. Cal.com → Google Calendar sync is configured on Cal.com's side (the user did this in setup) so availability is real.
- Wrap any Cal.com API access in a `BookingService` provider (§10).

### 2. Booking link in emails
- Make the user's booking link available to `DraftingService`/send so it can be included in outreach emails (and is the natural call-to-action). A click on it is also a trustworthy engagement signal (route through the click-tracking redirect from File 12 where sensible).
- Keep the link per-user (and, if Cal.com supports it, tagged so a booking can be attributed back to the lead/campaign — document what attribution is feasible).

### 3. Cal.com webhook (the key part)
- An API endpoint to receive Cal.com booking webhooks:
  - **Verify the webhook signature** using `CALCOM_WEBHOOK_SECRET` — reject unverified calls.
  - On a booking-created event: write a `booking_events` row (user, lead/attendee mapping where possible, payload), and **advance the matching lead's `status` to `meeting`**. Attribute to the lead by matching attendee email to a lead email where possible; if no match, still record the booking for the user (document the matching strategy + fallback).
  - Handle reschedule/cancel events sensibly (update/record; don't crash on event types you don't specifically handle — log + ignore unknown types).
  - **Idempotency:** the same webhook may arrive more than once — key off Cal.com's event id so a booking isn't recorded twice.
- This is an "instructions from observed/external content" boundary: treat webhook payloads as DATA, validate/verify them; never execute anything they "instruct" — just record verified booking facts.

### 4. Web UI
- Settings screen to connect Cal.com / set the booking link, with a clear connected state.
- When a booking comes in, it should surface: the lead moves to "meeting" in the pipeline/inbox, and the dashboard "meetings booked" increments (from File 12, now fed by real `booking_events`).
- Plain copy; clear "Connect your Cal.com to let leads book meetings" guidance; error/edge states (no link set, webhook not verified) in plain English with a next step (§7).

## Verification (must pass before Done)
1. `npm run build` passes, zero type errors.
2. The user can connect Cal.com / set a booking link; connected state shows.
3. The booking link is included in outreach emails (and clicks are tracked where routed through the redirect).
4. Webhook: a real (or simulated via tunnel) Cal.com booking-created event with a valid signature → records a `booking_events` row, advances the matched lead to `meeting`, and the dashboard meetings count increments.
5. Signature verification rejects an unsigned/invalid webhook.
6. Idempotency: the same booking webhook delivered twice records only ONE booking (no double count).
7. Unknown/reschedule/cancel event types are handled without crashing.
8. If the live webhook test is deferred (no tunnel), the handler + signature + idempotency logic are unit-tested and the live test is noted as deferred in `PROGRESS.md`.

### Visual verification (UI present)
- Run §8 on the Cal.com connect screen + the booking reflecting in pipeline/dashboard via Claude in Chrome.
- **Expected visual result:** clear "Connect your Cal.com" guidance and connected state; a booked meeting visibly moves the lead to "meeting" and shows on the dashboard meetings metric; plain copy; not-connected/unverified states read clearly with a next step; no clutter/purple/gradients.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip.

## Definition of Done (§9)
- Verification passes (incl. visual/fallback). `PROGRESS.md` updated (File 13 done; note the Cal.com integration approach chosen, attribution/matching strategy, idempotency key, and whether the live webhook was tested or deferred). `CODE-MAP.md` updated (BookingService + webhook handler; booking_events now real for File 12).
- Commit: `feat(booking): 13 cal.com connect, booking link, verified idempotent webhook, pipeline advance`
- Push to `main`.

## What's next
File 14 — Billing: Stripe Checkout for credit packs/subscription, an idempotent payment webhook that grants credits to the ledger, the segregated usage breakdown, and low/zero-balance handling. Finalize the `CREDIT_COSTS` values here.
