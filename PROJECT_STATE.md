# Vallum Engine Project State

## Current status

Vallum Engine is live as a GitHub Pages static app.

Live path:

https://zencloudau.github.io/vallum-engine/

Current release line: v0.3 Stormwright playable module execution.

## Master world guide

The Stormwright Cycle series bible is the master canon source for Vallum Engine's first original world line.

The canon direction is documented in:

- `docs/world/STORMWRIGHT_CANON.md`
- `docs/world/STORMWRIGHT_VALLUM_ADAPTATION.md`

The first real module is `The Noise of Purpose`, adapted from Book I Chapter 1: the ridge above the burning caravan, the civilian-versus-captain choice, the surge, and the aftermath.

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

## v0.3 delivered

The first Stormwright playable module execution began:

- new campaign module: `data/campaigns/noise-of-purpose.json`
- runtime now loads `The Noise of Purpose` instead of the sample campaign
- shell copy updated for Stormwright and Kael Vorn
- battlefield tableau replaces the travel-road framing
- single-character Kael module support added
- objective state added for civilians, raider threat, and captain pressure
- Stormwright moral state added: Force, Restraint, Witness, Hollow, Reputation
- Stormwright stat rolls wired into the dice engine
- map marker palette updated for ridge, fire, civilians, captain, and road
- storm ambience mode added
- theme layer sharpened for Stormwright tone

## Deployment status

The repository deploys from the main branch root through GitHub Pages.

The product remains intentionally static for now. There is no build step, backend, database, login, multiplayer layer, or external asset dependency.

## Next release

The next pass should harden v0.3 after live testing:

- verify the module loads on GitHub Pages
- tune choice outcomes and stat targets
- improve battlefield visual composition
- add an explicit session-complete screen or state
- add source-canon notes visible in documentation, not runtime
- consider a compact visual legend for moral and objective state

## Product control rule

Every future release must update `CHANGELOG.md`, `PROJECT_STATE.md`, and any roadmap or guide document affected by the change.
