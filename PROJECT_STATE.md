# Vallum Engine Project State

## Current status

Vallum Engine is live as a GitHub Pages static app.

Live path:

https://zencloudau.github.io/vallum-engine/

Current release line: v0.3.2 layout and engagement correction with runtime stabilisation.

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

## v0.3.1 delivered

The Stormwright game-feel hardening pass improved the module's play rhythm and consequence clarity:

- structured outcome display: roll result, immediate consequence, state change
- choice impact hints added to each action
- moral state labels added for Force, Restraint, Witness, Hollow, and Reputation
- objective labels added for civilians, raider threat, and captain pressure
- battlefield zones added behind ridge, civilians, and captain areas
- aftermath report added for the aftermath scene
- session-complete flag added when the module-ending choice is selected
- local save key advanced to v0.3.1 with migration from v0.3
- outcome and aftermath panels styled for readability

## v0.3.2 delivered

The layout and engagement correction pass addressed first-minute comprehension and screen hierarchy:

- landing page rewritten as a proper Stormwright prologue
- player role introduced as Kael Vorn before play begins
- two-column layout replaced with three-zone play table
- Game Master panel moved to the left
- battlefield map moved to the centre and made primary
- scenario narration moved below the map
- outcome panel moved below the map as `What Changed`
- Kael and The Account moved to the right
- raw dice log hidden from normal view
- top controls reduced to compact save, new session, and `M` music toggle
- compact music chrome override added in `layout-fix.js`

## v0.3.4 delivered

UX clarity, palette, buttons, and favicon pass:

- `assets/favicon.svg` — original V-in-shield sigil, gold on void, SVG format
- formalised Stormwright palette tokens in styles.css; all engine aliases preserved
- `.storm-choice` redesigned as decision card with left gold accent rail, hover shift, focus ring
- `choice-number` split from `choice-title` in app.js for independent styling
- `.outcome-grid` auto-fit — no empty third column
- outcome panel has left accent rail matching decision card language
- state-line hierarchy flipped: descriptor label (em) prominent, numeric value (strong) secondary
- `.storm-map-frame` stronger inner shadow and outer glow
- header chips reduced visual weight; primary button weight increased
- global `button:focus-visible` focus ring for accessibility

## v0.3.3 delivered

Engine reconnection and runtime stabilisation:

- `setStatus()` defined in app.js — this was the root cause of all choice-click crashes
- index.html rebuilt with all DOM IDs app.js requires
- styles.css and ux.css linked in index.html — were absent, engine-rendered classes had no styles applied
- stable-play.js demoted from active script tag; app.js now runs in production
- `applyDelta` capped at 10 — moral and objective state can no longer accumulate unboundedly
- `continueBtn` shows only when a saved session exists
- "Interactive Recovery Build" labels removed from player-facing copy
- `timeBox` moved to topbar chip; `ambienceBtn` gains tooltip

## v0.3.2 hotfix delivered

The post-landing runtime crash was addressed with a stabilised runtime:

- local save key advanced to `vallum.engine.session.noise-of-purpose.v0.3.2`
- incompatible older local state no longer loads into the new layout
- runtime now guards missing DOM elements instead of hard-crashing
- campaign fetch uses `no-store` to reduce stale file risk
- raw roll output removed from the visible outcome model
- visible recovery path added if the table is interrupted
- music toggle handling moved into the main runtime as compact On/Off state

## Deployment status

The repository deploys from the main branch root through GitHub Pages.

The product remains intentionally static for now. There is no build step, backend, database, login, multiplayer layer, or external asset dependency.

## Next release

The next pass should be v0.4 — two decisions pending Phil's call before execution:

Both design decisions resolved in v0.3.3:

- Choice pre-reveal removed. Deltas hidden before selection. Moral uncertainty preserved.
- Stat system decoupled. d20 rolls are pure chance. Moral state shapes narrative, not dice math.

Pending for v0.4: module authoring guide, additional decision scenes in Noise of Purpose (current module resolves in one branching moment — insufficient depth for sustained moral arc).

## Product control rule

Every future release must update `CHANGELOG.md`, `PROJECT_STATE.md`, and any roadmap or guide document affected by the change.
