-- 06 — Credit metering functions (master-context §6).
-- Atomic, race-safe reserve/commit/refund + balance, on top of the append-only
-- credit_ledger. Balance is always SUM(delta) — never a stored mutable value.
--
-- SECURITY: these functions are executable by the backend (service_role) ONLY.
-- They are revoked from the API roles (anon/authenticated) so no client can mint,
-- reserve, or refund credits directly.
--
-- RULE: never edit a past migration. Changes go in a new migration.

-- Current balance = sum of ledger deltas for a user.
create or replace function credit_balance(p_user uuid)
returns bigint
language sql
stable
as $$
  select coalesce(sum(delta), 0)::bigint from credit_ledger where user_id = p_user;
$$;

-- Reserve credits for an action: atomic balance check + debit + reserved usage_event.
-- Per-user advisory lock serializes concurrent reserves so two can't both pass on
-- a balance that only covers one. Raises INSUFFICIENT_CREDITS when too low.
create or replace function reserve_credits(
  p_user uuid,
  p_action text,
  p_cost int,
  p_ref uuid default null
)
returns uuid
language plpgsql
as $$
declare
  v_balance bigint;
  v_id uuid;
begin
  perform pg_advisory_xact_lock(hashtext(p_user::text));

  select coalesce(sum(delta), 0) into v_balance from credit_ledger where user_id = p_user;
  if v_balance < p_cost then
    raise exception 'INSUFFICIENT_CREDITS' using errcode = 'P0001';
  end if;

  insert into credit_ledger (user_id, delta, reason, ref_id)
    values (p_user, -p_cost, p_action::credit_reason, p_ref);

  insert into usage_events (user_id, action, credits, status, ref_id)
    values (p_user, p_action, p_cost, 'reserved', p_ref)
    returning id into v_id;

  return v_id;
end;
$$;

-- Finalize a reserved usage_event (ledger already debited at reserve time).
create or replace function commit_usage(p_usage uuid)
returns boolean
language plpgsql
as $$
declare
  v_count int;
begin
  update usage_events set status = 'committed'
    where id = p_usage and status = 'reserved';
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

-- Refund a usage_event: append a compensating +credit and mark refunded.
-- Idempotent: refunding an already-refunded event is a no-op (returns false).
create or replace function refund_usage(p_usage uuid)
returns boolean
language plpgsql
as $$
declare
  v_user uuid;
  v_credits int;
  v_status usage_status;
begin
  select user_id, credits, status into v_user, v_credits, v_status
    from usage_events where id = p_usage for update;
  if not found then
    return false;
  end if;
  if v_status = 'refunded' then
    return false; -- already refunded; do not double-credit
  end if;

  insert into credit_ledger (user_id, delta, reason, ref_id)
    values (v_user, v_credits, 'refund', p_usage);
  update usage_events set status = 'refunded' where id = p_usage;
  return true;
end;
$$;

-- Restrict execution to the backend service role.
revoke execute on function credit_balance(uuid) from public;
revoke execute on function reserve_credits(uuid, text, int, uuid) from public;
revoke execute on function commit_usage(uuid) from public;
revoke execute on function refund_usage(uuid) from public;
grant execute on function credit_balance(uuid) to service_role;
grant execute on function reserve_credits(uuid, text, int, uuid) to service_role;
grant execute on function commit_usage(uuid) to service_role;
grant execute on function refund_usage(uuid) to service_role;
