-- File 13 — Booking (Cal.com).
-- WHY: let leads book meetings and capture those bookings automatically so the
-- dashboard "meetings booked" metric becomes real and hands-off (File 12 already
-- counts booking_events). Two pieces of state are needed:
--   1) where the user's Cal.com booking link lives (per-user, BYO for v1), and
--   2) idempotency keys on booking_events so the same Cal.com webhook delivered
--      more than once is recorded only ONCE (no double-count).
-- All idempotent (IF NOT EXISTS) — safe to re-run.

-- 1) The user's Cal.com booking link (the natural CTA we drop into outreach emails).
alter table users add column if not exists booking_url text;

-- 2) Idempotency for Cal.com webhooks. Cal.com gives each booking a stable `uid`;
-- a webhook carries a trigger event (BOOKING_CREATED / _RESCHEDULED / _CANCELLED).
-- We key a recorded event off (cal_uid, cal_trigger): the same trigger for the same
-- booking delivered twice collides on the unique index and the second insert is a
-- no-op (ON CONFLICT DO NOTHING), while a later cancel/reschedule of the same booking
-- is a distinct row. Older rows (none yet) have null cal_uid → excluded by the
-- partial index, so the constraint only governs Cal.com-sourced events.
alter table booking_events add column if not exists cal_uid text;
alter table booking_events add column if not exists cal_trigger text;

create unique index if not exists uniq_booking_events_cal
  on booking_events (cal_uid, cal_trigger)
  where cal_uid is not null;
