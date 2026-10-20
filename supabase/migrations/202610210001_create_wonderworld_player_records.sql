-- Keep in sync with the migration applied to Supabase project kkfmrvgpendfziejscsz.
-- Creates baseline records after Supabase Auth creates a user.
-- This intentionally does not grant direct writes to player_wallets or player_inventory.
create or replace function public.handle_new_wonderworld_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.player_profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), 'Player')
  )
  on conflict (id) do nothing;

  insert into public.player_progress (player_id, level, experience)
  values (new.id, 1, 0)
  on conflict (player_id) do nothing;

  insert into public.player_wallets (player_id, coins)
  values (new.id, 0)
  on conflict (player_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_wonderworld on auth.users;
create trigger on_auth_user_created_wonderworld
  after insert on auth.users
  for each row execute function public.handle_new_wonderworld_user();

revoke all on function public.handle_new_wonderworld_user() from public, anon, authenticated;
