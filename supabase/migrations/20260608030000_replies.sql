-- 11 — Replies & inbox: mark message direction so a thread renders the full
-- back-and-forth (our outbound sends + the lead's inbound replies in order).
-- RULE: never edit a past migration. Idempotent.

alter table messages add column if not exists direction text not null default 'outbound';

-- Match an incoming reply to the thread we started (by provider thread id).
create index if not exists idx_messages_thread on messages (thread_id);
