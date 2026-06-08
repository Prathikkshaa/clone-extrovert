-- 09 — AI drafting: fields a draft/email needs that the §5 base `messages` shape
-- lacked. Drafts live on `messages` (the outbound item per §5) in a "holding area"
-- (campaign_id null) until File 10 builds the campaign + sequence_steps.
--   subject     — the email subject line (base shape only had `body`).
--   step_order  — sequence position: 1 = first email, 2/3 = follow-ups.
--   approved    — user approved this draft; File 10 only sends approved drafts.
-- RULE: never edit a past migration. All ADD COLUMN IF NOT EXISTS (idempotent).

alter table messages add column if not exists subject text;
alter table messages add column if not exists step_order integer not null default 1;
alter table messages add column if not exists approved boolean not null default false;

-- Look up a lead's drafts (review queue) quickly.
create index if not exists idx_messages_lead_step on messages (lead_id, step_order);
