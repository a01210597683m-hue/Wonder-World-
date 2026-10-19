# WonderWorld — Development Roadmap

## Current milestone: playable foundation
- [x] Create the initial Godot project structure in GitHub.
- [x] Add a simple 3D ground, lighting, camera, and placeholder player.
- [x] Add keyboard and on-screen directional controls.
- [ ] Open the project in Godot and verify the scene runs on the user's phone.
- [ ] Replace the placeholder capsule with the first stylized character.
- [ ] Add a follow camera and a small test environment.

## Later milestones
1. Character customization and basic interactions.
2. Houses, furniture, clothing, and a small item catalog.
3. Authentication and player profiles through Supabase.
4. Secure server-side handling for coins, inventory, and progression.
5. Additional activities and social-world features, designed with privacy and safety in mind.

## Important implementation notes
- This repository is the source of truth for project files.
- Do not put Supabase service-role keys or other secrets in the Godot client or GitHub.
- Keep Row Level Security enabled and review policies before connecting the game.
- Build and test one small milestone at a time; do not assume later features are implemented yet.
