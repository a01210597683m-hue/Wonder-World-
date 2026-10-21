-- Optimize per-player career save policies by evaluating auth.uid() once per statement.
drop policy if exists "Players can read their own career save" on public.player_career_saves;
create policy "Players can read their own career save"
on public.player_career_saves for select to authenticated
using ((select auth.uid()) = player_id);

drop policy if exists "Players can create their own career save" on public.player_career_saves;
create policy "Players can create their own career save"
on public.player_career_saves for insert to authenticated
with check ((select auth.uid()) = player_id);

drop policy if exists "Players can update their own career save" on public.player_career_saves;
create policy "Players can update their own career save"
on public.player_career_saves for update to authenticated
using ((select auth.uid()) = player_id)
with check ((select auth.uid()) = player_id);

drop policy if exists "Players can delete their own career save" on public.player_career_saves;
create policy "Players can delete their own career save"
on public.player_career_saves for delete to authenticated
using ((select auth.uid()) = player_id);
