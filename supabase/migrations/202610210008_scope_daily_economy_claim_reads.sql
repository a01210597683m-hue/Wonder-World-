drop policy if exists "Players can view their own daily economy claims" on public.player_daily_economy_claims;
create policy "Players can view their own daily economy claims"
 on public.player_daily_economy_claims for select to authenticated
 using ((select auth.uid())=player_id);
grant select on public.player_daily_economy_claims to authenticated;