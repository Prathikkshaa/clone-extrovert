-- 02 — Initial schema for ExtrovertAI (master-context §5).
-- Creates enum types, every core/credit/tracking table with UUID PKs,
-- created_at/updated_at (+ updated_at trigger), foreign keys, indexes, and
-- row-level security scoped to the owning user.
--
-- RULE: never edit a past migration. Schema changes go in a NEW migration file.

-- ---------------------------------------------------------------------------
-- Enum types (kept in sync with packages/shared/src/enums)
-- ---------------------------------------------------------------------------
create type lead_status as enum ('new', 'contacted', 'replied', 'meeting', 'won', 'lost');
create type enrichment_status as enum ('pending', 'in_progress', 'complete', 'failed');
create type message_state as enum ('queued', 'sent', 'bounced', 'replied', 'stopped');
create type user_mode as enum ('draft', 'autonomous');
create type mailbox_provider as enum ('gmail', 'outlook');
create type campaign_channel as enum ('email', 'whatsapp');
create type theme_source as enum ('fetched', 'official');
create type credit_reason as enum ('purchase', 'search', 'enrichment', 'draft', 'send', 'refund');
create type usage_status as enum ('reserved', 'committed', 'refunded');
create type suppression_reason as enum ('unsubscribe', 'bounce', 'manual');

-- ---------------------------------------------------------------------------
-- updated_at trigger function
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ===========================================================================
-- CORE TABLES
-- ===========================================================================

-- users — app-profile row; id mirrors auth.users.id (Supabase Auth owns login).
create table users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  plan text not null default 'free',
  mode user_mode not null default 'draft',
  daily_send_cap integer not null default 50,
  physical_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- company_profiles — one per user (brand/voice used for drafting + theming).
create table company_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users (id) on delete cascade,
  website text,
  logo_url text,
  brand_color text,
  theme_source theme_source not null default 'fetched',
  services text,
  about text,
  value_prop text,
  tone text,
  proof_points jsonb not null default '[]'::jsonb,
  raw_crawl text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- mailboxes — connected sending mailboxes. Token columns hold ENCRYPTED values
-- (encryption happens in app code, File 04, using TOKEN_ENCRYPTION_KEY).
create table mailboxes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  provider mailbox_provider not null,
  email text not null,
  access_token_encrypted text,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  daily_cap integer not null default 50,
  warmup_state text not null default 'new',
  status text not null default 'connected',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- searches — saved lead-search queries.
create table searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  industry text,
  location text,
  filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- leads — discovered + enriched prospects.
create table leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  search_id uuid references searches (id) on delete set null,
  name text,
  website text,
  email text,
  phone text,
  reviews jsonb not null default '{}'::jsonb,
  hook text,
  status lead_status not null default 'new',
  enrichment_status enrichment_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- lists — named groupings of leads.
create table lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- lead_list — join (a lead can be in many lists). Ownership derived from list.
create table lead_list (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references lists (id) on delete cascade,
  lead_id uuid not null references leads (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (list_id, lead_id)
);

-- campaigns — an outreach run over a list.
create table campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  list_id uuid references lists (id) on delete set null,
  channel campaign_channel not null default 'email',
  mode user_mode not null default 'draft',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- sequence_steps — ordered steps of a campaign. Ownership derived from campaign.
create table sequence_steps (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references campaigns (id) on delete cascade,
  step_order integer not null,
  wait_days integer not null default 0,
  template_ref text,
  prompt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- messages — individual outbound/threaded messages. Ownership derived from lead.
create table messages (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references campaigns (id) on delete set null,
  lead_id uuid not null references leads (id) on delete cascade,
  channel campaign_channel not null default 'email',
  state message_state not null default 'queued',
  thread_id text,
  sent_at timestamptz,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- suppressions — addresses that must never be emailed. Checked before EVERY send.
create table suppressions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  email text not null,
  reason suppression_reason not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, email)
);

-- ===========================================================================
-- CREDITS & USAGE (platform owns external API keys; users pay in credits)
-- ===========================================================================

-- credit_ledger — append-only. Balance = SUM(delta). delta is integer (+/-).
create table credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  delta integer not null,
  reason credit_reason not null,
  ref_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- usage_events — reserve/commit/refund lifecycle for each metered action.
create table usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  action text not null,
  credits integer not null,
  status usage_status not null default 'reserved',
  ref_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===========================================================================
-- TRACKING EVENTS (dashboard aggregates these)
-- ===========================================================================
create table click_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  lead_id uuid references leads (id) on delete set null,
  message_id uuid references messages (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reply_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  lead_id uuid references leads (id) on delete set null,
  message_id uuid references messages (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table bounce_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  lead_id uuid references leads (id) on delete set null,
  message_id uuid references messages (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table booking_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  lead_id uuid references leads (id) on delete set null,
  message_id uuid references messages (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===========================================================================
-- INDEXES (common lookups)
-- ===========================================================================
create index idx_leads_user_status on leads (user_id, status);
create index idx_messages_campaign on messages (campaign_id);
create index idx_messages_lead on messages (lead_id);
create index idx_suppressions_user_email on suppressions (user_id, email);
create index idx_credit_ledger_user on credit_ledger (user_id);
create index idx_usage_events_user on usage_events (user_id);
create index idx_click_events_user_created on click_events (user_id, created_at);
create index idx_reply_events_user_created on reply_events (user_id, created_at);
create index idx_bounce_events_user_created on bounce_events (user_id, created_at);
create index idx_booking_events_user_created on booking_events (user_id, created_at);

-- ===========================================================================
-- updated_at TRIGGERS (every table)
-- ===========================================================================
create trigger trg_users_updated before update on users for each row execute function set_updated_at();
create trigger trg_company_profiles_updated before update on company_profiles for each row execute function set_updated_at();
create trigger trg_mailboxes_updated before update on mailboxes for each row execute function set_updated_at();
create trigger trg_searches_updated before update on searches for each row execute function set_updated_at();
create trigger trg_leads_updated before update on leads for each row execute function set_updated_at();
create trigger trg_lists_updated before update on lists for each row execute function set_updated_at();
create trigger trg_lead_list_updated before update on lead_list for each row execute function set_updated_at();
create trigger trg_campaigns_updated before update on campaigns for each row execute function set_updated_at();
create trigger trg_sequence_steps_updated before update on sequence_steps for each row execute function set_updated_at();
create trigger trg_messages_updated before update on messages for each row execute function set_updated_at();
create trigger trg_suppressions_updated before update on suppressions for each row execute function set_updated_at();
create trigger trg_credit_ledger_updated before update on credit_ledger for each row execute function set_updated_at();
create trigger trg_usage_events_updated before update on usage_events for each row execute function set_updated_at();
create trigger trg_click_events_updated before update on click_events for each row execute function set_updated_at();
create trigger trg_reply_events_updated before update on reply_events for each row execute function set_updated_at();
create trigger trg_bounce_events_updated before update on bounce_events for each row execute function set_updated_at();
create trigger trg_booking_events_updated before update on booking_events for each row execute function set_updated_at();

-- ===========================================================================
-- ROW-LEVEL SECURITY
-- A row is accessible only when its owning user matches auth.uid().
-- The service_role client (api/worker) BYPASSES RLS — backend code must still
-- scope queries by user_id itself (defense in depth).
-- ===========================================================================
alter table users enable row level security;
alter table company_profiles enable row level security;
alter table mailboxes enable row level security;
alter table searches enable row level security;
alter table leads enable row level security;
alter table lists enable row level security;
alter table lead_list enable row level security;
alter table campaigns enable row level security;
alter table sequence_steps enable row level security;
alter table messages enable row level security;
alter table suppressions enable row level security;
alter table credit_ledger enable row level security;
alter table usage_events enable row level security;
alter table click_events enable row level security;
alter table reply_events enable row level security;
alter table bounce_events enable row level security;
alter table booking_events enable row level security;

-- users: row keyed by its own id.
create policy users_owner on users for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Directly user-owned tables: user_id = auth.uid().
create policy company_profiles_owner on company_profiles for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy mailboxes_owner on mailboxes for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy searches_owner on searches for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy leads_owner on leads for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy lists_owner on lists for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy campaigns_owner on campaigns for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy suppressions_owner on suppressions for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy credit_ledger_owner on credit_ledger for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy usage_events_owner on usage_events for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy click_events_owner on click_events for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy reply_events_owner on reply_events for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy bounce_events_owner on bounce_events for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy booking_events_owner on booking_events for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Join/child tables: ownership derived from the parent row.
create policy lead_list_owner on lead_list for all to authenticated
  using (exists (select 1 from lists l where l.id = lead_list.list_id and l.user_id = auth.uid()))
  with check (exists (select 1 from lists l where l.id = lead_list.list_id and l.user_id = auth.uid()));

create policy sequence_steps_owner on sequence_steps for all to authenticated
  using (exists (select 1 from campaigns c where c.id = sequence_steps.campaign_id and c.user_id = auth.uid()))
  with check (exists (select 1 from campaigns c where c.id = sequence_steps.campaign_id and c.user_id = auth.uid()));

create policy messages_owner on messages for all to authenticated
  using (exists (select 1 from leads ld where ld.id = messages.lead_id and ld.user_id = auth.uid()))
  with check (exists (select 1 from leads ld where ld.id = messages.lead_id and ld.user_id = auth.uid()));
