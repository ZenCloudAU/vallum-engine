# Vallum Engine Product Map

## Product definition

Vallum Engine is a solo tabletop story engine for turning original worlds, characters, campaign notes, and future lore packs into playable browser sessions.

The product is not a clone of any commercial tabletop or video game property. It is an original engine with its own module format, runtime, presentation model, and release path.

## Product thesis

The engine should let a creator feed in a story world and then experience that world as a playable solo tabletop campaign: map, party, narration, choices, dice, consequences, character state, ambience, and saved progress.

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

## Release roadmap

### v0.3 — First real story module

Goal: replace sample content with the first short playable arc from Phil's own writing.

Scope:

- one starting location
- one route or travel sequence
- one primary threat
- one choice-driven investigation or social scene
- one encounter
- one climax
- one return or session-end state
- named characters from the source world
- module notes describing what was adapted from source material

Success condition: Phil can play a short session using his own world, characters, and tone.

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

Success condition: a new story slice can be converted into a playable module without changing the engine.

### v0.5 — Rules and progression layer

Goal: make party state more durable and game-like.

Scope:

- traits
- wounds
- inventory
- status effects
- simple rewards
- rest and recovery rules
- basic progression hooks

Success condition: characters feel persistent across more than one session.

### v0.6 — Lore bible and content compiler

Goal: prepare for AI-assisted authoring without letting AI destabilise runtime play.

Scope:

- lore bible folder
- source notes folder
- module compiler prompt pattern
- canon extraction template
- generated module review checklist

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
