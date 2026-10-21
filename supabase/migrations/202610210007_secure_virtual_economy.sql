-- Server-authoritative virtual wallet and item purchases.
create table if not exists public.player_economy_transactions (
 id uuid primary key default gen_random_uuid(),
 player_id uuid not null references auth.users(id) on delete cascade,
 transaction_type text not null check (transaction_type in ('daily_reward','item_purchase')),
 reference_id text not null, amount bigint not null,
 balance_after bigint not null check (balance_after >= 0), created_at timestamptz not null default now()
);
create index if not exists player_economy_transactions_owner_created_idx on public.player_economy_transactions(player_id,created_at desc);
alter table public.player_economy_transactions enable row level security;
drop policy if exists "Players can view their own economy transactions" on public.player_economy_transactions;
create policy "Players can view their own economy transactions" on public.player_economy_transactions for select to authenticated using ((select auth.uid())=player_id);
revoke all on public.player_economy_transactions from anon,authenticated;
grant select on public.player_economy_transactions to authenticated;
create table if not exists public.player_daily_economy_claims (
 player_id uuid not null references auth.users(id) on delete cascade,
 reward_code text not null check (reward_code in ('daily_login')),
 claim_date date not null default (now() at time zone 'utc')::date,
 created_at timestamptz not null default now(), primary key(player_id,reward_code,claim_date)
);
alter table public.player_daily_economy_claims enable row level security;
revoke all on public.player_daily_economy_claims from anon,authenticated;
create unique index if not exists player_inventory_owner_item_unique on public.player_inventory(player_id,item_id);
insert into public.game_items(id,name,item_type,price_coins,is_available) values
 ('mint-outfit','طقم نعناعي','clothing',8,true),('coral-outfit','طقم مرجاني','clothing',10,true),
 ('blue-outfit','طقم أزرق','clothing',12,true),('gold-outfit','طقم ذهبي','clothing',15,true),
 ('brown-hair','شعر بني','avatar',6,true),('black-hair','شعر أسود','avatar',8,true),
 ('rose-hair','شعر وردي غامق','avatar',10,true)
on conflict(id) do update set name=excluded.name,item_type=excluded.item_type,price_coins=excluded.price_coins,is_available=excluded.is_available;
create or replace function public.ww_ensure_wallet() returns bigint language plpgsql security definer set search_path=pg_catalog,public,auth as $$
declare v_uid uuid:=auth.uid(); v_name text; v_coins bigint;
begin
 if v_uid is null then raise exception 'authentication_required' using errcode='28000'; end if;
 select coalesce(nullif(left(raw_user_meta_data->>'display_name',40),''),'Player') into v_name from auth.users where id=v_uid;
 insert into public.player_profiles(id,display_name) values(v_uid,v_name) on conflict(id) do nothing;
 insert into public.player_wallets(player_id,coins) values(v_uid,0) on conflict(player_id) do nothing;
 insert into public.player_progress(player_id,level,experience) values(v_uid,1,0) on conflict(player_id) do nothing;
 select coins into v_coins from public.player_wallets where player_id=v_uid; return v_coins;
end; $$;
create or replace function public.ww_claim_daily_wallet_reward() returns jsonb language plpgsql security definer set search_path=pg_catalog,public,auth as $$
declare v_uid uuid:=auth.uid(); v_balance bigint; v_date date:=(now() at time zone 'utc')::date;
begin
 if v_uid is null then raise exception 'authentication_required' using errcode='28000'; end if;
 perform public.ww_ensure_wallet();
 insert into public.player_daily_economy_claims(player_id,reward_code,claim_date) values(v_uid,'daily_login',v_date) on conflict do nothing;
 if not found then select coins into v_balance from public.player_wallets where player_id=v_uid; return jsonb_build_object('ok',false,'reason','already_claimed','coins',v_balance); end if;
 update public.player_wallets set coins=coins+10,updated_at=now() where player_id=v_uid returning coins into v_balance;
 insert into public.player_economy_transactions(player_id,transaction_type,reference_id,amount,balance_after) values(v_uid,'daily_reward','daily_login:'||v_date::text,10,v_balance);
 return jsonb_build_object('ok',true,'reward',10,'coins',v_balance);
end; $$;
create or replace function public.ww_purchase_game_item(p_item_id text) returns jsonb language plpgsql security definer set search_path=pg_catalog,public,auth as $$
declare v_uid uuid:=auth.uid(); v_price bigint; v_name text; v_balance bigint;
begin
 if v_uid is null then raise exception 'authentication_required' using errcode='28000'; end if;
 if p_item_id is null or length(p_item_id)>80 then raise exception 'invalid_item' using errcode='22023'; end if;
 perform public.ww_ensure_wallet();
 select price_coins,name into v_price,v_name from public.game_items where id=p_item_id and is_available=true for share;
 if not found then raise exception 'item_unavailable' using errcode='P0002'; end if;
 if exists(select 1 from public.player_inventory where player_id=v_uid and item_id=p_item_id) then
  select coins into v_balance from public.player_wallets where player_id=v_uid;
  return jsonb_build_object('ok',false,'reason','already_owned','coins',v_balance,'item_id',p_item_id);
 end if;
 update public.player_wallets set coins=coins-v_price,updated_at=now() where player_id=v_uid and coins>=v_price returning coins into v_balance;
 if not found then select coins into v_balance from public.player_wallets where player_id=v_uid; return jsonb_build_object('ok',false,'reason','insufficient_funds','coins',v_balance,'price',v_price); end if;
 insert into public.player_inventory(player_id,item_id,quantity) values(v_uid,p_item_id,1);
 insert into public.player_economy_transactions(player_id,transaction_type,reference_id,amount,balance_after) values(v_uid,'item_purchase',p_item_id,-v_price,v_balance);
 return jsonb_build_object('ok',true,'item_id',p_item_id,'item_name',v_name,'price',v_price,'coins',v_balance);
end; $$;
revoke all on function public.ww_ensure_wallet() from public,anon;
revoke all on function public.ww_claim_daily_wallet_reward() from public,anon;
revoke all on function public.ww_purchase_game_item(text) from public,anon;
grant execute on function public.ww_ensure_wallet() to authenticated;
grant execute on function public.ww_claim_daily_wallet_reward() to authenticated;
grant execute on function public.ww_purchase_game_item(text) to authenticated;
