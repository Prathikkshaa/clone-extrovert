-- File 14 — Billing (Stripe).
-- WHY: credits are granted ONLY from the verified Stripe webhook, and Stripe can
-- deliver the same event more than once — double-crediting is the classic billing
-- bug. We need a hard idempotency guarantee keyed off the Stripe EVENT id.
--
-- `credit_ledger.ref_id` is a uuid column, so it can't hold a Stripe event id
-- (evt_...). This dedup table is the idempotency ledger: the primary key IS the
-- Stripe event id, so a second delivery collides and is a no-op. It also audits the
-- session→user mapping + granted amount for reconciliation.
-- Idempotent (IF NOT EXISTS) — safe to re-run.

create table if not exists stripe_events (
  id text primary key,                -- Stripe event id (evt_...) — the idempotency key
  type text not null,                 -- e.g. checkout.session.completed
  user_id uuid references users (id) on delete set null,
  credits integer,                    -- credits granted for this event (null if none)
  created_at timestamptz not null default now()
);

create index if not exists idx_stripe_events_user on stripe_events (user_id);
