# Changelog

## v0.3.2 - Layout and engagement correction

Status: committed on main.

Added:

- proper Stormwright prologue landing page
- explicit player-role introduction for Kael Vorn
- three-zone play layout: Game Master left, map centre, Kael/account right
- scenario narration below the central map
- `What Changed` outcome panel below the map
- compact `M` music toggle
- `layout-fix.js` to keep the music control compact after interaction

Changed:

- replaced the previous two-column app layout with a centred play-table structure
- moved available actions into the left Game Master panel
- moved character state and account to the right panel
- hid raw dice log from normal play view
- reduced top controls to compact save, new session, music, and state indicators
- landing page now explains who Kael is and why the ridge matters before play begins

Known constraints:

- requires live browser review after GitHub Pages refresh
- responsive layout falls back to one column under smaller widths
- Kael panel language may still need tightening after playtest
- map remains symbolic pending a future battlefield readability pass

## v0.3.1 - Stormwright game-feel hardening

Status: committed on main.

Added:

- structured outcome display with Roll Result, Immediate Consequence, and State Change
- choice impact hints showing roll tests and state deltas before selection
- moral-state labels for Force, Restraint, Witness, Hollow, and Reputation
- objective labels for civilians, raider threat, and captain pressure
- battlefield zone overlays for ridge, civilians, and captain areas
- aftermath report on the aftermath scene
- session-complete flag for the module-ending choice
- v0.3.1 local save key with migration support from v0.3

Changed:

- latest outcome is now stored as structured state rather than plain text
- outcome panel now presents consequences as a readable game table
- account/journal flow now better supports the Stormwright theme of witness and consequence
- UX styling now supports outcome grids, aftermath grids, and state labels

Known constraints:

- requires live browser testing after GitHub Pages refresh
- aftermath report is generated from state thresholds and may need wording tuning
- battlefield remains symbolic rather than illustrated

## v0.3 - Stormwright playable module execution

Status: committed on main.

Added:

- first Stormwright campaign module: `data/campaigns/noise-of-purpose.json`
- module title: `The Noise of Purpose`
- Kael Vorn as primary playable character
- battlefield tableau map structure
- objective state for civilians, raider threat, and captain pressure
- Stormwright moral state: Force, Restraint, Witness, Hollow, Reputation
- Stormwright-specific roll support
- storm ambience mode
- Stormwright shell copy and cover screen
- sharper visual theme for the Stormwright module

Changed:

- runtime now loads the Stormwright module instead of the original sample campaign
- map rendering now supports battlefield markers and smoke texture
- party display now includes moral and objective state
- character drawer now surfaces Hollow and Reputation
- campaign framing changed from generic solo table to Stormwright table

Known constraints:

- module requires live browser testing after GitHub Pages refresh
- battlefield visuals are still symbolic rather than illustrated
- session-complete state is still handled as a scene choice, not a dedicated screen
- source-canon notes remain in documentation, not in runtime UI

## v0.2.1 - Stormwright canon alignment

Status: committed on main.

Added:

- accepted The Stormwright Cycle as the master world guide for Vallum's first original content line
- created `docs/world/STORMWRIGHT_CANON.md`
- created `docs/world/STORMWRIGHT_VALLUM_ADAPTATION.md`
- selected first real module target: `The Noise of Purpose`
- aligned product map to Stormwright mechanics and release direction
- updated project state with canon and v0.3 implementation requirements

Changed:

- v0.3 is no longer a generic first story module; it is now the first Stormwright adaptation module
- future mechanics now prioritise Force, Restraint, Witness, Hollow, and Reputation

## v0.2 - Product UX formalisation

Status: committed on main.

Added:

- campaign cover screen
- continue session and start session controls
- campaign title chrome
- save status chip
- ambience state chip
- latest outcome panel
- party-cluster token display
- clickable party members
- character sheet drawer
- active route highlighting
- v0.2 UX stylesheet layer
- product map documentation
- release guide documentation

Changed:

- moved runtime storage key to `vallum.engine.session.v0.2`
- retained migration path from v0.1 local save
- improved outcome handling so the latest choice result is visible outside the dice log
- corrected product documentation direction toward a formal release stream

Known constraints:

- still uses static HTML, CSS, and JavaScript by design
- no external audio files yet; ambience remains generated by Web Audio API
- no upload or AI module compiler yet

## v0.1 - First playable static vertical slice

Status: live.

Added:

- static GitHub Pages app shell
- sample campaign module: The Western Road
- top-down SVG map
- party token display
- GM narration panel
- bounded choices
- dice checks
- simple combat resolver
- party HP tracking
- journal tracking
- generated rain, wind, and dungeon ambience
- local browser save state
- proprietary project licence
