# 11 — Replies, Inbox & Compliance

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (compliance + modes §2; suppression §5; UX §7; reply-handling caution §wellbeing of users' deals).
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01–10 done: build passes; sending works through the user's mailbox; `messages.thread_id` stored; sequence engine has stop-on-reply/suppression CHECKS already wired (File 10) awaiting the SIGNALS this file populates; `suppressions` table exists; `LlmService` + `DraftingService` exist.
- A connected mailbox capable of reading replies (Gmail/Graph read scope from File 04).

## Scope of THIS file
Close the loop: detect and ingest replies into a threaded inbox, draft AI replies (approval-by-default), and make compliance **non-removable** (§2). This is also where the stop-on-reply and suppression signals that File 10 consumes get populated.

### 1. Reply ingestion (worker)
- Implement `MailboxProvider.listReplies(...)` for Gmail + Outlook (poll periodically and/or use push where feasible; polling is fine for MVP — document interval). Match incoming messages to the originating thread via `thread_id`.
- On a detected reply for a lead:
  - write a `reply_events` row + create/append a `messages` row for the inbound message (state `replied`), preserving the thread;
  - update the lead `status = 'replied'`;
  - **set the stop-on-reply signal** so File 10's sequence engine halts that lead's remaining follow-ups (verify the sequence actually stops).
- Classify the reply (positive / not interested / out-of-office / auto-reply / unsubscribe-request) via `LlmService` — used for dashboard "positive replies" and to route unsubscribe requests into suppression. Be conservative; when unsure, mark neutral and let the human decide.

### 2. Threaded inbox (web)
- A unified inbox view: conversations grouped by lead/thread, newest first, showing the full back-and-forth in order (your sent message + their reply in the same thread).
- Open a thread → see the conversation; compose/he edit area for a reply.
- Plain, calm UI (§7); virtualize if long.

### 3. AI reply drafting (approval-by-default — protect the user's deals, §2)
- In a thread, "Draft reply" uses `DraftingService` with the thread context + company profile to propose a response in the user's voice.
- **Mode rules (strict, §2):**
  - Draft mode (default): AI proposes; human approves/edits; nothing sends without explicit approval.
  - Autonomous mode: even here, the **FIRST** reply to a lead is draft-for-approval. Full hands-off auto-reply is an explicit per-user opt-in beyond autonomous, with a clear warning. Never auto-fire a reply to a hot lead by default.
- Sending the reply reuses File 10's `MailboxService.send` **in the same thread** (set in-reply-to/references + thread id so it threads correctly). Metered if replies are a credited draft action (consistent with `CREDIT_COSTS.draft`; document).

### 4. Compliance layer (NON-REMOVABLE — §2)
- **Every outbound campaign email** (File 10 sends; enforce here as a shared pre-send step) MUST include:
  - a working **unsubscribe link** (a tokenized URL → an endpoint that adds the address to `suppressions` with reason `unsubscribe`, no login required, honored immediately);
  - the sender's **physical address** (from `users.physical_address`; if missing, block sending with a clear "Add your mailing address to send — it's legally required" prompt rather than send non-compliant).
- **Suppression check before EVERY send** (campaign sends AND replies-as-new-outreach): if the recipient is in `suppressions` for that user, do not send; mark `stopped`. Make this a single shared guard both File 10 and this file call — no send path may bypass it.
- **Auto-suppress** on: unsubscribe click, a detected unsubscribe-request reply, and **hard bounce** (from `bounce_events`). 
- These are NOT user-toggleable off. "Compliant by default, even autonomously" (§ideation) — document the guarantee.

### 5. Bounces
- Capture hard bounces (provider non-delivery signals) → `bounce_events` + auto-suppress the address + mark the `messages` row `bounced`. Surface bounces on the dashboard later (File 12).

## Verification (must pass before Done)
1. `npm run build` passes, zero type errors.
2. Reply to a sent test email → it's ingested, threaded correctly, lead → `replied`, and **the sequence's remaining follow-ups stop** (verify against File 10).
3. Reply classification labels positive / OOO / unsubscribe etc. reasonably; an unsubscribe-request reply routes the address into `suppressions`.
4. Threaded inbox shows the full conversation in order; "Draft reply" proposes a contextual response in the user's voice.
5. Mode rules hold: draft mode never sends without approval; autonomous mode still drafts (not sends) the FIRST reply; full auto-reply requires explicit opt-in + warning.
6. Compliance: every campaign email contains a working unsubscribe link (clicking it suppresses immediately, no login) AND the physical address; sending is blocked with a clear prompt if the address is missing.
7. Suppression guard: a suppressed address is never sent to by ANY path (campaign or reply); the guard is shared, not duplicated/bypassable.
8. Hard bounce → bounce_event + auto-suppress + message `bounced`.

### Visual verification (UI present — inbox)
- Run §8 on the threaded inbox + reply drafting via Claude in Chrome.
- **Expected visual result:** calm unified inbox grouped by conversation; full thread shown in order; "Draft reply" produces an editable, in-voice draft that requires approval to send (draft mode); unsubscribe link + address visibly present in a sent email preview; suppression/blocked-send and missing-address states read in plain English with a next step; no clutter/purple/gradients.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip.

## Definition of Done (§9)
- Verification passes (incl. visual/fallback). `PROGRESS.md` updated (File 11 done; note poll interval, reply-classification labels, the shared suppression guard location, and confirm stop-on-reply now fully works end-to-end with File 10). `CODE-MAP.md` updated (reply ingestion; shared compliance/suppression guard flagged as used by all send paths).
- Commit: `feat(replies): 11 reply ingestion, threaded inbox, AI reply (approval-default), non-removable compliance`
- Push to `main`.

## What's next
File 12 — Dashboard: tracking-event aggregation and the metrics dashboard led by meetings/replies (opens muted as "approximate"), plus the deliverability health strip.
