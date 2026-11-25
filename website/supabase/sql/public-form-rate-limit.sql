-- Apply only through a Supabase migration generated with `supabase migration new`.
-- Persistent atomic fixed-window limiting; raw client IPs are never stored.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table if not exists private.public_form_rate_limits (
  action text not null,
  ip_hash text not null check (ip_hash ~ '^[0-9a-f]{64}$'),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0),
  updated_at timestamptz not null default clock_timestamp(),
  primary key (action, ip_hash)
);

alter table private.public_form_rate_limits enable row level security;
revoke all on table private.public_form_rate_limits from public, anon, authenticated, service_role;

create or replace function public.consume_public_form_rate_limit(
  p_action text,
  p_ip_hash text,
  p_max_requests integer,
  p_window_seconds integer
)
returns table (allowed boolean, retry_after_seconds integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := clock_timestamp();
  v_window_start timestamptz;
  v_count integer;
begin
  if p_action is null or p_action !~ '^[a-z][a-z0-9_-]{0,63}$'
     or p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$'
     or p_max_requests < 1 or p_max_requests > 500
     or p_window_seconds < 1 or p_window_seconds > 86400 then
    raise exception 'Invalid rate limit parameters';
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from v_now) / p_window_seconds) * p_window_seconds
  );

  insert into private.public_form_rate_limits as current_limit
    (action, ip_hash, window_started_at, request_count, updated_at)
  values (p_action, p_ip_hash, v_window_start, 1, v_now)
  on conflict (action, ip_hash) do update
    set window_started_at = greatest(current_limit.window_started_at, excluded.window_started_at),
        request_count = case
          when current_limit.window_started_at >= excluded.window_started_at
            then least(current_limit.request_count + 1, p_max_requests + 1)
          else 1
        end,
        updated_at = excluded.updated_at
  returning window_started_at, request_count into v_window_start, v_count;

  -- Bounded cleanup keeps old HMACs from accumulating without requiring pg_cron.
  delete from private.public_form_rate_limits
   where ctid in (
     select stale.ctid
       from private.public_form_rate_limits as stale
      where stale.updated_at < v_now - interval '1 day'
      limit 100
   );

  return query select
    v_count <= p_max_requests,
    greatest(1, ceil(extract(epoch from (v_window_start + make_interval(secs => p_window_seconds) - v_now)))::integer);
end;
$$;

revoke all on function public.consume_public_form_rate_limit(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_public_form_rate_limit(text, text, integer, integer) to service_role;
