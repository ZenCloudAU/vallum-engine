# Vallum Engine UAT and Game Tester Matrix

## Purpose

This matrix defines the internal acceptance gate before Phil gives final release signoff.

A release is not complete because code is committed. A release is complete only when it passes internal UAT, game-feel review, layout review, runtime stability checks, and founder signoff.

## Release signoff model

| Gate | Owner | Purpose | Required Before Release Signoff |
|---|---|---|---|
| Build Check | Implementation Lead | Confirm the deployed page loads and does not crash. | Yes |
| Runtime Check | Implementation Lead | Confirm buttons, state changes, scene transitions, and account updates work. | Yes |
| UX Check | UX Lead | Confirm layout hierarchy, readability, spacing, and visual load. | Yes |
| Game Design Check | Game Designer | Confirm the player understands role, situation, stakes, and consequence. | Yes |
| Lore Check | World Designer | Confirm Stormwright tone, character, and canon are not flattened into generic fantasy. | Yes |
| Founder UAT | Phil | Confirm the experience feels playable, comprehensible, and worth continuing. | Yes |

## Current UAT target

| Release | UAT Target | Status |
|---|---|---|
| v0.3.3 Engine Reconnection | Full engine (app.js) live. All DOM IDs present. setStatus() defined. No crash on choice click. | Pending founder live test |
| v0.3.2 Interactive Recovery | Superseded by v0.3.3. stable-play.js emergency path retired. | Closed |

## Internal UAT matrix

| Test ID | Area | Test Scenario | Expected Result | Pass / Fail | Notes |
|---|---|---|---|---|---|
| UAT-001 | Load | Open the live GitHub Pages site. | Landing page loads without blank screen or crash. | Static PASS — server returns 200, HTML valid | Hard refresh required on GitHub Pages after push. |
| UAT-002 | Landing | Click Begin on the Ridge. | Landing closes or table becomes playable without crash. | Static PASS — startBtn present, closeCover() wired | Requires founder live test to confirm no browser error. |
| UAT-003 | Layout | Review desktop layout. | Game Master is left, map is central, Kael/account is right, scenario and outcome are below map. | Static PASS — 3-zone play-layout grid confirmed in HTML | Must be reviewed on large screen. |
| UAT-004 | Choice Interaction | Click each available action from the first scene in separate test runs. | Action is clickable and updates the story state. | Static PASS — renderChoices() builds buttons with listeners; setStatus() defined; no ReferenceError path | Requires founder live click test. |
| UAT-005 | Scene Transition | Choose a path to civilians, command, surge, and aftermath. | Scene title, situation, scenario, choices, and token position update. | Static PASS — scene graph fully connected; all 5 scenes verified | Requires founder live test across all paths. |
| UAT-006 | Kael State | Trigger choices that change Force, Restraint, Witness, Hollow, or Reputation. | Right panel updates with changed state labels. | Static PASS — renderCharacterPanel() reads moralState and renders label functions | Requires founder live test. |
| UAT-007 | Field State | Trigger choices that change civilians, raider threat, or captain pressure. | Field state changes are reflected in the right panel or outcome text. | Static PASS — applyDelta wired to objectives; capped 0–10 | Requires founder live test. |
| UAT-008 | Account | Make two or more choices. | The Account records recent consequences in reverse chronological order. | Static PASS — renderJournal() renders last 6 entries reversed | Requires founder live test. |
| UAT-009 | Outcome | Make a choice. | What Changed updates with the immediate consequence and state change. | Static PASS — renderOutcome() reads latestOutcome; setStatus() no longer crashes | Requires founder live test. |
| UAT-010 | Map | Make choices that move Kael. | Kael token moves to the relevant battlefield location. | Static PASS — renderKaelToken() reads scene.location; all locations defined | Requires founder live test. |
| UAT-011 | Restart | Click New or reload the page. | User can return to a clean starting state or reload without crash. | Static PASS — startNewSession() clears STORAGE_KEY and re-initialises | Requires founder live test. |
| UAT-012 | Visual Load | Review full screen at normal distance. | Player can immediately identify map, action choices, Kael, and outcome without overload. | Pending founder review | Cannot verify statically. Requires large screen review. |
| UAT-013 | Comprehension | Read landing and first table screen. | Player understands who Kael is, where he is, what is happening, and what the decision pressure is. | Pending founder review | Cannot verify statically. Requires first-read test. |
| UAT-014 | Stormwright Tone | Review copy and outcome language. | Tone feels restrained, severe, moral, and Stormwright-specific. | Pending founder review | Cannot verify statically. Requires world designer read. |
| UAT-015 | Regression | Confirm no external runtime crash path remains. | Page continues to function after refresh and action click. | Static PASS — setStatus() defined; all DOM IDs present; no uncaught reference paths in choose() | Requires founder live regression run. |

## Game tester matrix

| Tester Role | Lens | What They Are Testing | Acceptance Signal |
|---|---|---|---|
| Player Tester | First-time comprehension | Can I understand what is happening without explanation? | Can explain Kael, the ridge, the civilians, and the captain after one minute. |
| UX Tester | Layout and cognitive load | Is the screen readable and comfortable? | No confusion about where to look or what to press. |
| Game Designer | Loop quality | Does the loop feel like a game rather than a page? | Choice creates consequence, consequence changes state, state affects the account. |
| World Designer | Stormwright fidelity | Does the scene preserve Kael's tone and moral pressure? | No generic fantasy drift. |
| Technical Tester | Runtime stability | Does the page crash, freeze, or fail to respond? | No crash during start, action selection, scene transition, or reload. |
| Founder Tester | Product instinct | Is this worth continuing? | Phil wants to play one more scene. |

## Release decision matrix

| Result | Meaning | Action |
|---|---|---|
| All critical tests pass | Release candidate is stable enough for founder signoff. | Present signoff matrix to Phil. |
| One critical test fails | Release is not signoff-ready. | Patch only the failed gate. No new features. |
| Multiple critical tests fail | Runtime or layout is unstable. | Roll back to last known stable release and rebuild incrementally. |
| Game feel fails but runtime passes | Product works but does not engage. | UX/game-design tuning release. |
| Founder rejects | Release does not meet product intent. | Convert feedback into next release scope. |

## Critical tests

The critical tests are UAT-001, UAT-002, UAT-004, UAT-005, UAT-009, UAT-012, and UAT-013.

A release cannot be signed off if any critical test fails.

## Signoff rule

No future release should be presented as final until this matrix has been reviewed and the release-specific signoff table has been provided to Phil.
