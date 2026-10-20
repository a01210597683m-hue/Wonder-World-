# WonderWorld backend readiness — 2026-10-21

## Implemented
- Supabase Auth creates baseline `player_profiles`, `player_progress` (level 1 / 0 XP), and `player_wallets` (0 coins) rows through a database trigger.
- The signup trigger function has direct execution revoked from `public`, `anon`, and `authenticated`.
- Signup migration: `supabase/migrations/202610210001_create_wonderworld_player_records.sql`.
- Client table privilege lockdown migration: `supabase/migrations/202610210002_lock_down_wonderworld_client_table_writes.sql`.
- Explicit deny policy migration: `supabase/migrations/202610210003_explicitly_deny_client_access_to_design_decisions.sql`.
- `auth.js` supports email/password sign-up, sign-in, sign-out, persistent client sessions, and read-only profile/progress/wallet display.
- GitHub Actions validates JavaScript syntax, runs gameplay regression checks and asset/integration checks, then deploys GitHub Pages.
- Character reference panel loads image filenames from the configured Supabase Storage bucket.

## Verified
- Supabase project `kkfmrvgpendfziejscsz` is active and healthy.
- RLS is enabled on all six public tables inspected.
- Current player read policies scope profiles, progress, wallet and inventory to the signed-in player's own rows. The game catalog is readable for available items.
- Migration `lock_down_wonderworld_client_table_writes` has been applied to Supabase. Browser roles no longer need direct table-write permissions for player data; wallet, inventory and progress changes must be server-authoritative.
- GitHub Actions run for commit `2740332600466db32b04e3fa2e1fce1df845a0f6` completed successfully: JavaScript syntax, gameplay checks, asset/integration checks, artifact upload and Pages deployment all passed.
- Reference images remain visual references; they are not 3D playable models.

## Remaining issues and manual checks
- Supabase Security Advisor previously reported leaked-password protection disabled. This project setting must be enabled in the Supabase Dashboard's Auth/password security settings; the available project/database tools do not expose that Auth setting, so it is not claimed as fixed.
- `public.design_decisions` client access is explicitly denied by an RLS policy and its privileges are revoked from `anon` and `authenticated`.
- A real end-to-end sign-up/sign-in/email-confirmation flow still needs testing with a real mailbox and an authenticated test account.
- Career/business state remains browser-local `localStorage`, is editable/resettable by the player, and is not cloud-synced.
- There are no deployed Supabase Edge Functions yet. Secure server-authoritative progress, wallet, inventory, rate-limiting and idempotency operations are not implemented.
- No real-money purchase, ad network, payout, Android signing, or store distribution integration is complete. Ads and in-app purchases require provider setup and server-side receipt verification.

## Next engineering steps
1. Enable leaked-password protection in Supabase Auth settings and re-run the Security Advisor.
2. Test signup, email confirmation, sign-in/sign-out, and per-user data isolation on the deployed website.
3. Add server-authoritative save/load and career/progress operations with ownership checks, rate limits and idempotency.
4. Implement secure inventory and virtual-currency operations; never accept client-provided balances or purchase claims.
5. Prepare Android package/application ID, signing, Play Console setup, and real-device testing.
6. Integrate ads and in-app purchases only after provider accounts and product IDs exist; verify purchase receipts server-side before granting items or currency.

## Safety
- Never commit or expose Supabase service-role keys, secret keys, or passwords.
- Publishable client keys are suitable for browser use only when RLS and least-privilege grants are correctly configured.
- The current careers/business demo uses fictional local credits, not real money and not Supabase.
