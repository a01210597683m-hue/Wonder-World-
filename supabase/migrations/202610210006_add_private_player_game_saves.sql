-- Private per-player save for WonderWorld's browser-game progression.
-- This preserves player-owned prototype state across devices; it is NOT an authoritative wallet.
create table if not exists public.player_game_saves (
  player_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null default '{}'::jsonb
    check (jsonb_typeof(save_data) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.player_game_saves enable row level security;
revoke all privileges on table public.player_game_saves from anon, authenticated;
grant select, insert, update, delete on table public.player_game_saves to authenticated;

drop policy if exists "Players can read their own game save" on public.player_game_saves;
create policy "Players can read their own game save"
on public.player_game_saves for select to authenticated
using ((select auth.uid()) = player_id);

drop policy if exists "Players can create their own game save" on public.player_game_saves;
create policy "Players can create their own game save"
on public.player_game_saves for insert to authenticated
with check ((select auth.uid()) = player_id);

drop policy if exists "Players can update their own game save" on public.player_game_saves;
create policy "Players can update their own game save"
on public.player_game_saves for update to authenticated
using ((select auth.uid()) = player_id)
with check ((select auth.uid()) = player_id);

drop policy if exists "Players can delete their own game save" on public.player_game_saves;
create policy "Players can delete their own game save"
on public.player_game_saves for delete to authenticated
using ((select auth.uid()) = player_id);
