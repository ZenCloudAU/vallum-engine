# Vallum Engine Project State

## Current status

Vallum Engine is live as a GitHub Pages static app.

Live path:

https://zencloudau.github.io/vallum-engine/

Current release line: v0.2 product UX formalisation.

## v0.1 delivered

The first release proved the playable solo tabletop loop:

- static application shell
- split-screen tabletop layout
- campaign module format
- sample campaign: The Western Road
- top-down route map rendered in SVG
- party token rendering
- bounded scene choices
- GM narration panel
- dice checks
- simple combat resolver
- party HP tracking
- journal tracking
- local browser save state
- generated ambience using Web Audio API
- no external dependency or build step required

## v0.2 delivered

The second release formalised the product UX and documentation baseline:

- campaign cover screen
- continue session and start session flow
- campaign title chrome
- visible save state chip
- visible ambience state chip
- latest outcome panel
- active route highlighting
- party-cluster token display
- clickable party members
- character sheet drawer
- v0.2 UX stylesheet layer
- product map documentation
- release guide documentation
- changelog
- refreshed README

## Deployment status

The repository deploys from the main branch root through GitHub Pages.

The product remains intentionally static for now. There is no build step, backend, database, login, multiplayer layer, or external asset dependency.

## Next release

v0.3 should replace the sample content with the first short playable story module from Phil's own writing.

The next module should contain one starting location, one route, one primary threat, one investigation or social scene, one encounter, one climax, and one return or session-end state.

## Product control rule

Every future release must update `CHANGELOG.md`, `PROJECT_STATE.md`, and any roadmap or guide document affected by the change.
