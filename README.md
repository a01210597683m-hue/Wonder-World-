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

All balances, ownership, reputation, daily limits, and progress are stored in the current browser's local storage. They are prototype-only and can be reset or edited by the player; they are not synchronized to Supabase, secure multiplayer state, or real money. GitHub Actions checks JavaScript syntax during Pages builds. Browser and Android gameplay verification is still required.



## 2026-10-21 development note
The next integration pass is to connect the player-owned storefront to proximity interactions and add it as a navigation destination. The current storefront, career balances, and progression remain local prototype state until authenticated persistence is integrated and tested.


## Static regression checks
Run `node scripts/check-game.mjs` from the repository root to verify that core scene wiring, touch controls, social consent, pet care, career progression, and responsive styles are present. These are static checks, not a substitute for browser, Android, or deployment testing.
