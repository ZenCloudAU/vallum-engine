# Vallum Engine Product Map

## Product definition

Vallum Engine is a solo tabletop story engine for turning original worlds, characters, campaign notes, and lore packs into playable browser sessions.

The first official world line is The Stormwright Cycle, using the uploaded series bible as the master canon source.

The product is not a clone of any commercial tabletop or video game property. It is an original engine with its own module format, runtime, presentation model, and release path.

## Product thesis

The engine should let a creator feed in a story world and then experience that world as a playable solo tabletop campaign: map, party, narration, choices, dice, consequences, character state, ambience, and saved progress.

For Stormwright, the playable experience must prioritise moral pressure, restraint, violence, reputation, witness, and consequence over generic fantasy progression.

## Current release line

### v0.1 — Playable static vertical slice

Purpose: prove the engine can run a bounded solo campaign session in the browser.

Delivered:

- static GitHub Pages deployment
- campaign module loading
- top-down SVG map
- party token display
- GM narration panel
- bounded choices
- dice checks
- simple combat resolution
- party HP state
- journal state
- generated ambience
- local save state

### v0.2 — Product UX formalisation

Purpose: make the prototype behave more like a formal game product and less like a technical demo.

Delivered:

- campaign cover screen
- continue session and start session entry points
- campaign title chrome
- visible save status
- visible ambience state
- latest outcome panel
- route highlighting for recent movement
- party-cluster map token
- clickable party members
- character sheet drawer
- product documentation baseline

### v0.2.1 — Stormwright canon alignment

Purpose: make The Stormwright Cycle the formal master world guide for Vallum's first original content line.

Delivered:

- Stormwright canon guide
- Stormwright-to-Vallum adaptation plan
- first real module target selected: The Noise of Purpose
- product roadmap aligned to Stormwright content

## Release roadmap

### v0.3 — Stormwright module one: The Noise of Purpose

Goal: replace the sample content with the first playable Stormwright module.

Source focus:

Book I, Chapter 1: the ridge above the burning caravan, the choice between saving civilians and cutting the head, the surge, the raider captain, and the aftermath.

Scope:

- single-character or light-party module centred on Kael Vorn
- battlefield tableau map rather than generic road map
- civilians as objective state
- raider captain as tactical pressure point
- Force, Restraint, Witness, Hollow, and Reputation as early Stormwright mechanics
- outcome states that track what was saved, what was lost, and what Kael refused or accepted seeing
- module notes describing the source-canon relationship

Success condition: Phil can play a short Stormwright session and feel that Kael's world has entered Vallum without becoming generic fantasy.

### v0.4 — Module authoring guide

Goal: define how raw writing becomes a playable module.

Scope:

- module schema reference
- scene type taxonomy
- choice design rules
- encounter design rules
- character definition pattern
- ambience tagging pattern
- save-state considerations
- Stormwright adaptation checklist

Success condition: a new Stormwright story slice can be converted into a playable module without changing the engine.

### v0.5 — Stormwright rules and progression layer

Goal: make character state reflect Stormwright's actual themes.

Scope:

- Force
- Restraint
- Witness
- Hollow
- Reputation
- wounds
- objective state
- community consequence
- rest and withdrawal rules

Success condition: characters feel persistent across more than one session, and moral state matters as much as HP.

### v0.6 — Lore bible and content compiler

Goal: prepare for AI-assisted authoring without letting AI destabilise runtime play.

Scope:

- lore bible folder
- source notes folder
- module compiler prompt pattern
- canon extraction template
- generated module review checklist
- Stormwright canon validation process

Success condition: source writing can be digested into structured game material before runtime.

### Future — Shared table mode

Goal: allow multiple players to join the same campaign session later without rewriting the engine.

Scope:

- remote session state
- join codes
- character ownership
- turn handling
- shared dice log
- party decision model

Success condition: the engine can support solo play now and shared play later.

## Product principles

The runtime engine must stay stable and deterministic.

AI belongs first in authoring, lore extraction, and module compilation, not in unbounded runtime improvisation.

The first playable path should always matter more than theoretical platform completeness.

Every release must update documentation, project state, and the changelog.
