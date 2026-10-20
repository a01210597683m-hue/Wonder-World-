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
