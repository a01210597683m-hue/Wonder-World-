# WonderWorld

WonderWorld is a mobile-first 3D virtual-life simulation game, being built in small, testable milestones.

## Current prototype
- A simple 3D test ground and lighting.
- A placeholder player character.
- Keyboard and on-screen directional controls.
- A roadmap for the next development milestones.

## Open in Godot
1. Import the folder containing `project.godot`.
2. The project files are kept directly in the repository root to make them easier to find on mobile.
3. Open `Main.tscn` and run the project.

This is an initial scaffold, not a finished game. The scene still needs to be tested in Godot on the target phone.

## Main files
- `project.godot` — project settings and startup scene.
- `Main.tscn` — starter 3D scene.
- `player.gd` — basic player movement.
- `touch_controls.gd` — on-screen directional controls.
- `ROADMAP.md` — development plan.

## Safety and backend
Supabase integration will be added after the local prototype is verified. Never commit service-role keys, passwords, access tokens, or other secrets. Keep database Row Level Security enabled and review policies before connecting the game.
