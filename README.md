# WonderWorld

WonderWorld is a mobile-first 3D virtual-life simulation game, being built in small, testable milestones.

## Current prototype

The first starter build contains:
- A simple 3D test ground and lighting.
- A placeholder player character.
- Keyboard and on-screen directional controls.
- A roadmap for the next development milestones.

## Open in Godot

1. Download or clone this repository to a device that can open Godot 4.x projects.
2. In Godot, import the folder containing `project.godot`.
3. Open `scenes/Main.tscn` and run the project.

**Note:** This is an initial scaffold, not a finished game. The scene still needs to be tested in Godot on the target phone.

## Project structure

- `project.godot` — project settings and main scene.
- `scenes/Main.tscn` — starter 3D scene.
- `scripts/player.gd` — basic player movement.
- `scripts/touch_controls.gd` — on-screen directional controls.
- `docs/ROADMAP.md` — development plan.

## Safety and backend

Supabase integration will be added after the local prototype is verified. Never commit service-role keys, passwords, access tokens, or other secrets. Keep database Row Level Security enabled and review policies before connecting the game.
