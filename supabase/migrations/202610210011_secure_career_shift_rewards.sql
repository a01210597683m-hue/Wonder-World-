-- Server-authoritative cloud-wallet rewards for career shifts.
-- The client supplies only a known job code; the server chooses the reward and caps claims.
alter table public.player_economy_transactions
  drop constraint if exists player_economy_transactions_transaction_type_check;
alter table public.player_economy_transactions
  add constraint player_economy_transactions_transaction_type_check
  check (transaction_type in ('welcome_bonus','daily_reward','item_purchase','career_income'));

create table if not exists public.player_career_daily_limits (
  player_id uuid not null references auth.users(id) on delete cascade,
  reward_date date not null,
  shift_count integer not null default 0 check (shift_count between 0 and 10),
  updated_at timestamptz not null default now(),
  primary key (player_id, reward_date)
);
alter table public.player_career_daily_limits enable row level security;
drop policy if exists "Players can view their own career reward limits" on public.player_career_daily_limits;
create policy "Players can view their own career reward limits"
  on public.player_career_daily_limits for select to authenticated
  using ((select auth.uid()) = player_id);
revoke all on public.player_career_daily_limits from anon, authenticated;
grant select on public.player_career_daily_limits to authenticated;

create or replace function public.ww_claim_career_shift(p_job_code text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_date date := (now() at time zone 'utc')::date;
  v_wage integer;
  v_count integer;
  v_balance bigint;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;

  v_wage := case p_job_code
    when 'cafe' then 12
    when 'market' then 11
    when 'delivery' then 13
    else null
  end;
  if v_wage is null then
    raise exception 'invalid_career_job' using errcode = '22023';
  end if;

  perform public.ww_ensure_wallet();

  insert into public.player_career_daily_limits(player_id, reward_date, shift_count)
  values (v_uid, v_date, 0)
  on conflict (player_id, reward_date) do nothing;

  select shift_count into v_count
  from public.player_career_daily_limits
  where player_id = v_uid and reward_date = v_date
  for update;

  if v_count >= 10 then
    select coins into v_balance from public.player_wallets where player_id = v_uid;
    return jsonb_build_object('ok', false, 'reason', 'daily_limit', 'coins', v_balance, 'remaining_shifts', 0);
  end if;

  update public.player_career_daily_limits
  set shift_count = shift_count + 1, updated_at = now()
  where player_id = v_uid and reward_date = v_date;

  update public.player_wallets
  set coins = coins + v_wage, updated_at = now()
  where player_id = v_uid
  returning coins into v_balance;

  insert into public.player_economy_transactions
    (player_id, transaction_type, reference_id, amount, balance_after)
  values
    (v_uid, 'career_income',
      'career_shift:' || p_job_code || ':' || v_date::text || ':' || (v_count + 1)::text,
      v_wage, v_balance);

  return jsonb_build_object(
    'ok', true, 'job_code', p_job_code, 'reward', v_wage,
    'coins', v_balance, 'remaining_shifts', 9 - v_count
  );
end;
$$;

revoke all on function public.ww_claim_career_shift(text) from public, anon;
grant execute on function public.ww_claim_career_shift(text) to authenticated;
