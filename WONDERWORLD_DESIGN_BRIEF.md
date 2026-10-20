# WonderWorld — Master Game Vision

**Status:** Product vision / design requirements. This is the source-of-truth brief for future development, not a claim that every feature is already implemented.

## North-star experience
WonderWorld should make players feel that they are genuinely living inside a wonderful, explorable virtual world. It brings life simulation, branching interactive stories, action, sports, puzzles, fashion, social mini-games, travel, building, and AI companionship together in one coherent game.

## Character art direction
- Target an appealing, Barbie/anime-inspired look that leans somewhat toward human realism while remaining beautiful, friendly, and never uncanny or frightening.
- Use the user's original reference images as the primary visual source. Do not replace them with generic alternatives.
- Preserve two distinct visual styles in the same world:
  1. Semi-realistic characters based on the user's multi-character reference: natural facial features (eyes, nose, lips), convincing skin/hair/clothing detail, appealing proportions, and varied ages.
  2. A separate anime style based on the user's individual anime reference(s), including the black-outfit character reference. Keep the anime identity distinct; do not blend both styles into one.
- Include character choices spanning ages 5–65: children, teens, young adults, adults, women and men, and older adults. The game must be designed for a broad age range, with age-appropriate safety and content controls.
- Offer multiple character appearances and customization choices through free items, in-game currency, and real-money purchases.
- Prior semi-realistic mockups the user rejected are not approved art direction.
- Reference images are design references, not finished 3D models. Production characters need suitable models, rigs, facial/hair/clothing detail, and animation.

## Core world and life simulation
- A large, attractive, explorable world with responsive movement and interactions with people, objects, and locations.
- Spacious, distinctive houses and villas (not only small apartments).
- Ready-to-live-in homes, including free and paid options, for players who do not want to build.
- Optional building mode for players who enjoy designing homes and choosing furniture/decor.
- Pools where characters can enter and swim with natural-looking movement.
- Cafés, restaurants, shops, leisure destinations, orders, jobs, and virtual salaries.
- Drivable cars and aircraft with smooth, responsive controls and appropriate environments.
- Fashion, makeup, accessories, vehicles, homes, furniture, and other items can have free, virtual-currency, and real-money options.

## Game modes and activities
1. **Life simulation:** movement, object interaction, jobs, earnings, venues, homes, transport, and everyday activities.
2. **Interactive stories:** branching choices inspired by decision-based story games; each situation should offer multiple responses, with choices changing outcomes where appropriate.
3. **Action/combat:** battle-royale-inspired combat, shooting, and boxing as a dedicated mode with age-appropriate design and safety boundaries.
4. **Sports:** football/soccer, gym and other sports with real player control and responsive gameplay, not merely passive animations.
5. **Puzzles and casual games:** block puzzles, water-sort puzzles, billiards, rope untangling, arrow/logic puzzles, match-3/candy-style puzzles, space-shooter gameplay inspired by classic arcade games, and other brain games.
6. **Party/board mini-games:** cup-based party games, Ludo-like games, and other social mini-games.
7. **Fashion and beauty:** clothing, makeup, accessories, and runway competitions for male and female characters with ratings/results.
8. **Building and decoration:** optional creative mode, separate from ready-made homes.

These are intended product modes. Each must be built and tested as a genuinely playable experience; listing a mode or displaying a button does not count as implementation.

## Communication and AI
- No player-to-player chat, free-text messages, or direct communication channels between players.
- Social interaction should use curated, context-sensitive response options; offer several choices for the same situation, similar to interactive stories.
- Emoji reactions may have optional sound effects.
- The only free-form conversational feature is a dedicated AI chat area where players can talk, joke, and ask for advice.
- AI interactions must remain respectful and age-appropriate, with clear safety boundaries and protections for younger users.
- Build privacy into the architecture so chat cannot be reintroduced through a side channel.

## Economy and owner monetization
Plan multiple sustainable revenue streams for the game owner:
- Real-money in-game purchases for selected avatars, cosmetics, clothing, makeup, accessories, homes, decor, vehicles, aircraft, and content.
- Virtual-currency purchases earned through gameplay and/or purchased through approved payment systems.
- Optional subscriptions or premium memberships.
- Optional rewarded ads and carefully placed advertising where permitted.
- Paid content packs, story content, activities, and other expansions where appropriate.
- Maintain meaningful free content and disclose prices clearly. Use platform-approved payment systems, parental controls, privacy protections, anti-fraud controls, and legal compliance. Revenue is a design goal, not a guaranteed outcome.

## Technical delivery principles
- Keep the browser-based PlayCanvas prototype, GitHub Pages deployment, and Supabase backend aligned with this master brief.
- Treat the existing prototype as an early foundation, not the completed game.
- Use Supabase for appropriate persistent data such as profiles, progress, inventories, virtual wallets, catalogs, and future systems, with row-level security and server-side validation.
- Never put Supabase service-role/secret keys in browser code. Do not trust client-side currency balances or purchase claims.
- Implement real-money payments and valuable currency changes through trusted server-side flows and verify transactions.
- Protect all players, especially children; minimize personal data and apply age-appropriate safety, privacy, moderation, and purchasing controls.
- Build in stages: playable core movement/world first, then high-quality characters and customization, life-simulation systems, individual mini-games, stories, AI chat, commerce, security, and optimization.
- Do not create new images unless the user explicitly asks. Keep original user-provided character references as the visual authority.

## One-sentence promise
**WonderWorld is one beautiful, interactive world where people can live, explore, build, travel, compete, play, tell stories, and personalize their experience—with safe AI conversation, no player-to-player chat, and a sustainable monetization system.**


## Expanded additions — 2026-10-20 (additive; do not replace earlier requirements)

These requirements extend the existing WonderWorld vision. They do not cancel, narrow, or replace any previously recorded requirement.

### Cross-country travel and transport services
- Let characters travel between countries and destinations, not only move around one neighborhood.
- Travel options should include player-owned vehicles and vehicles obtained free, with virtual currency, or through real-money purchase where permitted.
- Include on-demand transport inspired by ride-hailing: request an available car, aircraft, or train service, choose a destination, and travel there with clear pricing, timing/availability, and smooth transitions.
- Include trains alongside cars and aircraft. Each transport type should have appropriate controls, routes, interiors/boarding interactions where feasible, and travel destinations.
- Transport ownership, rentals/ride requests, fares, routes, and paid purchases must be separate systems with transparent prices and server-side validation for valuable transactions.

### Player-owned businesses and careers
- Support two distinct career paths: working for an employer at existing venues for virtual wages, and owning/running a business.
- Players who want their own business should be able to acquire an empty plot or suitable commercial property using eligible free options, virtual currency, or real-money purchase where permitted.
- Owners can arrange and decorate the space, choose the business type and layout, stock/select products or services, set up customer interactions and orders, and operate the venue as an interactive gameplay loop.
- Businesses should be able to earn in-game revenue through simulated customers, services, and activities. Keep business earnings distinct from real-money monetization; any real-money sale, payout, or cash-out would require a separately designed compliant system and must not be implied by virtual earnings.
- Continue supporting conventional jobs, shifts, and virtual salaries for players who prefer working for another character or organization.

### Social life without player-to-player chat
- Characters who become friends through context-sensitive, preset/generated-in-context response choices can organize family gatherings, house parties, dinner parties, outings, and group activities at homes or public venues.
- Use NPC schedules, invitation/attendance choices, emotes, animations, group activities, and optional sound-enabled emoji reactions to make gatherings feel alive.
- Never add direct player-to-player text chat, voice chat, private messages, or a side channel that bypasses the no-chat rule. Social situations use several curated response choices per context, with outcomes influenced by choices where appropriate.
- The only free-form conversation remains the separate AI chat area, with respectful advice, joking, and conversation under strong age-appropriate boundaries and child-safety protections.

### Enjoyment, immersion, and healthy engagement
- The overall goal is a large, coherent 3D world that feels lively, surprising, varied, and worth returning to—not a repetitive list of buttons or empty buildings.
- Make the experience engaging through meaningful choice, discovery, varied playable activities, expressive animation, responsive controls, progression, social events, and player-created businesses.
- Aim for sustained enjoyment without manipulative or exploitative engagement loops, especially for children. Include sensible breaks, transparent purchases, age-appropriate limits, and fair free-to-play options.

### Monetization expansion and safeguards
- Keep all earlier monetization plans and add the transport and business systems to the catalog: free, virtual-currency, and eligible real-money tiers for vehicles, rides, travel-related content, plots, commercial spaces, upgrades, cosmetics, homes, decor, and activity/story packs.
- Preserve multiple potential owner revenue streams: eligible direct purchases, virtual-currency sales, optional subscriptions, optional rewarded ads/ads where permitted, and paid content/expansions.
- Do not promise or guarantee revenue. Use platform-approved payment systems, clear pricing, parental controls, refund/compliance handling, anti-fraud checks, and server-side verification. Never trust client-side balances or expose secret keys.

### Delivery rule
- These are product requirements, not claims of implementation. Build and test each system in stages; the current browser prototype is not yet a finished 3D/4K world, and documentation updates do not mean that travel, business ownership, group gatherings, production-quality characters, or real-money monetization are already playable.


## Explicit reaffirmation — action, puzzles, group games, and safe AI (2026-10-20)

This section is additive. It reaffirms requirements already present elsewhere in the brief and makes the user's requested boundaries explicit; it does not claim that the systems are implemented.

### Action / battle-royale-inspired mode
- Preserve a dedicated action mode inspired by PUBG-style battle royale, including responsive movement, aiming/shooting mechanics, combat encounters and boxing/melee gameplay.
- Treat this as a distinct playable mode inside WonderWorld, not the whole game. Keep the implementation age-appropriate and apply the user's safety/content boundaries; do not portray this as finished until it is implemented and tested.

### Puzzles, thinking, arcade, and group games
- Preserve a broad selection of genuinely playable activities: Block Blast-style block puzzles, Water Sort, billiards/pool, rope untangling, arrow and logic puzzles, Candy Crush-style match-3, space/rocket arcade shooting, and additional brain/strategy games.
- Preserve group and party play such as Ludo-like board games and other casual social mini-games, plus sports and fashion/runway competitions. These are intended as actual interactive games with controls, rules, win/loss states and tested outcomes—not merely decorative panels or buttons.
- Keep the existing interactive-story/Decision-like branching choices as a separate activity type.

### Friendly AI companion and content boundaries
- Provide a dedicated, friendly, warm, humorous AI companion that people can talk with naturally about everyday topics, jokes and laughter, real-life questions, reasonable advice, and practical help across a wide range of subjects.
- The AI should be kind, respectful, sensible, and clear about uncertainty; it should not pretend to be a human or replace qualified emergency/professional help when that matters.
- Apply robust age-appropriate safeguards and block or redirect sexual/explicit content; graphic or harmful violence involving killing, hitting/assault, threats, or glorification of harm; and religiously abusive content such as blasphemy, mockery, or insults targeting any religion or faith. Apply the religious-respect rule consistently across religions, not selectively.
- Do not turn this into a blanket ban on a person's harmless everyday conversation: keep responses neutral and respectful, and safely redirect requests that cross the boundaries. Protect children and user privacy.
- The AI chat is the only free-form chat area. No free-text or voice chat, private messages, or side-channel communication between players. Social play outside AI chat uses curated, context-sensitive response choices and suitable emotes.

**Implementation status:** these are design requirements. The existing quick-puzzle panel is only an early prototype; the PUBG-inspired mode, full puzzle catalogue, polished group games, and production-safe AI companion still require implementation, safety testing, and gameplay testing.


## Non-negotiable continuity rule — preserve the complete vision

- The entire WonderWorld vision across all user conversations and all dated additions is cumulative and additive. No earlier feature, detail, constraint, reference image, safety boundary, art direction, game mode, economy requirement, or platform requirement may be silently removed, forgotten, replaced, or treated as superseded by a newer addition.
- New requests must be appended or reconciled as additional requirements. If two requirements genuinely conflict, document the conflict and ask the user before changing either; never silently choose one and discard the other.
- Keep this brief as the canonical product-vision record and keep the roadmap aligned with it. Supabase's master vision record must preserve prior JSON fields while adding new fields. GitHub Pages is the deployed playable application, not a substitute for implementation: each requirement must be built and tested in the app before being called playable or complete.
- Any summary must explicitly preserve the full breadth of the vision; a short summary is not permission to drop details.
