# WonderWorld backend readiness — 2026-10-21

## Implemented
- Applied Supabase migration `create_wonderworld_player_records_on_signup` to project `kkfmrvgpendfziejscsz`.
- New Supabase Auth users get baseline `player_profiles`, `player_progress` (level 1 / 0 XP), and `player_wallets` (0 coins) rows through a database trigger.
- The trigger function has direct execution revoked from `public`, `anon`, and `authenticated`.
- The migration is versioned in `supabase/migrations/202610210001_create_wonderworld_player_records.sql`.
- Added `auth.js`: email/password sign-up, sign-in, sign-out, persistent client session, and read-only profile/progress/wallet display. It uses the Supabase publishable key only and does not write wallet, inventory, or progress rows.
- `index.html` now loads the account module.

## Verified
- The signup trigger exists on `auth.users`.
- RLS is enabled on `player_profiles`, `player_progress`, `player_wallets`, and `player_inventory`; policies currently allow only own-row reads for progress, wallet, and inventory, and own-row profile access.
- The GitHub Actions build passed, including the JavaScript syntax check for `auth.js`, and the GitHub Pages deployment workflow completed successfully: https://github.com/a01210597683m-hue/Wonder-World-/actions/runs/39510358274
- The current Supabase security advisor reports one INFO finding: `public.design_decisions` has RLS enabled but no policies. Keep it closed by default; do not add a broad public policy.

## Not yet verified or complete
- A real end-to-end sign-up/sign-in and email-confirmation flow has not yet been tested with a real mailbox. The account UI's profile queries need an authenticated test account to confirm runtime behavior.
- Career/business state still lives in localStorage and is not cloud-synced.
- Progress writes, inventory grants, and wallet transactions are not implemented as server-authoritative operations. Do not add client write policies to wallets or inventory.
- No Supabase Edge Functions are deployed.
- No real-money purchase, ad network, payout, or store distribution integration exists.
- The selected release targets are **web and Android**. The selected monetization model is **ads plus in-app purchases**; provider-specific integration remains pending setup and secure credentials/IDs.

## Required next engineering steps
1. Test account creation, email confirmation (if enabled), sign-in, sign-out, and per-user read isolation on the deployed site.
2. Add safe server-authoritative career/progress operations with ownership checks, rate limits, and idempotency; migrate away from treating localStorage as the cloud save.
3. Implement server-authoritative inventory and virtual-currency operations; never accept client-provided wallet balances or purchase claims.
4. Add tests for user isolation, save/load across sessions, duplicate requests, and invalid balances.
5. Prepare Android distribution (package/application ID, signing, Play Console setup) and confirm the web deployment domain.
6. Integrate ads and in-app purchases only after provider setup: web ad publisher/site approval, Android AdMob app/ad-unit IDs, web checkout provider, and Google Play Billing product IDs. Verify purchase receipts server-side before granting any paid item or currency.

## Safety
- Never expose the Supabase service-role key or secret keys in browser code or commit them to GitHub.
- Publishable client keys are intended for client use only when RLS and least-privilege policies are correct.
- The current careers/business demo uses fictional local credits, not real money and not Supabase.
