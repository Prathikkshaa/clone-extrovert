-- 07 — Lead search: extra columns on `leads` for Places results + dedup.
-- place_id: Google Places id (dedup key per user). address/rating/review_count:
-- shown on lead cards. RULE: never edit a past migration.

alter table leads add column place_id text;
alter table leads add column address text;
alter table leads add column rating real;
alter table leads add column review_count integer;

-- A user never gets the same Place twice (dedup across repeated searches).
create unique index uniq_leads_user_place on leads (user_id, place_id)
  where place_id is not null;
