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
