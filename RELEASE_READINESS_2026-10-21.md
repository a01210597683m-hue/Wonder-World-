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


## Board games batch — 2026-10-21

- Ludo now keeps a local win/loss record and records each completed match once. This is local-device progress, not cloud-synced or tamper-proof.
- Chess practice now supports undoing the most recent move, including restoring the prior board, turn, promotion/capture state, and finished-state snapshot; starting a new board clears undo history.
- Added static regression checks and mobile-browser smoke coverage for the Ludo panel and chess move/undo/reset flow.
- The chess activity remains a move-practice prototype and does not implement complete tournament rules such as check/checkmate, castling, or en passant.

## Water Sort integration batch — 2026-10-21

- Added a Water Sort mode to the existing board-games panel on the feature branch, with six tubes, randomized color distribution, valid pour rules, move count, undo, restart, and win detection.
- Refreshed the board-games module and page cache-busting versions, and corrected the static regression check to assert the exact module URL.
- [ ] Run the repository's automated checks and inspect their results; no successful workflow run is confirmed for this branch yet.
- [ ] Play through valid/invalid pours, undo, restart, and win completion in a real browser and on a physical Android device.
- [ ] Merge and verify the deployed GitHub Pages build only after checks pass.

**Scope note:** this is a small playable puzzle slice, not completion of the full puzzle catalogue or of the broader WonderWorld requirements. This branch is not yet merged or deployed.

## Casual arcade batch — 2026-10-21

- Added a separate casual arcade panel with a playable 12-card memory-pair matching game, move count, match feedback, restart, and a three-cup hidden-star guessing game.
- Loaded the arcade module from `index.html` and added static regression checks for module wiring and both activities.
- [ ] Inspect the pull-request workflow run and confirm syntax, static regression, and browser smoke checks pass; source edits alone do not prove they pass.

- Updated the Pages workflow to run build/regression/browser checks on pull requests and prevent pull-request events from deploying to Pages. Added syntax, static, and browser smoke coverage for the new arcade module; the resulting workflow run must still be inspected before merge.
- [ ] Test on narrow mobile screens and a real Android device, including repeated restarts and rapid card taps.
- [ ] Keep the broader game catalogue, secure cloud persistence, multiplayer consent flows, full football/action modes, production 3D characters, and owner-controlled Supabase security settings marked incomplete until implemented and verified.
