# WonderWorld

WonderWorld is a mobile-first 3D life-simulation game prototype built with the PlayCanvas Engine for browsers.

## Run the prototype
Open `index.html` through a web server or a static-hosting service. The page loads the PlayCanvas Engine from a pinned CDN version. Opening an ES module page directly as a `file://` URL may not work in every browser.

## Current prototype
- Basic 3D environment with ground and directional lighting.
- Placeholder character and follow camera.
- Keyboard controls (WASD / arrow keys).
- On-screen touch buttons for mobile.

## Main files
- `index.html` — web page and PlayCanvas import map.
- `main.js` — 3D scene and player controls.
- `style.css` — responsive HUD and mobile controls.
- `ROADMAP.md` — development plan.

## Important
This repository is the source code for a browser-based PlayCanvas Engine prototype. It is not a PlayCanvas Editor project export and is no longer intended to be opened as a Godot project. The PlayCanvas Editor account/project is separate from this GitHub repository.

Supabase integration should come only after the browser prototype is tested. Never commit service-role keys, passwords, or other secrets. Keep Row Level Security enabled.
