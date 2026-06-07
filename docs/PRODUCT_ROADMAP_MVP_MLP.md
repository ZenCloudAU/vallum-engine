# Vallum Product Roadmap — MVP to MLP

## Product definition

Vallum is a solo-first digital tabletop story engine that presents original worlds as playable sessions around a virtual table. The initial content line is The Stormwright Cycle.

The roadmap distinguishes technical viability from emotional product quality.

- **MVP** proves the complete playable loop.
- **MLP** delivers the minimum experience that players can care about, remember and want to continue.

## MVP definition

The Minimum Viable Product is not merely a page that loads or a choice that changes text. MVP requires one complete, stable tabletop session.

### MVP promise

A player can enter the Stormwright world, sit down at the virtual table, understand Kael and the immediate situation, make meaningful decisions, see consequences, complete the session and retain a persistent account.

### MVP required capabilities

| Capability | Acceptance condition |
|---|---|
| World landing | Introduces the world, Kael, module and central pressure without technical language |
| Table transition | Establishes the virtual tabletop metaphor before the first scene |
| VTT board | Central board supports zones, tokens and state overlays |
| Lead token | Kael is represented by a dimensional tabletop token |
| Game Master | Situation, choices and consequence are delivered without exposing raw resolution machinery |
| Complete module loop | Orientation → pressure → decision → hidden resolution → consequence → changed state → landing |
| Character continuity | HP and moral portrait persist through the session |
| Account | Decisions and consequences are recorded in an in-world form |
| Session complete | Dedicated landing displays full account, final portrait and forward hook |
| Save / continue | A player can leave and resume without losing session state |
| UAT | Critical runtime, UX, comprehension and tone gates pass |

## MVP release sequence

| Release | Name | Outcome |
|---|---|---|
| v0.3.x | Recovery and loop baseline | Stable engine, session-complete state and UAT controls |
| v0.4 | Tabletop Entry and Orientation | World landing, sit-down transition, Kael orientation and clear first decision |
| v0.5 | VTT Board Foundation | Board background contract, zones, coded fallback, Kael token and board-first layout |
| v0.6 | Board Consequence | Choices alter board overlays, location pressure and account presentation |
| v0.7 | Module One Completion | The Noise of Purpose becomes a complete multi-scene session with rising pressure and clean landing |
| v0.8 | Persistence and Resume | Save, continue, reset and account continuity hardened |
| v0.9 | MVP UAT Candidate | Full internal UAT, accessibility, visual hierarchy and defect correction |
| v1.0 | MVP Release | One complete Stormwright tabletop session, stable and publicly playable |

## MLP definition

The Minimum Lovable Product must produce presence, attachment and anticipation. The player should feel that they sat at a table with a Game Master and a party, not that they navigated a story interface.

### MLP promise

A player completes a short connected Stormwright arc, develops a distinct version of Kael, experiences companions as persistent personalities, sees the world remember prior choices and wants to return for the next session.

### MLP required capabilities

| Capability | Acceptance condition |
|---|---|
| Three connected modules | Prior decisions bend later scenes and available responses |
| Cross-module state | Hollow, Reputation, Restraint, Witness and major account marks carry forward |
| Meaningful closure | Some choices permanently close or complicate later possibilities |
| Companion presence | At least two bounded AI-controlled companions have tokens, sheets and personality-led interventions |
| Multiple VTT boards | Battlefield and non-battlefield contexts prove the board system is reusable |
| World response | NPCs, narration and future hooks acknowledge earlier actions |
| Table atmosphere | Wood/table surface, board frame, GM screen, token family and restrained ambience feel coherent |
| Character investment | The player recognises this Kael as the consequence of their sessions |
| Return driver | Each session ends with a concrete unresolved name, place, threat or obligation |
| Authoring repeatability | New chapters can be converted through a stable module and board contract |

## MLP release sequence

| Release | Name | Outcome |
|---|---|---|
| v1.1 | State-Gated Consequence | Prior moral state opens, closes or reframes later choices |
| v1.2 | Module Two — Reputation | Non-battlefield board where Kael's reputation is a problem rather than an advantage |
| v1.3 | Companion Foundation | Party slots, token family, personality model and bounded companion interventions |
| v1.4 | Module Three — Recognition | Consequences from Modules One and Two become unavoidable |
| v1.5 | World Memory | Cross-module account, NPC acknowledgement and persistent obligations |
| v1.6 | Authoring Kit | Story-to-module guide, board schema, validation and canon controls |
| v1.7 | MLP UAT Candidate | Full arc testing, pacing, replay, companion presence and retention review |
| v2.0 | MLP Release | Lovable three-module Stormwright tabletop arc |

## Later platform horizon

After the MLP proves the emotional and structural model:

- additional original worlds and genres;
- creator ingestion and AI-assisted module compilation;
- richer AI companion behaviour;
- shared-table rooms;
- human ownership of party characters;
- remote Game Master mode;
- board asset import/export;
- optional VTT interoperability;
- campaign library and canonical world packs.

## Explicit exclusions before MVP

The following are not required for MVP:

- full 3D world simulation;
- free movement with keyboard controls;
- photorealistic character models;
- open-ended generative Game Master improvisation;
- multiplayer networking;
- inventory-heavy progression;
- large-scale procedural world generation;
- integration with proprietary VTT platforms.

## Product measures

### MVP measures

- first-time player comprehension before first choice;
- percentage of sessions reaching completion;
- runtime error-free completion rate;
- ability to resume after reload;
- clarity of action-to-consequence feedback;
- UAT pass rate;
- time required to author a new scene using the documented contract.

### MLP measures

- voluntary second session or module start;
- player recall of prior moral choices;
- perceived companion presence;
- perceived world responsiveness;
- desire to continue the arc;
- distinction between different playthrough versions of Kael;
- author confidence that chapters can be adapted without rewriting the engine.

## Governance rule

No release advances because code exists. It advances when the release outcome passes internal UAT and founder signoff. New feature work pauses when a critical stability, comprehension or immersion gate fails.
