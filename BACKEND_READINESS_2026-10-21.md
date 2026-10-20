# WonderWorld backend readiness — 2026-10-21

## Implemented
- Applied Supabase migration `create_wonderworld_player_records_on_signup` to project `kkfmrvgpendfziejscsz`.
- New Supabase Auth users now get a baseline `player_profiles`, `player_progress` (level 1 / 0 XP), and `player_wallets` (0 coins) row through a database trigger.
- The trigger function has direct execution revoked from `public`, `anon`, and `authenticated`.
- The same SQL is versioned in `supabase/migrations/202610210001_create_wonderworld_player_records.sql`.

## Verified
- The trigger exists on `auth.users`.
- RLS remains enabled on the game tables.
- The current security advisor reports one INFO finding: `public.design_decisions` has RLS enabled but no policies. This currently denies API access by default; do not add a broad public policy. If the app needs it, design a restricted authenticated/admin access path.

## Still not complete
- The browser game does not yet have an integrated Supabase Auth sign-in/sign-up and session flow.
- The browser game still stores career/business prototype state in localStorage; it is not cloud-synced.
- Player progress writes, inventory grants, and wallet transactions are not implemented as server-authoritative game operations. Do not add client write policies to wallets or inventory.
- No Edge Functions are deployed in this project yet.
- No real-money purchase, ad network, payout, or store distribution integration exists.

## Required next engineering steps
1. Add and test Supabase Auth UI/session management in the game.
2. Add authenticated profile/progress read APIs and server-side validation for allowed progress updates.
3. Implement server-authoritative inventory and virtual-currency operations; never accept client-provided wallet balances or purchase claims.
4. Add tests for user isolation, save/load across sessions, duplicate requests, and invalid balances.
5. Choose a distribution target (web or Google Play) and a monetization model (ads, in-app purchases, or both) before integrating the corresponding provider and compliance requirements.

## Safety
- Never expose the Supabase service-role key in browser code or commit it to GitHub.
- Public/publishable client keys are intended for client use only when RLS and policies are correct.
- The current careers/business demo uses fictional local credits, not real money and not Supabase.
