# 10 — Sending Engine

## Session start (do this first, every time)
1. Read `/docs/00-master-context.md` fully (sending rules §2; tables §5; credit gate §6; UX §7).
2. Read `/docs/PROGRESS.md`.
3. Execute only this file's scope.

## Preconditions to verify
- Files 01–09 done: build passes; a mailbox can be connected with encrypted tokens (File 04); approved drafts exist (File 09); `messages`/`campaigns`/`sequence_steps` tables exist; credit gate works; BullMQ supports **delayed jobs + rate limiting** (confirmed in File 06).
- A connected, working mailbox is available for testing (Gmail at minimum). If only Outlook is stubbed, test Gmail and note it.

## Scope of THIS file
Send approved drafts through the USER's own mailbox, throttled per inbox with warm-up, and run the follow-up sequence via BullMQ delayed jobs, stopping a lead's sequence when they reply. **Compliance footer + suppression checks + reply ingestion are File 11** — but build the hooks so File 11 slots in cleanly. Sending reality (§2): ~30–50/day/inbox, ramped.

### 1. MailboxService.send (complete the File 04 stub)
- Implement `send()` for `GmailProvider` and `OutlookProvider`: decrypt token in-memory, refresh if needed (File 04), send a message via Gmail API / Graph, capture the provider message id + thread id (store `messages.thread_id` for threading in File 11).
- Never log token or full body at info level; never expose tokens.
- On send failure: typed errors (auth/reauth-required, rate-limited, hard bounce-ish rejection, transient). Map each to a clear `messages.state` + user-facing outcome.

### 2. Throttling + warm-up (protect deliverability — §2)
- Per-inbox daily cap from `mailboxes.daily_cap` (default conservative ~30–50). Enforce via BullMQ rate limiting + a per-mailbox daily counter (reset daily). Never exceed the cap regardless of how many drafts are queued.
- Randomize intervals between sends (human-like spacing, not a burst).
- Warm-up: a ramping schedule for `warmup_state = 'new'` mailboxes (start low, increase over days). Document the ramp. Surface the effective daily limit to the user.
- Support **multiple mailboxes** per user with rotation (the schema allows it) — distribute/round-robin sends across a user's connected mailboxes to raise safe daily volume. Keep it simple but present.

### 3. Sequence engine (BullMQ delayed jobs)
- A campaign turns an approved list of drafts into scheduled sends:
  - send step 0 now (subject to throttle/cap); 
  - schedule follow-up steps using `sequence_steps.wait_days` as **delayed jobs**;
  - before each step fires, re-check: has the lead replied? is the lead suppressed? is the mailbox healthy? If replied/suppressed → **stop the sequence** for that lead (state `stopped`/`replied`). (Reply detection itself is wired in File 11; here, consume a `lead.replied`/suppression signal and stop — build the check now even if the signal is populated in File 11.)
- Each `messages` row tracks its `state` (`queued → sent → bounced | replied | stopped`).

### 4. Metering (uses File 06 gate)
- If sending is a credited action, wrap each send in `withCreditGate(userId, 'send', refId, fn)` (unit consistent with `CREDIT_COSTS.send`; document — sending may be low/zero credits since it's the user's own mailbox; decide and record). Failure → refund (net-zero). Out-of-credits → pause the campaign with a clear top-up prompt; don't drop scheduled steps silently.

### 5. Web UI — launch + monitor a campaign
- From approved drafts: "Start sending" (verb, §7) → creates the campaign + schedules sends. Show the plan plainly ("Sending 40 today, the rest tomorrow — staying within your safe limit").
- A campaign view: per-lead state (queued/sent/replied/bounced/stopped), follow-ups pending, today's send count vs cap.
- **Deliverability guardrail UX:** if the user tries to exceed safe limits, explain calmly why we pace it (one-line hint) rather than letting them torch their domain. This is a feature, not a restriction (§2/§ideation).
- Error/edge copy (§7): mailbox disconnected/reauth → clear "Reconnect your mailbox to keep sending" with a button; rate-limited → "Pausing briefly to protect your inbox"; out of credits → top-up prompt; never lose the campaign; always a next step.

## Verification (must pass before Done)
1. `npm run build` passes, zero type errors.
2. A real send through a connected Gmail arrives at a test inbox; `messages.state` becomes `sent`; provider message id + thread id stored.
3. Throttle: queuing more than the daily cap sends only up to the cap today and schedules the rest; bursts are spaced, not simultaneous.
4. Warm-up ramp applies to a `new` mailbox; effective limit surfaced to the user.
5. Multi-mailbox rotation distributes sends across a user's mailboxes.
6. Sequence: follow-ups schedule as delayed jobs with correct `wait_days`; a lead marked replied/suppressed has its remaining steps stopped (test by setting the signal manually until File 11 populates it).
7. Metering behaves per the decided unit; failures refund; out-of-credits pauses with a prompt.
8. Failure mapping: a reauth-required mailbox surfaces a reconnect prompt and does not silently fail sends.

### Visual verification (UI present)
- Run §8 on the "Start sending" + campaign monitor screens via Claude in Chrome.
- **Expected visual result:** clear "Start sending" verb button; a plain-language send plan respecting safe limits; campaign view shows per-lead states and today's count vs cap; the deliverability pacing is framed positively as protection; reconnect/rate-limited/out-of-credits states read in plain English with a next step; no clutter/purple/gradients.
- Fix deviations, re-verify. Fallback per §8 if Chrome unavailable; note skip.

## Definition of Done (§9)
- Verification passes (incl. visual/fallback). `PROGRESS.md` updated (File 10 done; note send credit unit decision, warm-up ramp, daily caps, that reply/suppression stop-checks are wired and await File 11's signals). `CODE-MAP.md` updated (MailboxService.send complete; sequence engine; awaits File 11 for replies/compliance).
- Commit: `feat(sending): 10 throttled mailbox send, warm-up, follow-up sequences, stop-on-reply hooks`
- Push to `main`.

## What's next
File 11 — Replies + inbox + compliance: ingest replies into a threaded view, AI reply drafting (approval-by-default; first reply always draft even in autonomous mode), and the non-removable compliance layer (unsubscribe link + physical address footer, suppression check before every send, auto-suppress on unsubscribe/hard bounce).
