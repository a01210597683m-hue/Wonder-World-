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


## 2026-10-20 — Pet companions, adoption and pet-care economy (additive requirement)

- Add a dedicated pet-care system to WonderWorld without removing or replacing any existing feature.
- Provide a meaningful free adoption path, pets purchasable with earned virtual currency, and optional premium pets purchasable with real money where legally and platform permitted. Free players must still be able to enjoy pet ownership; premium pets must not be required for basic care or progression.
- Planned pet categories may include dogs, cats, rabbits, birds, hamsters and other suitable companion animals. Final species, breeds, art, animation and availability are design choices to be built and tested; assistant image examples are illustrative only, not approved final assets.
- Pet ownership should include naming, following/companionship, age-appropriate interactions, feeding, water, play, grooming, rest, affection/bond progression, and clear wellbeing feedback. Care should be forgiving and enjoyable, never punish players with cruelty, graphic suffering, or manipulative pressure to log in or spend.
- Add a pet shop/adoption centre and optional pet supplies such as food, toys, beds, grooming items, collars, outfits and carriers, with clearly labelled free, virtual-currency and real-money tiers.
- Support safe integration with homes and the wider world: pets can accompany the player in suitable areas and interact with appropriate furniture/objects; add pet-friendly places and activities as the world expands. Multiplayer pet interactions must not create free-text or voice chat between players.
- Protect children and household privacy. Real-money purchases require clear real-currency prices, platform-approved payment flows, purchase confirmation, parental controls where applicable, refund/compliance handling, anti-fraud measures and server-side purchase verification. Never trust client-side balances or expose service-role/secret keys in browser code. No loot-box/gambling mechanics for pets; disclose exactly what is purchased.
- Persist owned pets, pet needs/state, inventory and transactions through secure server-authoritative systems when implemented. The current browser prototype/localStorage must not be represented as secure, multiplayer-persistent or production-ready.
- Status: product requirement only; pet systems, models, animations, adoption, care loops, shop and purchase flows are not implemented until code and tests verify them.


## Home visits and shared living-room activities — 2026-10-20 (additive)

### Bilateral invitations and consent
- Either player can invite a friend to their own home, or request an invitation to visit the friend's home.
- The recipient must explicitly accept before any home entry or visitor movement occurs. Decline, cancellation, invitation expiry, and ending the visit must be supported.
- A walk ending or a player entering their own home must not imply that social interaction is over; home visits are a separate, consent-based activity flow.
- Real visits must be authorized by authenticated identities and server-side checks, with private/restricted realtime synchronization. Never trust a client-only flag or simulated NPC choice as consent from a real player.

### Shared home activities
- Players can sit together on the sofa, watch television together, and select additional home activities through context-appropriate preset choices and emotes.
- Both players' character positions and activity states must synchronize, and either player can end the visit and leave safely.
- Television interaction in the early prototype may be a simple in-game activity; it must not be described as real video streaming or synchronized media playback until those capabilities are built.
- Preserve the no player-to-player free-text or voice-chat rule for all visits and activities.


## Explicit football, action, and context-aware wardrobe requirements — 2026-10-20 (additive)

### Football / soccer — a full playable sports game
- Football must feel like a real PC/console sports game rather than a simple mini-game prompt: two opposing teams, selectable sides, team kits and colors, a proper pitch, kickoff, match clock, scoreline, goals, ball physics, passing, shooting, tackling/interception, goalkeeper and opponent behavior, player switching/positioning, match outcomes and replay/rematch.
- Controls should be responsive on keyboard/gamepad and adapted for mobile touch; camera, animation, collision and ball control must support active play. Add team formation/roles and richer match rules as the mode matures.
- Football kits are part of the outfit-by-context system, separate from everyday clothing and from action-mode equipment.

### Dedicated battle-royale action mode
- Keep a separate PUBG-inspired mode within the broader WonderWorld world. Preserve the familiar genre-level feel of third-person movement, sprinting, crouching and appropriate traversal, aiming, shooting, reloads, weapon handling, health/armor, equipment/loot, combat encounters, safe-zone pressure, match start/end and win/loss.
- Use WonderWorld's own character styles, outfits, maps, interface and original assets; do not substitute unrelated character art or copy proprietary PUBG assets. Target a polished experience that can eventually surpass the inspiration in quality, but never claim that level until implemented and tested.
- Keep the mode age-appropriate with safety controls and clear separation from ordinary social/life-simulation spaces.

### Clothing and appearance adapt to context
- Support clothing presets/categories for everyday life, home/lounge, work uniforms, gym, football kits, action-mode gear, swimming, travel, formal gatherings, parties and runway competitions, plus sensible weather/location options.
- Let players customize within each category and manually change outfits when appropriate. Do not impose revealing or age-inappropriate clothing on younger characters. Preserve free, virtual-currency and permitted real-money tiers with transparent pricing and parental safeguards.

These requirements are cumulative with all previously recorded requirements for homes and shared visits, group events, countries/transport, employer jobs and player-owned businesses, puzzles/party games, two distinct character art styles, AI safety, security and monetization. They are requirements until code and tests prove each feature playable.

### Football implementation stages — 2026-10-20

- The long-term requirement is a genuinely playable football game with teams, team kits, player-controlled movement, passing, shooting, tackles, goalkeepers, match rules, formations, match timer and results, designed for keyboard/gamepad/touch and aiming for responsive PC/console-style play.
- The browser prototype now includes a limited five-shot football drill as a first interactive control milestone. It is not a full football match and does not replace the required team-based mode.
- Keep football as a separate sports mode from the PUBG-inspired action mode; each needs its own gameplay loop and testing.
