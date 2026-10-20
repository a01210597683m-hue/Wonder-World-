# WonderWorld — Additive Requirements Confirmation (2026-10-20)

**Status:** Cumulative product requirements only. This document does not claim that these systems are implemented, playable, deployed, or tested.

This is an additive companion to `WONDERWORLD_DESIGN_BRIEF.md` and `ROADMAP.md`. Nothing here removes, replaces, or narrows earlier WonderWorld requirements. If any details appear duplicated, treat them as reaffirmed priorities.

## North star
Create a large, beautiful, immersive 3D×4K WonderWorld where players feel as though they are living inside a vibrant world. Variety, responsive movement, meaningful choices, polished animations, and satisfying progression should make it fun—not manipulative or exploitative.

## Characters and age-appropriate design
- Include character options across ages 5–65 and a broad range of genders and life stages.
- Keep the two approved art directions distinct: (1) attractive, friendly Barbie-like characters leaning toward human realism, following the user's original multi-character visual reference; and (2) a separate anime style following the user's original anime reference.
- Characters should look appealing and natural, never frightening, uncanny, or grotesque. The user's original reference images remain authoritative; rejected mockups and generic replacement designs are not approved.
- Provide varied selectable appearances and outfits, with free, virtual-currency, and real-money tiers where permitted.
- Context-aware wardrobe changes should fit the current activity and location: everyday, home, work/uniform, gym, football kits, action-mode gear, swimwear, travel, formal events, parties, and runway/fashion events.
- Include makeup, accessories, fashion contests, and runway competitions for male and female characters with fair ratings.

## Required playable game modes
- **Life simulation and branching stories:** interactive choices with multiple responses per situation and outcomes that can change based on choices.
- **Dedicated battle-royale/action mode:** PUBG-inspired third-person movement and match flow, including aiming, shooting, weapon handling, reloading, health/armor, equipment/loot, combat encounters, melee/boxing, and match outcomes. Use WonderWorld's own characters, clothing, maps, UI, and assets; do not copy proprietary PUBG assets.
- **Football/soccer:** a genuinely playable PC/console-style experience with teams, team selection, kits, a pitch, kickoff, match clock, score, ball physics/collisions, passing, shooting, tackling/interception, goalkeeper/opponent behavior, player positioning/switching, responsive controls (keyboard/gamepad and mobile as supported), and replay/rematch. A static ball or decorative football button is not sufficient.
- **Sports and gym:** interactive movement and activity, not just decorative venues.
- **Puzzle and arcade catalogue:** Block Blast-style blocks, Water Sort, billiards/pool, rope untangling, Arrows/logic puzzles, Candy Crush-style match-3, a classic-inspired space/rocket shooter, brain games, Ludo-like board games, cup-based games, Sparkly Party-style party activities, and more group mini-games.
- **Fashion and competitions:** playable styling and runway/contest loops with judging and ratings.

## Social interaction and communication boundaries
- No player-to-player free-text chat, voice chat, direct messages, or side-channel communication anywhere in the game.
- NPC/player-character social scenes must use contextual preset or generated choice menus, with several suitable responses per situation. Emoji reactions may have sound.
- Support two-way home invitations, explicit accept/decline, cancellation/expiry, and either participant ending a visit; never enter another player's home without consent.
- Include sitting together, shared/synchronized TV watching, meals, family gatherings, house parties, dinner parties, and outings at homes and public venues.
- The **only** free-form chat is a separate, age-appropriate AI conversation area for respectful conversation, jokes, questions, and sensible advice, with privacy and safety protections.

## Homes, world, transport, and travel
- Provide spacious, distinctive houses and villas—not only apartments—with ready-to-live-in options across free, virtual-currency, and eligible real-money tiers for people who do not want to build.
- Building, property/plot ownership, decoration, and furniture arrangement remain optional paths, not mandatory prerequisites.
- Include pools with natural-looking swimming, cafes, restaurants, shops, ordering, and leisure venues.
- Include responsive drivable cars, flyable/controllable aircraft, and trains; allow cross-country travel.
- Offer both owned transport and on-demand services comparable to requesting a ride, flight, or train. Clearly show destinations, fares, availability, and whether a vehicle is owned, rented, or requested. Provide free, virtual-currency, and real-money options only where suitable and permitted.

## Work, businesses, and economy
- Support jobs working for an employer or alongside others, including tasks/shifts and virtual wages.
- Separately support player-owned businesses: acquire a suitable empty plot or commercial premises, choose a business type, arrange/decorate it, select products/services, fulfil orders, interact with simulated customers, and earn simulated in-game revenue.
- Virtual earnings are not real-world cash income or cash-out. Any real-money payout system would require separate legal, platform, tax, and fraud review.
- Free, virtual-currency, and real-money options may apply to eligible homes, plots, clothing, makeup, accessories, vehicles, aircraft, transport, decor, and content, with transparent pricing.

## Monetization, safety, and integrity
- Plan sustainable revenue streams for the game owner through compliant optional real-money purchases, virtual currency, premium items/content packs, subscriptions, and ads/rewarded ads where allowed. Revenue is not guaranteed.
- Use platform-approved payment flows, clear prices, purchase confirmations, age/parental safeguards where applicable, refund/compliance handling, and anti-fraud controls.
- Validate wallets, inventory, progression, ownership, and purchases on the server. Never trust client-side balances or expose service-role/secret keys. Keep appropriate Supabase RLS policies enabled.
- Protect children and privacy, maintain age-appropriate content boundaries, and avoid pay-to-win, gambling-like monetization, manipulative engagement loops, or pressure to spend/log in.

## Platform and delivery truth
- Keep the GitHub source, GitHub Pages prototype, roadmap, and Supabase records aligned.
- Current project is an early browser-based PlayCanvas prototype. Existing local prototype activities and placeholder geometry are not the finished game.
- A requirement in documentation, a button, a decorative prop, or a placeholder does not count as a completed feature. Each system must be implemented, made playable, and tested.
- Track each item as **implemented**, **partially implemented**, **planned**, or **tested** honestly. Do not claim a deployment, upload, integration, or feature is complete without verification.
- Production 3D characters, full football, battle-royale combat, real multiplayer visits/synchronized activities, controllable transport, cross-country travel, full business ownership, full game catalogue, safe AI integration, and secure server-authoritative commerce remain separate implementation/testing milestones unless verified otherwise.
