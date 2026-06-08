-- 10 — Sending engine: per-message send metadata.
--   mailbox_id          — which connected mailbox sent it (rotation accounting +
--                         reply matching in File 11).
--   provider_message_id — Gmail/Graph message id (threading + reply matching).
--   scheduled_at        — when a (follow-up) step is scheduled to fire.
--   send_error          — last send failure reason (for the campaign monitor).
-- RULE: never edit a past migration. All ADD COLUMN IF NOT EXISTS (idempotent).

alter table messages add column if not exists mailbox_id uuid references mailboxes (id) on delete set null;
alter table messages add column if not exists provider_message_id text;
alter table messages add column if not exists scheduled_at timestamptz;
alter table messages add column if not exists send_error text;

create index if not exists idx_messages_state on messages (state);
create index if not exists idx_messages_campaign_lead on messages (campaign_id, lead_id);
