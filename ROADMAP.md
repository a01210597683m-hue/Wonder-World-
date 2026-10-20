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
