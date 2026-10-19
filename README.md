# WonderWorld

WonderWorld is a mobile-first 3D life-simulation game prototype built with the PlayCanvas Engine for browsers.

## Run the prototype
Open `index.html` through a web server or a static-hosting service. The page loads the PlayCanvas Engine from a pinned CDN version. Opening an ES module page directly as a `file://` URL may not work in every browser.

## Current prototype
- Basic 3D environment with ground and directional lighting.
- Placeholder character and follow camera.
- Keyboard controls (WASD / arrow keys).
- On-screen touch buttons for mobile.
- An in-game "مراجع الشخصيات" panel that loads the three reference images from this repository's `assets/characters/` folder.

## Character reference images
- `assets/characters/IMG-20261018-WA0015.jpg`
- `assets/characters/IMG_d1d9c8b3-b7c7-4700-87b4-a4099590ab92.jpg`
- `assets/characters/IMG_eec0ba1a-c1d6-4a45-8698-02aeb0ad9f08.jpg`

These are visual references only. They are not 3D character models and do not automatically create playable characters. Keep the semi-realistic and anime styles distinct when creating the final character models.

## Main files
- `index.html` — web page, reference panel, and PlayCanvas import map.
- `main.js` — 3D scene and player controls.
- `style.css` — responsive HUD, reference panel, and mobile controls.
- `ROADMAP.md` — development plan.

## Important
This repository is the source code for a browser-based PlayCanvas Engine prototype. It is not a PlayCanvas Editor project export and is not automatically synced to a separate PlayCanvas Editor project.

Supabase integration is not configured by this prototype yet. Do not commit service-role keys, passwords, or other secrets. Keep Row Level Security enabled.
