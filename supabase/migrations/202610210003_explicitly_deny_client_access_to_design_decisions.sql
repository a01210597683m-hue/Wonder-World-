-- Make the intentional deny-by-default behavior explicit for client roles.
-- Internal/admin access can use trusted server-side credentials that bypass RLS.
drop policy if exists "design_decisions_closed_to_clients" on public.design_decisions;
create policy "design_decisions_closed_to_clients"
on public.design_decisions
for all
to anon, authenticated
using (false)
with check (false);
