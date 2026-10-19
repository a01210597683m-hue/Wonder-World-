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
- An in-game "مراجع الشخصيات" panel that loads three character reference images from the public Supabase Storage bucket.

## Character reference images
The panel currently reads these known public objects from Supabase Storage:
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
This repository is the source code for a browser-based PlayCanvas Engine prototype. It is not a PlayCanvas Editor project export and is not automatically synced to a separate PlayCanvas Editor scene. The web prototype and its hosting are connected through GitHub; its three reference images are loaded directly from Supabase Storage. Adding a new image to Supabase does not automatically add it to the reference panel yet; the panel currently lists the three known image URLs.

Do not commit service-role keys, passwords, or other secrets. Keep Row Level Security enabled.
