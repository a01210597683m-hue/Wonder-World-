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


## 2026-10-20 — Wardrobe clarity and memory-game reward guard

- [x] Group clothing and hair into separate wardrobe sections and show owned/equipped status for each item.
- [x] Display the currently equipped outfit and hair plus collection count, without replacing existing inventory or character reference styles.
- [x] Track the best memory-match move count locally and display it on future rounds.
- [x] Limit the memory-match coin/XP reward to once per local calendar day to reduce trivial repeat farming in this client-side prototype.
- [x] Bump the browser asset version to `20261020-36`.
- [ ] Test the wardrobe purchase/equip flow, memory-game best score and daily reward guard on mobile.
- [ ] Local storage checks are a convenience only; players can modify browser data. Competitive rewards still require server-side validation and authenticated persistence.


## 2026-10-20 — Consent-first shared walks and social outing

- [x] Add a shared-walk panel to invite a neighborhood NPC, with explicit accept/decline choices before companion movement begins.
- [x] Move the accepted NPC alongside the player while exploring; let the player end the walk at any time.
- [x] Track distinct destinations visited together and award a small once-per-local-day outing reward after three places; record activity in the adventure journal.
- [x] Block starting a shared walk indoors and document that real-player consent needs authenticated identities and server-authoritative invite/accept/decline/end states.
- [x] Bump browser asset version to `20261020-37`.
- [ ] Test accept/decline, following, map stops, ending the walk, daily reward, and mobile layout in a real browser.
- [ ] Real player-to-player walking is not implemented yet. It must require both players' explicit consent and must never move a player based on the other player's consent alone.


## 2026-10-20 — Daily login streak and expanded progression

- [x] Preserve the original once-per-day login grant of 5 coins and 5 XP, adding a modest consecutive-day coin bonus capped at 6 extra coins.
- [x] Track a local consecutive-day login streak, resetting after a missed calendar day and avoiding duplicate same-day rewards.
- [x] Expand achievements to include playing a mini-game, completing daily quests, a three-day login streak, and completing a shared-walk outing.
- [x] Show the current login streak in the achievement summary and bump assets to `20261020-38`.
- [ ] Verify day-boundary and storage behavior in browser testing. Streaks and rewards are device-local prototype data and are not server-authoritative.


## 2026-10-20 — Companion outings at the park and café

- [x] Add two location-gated activities during an active consented NPC walk: a park picnic (4 virtual coins) and a café outing (5 virtual coins).
- [x] Require the player to be outdoors, have an active companion walk, and be within the target location before charging coins.
- [x] Give a modest friendship/happiness/XP reward and limit each activity to once per local day per NPC using local-device guards.
- [x] Add responsive activity controls and status feedback to the companion panel; preserve the end-walk action.
- [x] Bump browser asset version to `20261020-38`.
- [ ] Browser-test location gating, insufficient coins, daily limits, and mobile layout. Local-device limits are prototype protections, not server-authoritative anti-cheat.


## 2026-10-20 — Shared fountain memories

- [x] Add a consented-companion photo-memory action available only while a shared walk is active and the player is at the fountain plaza.
- [x] Limit the memory to once per local day per NPC, add it to the adventure journal, and reward +5 happiness and +5 XP.
- [x] Clearly state that this records an in-game memory, not a real camera photo or uploaded image.
- [x] Bump browser asset version to `20261020-39`.
- [ ] Browser-test fountain proximity, once-per-day guard, journal entry, and mobile layout. This local-device guard is not server-authoritative.


## 2026-10-20 — Cooperative companion challenge

- [x] Add a short, accessible cooperative question challenge while an NPC walk is active and the player is outdoors.
- [x] Use three rotating preset questions with retry feedback; no free-text or voice chat is introduced.
- [x] Reward a correct answer with +1 friendship, +4 happiness, and +8 XP, limited to once per local day per NPC on this device.
- [x] Automatically end the NPC walk when entering a home, preventing a stale outdoor companion state indoors.
- [x] Bump browser asset version to `20261020-40`.
- [ ] Browser-test challenge retries, daily guard, and entering a home during a walk. Daily guard remains local prototype logic, not server-authoritative.


## 2026-10-20 — Home TV interaction and bilateral visits

- [x] Add a visible television set and a proximity-based TV interaction inside the home, with a short cooldown, happiness/XP reward, and journal entry.
- [x] Bump browser asset version to `20261020-41`.
- [ ] Add a real home-visit invitation flow: either player may invite the other, or request a visit to the other player's home; no entry before the recipient explicitly accepts.
- [ ] Add invitation states (pending, accepted, declined, cancelled, ended), expiry, duplicate-request prevention, and a clear leave-visit control.
- [ ] Add shared home activities after consent: sit together on the sofa, watch TV together, and additional preset-response activities; use visible synchronized character states rather than text-only claims.
- [ ] Real player visits require authenticated player identities, server-authoritative authorization, private/restricted realtime channels, and server validation. NPC consent is only a prototype simulation and must never be presented as real-player consent.
- [ ] Reconcile the full master vision into a tracked implementation backlog: house/villa ownership and building, pools/swimming, travel between countries, cars/aircraft/trains and on-demand rides, player-owned businesses, all requested puzzle/arcade/party games, sports/action modes, fashion/makeup/runway, branching stories, AI companion safety, production character art, secure economy, payments, subscriptions/ads, and age-appropriate safety.
- [ ] Test TV proximity/cooldown, home enter/exit, journal persistence, and mobile layout on Android.

**Scope note:** TV is a local interaction placeholder, not a real streaming service. Home visits between separate human players and synchronized couch/TV activities are not implemented in this build.


## Full gameplay backlog audit — 2026-10-20 (cumulative, nothing removed)

This audit is an implementation checklist, not a claim that these systems are already playable. A checkbox may be marked complete only after the feature exists in code and has been tested.

### P0 — Core playable sports/action foundations
- [ ] **Football/soccer mode with real gameplay**, not a decorative ball or a menu: two teams, team selection, recognizable team kits/colors, match start/end, goals and score, ball physics, pass, shoot, tackle/intercept, goalkeeper/opponent behavior, responsive player switching/movement, camera and controls suitable for keyboard/gamepad and mobile touch. Target the feel and depth of PC/console football games while developing original WonderWorld art/assets and identity.
- [ ] **Dedicated PUBG-inspired action mode**, separate from everyday life: responsive third-person movement, sprint, crouch/prone where appropriate, jump/vault, aiming, shooting, reload, weapon handling, hit feedback, health/armor, loot/equipment, shrinking safe zone, match start/end and win/loss loop; preserve the familiar genre's control feel and readability while using WonderWorld's own character models, outfits, environments, UI and original assets. Do not copy proprietary PUBG assets or claim feature parity before testing.
- [ ] Build both modes as actual controllable games with keyboard/gamepad and touch layouts; do not count buttons, mockups or passive animations as completion.

### P1 — Life simulation, outfits and social homes
- [ ] Outfit rules by context and location: everyday, home/lounge, work/uniform, gym/sports, football kits, action-mode gear, swimwear for pools, travel, parties/formal events, runway/fashion, and weather/location-appropriate layers; allow manual override and never force a revealing or age-inappropriate outfit.
- [ ] Two-way home invitations/visit requests with explicit accept/decline, cancel, expiry and leave/end controls; real player visits only after authenticated server-verified consent.
- [ ] Synchronized co-presence and activities in a shared living room: sit on sofa, watch TV together, curated reactions/choices, meals, family gatherings, house parties, dinner parties and group outings. No player-to-player free text, private messages or voice chat.
- [ ] Larger homes and villas, ready-made homes, optional building/decoration, furniture placement, ownership/permissions, pools and natural swimming.

### P2 — World scale and transport
- [ ] Distinct destinations and travel between countries; travel UI, destinations, loading/arrival, locale-appropriate environments and progress.
- [ ] Controllable drivable cars and aircraft, train boarding/travel, owned/rented vehicles, and on-demand ride/flight/train requests inspired by ride-hailing. Show destination, price and availability; distinguish ownership, rentals, fares and purchases.

### P3 — Careers, business and economy
- [ ] Jobs working for an employer with shifts, tasks, schedules, wages and progression.
- [ ] Player-owned businesses: acquire a plot/commercial property, choose type/layout, decorate, choose products/services, stock and orders, serve NPC customers, operate a gameplay loop and earn virtual revenue.
- [ ] Server-authoritative accounts, progress, inventory, wallet and transactions; RLS, anti-cheat, verified purchases, transparent prices, parental controls and compliant optional subscriptions/ads/paid packs. Virtual earnings must not be represented as real cash income.

### P4 — Full game catalogue
- [ ] Billiards/pool with aiming, cue power, ball collisions, rules and scoring.
- [ ] Rope untangling, arrow/logic puzzles, match-3/candy-style puzzle, space/rocket arcade shooter, Ludo-like board game, cup-based game and party/group mini-games.
- [ ] Expand sports beyond the gym and football; each mode needs actual controls, rules, scoring and results.
- [ ] Branching interactive stories where choices meaningfully change later scenes/outcomes; separate AI companion chat with age-aware safety and privacy.
- [ ] Makeup, accessories, male/female styling, runway/fashion contests with judging/results and context-aware wardrobe.

### P5 — Production quality, safety and delivery
- [ ] Final character pipeline from the user's original references: beautiful friendly Barbie-like semi-realistic characters with natural facial features/skin/hair and broad ages 5–65; a separate anime style matching the user's liked reference. Never merge the styles or substitute rejected mockups. Include rigs, expressions, hair/clothing detail and suitable animations.
- [ ] Preserve all currently implemented prototype features (NPC relationships, pets/care, shop/wardrobe, homes/interior interactions, map/journal, quests, progression, achievements, Block Blast, Water Sort, memory match, companion walks and activities, weather/day-night controls where verified) while expanding the game.
- [ ] Child protection, age-appropriate content, privacy minimization, accessibility, mobile performance, testing, backups and security review.
- [ ] Test each mode on Android and desktop keyboard/gamepad where relevant; record known limits and never label a feature complete solely because it is documented.

### Current verified scope boundary
The deployed browser build is an early PlayCanvas neighborhood prototype. It has local NPC/pet/life-simulation systems and small playable puzzles, plus a simple local TV interaction. It does **not** yet have real-player multiplayer visits, synchronized shared TV, football matches, PUBG-like combat, drivable vehicles, inter-country travel, player-owned businesses, the full puzzle/party catalogue, production character models, or secure server-authoritative economy/authentication. These are retained as required future work, not dropped ideas.

## 2026-10-20 — First playable football shooting drill

- [x] Add a controllable football shooting challenge with player movement, ball proximity/dribbling, goalkeeper positioning, five attempts, score, restart, best score saved locally, XP/happiness rewards and journal logging.
- [x] Add touch controls for mobile and a clear in-game note that this is a training prototype, not the full team sport.
- [x] Bump browser asset version to `20261020-42`.
- [ ] Build the requested full football mode: teams with kits, kickoff, passing, dribbling, tackles, goalkeeper AI, fouls/rules, match timer, scoreline, formations, opponent AI, gamepad/keyboard/touch controls, and complete match flow comparable in feel and responsiveness to PC/console football games.
- [ ] Continue the independent PUBG-inspired action mode with responsive movement, aiming, shooting, safe age-specific design, maps, opponents, and full round rules; never present the football drill as satisfying this requirement.

**Scope note:** the new drill is playable locally and does not provide full team matches, online multiplayer, realistic animation, or console-grade gameplay yet.


## 2026-10-21 — Full progression persistence pass

- [x] Add private per-player `player_game_saves` storage with row-level security and owner-only read/write policies.
- [x] Sync the existing life-simulation save: XP/level, prototype coins, happiness/energy, daily quests, owned/equipped wardrobe items, NPC relationship values, pets and their care/names/supplies, and the adventure journal.
- [x] Include selected local records (football, Block Blast, memory-match bests, login streak, daily reward markers, and shared-walk reward marker) in the per-account snapshot.
- [x] Add a visible cloud-save status in the in-game HUD and preserve local storage as the offline/signed-out fallback.
- [x] Add 10 XP to the reward for completing all four daily objectives.
- [ ] Validate cloud save/load, sign-out/sign-in restore, and account isolation in a real browser session.
- [ ] Validate the updated deployed build and all touch controls on the target Android phone.

**Scope note:** cloud saves preserve prototype progress but do not make client-controlled currency or rewards cheat-proof. The full football match, action mode, vehicles, multiplayer, final 3D characters, Android package, ads, and purchases remain separate unfinished milestones.


## 2026-10-21 — Release completion plan (honest feature gates)

This plan separates verified prototype functionality from production features. A checkbox may be marked complete only after implementation and a relevant test.

### Gate A — Stabilize the playable browser build
- [x] Keep the GitHub Pages deployment workflow enabled and confirm a successful deployment run.
- [x] Run static gameplay and asset integration checks during each deployment.
- [x] Preserve local progress and provide account-scoped cloud-save storage with row-level security.
- [ ] Exercise signed-in save/load, offline fallback, account switching, and save restoration in a real browser session.
- [ ] Complete an Android touch-control and layout pass; fix all critical runtime errors and document any unsupported device/browser.
- [ ] Verify that character-reference images load from the expected Supabase Storage paths on the deployed domain.

### Gate B — Finish one complete gameplay loop before expanding the catalogue
- [ ] Add a proper new-player onboarding flow, controls/help, pause/resume, settings, and a reliable return-to-world path.
- [ ] Complete one end-to-end football match mode: teams, kickoff, player switching, passing, shooting, goalkeeper/opponent AI, timer, scoreline, match end, rewards, and restart.
- [ ] Complete one polished social/life loop from quest acceptance through interaction, reward, save, reload, and reward-history verification.
- [ ] Add repeatable automated tests for progression rewards, duplicate-claim prevention, invalid state, and interrupted sessions.

### Gate C — Expand content and production systems
- [ ] Build the action mode as its own complete game loop, with age-appropriate content and responsive touch controls.
- [ ] Implement vehicles and travel with actual movement, destinations, transitions, and collision handling.
- [ ] Implement player visits and shared activities with authenticated sessions, server validation, moderation/reporting, and disconnect handling.
- [ ] Finish homes/interiors, business simulation, fashion, sports, puzzle and party-game catalogue with complete controls, scoring, results, and persistence.
- [ ] Replace placeholder 3D assets with properly licensed, rigged and optimized character/environment assets guided by the supplied reference images.

### Gate D — Production release and safety
- [ ] Make inventory, rewards, progression and currency-changing actions server-authoritative before competitive multiplayer or purchases.
- [ ] Complete Supabase security/performance review, backup/restore testing, rate limits, and privacy/retention controls.
- [ ] Run browser/device compatibility, accessibility, performance, and regression suites; test on a physical Android device.
- [ ] Prepare Android packaging, application ID, signing, store listing, privacy disclosures and release testing.
- [ ] Add ads or in-app purchases only after provider setup; verify purchases server-side and keep them disabled until compliance checks pass.

**Release rule:** the game is not considered finished until each required gate has implementation evidence and runtime test results. GitHub Actions success verifies the configured build/static checks and deployment steps; it does not prove every gameplay feature works or that cloud synchronization has passed live end-to-end tests.


## 2026-10-21 — Browser runtime regression gate
- [x] Added a Playwright Chromium smoke test using software WebGL in GitHub Actions.
- [x] Verify the page mounts the PlayCanvas canvas and mobile touch controls.
- [x] Exercise the careers/business dialog, a football shot, memory-match board rendering, and account dialog open/close.
- [x] Fail the build on uncaught browser JavaScript exceptions during the smoke flow.
- [x] Confirmed the new browser job passes in GitHub Actions (run 254: https://github.com/a01210597683m-hue/Wonder-World-/actions/runs/39528034220).
- [ ] Perform real Android-device checks for touch responsiveness, frame rate, cloud-save round trips, and account switching.

This adds a basic runtime regression gate; it does not mark the full product vision complete. Production character models, full football/action modes, transport and country travel, building/swimming, social visits and parties, AI chat safeguards, secure server-authoritative economy, monetization, and store release work remain distinct acceptance items in the master vision.


## 2026-10-21 — Secure wardrobe economy slice
- [x] Added server-side wallet initialization for the authenticated player.
- [x] Added a once-per-UTC-day +10 virtual-coin claim protected by a unique player/date claim key.
- [x] Added a database-transactional wardrobe purchase RPC: server-side price lookup, row-locked balance check/deduction, owned-item insert, and transaction ledger entry.
- [x] Added owner-scoped RLS for transaction history and daily claims; anonymous users cannot execute the economy RPCs.
- [x] Connected the signed-in wardrobe UI to the cloud wallet and catalog, and blocked its signed-in local-only checkout fallback.
- [x] Seeded the seven existing wardrobe items into the catalog and added regression checks.
- [ ] Verify real signed-in account purchase, insufficient-funds, duplicate-purchase, daily-claim-once, and cross-account isolation flows in browser tests.
- [ ] Apply the same server-authoritative design to career income, other gameplay rewards, business balances, and any future real-money purchases. These are not covered by the wardrobe economy slice.

## 2026-10-21 — First home, avatar, and vehicle gameplay slices
- [x] Expanded procedural 3D characters with visible eyes, pupils, nose, smile, legs, shoes, recolorable hair fringe, and alternating leg/arm movement.
- [x] Added a controllable low-poly car using the same keyboard and touch movement controls, with a clear enter/exit state.
- [x] Added a visible backyard swimming pool and a pool interaction that adjusts the prototype's happiness/energy and records progression.
- [x] Added a home exterior design panel for facade color, roof color, and garden shrub visibility; preferences persist locally on the device.
- [x] Added a bounded Wonder guide with five prewritten, age-safe help topics; free-form chat and external AI inference remain disabled until a moderated server-side AI integration is ready.
- [x] Added static regression checks and mobile-browser interaction coverage for the car and home builder.
- [ ] These are prototype slices, not final licensed rigged character models, a complete vehicle fleet, country travel, full house construction/interior editing, or multiplayer swimming.
- [ ] Validate the new interactions on a physical Android device and review actual reference images side-by-side before claiming visual parity.


## 2026-10-21 — Server-authoritative career rewards
- [x] Added server-priced cloud-wallet career shift rewards for the three known job types, with authenticated RPC access, a daily cap of 10 claims, and a transaction ledger entry per accepted shift.
- [ ] Extend server-authoritative accounting to business premises, stock, expenses, order payouts and business daily contracts; the shop/business simulation's workCredits still remain local prototype data.
- [ ] Run live authenticated tests for shift reward caps, account isolation, wallet refresh and failed-network behavior.


## 2026-10-21 — First cross-country travel prototype
- [x] Expanded the explorable ground and movement bounds so destinations can sit beyond the original neighborhood.
- [x] Added three separated low-poly destination areas: Egypt (stepped pyramids and sphinx silhouette), Paris (Eiffel-inspired tower), and Tokyo (torii gate and cherry-blossom garden).
- [x] Added the destinations to the in-game fast-travel list and browser smoke coverage for arrival in two countries.
- [ ] Replace instant map teleportation with transport selection, routes, fares, and aircraft/train/car travel.
- [ ] Replace primitive landmarks with detailed, optimized country environments and mobile-device performance testing.
- Note: this is a local prototype travel layer. It does not yet simulate real country-scale maps, actual vehicles between countries, or persistent multiplayer travel.


## 2026-10-22 — Explicit mode identity and delivery gates (additive)

The full requirements are in [Master Game Vision](./WONDERWORLD_DESIGN_BRIEF.md), including the new per-mode specification. This roadmap is a delivery plan, not a claim that listed future systems are already playable.

### Required implementation order
1. **Verify the current build and account isolation:** confirm the latest password-recovery deployment, then test that sign-in/sign-out/account switching cannot mix local and cloud progress. Preserve the existing local save and private per-player cloud save behavior.
2. **Build a reliable playable foundation:** character controller, camera, interactions, scene loading, input abstraction for touch/keyboard/gamepad, save/load boundaries and performance budgets on Android.
3. **Character and context-specific wardrobe:** replace the temporary placeholder with rigged, animated characters grounded in the user's original references; preserve separate semi-realistic and anime styles and ages 5–65. Implement wardrobe presets per activity and age-safe restrictions.
4. **Complete one signature mode at a time:** first football match loop (teams, pitch, ball physics, controls, clock, score, goals, keeper/opponents, result/rematch); separately plan the battle-royale mode with original WonderWorld assets and its own controls/HUD/map. A football shooting drill is not a complete match; a combat panel is not a battle-royale game.
5. **Fashion and makeup competition loop:** theme/brief, wardrobe/makeup, runway, judging, scoring, rewards and replay.
6. **Independent casual-game catalogue:** implement and test Block Blast, Water Sort, Space Shooter, memory cards, quiz/party, chess, Ludo, dominoes, billiards, arrows, rope untangling, cup games, UNO-style and standard-card games. Preserve no-player-chat rules for every mode.
7. **World life systems:** swimming, usable gym equipment, optional pet care, homes/building, employer jobs and optional businesses; ensure each system has its own environment and loop.
8. **Transport and travel:** owned vehicles and aircraft separate from on-demand rides; airport booking/packing/check-in/boarding/travel/arrival; expand destinations and transport routes beyond teleportation.
9. **Stories, consensual social activities and drawing garden:** branch choices and outcomes across life venues; bilateral consent for visits/walks/group activities; solo/collaborative drawing with moderation and no chat side channel.
10. **AI and language learning:** only after server-side integration, privacy controls and moderation tests; protected age-appropriate AI companion plus a separate multilingual learning flow.
11. **Secure economy and owner monetization:** server-authoritative virtual balances/inventory, audited transactions, approved real-money billing and receipt validation, ads/rewarded ads with provider consent and child/privacy safeguards. Keep group/party games free of monetization placements as requested.
12. **Release readiness:** regression suite, Android device tests, localization, accessibility, security/RLS checks, app-store/legal compliance and transparent disclosure of incomplete features.

### Acceptance gate for every mode
- It has a unique, appropriate scene/interface/controls/art and a complete playable loop.
- Core rules and outcomes work; touch controls and small-screen layouts are tested.
- Persistence and account separation are tested where applicable.
- Safety, age suitability, consent, privacy and no-player-chat rules are verified.
- Any rewards or purchases are server-validated; real-money and ad flows use approved providers.
- The original character/logo/reference assets remain unchanged and are used as the source of truth.
- Mark a milestone complete only after working code and repeatable tests support it. Documentation, a button, a placeholder or a static mockup is not completion.
