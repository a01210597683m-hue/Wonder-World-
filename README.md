# WonderWorld

WonderWorld is a mobile-first 3D life-simulation game prototype built with the PlayCanvas Engine for browsers.

## Run the prototype
The site is configured for automatic deployment to GitHub Pages through the workflow in `.github/workflows/deploy-pages.yml`. Every push to `main` triggers a deployment. The GitHub Pages site URL is:

`https://a01210597683m-hue.github.io/Wonder-World-/`

The page loads the PlayCanvas Engine from a pinned CDN version. Opening `index.html` directly as a `file://` URL may not work in every browser.

## Current prototype
- Basic 3D environment with ground and directional lighting.
- Placeholder character and follow camera.
- Keyboard controls (WASD / arrow keys).
- On-screen touch buttons for mobile.
- An in-game "مراجع الشخصيات" panel that automatically lists image files in the public Supabase Storage bucket under the `characters/` folder.

## Character reference images
The panel lists supported image files currently present in this Supabase Storage folder:
- `Wonder World Game/characters/IMG-20261018-WA0015.jpg`
- `Wonder World Game/characters/IMG_d1d9c8b3-b7c7-4700-87b4-a4099590ab92.jpg`
- `Wonder World Game/characters/IMG_eec0ba1a-c1d6-4a45-8698-02aeb0ad9f08.jpg`

These are visual references only. They are not 3D character models and do not automatically create playable characters. Keep the semi-realistic and anime styles distinct when creating the final character models.

## Main files
- `index.html` — web page, reference panel, and PlayCanvas import map.
- `main.js` — 3D scene and player controls.
- `style.css` — responsive HUD, reference panel, and mobile controls.
- `.github/workflows/deploy-pages.yml` — automatic static-site deployment.
- `ROADMAP.md` — development plan.

## Important integration note
This repository is the source code for a browser-based PlayCanvas Engine prototype. It is not a PlayCanvas Editor project export and is not automatically synced to a separate PlayCanvas Editor scene. The web prototype and its hosting are connected through GitHub; its three reference images are loaded directly from Supabase Storage. Adding a new image to `Wonder World Game/characters/` in Supabase Storage should make it appear in the reference panel automatically. A narrowly scoped Storage policy allows anonymous clients to list image filenames only in that folder; the bucket objects themselves are public as configured.

Do not commit service-role keys, passwords, or other secrets. Keep Row Level Security enabled.

## Careers and player-owned shop prototype
The careers panel includes three selectable job tracks (café, store, and delivery coordination), repeatable paid shifts, job experience, a player-owned storefront, shop decoration, stock deliveries, customer orders, business reputation and level upgrades, additional shelves, a daily marketing action, a once-per-local-day three-order contract, and progress badges. The storefront is linked to the 3D neighborhood and its sign/visible stock react to local business state.

Career and business progress is stored locally and, when signed in, synchronized to the private `player_career_saves` row for that account. This is prototype-only client-controlled state, not secure multiplayer progression, a trusted wallet, or real money. Browser and Android gameplay verification is still required.



## 2026-10-21 development note
- Connected the purchased player-owned storefront to a proximity interaction at its in-world entrance; activating it opens the existing careers/business management panel.
- Added a static regression assertion to guard this world-to-business interaction wiring.
- Remaining validation: run the GitHub Actions checks, then verify the interaction in a real browser and on Android. Career balances and business progression remain prototype state, not server-authoritative multiplayer economy.


## Static regression checks
Run `node scripts/check-game.mjs` from the repository root to verify that core scene wiring, touch controls, social consent, pet care, career progression, and responsive styles are present. These are static checks, not a substitute for browser, Android, or deployment testing.

## Board games
The game now includes a local Ludo-vs-CPU prototype and a two-side chess move-practice board. Ludo includes dice, captures and finish rules; chess supports basic piece movement and captures but does not yet enforce check, castling, or en passant. Test touch controls on a real phone before treating these prototypes as production-ready.


## Player career saves — 2026-10-21
- Fixed the career module's missing local persistence function, so job and business progress is stored in localStorage again.
- Added private per-account cloud saves for the career/business demo using the `player_career_saves` table and row-level security (RLS). Signed-in players can access only their own row.
- Cloud-saved career credits and business state remain prototype data controlled by the client. They are not authoritative wallet currency, purchases, or anti-cheat-secure progression.
- Restored mobile browser zoom accessibility in the viewport settings.


## Full game progression cloud saves — 2026-10-21
- Added a private `player_game_saves` row per authenticated player with RLS policies for select/insert/update/delete restricted to `auth.uid() = player_id`.
- The game syncs levels and XP, prototype coins, happiness/energy, daily quests, wardrobe ownership/equipment, NPC relationships, pet ownership/care/names/supplies, adventure history, and selected mini-game records/login streaks. Local storage remains the fallback when signed out or when the network is unavailable.
- Completing all four daily objectives now also grants 10 XP, in addition to the existing coin and happiness reward.
- Cloud saves are persistence, not anti-cheat protection: prototype currency and progress are still client-controlled. The cloud round-trip and cross-account isolation still need real signed-in browser testing.


## Automated browser smoke tests
GitHub Actions now installs a pinned Playwright version and runs Chromium with software WebGL before deployment. The smoke suite opens the mobile viewport and exercises the 3D canvas, touch controls, careers/business panel, a football shot, the 16-card memory board, and the account dialog. These checks catch basic runtime/UI regressions; they do not replace real-device Android testing, visual QA, secure purchase testing, or full production gameplay acceptance.


## Secure cloud wardrobe economy — 2026-10-21
- Added a Supabase migration for a server-validated virtual wallet, private daily reward claims, and an append-only transaction history with owner-scoped read access.
- Seeded the seven existing wardrobe items into the database catalog. Signed-in players can claim 10 virtual coins once per UTC day and purchase catalog items through authenticated Postgres RPCs; balance checks, deductions, ownership inserts, and transaction logging run in a single database transaction.
- The signed-in wardrobe UI uses the cloud wallet path rather than the local-only checkout. Signed-out play retains the existing local prototype economy and is explicitly labeled as device-local.
- This hardens the wardrobe purchase path only. Other gameplay rewards, career/business balances, paid-money checkout, and overall progression still require their own server-authoritative implementations and end-to-end authenticated testing. No real-money payment processing was added.


## Football aiming gameplay — 2026-10-21
- Added player-selected left/center/right shot lanes with a visible target marker and mobile-friendly controls.
- Replaced random shot outcomes with a predictable keeper training pattern so goals reward choosing a lane away from the keeper.
- Browser smoke tests now verify aim selection and a deterministic successful shot. This remains a solo training mini-game, not a full team match or advanced football simulation.


## Gameplay polish batch — 2026-10-21
- Fixed the football browser test selector so it matches the actual left-lane control.
- Added keyboard accessibility for football aiming (left/right arrows), shooting (Enter/Space when the panel itself has focus), and restarting (R).
- Prevented global world movement/interact shortcuts from hijacking keyboard activation of buttons and form fields.
- Expanded mobile smoke coverage to finish a full five-shot round, verify score persistence, restart without losing the best score, and test keyboard aiming.
- Added visible keyboard focus and tighter small-screen football controls.


## Mini-game reliability batch — 2026-10-21
- Water Sort now builds a puzzle from a solved state using reversible top-run moves, preserving a known solution path instead of arbitrarily shuffling color units into potentially unsolvable boards.
- Browser smoke coverage now checks Block Blast board size, placement/scoring, best-score persistence and reset behavior.
- Browser smoke coverage now checks Water Sort tube count, a valid pour, move counter, solvable-scramble guidance and reset behavior.
- Refreshed asset cache versions for the gameplay changes.


## Water Sort usability and controls guide — 2026-10-21
- Added one-step undo to Water Sort. Every valid pour snapshots the tube state; undo restores the prior state and decrements the move counter.
- Undo is disabled when no move exists and after a puzzle is completed, preventing reward state from being rolled back independently.
- Updated the in-game guide with mobile controls, WASD, football aiming shortcuts and mini-game pointers.
- Added browser coverage for undo availability, state restoration and reset behavior.
- Refreshed static asset cache versions.
