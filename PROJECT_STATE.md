# Vallum Engine Project State

## Current status

Vallum Engine is live as a GitHub Pages static app.

Live path:

https://zencloudau.github.io/vallum-engine/

Current release line: v0.2.1 Stormwright canon alignment.

## Master world guide

The Stormwright Cycle series bible is now the master canon source for Vallum Engine's first original world line.

The canon direction is documented in:

- `docs/world/STORMWRIGHT_CANON.md`
- `docs/world/STORMWRIGHT_VALLUM_ADAPTATION.md`

The first real module target is `The Noise of Purpose`, adapted from Book I Chapter 1: the ridge above the burning caravan, the civilian-versus-captain choice, the surge, and the aftermath.

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

## v0.2.1 delivered

The Stormwright canon alignment release formalised the first content direction:

- Stormwright Cycle accepted as master world guide
- Stormwright canon guide created
- Stormwright Vallum adaptation plan created
- v0.3 module target selected
- product map updated around Stormwright mechanics and roadmap

## Deployment status

The repository deploys from the main branch root through GitHub Pages.

The product remains intentionally static for now. There is no build step, backend, database, login, multiplayer layer, or external asset dependency.

## Next release

v0.3 should implement `The Noise of Purpose` as the first real Stormwright module.

Required engine extensions:

- single-character module support
- objective state for civilians saved or lost
- Stormwright moral state values: Force, Restraint, Witness, Hollow, Reputation
- battlefield tableau map support
- outcome states beyond generic success and failure
- source-canon metadata in the campaign module

## Product control rule

Every future release must update `CHANGELOG.md`, `PROJECT_STATE.md`, and any roadmap or guide document affected by the change.
