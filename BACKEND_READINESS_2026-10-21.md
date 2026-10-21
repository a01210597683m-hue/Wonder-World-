# WonderWorld backend readiness — 2026-10-21

## Implemented
- Supabase Auth creates baseline `player_profiles`, `player_progress` (level 1 / 0 XP), and `player_wallets` (0 coins) rows through a database trigger.
- The signup trigger function has direct execution revoked from `public`, `anon`, and `authenticated`.
- Signup migration: `supabase/migrations/202610210001_create_wonderworld_player_records.sql`.
- Client table privilege lockdown migration: `supabase/migrations/202610210002_lock_down_wonderworld_client_table_writes.sql`.
- Explicit deny policy migration: `supabase/migrations/202610210003_explicitly_deny_client_access_to_design_decisions.sql`.
- Private career/business prototype cloud-save migration: `supabase/migrations/202610210004_add_private_player_career_saves.sql`.
- Career-save RLS performance migration: `supabase/migrations/202610210005_optimize_player_career_save_rls_policies.sql`.
- Full game progression cloud-save migration: `supabase/migrations/202610210006_add_private_player_game_saves.sql`.
- `auth.js` supports email/password sign-up, sign-in, sign-out, persistent client sessions, and read-only profile/progress/wallet display.
- GitHub Actions validates JavaScript syntax, runs gameplay regression checks and asset/integration checks, then deploys GitHub Pages.
- Character reference panel loads image filenames from the configured Supabase Storage bucket.

## Verified
- Supabase project `kkfmrvgpendfziejscsz` is active and healthy.
- RLS is enabled on the inspected public tables, including `player_career_saves`; `player_game_saves` was added afterward with RLS enabled and four owner-scoped policies.
- Current player read policies scope profiles, progress, wallet and inventory to the signed-in player's own rows. The game catalog is readable for available items.
- Migration `lock_down_wonderworld_client_table_writes` has been applied to Supabase. Browser roles no longer need direct table-write permissions for player data; wallet, inventory and progress changes must be server-authoritative.
- GitHub Actions run for commit `707cb07f85f2e02e68bd1951625f019c6b0b5be9` (run 228) completed successfully: JavaScript syntax, gameplay checks, asset/integration checks, artifact upload and Pages deployment all passed.
- `player_career_saves` and `player_game_saves` are designed for select/insert/update/delete by `authenticated` only, with RLS owner checks using `(select auth.uid()) = player_id`. The career policies were verified by querying `pg_policies`; the new game-save policies still need a post-migration verification pass.
- Reference images remain visual references; they are not 3D playable models.

## Remaining issues and manual checks
- Supabase Security Advisor previously reported leaked-password protection disabled. This project setting must be enabled in the Supabase Dashboard's Auth/password security settings; the available project/database tools do not expose that Auth setting, so it is not claimed as fixed.
- `public.design_decisions` client access is explicitly denied by an RLS policy and its privileges are revoked from `anon` and `authenticated`.
- A real end-to-end sign-up/sign-in/email-confirmation flow still needs testing with a real mailbox and an authenticated test account.
- Career/business demo state and the broader game progression now have separate per-account cloud-save rows when the player is signed in, plus localStorage fallback. The broader save includes levels/XP, prototype coins, daily quests, wardrobe, relationships, pets/care, and adventure log. Runtime browser round-trip testing is still required. Client-provided balances and progression are not authoritative or anti-cheat-secure.
- There are no deployed Supabase Edge Functions yet. Secure server-authoritative progress, wallet, inventory, rate-limiting and idempotency operations are not implemented.
- No real-money purchase, ad network, payout, Android signing, or store distribution integration is complete. Ads and in-app purchases require provider setup and server-side receipt verification.

## Next engineering steps
1. Enable leaked-password protection in Supabase Auth settings and re-run the Security Advisor.
2. Test signup, email confirmation, sign-in/sign-out, and per-user data isolation on the deployed website.
3. Test game and career cloud-save round trips in a real signed-in browser session, including sign-out/sign-in and isolation between two test accounts.
4. Add server-authoritative save/load and career/progress operations with ownership checks, rate limits and idempotency.
5. Implement secure inventory and virtual-currency operations; never accept client-provided balances or purchase claims.
6. Prepare Android package/application ID, signing, Play Console setup, and real-device testing.
7. Integrate ads and in-app purchases only after provider accounts and product IDs exist; verify purchase receipts server-side before granting items or currency.

## Safety
- Never commit or expose Supabase service-role keys, secret keys, or passwords.
- Publishable client keys are suitable for browser use only when RLS and least-privilege grants are correctly configured.
- Career credits, game coins, XP, relationships, pet care, and other game progression are fictional prototype values. Cloud rows provide per-account persistence but are still client-controlled; they are not a secure wallet or real-money ledger.
