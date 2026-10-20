# WonderWorld — PlayCanvas Roadmap

## Source of truth
- [Master Game Vision](./WONDERWORLD_DESIGN_BRIEF.md) — full product requirements, character art direction, game modes, privacy rules, and monetization goals.
- [GitHub Pages prototype](https://a01210597683m-hue.github.io/Wonder-World-/)

## Current milestone: browser-based 3D prototype
- [x] Browser-based PlayCanvas Engine setup and GitHub Pages workflow.
- [x] 3D test ground, lighting, camera, placeholder character, and touch controls.
- [x] Supabase-backed character-reference panel (reference images are not 3D models).
- [x] Prototype curated NPC dialogue with three response choices and relationship/happiness effects.
- [x] Save prototype progress locally: coins, happiness, completed objectives, NPC relationship levels, owned items, and equipped shop items.
- [ ] Test NPC dialogue, mobile layout, and deployment on the target Android phone.
- [ ] Verify the prototype on the target Android phone.
- [ ] Replace placeholder character with production-quality 3D character assets based on the user's original references.

## Product milestones
1. **Core world:** reliable mobile movement, camera, interaction system, and a small but polished explorable neighborhood.
2. **Character system:** separate semi-realistic and anime art directions; ages 5–65; customization, outfits, hair, makeup, accessories, and animation.
3. **Life simulation:** spacious homes/villas, ready-made homes, optional building/decorating, pools/swimming, shops, cafés, restaurants, orders, jobs, and virtual salaries.
4. **Economy and inventory:** server-validated virtual wallets, item catalog, purchases, owned items, free/virtual/real-money item tiers, and transaction integrity.
5. **Vehicles and travel:** responsive car and aircraft controls and suitable world areas.
6. **Playable activity modules:** football/sports, gym, action/combat, puzzles, billiards, arcade space shooter, Ludo/party games, and fashion competitions.
7. **Interactive stories:** branching scenarios with multiple response choices and persistent outcomes as appropriate. (NPC dialogue is currently an early prototype; full story branches and durable outcomes remain future work.)
8. **Safe interaction:** no player-to-player chat or free-text contact; curated response choices and emoji reactions with optional sound.
9. **AI companion:** separate respectful, age-appropriate AI conversation area with privacy and safety protections.
10. **Owner monetization:** approved real-money purchases, optional subscriptions, rewarded ads, and paid content packs where permitted; no guaranteed-revenue assumptions.
11. **Quality and release:** performance, accessibility, security/RLS review, child safety, testing, and store/platform compliance.

## Implementation rules
- A visible button or placeholder is not a completed feature; each mode must be playable and tested.
- Original user-provided character images remain the visual authority. Do not substitute generic references or merge the two styles.
- Keep GitHub Pages, source files, and Supabase aligned with the master brief.
- Never commit passwords, service-role keys, or secret keys. Keep RLS enabled and validate purchases/currency changes on the server.
- The project is currently a browser-based PlayCanvas Engine prototype, not a native Godot project or automatically synchronized PlayCanvas Editor scene.


## 2026-10-20 — Movement polish (prototype)
- Added a simple arm-swing and body-bounce walk cycle to the temporary geometric player avatar.
- Player now turns toward the current movement direction.
- Follow camera eases toward the player rather than snapping instantly.
- Bumped the browser asset version to `20261020-9`.
- Validation note: repository files were updated; the browser runtime and published GitHub Pages build still need an on-device smoke test. These are placeholder-avatar animations, not final reference-matched character art.


## 2026-10-20 — More playable life systems
- [x] Added a Wonder Cafe destination with a repeatable paid order: costs 5 prototype coins and restores happiness and energy.
- [x] Added a community office destination and a quick-work action: earns 12 prototype coins, costs 15 energy, and has a 30-second cooldown.
- [x] Added an energy stat saved locally with the other prototype progress, plus a rest action to restore energy.
- [x] Added a once-per-local-day welcome reward of 5 prototype coins, saved on the current device.
- [x] Added simple cafe/office architecture and a central plaza fountain to the neighborhood.
- [x] Added mobile layout polish and cache-busting version 20261020-10.
- [ ] Smoke-test all new actions and the deployed site on Android; the economy is local-only prototype logic, not server-secured multiplayer or real-money commerce.


## 2026-10-20 — Playable puzzle activity
- [x] Added a quick-puzzle panel with five short fixed-choice questions.
- [x] Correct answers grant 5 prototype coins and 4 happiness, with feedback and a short anti-spam cooldown.
- [x] Added responsive styling and cache-busting version 20261020-11.
- [ ] Validate puzzle interaction and full page runtime in a real browser; rewards remain client-side prototype values.


## 2026-10-20 — Fitness, collecting and daily objective refresh
- [x] Added a Wonder Fitness building with simple visible gym props.
- [x] Added a workout action near the gym: consumes 12 energy, grants 8 happiness and 3 prototype coins, with a 20-second cooldown.
- [x] Added a once-per-day flower gathering action near the park; saves the collected flower count locally.
- [x] Daily quests now reset when the saved calendar date changes.
- [x] Added mobile styles and bumped asset version to 20261020-12.
- [ ] Browser smoke test and deployment confirmation remain outstanding; all balances and inventory in this prototype are local-device values.


## 2026-10-20 — Four-part daily challenge and local calendar handling
- [x] Expanded the daily objective from three to four tasks by adding the once-per-day flower collection goal.
- [x] Increased the full daily challenge reward to 15 prototype coins plus 10 happiness, granted only after all four goals are completed.
- [x] Switched daily quest and flower collection date keys to the device's local calendar date, avoiding UTC-boundary resets that could surprise players.
- [x] Bumped browser cache version to 20261020-13.
- [ ] Smoke-test daily reset, reward-once behavior, and flower collection in a real browser; save data remains local to the device.


## 2026-10-20 — Flower inventory visibility
- [x] Added a persistent flower counter to the main HUD so collected garden items remain visible after leaving the park.
- [x] Bumped browser asset version to 20261020-14.
- [ ] Verify the updated HUD and flower save/restore behavior in a real browser.


## 2026-10-20 — Expanded master vision additions (additive)
- [x] Recorded cross-country travel with cars, aircraft, trains, and on-demand ride services.
- [x] Recorded player-owned businesses/plots as a separate path from employment, with configurable spaces and simulated in-game earnings.
- [x] Recorded family gatherings, house/dinner parties, and outings using preset context-sensitive responses, animations, and optional emoji sounds while preserving the no-player-chat rule.
- [x] Expanded monetization planning across eligible transport, travel, business plots, upgrades, homes, decor, cosmetics, subscriptions, ads, and content packs, with server-side validation and clear pricing.
- [x] Added healthy-engagement requirements: immersive variety and meaningful progression without manipulative or exploitative loops.
- [ ] These are vision/documentation additions only; each feature still needs implementation, age-appropriate design, security review, and playable testing.


## 2026-10-20 — Reaffirmed action, puzzle/group-game catalogue, and AI safety

- [ ] Build a dedicated PUBG-inspired battle-royale/action mode with responsive shooting/aiming and boxing/melee mechanics; age-appropriate and safety-bounded.
- [ ] Expand beyond the existing quick-puzzle prototype into playable block puzzles, water-sort, billiards, rope untangling, arrow/logic puzzles, match-3, space/rocket arcade games, and more brain/strategy activities.
- [ ] Implement and test group/party games such as Ludo-like board games and other casual social mini-games, with real rules, controls and outcomes.
- [ ] Build a warm, friendly, humorous AI companion for everyday conversation, jokes, rational real-life advice and practical help.
- [ ] Enforce AI content safeguards: block/redirect sexual or explicit content; harmful violence including killing, hitting/assault, threats or glorification of harm; and blasphemy/mockery/insults targeting any religion. Apply rules consistently across religions, preserve respectful neutral conversation, protect children and privacy.
- [ ] Keep AI as the only free-form chat area; continue prohibiting player-to-player free-text/voice chat, private messages and side channels.
- [ ] Run gameplay and safety tests before describing any of these future systems as complete. These checklist items are requirements, not claims that the features are already playable.


## Non-negotiable continuity rule

Every feature and constraint from the original WonderWorld concept through all later additions remains in scope cumulatively. Never remove or replace an earlier requirement to make room for a new one. If a real conflict appears, document it and ask the user before changing either requirement. Keep this roadmap aligned with the canonical `WONDERWORLD_DESIGN_BRIEF.md` and preserve existing Supabase master-record fields when appending additions. Documentation is not implementation: GitHub Pages must receive actual code and successful gameplay tests before a feature is described as playable.


## 2026-10-20 — First enterable home interior (prototype)

- [x] Added a separate interior scene for the two existing homes with a living-room sofa and rug, coffee table, bed, bedside table, kitchen counter/cabinets, window and wall decoration.
- [x] House interaction now enters the interior instead of only displaying a placeholder message.
- [x] Added an explicit exit-to-neighborhood control; exiting restores the outdoor entities and the player's saved outdoor position.
- [x] Updated the asset cache version to `20261020-15`.
- [ ] Verify JavaScript syntax, run a real browser smoke test, and test entry/exit plus mobile camera framing on Android.
- [ ] Replace geometric furniture and placeholder avatars with production-quality assets while preserving the user's original character references and separate anime/semi-realistic art directions.

**Scope note:** this is a first functional room-layout prototype, not a finished furnished home system, character-art upgrade, or completed 3D/4K world. It is additive; the outdoor neighborhood and all other roadmap features remain in scope.


## 2026-10-20 — Interactive home furniture (prototype)

- [x] Made the sofa a usable comfort interaction that increases happiness.
- [x] Made the bed restore energy and a little happiness, with a short cooldown.
- [x] Added a kitchen meal interaction that spends 3 prototype coins and restores energy/happiness; insufficient balance is handled without charging.
- [x] Added a read-a-book interaction with a short cooldown.
- [x] Interaction targeting now switches to indoor furniture while inside a home, so outdoor destinations and NPCs cannot steal the interaction.
- [x] Bumped browser cache version to `20261020-16`.
- [ ] Run browser runtime smoke tests for entering/exiting, furniture range, cooldowns, and saved stats; test on Android.
- [ ] Replace temporary geometric furniture and avatars with polished assets based on the user's original references.

**Scope note:** all furniture rewards are local prototype values. This does not yet implement multiplayer synchronization, server-authoritative economy, or final production assets.


## 2026-10-20 — NPC personality profiles and relationship progression (prototype)

- [x] Added distinct, fixed personality descriptions, favorite activities, and welcoming greetings for Layla, Adam, and Nour.
- [x] Added an accessible relationship meter (0–10), relationship-stage labels, and a brief character profile in the existing preset-choice dialogue.
- [x] Kept all player-to-player/free-text chat out of scope; this is curated NPC dialogue, not an open chat feature.
- [x] Bumped browser cache version to `20261020-17`.
- [ ] Smoke-test all three NPC profiles, relationship save/restore, dialogue choices, and mobile panel sizing in a real browser/Android.
- [ ] These NPC bodies remain temporary geometric placeholders and are not final semi-realistic or anime character assets; the original user-provided references remain authoritative.


## 2026-10-20 — Character-specific conversation topics (prototype)

- [x] Replaced generic conversation choices with distinct preset topics for Layla, Adam, and Nour, aligned with each character's personality and favorite activities.
- [x] Kept dialogue curated and choice-based; no free-text player chat or voice chat was introduced.
- [x] Existing relationship progression, local save/restore, happiness rewards, and daily neighbor quest remain in place.
- [x] Bumped browser cache version to `20261020-18`.
- [ ] Smoke-test each NPC's three topics, relationship updates, daily quest, and mobile dialogue layout.
- [ ] NPC models are still temporary placeholders; final visual design must follow the user's original character references and preserve the separate semi-realistic and anime styles.


## 2026-10-20 — Daily NPC relationship reward guard (prototype)

- [x] Persist the local-calendar date of the last rewarded conversation for each NPC.
- [x] Award relationship progress and happiness once per NPC per local day, while allowing later conversations for their character-specific replies without repeat rewards.
- [x] Clamp restored relationship values to the displayed 0–10 range.
- [x] Bumped browser asset version to `20261020-19`.
- [ ] Smoke-test first conversation, repeated same-day conversation, next-day reset, saved progress, and daily neighbor quest on Android.

**Scope note:** this is a client-side prototype anti-farming guard, not a tamper-proof or server-authoritative reward system.


## 2026-10-20 — Relationship-based dialogue unlocks (prototype)

- [x] NPCs with relationship level 4 or higher offer an additional cooperative activity conversation.
- [x] NPCs with relationship level 8 or higher offer an additional neighborhood-adventure planning conversation.
- [x] Unlocks are additive: each NPC's original personality-specific dialogue choices remain available.
- [x] All added choices use the existing preset dialogue safety model and existing once-per-day reward guard; no player free-text or voice chat.
- [x] Bumped browser asset version to `20261020-20`.
- [ ] Test unlock thresholds at relationship levels 4 and 8, dialogue on mobile, daily reward guard, and deployment on Android.

**Scope note:** these are branching dialogue choices, not yet fully simulated co-op mini-games or an implemented adventure mission.


## 2026-10-20 — Player levels and experience progression (prototype)

- Added a visible player level and XP progress bar to the HUD.
- Social choices, puzzles, shopping, café orders, work shifts, workouts, garden collection, rest, and home activities award XP.
- Each level requires more XP than the previous level; leveling up grants 10 virtual coins and a small happiness bonus.
- Player level and remaining XP are saved with the existing local save, alongside current game progress.
- Daily login reward also grants a small XP bonus.
- This is prototype progression stored in browser local storage, not a server-authoritative or anti-cheat-safe economy.
- Build/cache version: 20261020-21. Testing pending.


## 2026-10-20 — Daily quest save reliability fix

- [x] Persist the four daily quest completion flags in the existing local save alongside the quest date.
- [x] Save quest progress immediately after a quest is completed, so the completion state survives a reload even when no later action updates the stats.
- [x] Guard quest completion against unknown keys and direct attempts to set the reward flag; the full-set reward remains controlled by the existing all-quests-complete check.
- [ ] Smoke-test completing one quest, reloading on the same local calendar day, and confirming the completed quest remains marked without duplicate rewards.
- [ ] Verify that changing to a new local calendar date resets daily quests and permits the daily reward again.

**Scope note:** progress remains local to this browser/device and is not a server-authoritative multiplayer save.


## 2026-10-20 — Block Blast mini-game (prototype)
- [x] Add an 8×8 board with tap-to-select pieces and tap-to-place controls suitable for mobile.
- [x] Validate placements against occupied cells and board edges.
- [x] Clear completed rows and columns, award score, coins, happiness and XP.
- [x] Save the best score locally and provide a restart control.
- [ ] Smoke-test on mobile for piece placement, simultaneous row/column clearing, no-move game over, and best-score persistence.
- [ ] Add richer piece previews and sound/animation only after the core rules pass playtesting.

**Scope note:** this is a client-side prototype. Local scores and rewards are not secure/server-authoritative.


## 2026-10-20 — Mobile mini-game layout and Water Sort
- [x] Make Block Blast a fixed, safe-area-aware mobile game window with internal scrolling and a board sized for short screens.
- [x] Add Water Sort with six tubes (four colors plus two empty tubes), tap-to-select/tap-to-pour controls, move count, completion progress, and restart.
- [x] Award a small local prototype reward for solving Water Sort; keep the reward client-side and non-authoritative.
- [x] Style Water Sort tubes and controls for phone and desktop layouts.
- [ ] Verify Block Blast and Water Sort on a physical phone, including short viewport, tube selection, invalid pours, and win detection.
- [ ] Review all other activity panels on mobile for clipped content and reachable close/action buttons.

**Scope note:** the CSS changes are implemented, but physical-device usability still needs hands-on testing. Water Sort puzzle generation is randomized; difficulty balancing and guaranteed progression are future polish.

## 2026-10-20 — Pet companions, adoption and care (additive requirement)

- [ ] Add a pet adoption centre and pet shop; preserve all existing game systems and requirements.
- [ ] Offer three clearly labelled access tiers: free adoption/pets, pets bought with earned virtual coins, and optional premium pets bought with real money where permitted. Keep basic pet ownership and care enjoyable without paying.
- [ ] Plan companion animals such as dogs, cats, rabbits, birds and hamsters; final species, breeds and art need approval/design work and production assets.
- [ ] Implement naming, following/companionship, pet interactions, feeding, water, play, grooming, rest, affection/bond progression and understandable wellbeing feedback.
- [ ] Add pet supplies (food, toys, beds, grooming items, collars, outfits and carriers) with transparent free/virtual/real-money pricing tiers.
- [ ] Integrate pets with suitable homes, furniture, neighbourhood locations and pet-friendly activities.
- [ ] Keep care forgiving and humane: no graphic suffering, cruelty, or manipulative pressure to log in or spend; no pet loot-box/gambling mechanics.
- [ ] Secure persistent pet ownership, care state, inventory and purchases with server-authoritative validation and Supabase RLS. Real-money purchases require approved payment flows, clear real-currency pricing, confirmations, applicable parental controls, refunds/compliance handling and anti-fraud checks.
- [ ] Do not treat localStorage/client-side coins as secure; never expose service-role or secret keys in browser code.
- [ ] Preserve the no-player-to-player-text/voice-chat rule for every pet/social feature.

**Scope note:** this is a product requirement, not an implemented pet feature. The current browser prototype does not yet provide a playable pet adoption, pet-care, or pet-purchase system. Build and test it before marking these tasks complete.

## 2026-10-20 — First playable pet-companion prototype
- [x] Add a pet panel accessible from the expanded action menu.
- [x] Add a free dog adoption plus cat and rabbit options bought with prototype virtual coins.
- [x] Create a simple geometric placeholder pet that follows the player and can be switched between owned pets.
- [x] Add free care actions for food, water, play, grooming and rest, with care meters and bond progression.
- [x] Save owned pets, active companion and care state in the existing local browser save.
- [x] Clearly label real-money premium pets as future work; no real-money payment or checkout is enabled.
- [ ] Test adoption, virtual-coin purchases, companion switching, care meters, save/reload and mobile panel layout in a real browser/Android device.
- [ ] Replace placeholder pet geometry with production pet models, animation and audio; add pet supplies and pet-friendly locations in later milestones.
- [ ] Move ownership, inventory, care state and valuable purchases to secure server-authoritative Supabase flows before multiplayer or real-money release.

**Scope note:** this is an early local prototype. The geometric companion, localStorage inventory and client-side virtual-coin purchases are not secure, synchronized multiplayer, production pet art, or real-money commerce. The pet system is additive; all previous game requirements remain in scope.


## 2026-10-20 — Pet supplies and pet-friendly park activity (prototype)
- [x] Add optional pet supplies with clear virtual-coin prices: extra food (3), toy (5), comfort bed (8), and cosmetic collar (6).
- [x] Persist supply inventory locally and display owned quantities in a simple pet bag.
- [x] Allow food, toy, and bed items to be consumed for small care-meter boosts; free basic care actions remain available.
- [x] Add a pet-friendly activity that requires the player and active companion to be at Friends Park; awards joy, bond, happiness and XP.
- [x] Bump browser asset version to `20261020-31`.
- [ ] Test supply purchases, insufficient balance, inventory persistence after reload, item use, and park proximity on Android.
- [ ] Add production pet models, animation and visuals; integrate pets with more homes and activities.
- [ ] Replace local-only ownership/inventory with secure server-authoritative Supabase persistence before multiplayer or real-money release.

**Scope note:** optional supply purchases and rewards are prototype-only client-side state. The cosmetic collar is tracked in inventory but does not yet change the pet's appearance. Basic pet care remains free; real-money checkout remains disabled.


## 2026-10-20 — World atmosphere, photo memories, and indoor pet bonding
- [x] Add an automatic day/night and dawn/dusk cycle with changing sky tint and sunlight/ambient lighting.
- [x] Add a player-controlled weather cycle (clear, cloudy, rain) with simple falling rain visuals in the outdoor neighborhood.
- [x] Add a fountain photo-memory activity with a once-per-local-day happiness/XP reward and a saved memory counter. This records an in-game memory, not an actual screenshot or uploaded photo.
- [x] Add pet bonding interactions near the living-room sofa and pet rest near the bedroom bed when a companion is active indoors.
- [x] Persist the photo-memory count/date with the existing local save and expose the counter in the HUD.
- [ ] Test day/night readability, rain performance, photo proximity/cooldown, pet furniture interactions, and save/reload on a real phone.
- [ ] Weather, memories, and pet interaction rewards remain client-side prototype behavior; no server-authoritative multiplayer persistence has been added.

**Scope note:** atmosphere uses lightweight prototype geometry and color changes. It is not a finished weather simulation, screenshot/photo capture feature, or final art pass.


## 2026-10-20 — Pet naming and achievement collection
- [x] Allow players to give each owned pet a custom name (up to 18 characters) and save names with local progress.
- [x] Show the chosen companion name in the pet summary and preserve a safe text-only display.
- [x] Add an achievements panel with five progress-based badges: first friendship, first pet, flower collector, first photo memory, and level 3.
- [x] Refresh achievement status as player progress changes; the panel is informational and does not grant paid or random rewards.
- [ ] Test pet naming, switching between named pets, persistence, achievement unlocks, and small-screen panel layout on Android.
- [ ] Names, achievements and progression remain local prototype data until server-authoritative save support is implemented.


## 2026-10-20 — Neighborhood map and adventure journal
- [x] Add an in-game destination panel with quick travel to the plaza fountain, park, shop, café, office, fitness center, and the two home entrances.
- [x] Block fast travel while inside a home and update the player and camera together after destination selection.
- [x] Add a local journal that stores the latest 30 dated activities and records destination visits and fountain memories.
- [x] Persist journal entries in the existing local save and render them as text-only DOM nodes.
- [ ] Test arrival positions, home exit behavior, journal persistence, and mobile layout on Android.
- [ ] The map is a destination list, not a full navigable map; travel and journal remain local prototype features.


## 2026-10-20 — Playable memory-match mini-game

- [x] Add a playable 4×4 memory-card board with eight symbol pairs, tap-to-flip controls, matching logic, move counter, and restart.
- [x] Prevent additional card input while a mismatched pair is briefly revealed, and disable already-matched cards.
- [x] Award a small prototype reward after completing all pairs and add the result to the adventure journal.
- [x] Bump the browser asset version to `20261020-35`.
- [ ] Test card matching, mismatches, rapid taps, restart, reward delivery, and narrow mobile layouts in a real browser/Android.
- [ ] This is a client-side prototype; its coins and XP are not secure or server-authoritative. Do not use it as the basis for competitive multiplayer or real-money rewards.
