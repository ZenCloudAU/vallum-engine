# Vallum Engine

Solo tabletop story engine for turning original worlds, characters, and campaign notes into playable browser sessions.

Vallum Engine v0.1 is deliberately narrow: a static, no-dependency web app with a sample campaign, top-down map, party tokens, narration, choices, dice rolls, health tracking, procedural ambience, and local save state.

## Product intent

Vallum is not a D&D clone, not a Forgotten Realms adaptation, and not a Warhammer or Final Fantasy derivative. It is an original solo tabletop engine designed to run Phil's own worlds and stories.

The engine is separated from the campaign content. Stories become modules. The runtime reads those modules and presents them as playable tabletop sessions.

## Current release

`v0.1` proves the core loop:

- load a campaign module
- display a top-down route map
- show party tokens
- present GM narration
- offer bounded choices
- roll dice where uncertainty matters
- update party state and hit points
- support one simple encounter
- play optional generated ambience
- persist progress locally

## Deployment

This repo is designed for GitHub Pages. The app is static and can be served directly from the repository root.

Expected live URL after Pages is enabled:

`https://zencloudau.github.io/vallum-engine/`

If GitHub Pages is not yet enabled, open the repository settings and select either GitHub Actions or deploy from the `main` branch root.

## Architecture

The first version uses plain HTML, CSS, and JavaScript to avoid dependency and deployment friction. React/TypeScript can be introduced later after the playable loop is proven.

Key files:

- `index.html` — application shell
- `styles.css` — table, map, panel, character sheet, and responsive layout
- `app.js` — runtime engine, dice, choices, state, ambience, local save
- `data/campaigns/western-road.json` — first sample campaign module
- `.github/workflows/pages.yml` — GitHub Pages deployment workflow

## Roadmap

The roadmap is solo-first but multiplayer-capable:

1. v0.1: playable static solo vertical slice
2. v0.2: richer character sheets, inventory, status effects, and encounter tuning
3. v0.3: authoring schema for converting story material into modules
4. v0.4: lore bible and module compiler workflow
5. v0.5: companion behaviour and controlled AI narration support
6. future: shared campaign rooms, remote session state, and human-controlled party members

## Design rule

The engine should remain stable. AI belongs in the authoring and module-compilation layer first, not inside the core runtime rules engine.
