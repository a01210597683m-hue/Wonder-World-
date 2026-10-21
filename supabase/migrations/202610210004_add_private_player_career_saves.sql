-- Private cloud saves for the local career/business prototype.
-- This is not an authoritative wallet or purchase ledger.
create table if not exists public.player_career_saves (
  player_id uuid primary key references auth.users(id) on delete cascade,
  save_data jsonb not null default '{}'::jsonb
    check (jsonb_typeof(save_data) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.player_career_saves enable row level security;
revoke all privileges on table public.player_career_saves from anon, authenticated;
grant select, insert, update, delete on table public.player_career_saves to authenticated;

drop policy if exists "Players can read their own career save" on public.player_career_saves;
create policy "Players can read their own career save"
on public.player_career_saves for select to authenticated
using (auth.uid() = player_id);

drop policy if exists "Players can create their own career save" on public.player_career_saves;
create policy "Players can create their own career save"
on public.player_career_saves for insert to authenticated
with check (auth.uid() = player_id);

drop policy if exists "Players can update their own career save" on public.player_career_saves;
create policy "Players can update their own career save"
on public.player_career_saves for update to authenticated
using (auth.uid() = player_id)
with check (auth.uid() = player_id);

drop policy if exists "Players can delete their own career save" on public.player_career_saves;
create policy "Players can delete their own career save"
on public.player_career_saves for delete to authenticated
using (auth.uid() = player_id);
