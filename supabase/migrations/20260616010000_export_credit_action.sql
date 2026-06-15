-- Add the 'export' credit reason so CSV exports can be metered like other paid
-- actions (search/enrichment/draft/send). The reserve_credits RPC casts the
-- action text to credit_reason, so this value must exist before exports run.
--
-- NOTE: ALTER TYPE ... ADD VALUE cannot run inside a transaction block on older
-- Postgres. Run this statement on its own (the Supabase SQL editor does this).
ALTER TYPE credit_reason ADD VALUE IF NOT EXISTS 'export';
