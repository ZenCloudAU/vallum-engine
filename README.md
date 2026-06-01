# Vallum Engine

Solo tabletop story engine for turning original worlds, characters, and campaign notes into playable browser sessions.

Vallum Engine is a solo-first browser tabletop product. It lets a campaign module render as a playable session with a map, party, narration, choices, dice, consequences, character state, ambience, and local save.

Live app:

https://zencloudau.github.io/vallum-engine/

## Product intent

Vallum is not a D&D clone, Forgotten Realms adaptation, Warhammer derivative, or Final Fantasy adaptation. It is an original solo tabletop engine designed to run Phil's own worlds and stories.

The engine is separated from the campaign content. Stories become modules. The runtime reads those modules and presents them as playable tabletop sessions.

## Current release

`v0.2` formalises the product UX and documentation baseline.

Current capabilities:

- campaign cover screen
- continue session and start new session flow
- static campaign module loading
- top-down SVG route map
- party-cluster token display
- GM narration panel
- bounded choices
- dice checks
- latest outcome panel
- simple combat resolver
- party HP tracking
- clickable character sheets
- journal tracking
- generated ambience
- visible save and ambience state
- local browser save state

## Deployment

The app deploys from the `main` branch root through GitHub Pages.

There is no build step, package manager, backend, database, or external asset dependency in the current release line.

## Architecture

The current version uses plain HTML, CSS, and JavaScript to avoid dependency and deployment friction. React/TypeScript can be introduced later if the product needs it, but the priority is proving the playable solo tabletop loop first.

Key files:

- `index.html` — application shell and campaign cover
- `styles.css` — base table, map, panel, character, and responsive layout
- `ux.css` — v0.2 product UX layer
- `app.js` — runtime engine, dice, choices, state, ambience, save, character sheet drawer
- `data/campaigns/western-road.json` — first sample campaign module
- `docs/PRODUCT_MAP.md` — product direction and release map
- `docs/RELEASE_GUIDE.md` — release operating guide
- `CHANGELOG.md` — release history
- `PROJECT_STATE.md` — current project status

## Roadmap

The roadmap is solo-first but multiplayer-capable:

1. v0.1: playable static solo vertical slice
2. v0.2: product UX formalisation and documentation baseline
3. v0.3: first real story module based on Phil's own writing
4. v0.4: module authoring guide
5. v0.5: durable rules, inventory, wounds, and progression
6. v0.6: lore bible and AI-assisted module compiler workflow
7. future: shared campaign rooms, remote session state, and human-controlled party members

## Design rule

The engine should remain stable. AI belongs first in authoring, lore extraction, and module compilation, not inside unbounded runtime improvisation.
