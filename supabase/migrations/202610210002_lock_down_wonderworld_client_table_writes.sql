-- Tighten browser-facing privileges for the WonderWorld prototype.
-- RLS policies still scope permitted reads; clients must never write authoritative
-- player progression, wallet, inventory, or internal design-decision records directly.
revoke insert, update, delete, truncate, references, trigger
on all tables in schema public from anon, authenticated;

revoke all privileges on table public.design_decisions from anon, authenticated;

grant select on table public.game_items to anon, authenticated;
grant select on table public.player_profiles to authenticated;
grant select on table public.player_progress to authenticated;
grant select on table public.player_wallets to authenticated;
grant select on table public.player_inventory to authenticated;
