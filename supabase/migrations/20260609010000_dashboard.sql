-- File 12 — Dashboard aggregation support.
-- WHY: the dashboard summary is COUNT-only and already leans on the per-user+created_at
-- indexes from the init migration (idx_click/reply/bounce/booking_events_user_created).
-- These add two more so the remaining hot counts also avoid table scans:
--   1) reply_events "positive" label filter (the positive-replies headline metric).
--   2) messages sent/queued counts joined to the owning lead (emails sent, follow-ups).
-- All idempotent (IF NOT EXISTS) — safe to re-run.

-- Expression index for the jsonb label filter used by "positive replies".
create index if not exists idx_reply_events_user_label
  on reply_events (user_id, (payload->>'label'));

-- Sent-emails / pending-follow-up counts filter messages by lead + state + sent_at.
create index if not exists idx_messages_lead_state_sent
  on messages (lead_id, state, sent_at);

-- Click events are joined to leads for per-campaign drill-down (lead_id IN (...)).
create index if not exists idx_click_events_lead on click_events (lead_id);
