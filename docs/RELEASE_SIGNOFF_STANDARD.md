# Vallum Engine Release Signoff Standard

## Rule

A release is not final until it passes internal UAT and Phil signs off.

## Required UAT reference

Use:

`docs/UAT_GAME_TESTER_MATRIX.md`

## Critical gates

A release must pass these gates before founder signoff:

- page loads
- table starts
- actions are clickable
- scene changes work
- outcome updates
- Kael/account state updates
- layout is readable
- first-minute comprehension is clear

## Future response format

All future release responses must use this signoff matrix:

| Release | Scope | Completed | Evidence | Status | Risks / Notes | Signoff |
|---|---|---|---|---|---|---|

## Failure rule

If a critical gate fails, the next release must fix that gate only. No new feature work should be added while a critical gate is failing.
