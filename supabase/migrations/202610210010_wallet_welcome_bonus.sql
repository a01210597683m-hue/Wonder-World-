-- Give each new cloud wallet the same 20-coin starting balance as the browser prototype.
-- Existing empty wallets receive this one-time welcome balance; wallets with any ledger activity are untouched.
alter table public.player_economy_transactions
  drop constraint if exists player_economy_transactions_transaction_type_check;
alter table public.player_economy_transactions
  add constraint player_economy_transactions_transaction_type_check
  check (transaction_type in ('welcome_bonus','daily_reward','item_purchase'));

with eligible as (
  update public.player_wallets w
  set coins = 20, updated_at = now()
  where w.coins = 0
    and not exists (
      select 1 from public.player_economy_transactions t
      where t.player_id = w.player_id
    )
  returning w.player_id
)
insert into public.player_economy_transactions
  (player_id, transaction_type, reference_id, amount, balance_after)
select player_id, 'welcome_bonus', 'welcome_bonus:2026-10-21', 20, 20
from eligible;

create or replace function public.ww_ensure_wallet()
returns bigint
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_name text;
  v_coins bigint;
  v_rows integer;
begin
  if v_uid is null then
    raise exception 'authentication_required' using errcode = '28000';
  end if;

  select coalesce(nullif(left(raw_user_meta_data->>'display_name', 40), ''), 'Player')
    into v_name
  from auth.users
  where id = v_uid;

  insert into public.player_profiles(id, display_name)
  values (v_uid, v_name)
  on conflict (id) do nothing;

  insert into public.player_wallets(player_id, coins)
  values (v_uid, 20)
  on conflict (player_id) do nothing;
  get diagnostics v_rows = row_count;

  if v_rows = 1 then
    insert into public.player_economy_transactions
      (player_id, transaction_type, reference_id, amount, balance_after)
    values
      (v_uid, 'welcome_bonus', 'welcome_bonus:2026-10-21', 20, 20);
  end if;

  insert into public.player_progress(player_id, level, experience)
  values (v_uid, 1, 0)
  on conflict (player_id) do nothing;

  select coins into v_coins
  from public.player_wallets
  where player_id = v_uid;

  return v_coins;
end;
$$;

revoke all on function public.ww_ensure_wallet() from public, anon;
grant execute on function public.ww_ensure_wallet() to authenticated;
