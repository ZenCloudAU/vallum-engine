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
| v0.3.2 Interactive Recovery | Restore clickable play without returning to the previous crash path. | Pending live test |

## Internal UAT matrix

| Test ID | Area | Test Scenario | Expected Result | Pass / Fail | Notes |
|---|---|---|---|---|---|
| UAT-001 | Load | Open the live GitHub Pages site. | Landing page loads without blank screen or crash. | Pending | Use hard refresh if cached. |
| UAT-002 | Landing | Click Begin on the Ridge. | Landing closes or table becomes playable without crash. | Pending | First critical gate. |
| UAT-003 | Layout | Review desktop layout. | Game Master is left, map is central, Kael/account is right, scenario and outcome are below map. | Pending | Must be reviewed on large screen. |
| UAT-004 | Choice Interaction | Click each available action from the first scene in separate test runs. | Action is clickable and updates the story state. | Pending | No dead buttons allowed. |
| UAT-005 | Scene Transition | Choose a path to civilians, command, surge, and aftermath. | Scene title, situation, scenario, choices, and token position update. | Pending | Core game loop. |
| UAT-006 | Kael State | Trigger choices that change Force, Restraint, Witness, Hollow, or Reputation. | Right panel updates with changed state labels. | Pending | Must remain readable. |
| UAT-007 | Field State | Trigger choices that change civilians, raider threat, or captain pressure. | Field state changes are reflected in the right panel or outcome text. | Pending | Needed for moral battlefield. |
| UAT-008 | Account | Make two or more choices. | The Account records recent consequences in reverse chronological order. | Pending | Should read like an in-world account, not debug log. |
| UAT-009 | Outcome | Make a choice. | What Changed updates with the immediate consequence and state change. | Pending | No raw dice shown. |
| UAT-010 | Map | Make choices that move Kael. | Kael token moves to the relevant battlefield location. | Pending | Symbolic movement is acceptable. |
| UAT-011 | Restart | Click New or reload the page. | User can return to a clean starting state or reload without crash. | Pending | Recovery behaviour must be predictable. |
| UAT-012 | Visual Load | Review full screen at normal distance. | Player can immediately identify map, action choices, Kael, and outcome without overload. | Pending | Executive/game feel test. |
| UAT-013 | Comprehension | Read landing and first table screen. | Player understands who Kael is, where he is, what is happening, and what the decision pressure is. | Pending | Critical for engagement. |
| UAT-014 | Stormwright Tone | Review copy and outcome language. | Tone feels restrained, severe, moral, and Stormwright-specific. | Pending | Avoid generic fantasy. |
| UAT-015 | Regression | Confirm no external runtime crash path remains. | Page continues to function after refresh and action click. | Pending | Stability gate. |

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
