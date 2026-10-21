# WonderWorld — One-pass release readiness checklist

Updated: 2026-10-21

This checklist separates automated checks from tasks that require a real account, an owner-controlled dashboard setting, or a physical Android device. A successful Pages deployment is not proof that every product requirement is complete.

## Automated browser coverage

The CI smoke suite verifies the 3D canvas and mobile controls, travel to Egypt/Paris/Tokyo, home customization persistence, the curated Wonder guide, careers, a football practice shot, the memory board, signed-out cloud-wallet guidance, account form validation, and absence of uncaught browser exceptions.

## Must be verified with real credentials / owner access

- [ ] Enable Supabase Auth leaked-password protection in the Dashboard's password security settings.
- [ ] Re-run the Supabase Security Advisor and review each remaining warning; do not disable required authenticated RPC access without a replacement design.
- [ ] Add `https://a01210597683m-hue.github.io/Wonder-World-/` to Supabase Auth's allowed redirect URLs and verify password-recovery emails return to the game.
- [ ] Sign up with a real test mailbox and verify confirmation, sign-in, sign-out, and session restoration.
- [ ] Confirm game-save and career-save cloud round trips across reloads and fresh sessions.
- [ ] Test with two disposable accounts and verify that each account can access only its own save, wallet, inventory, and career data.
- [ ] Verify daily reward is claimable once per UTC date, item purchases reject insufficient funds and duplicates, and career shifts stop at the server-side daily cap.
- [ ] Verify all core interactions and performance on a real Android device.

## Product scope that remains beyond this prototype

- Current character images are references, not rigged or animated production 3D models.
- The browser scene is a low-poly prototype, not a complete 3D/4K world.
- Country destinations are small landmark areas, not full-scale city worlds or complete transport systems.
- Football, careers, business management, puzzles and social systems have prototype slices; they require broader gameplay, balance, accessibility, and device testing.
- Local-storage progression and any non-server-authoritative progression must not be treated as tamper-proof.
- No real-money payment, cash-out, or production monetization system is implied.

## Release rule

Keep the prototype status visible until all credentialed and device-specific checks above have passed. Never put service-role keys, database passwords, or other secrets in client files or the repository.


## Account UX batch — 2026-10-21

- Added password recovery requests with a redirect back to the current game URL and a generic success message that avoids confirming whether an email is registered.
- Added client-side email validation, minimum signup password validation, Arabic-friendly authentication errors, password visibility toggle, Enter-to-submit, keyboard focus trapping, and focus restoration when closing the account dialog.
- Guarded profile refreshes so a slower response from an earlier session cannot overwrite the currently active account view.
- Added browser smoke coverage and static regression checks for these UI flows. The automated suite does not send real recovery email or validate Supabase's dashboard redirect allowlist; these remain owner-controlled checks.
