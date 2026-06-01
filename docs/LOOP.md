# Vallum Module Loop

Every Vallum module follows this structure. Authoring outside it requires deliberate justification.

## The five stages

```
ESTABLISH → DECIDE → PEAK → LAND → CLOSE
```

### 1. ESTABLISH

One opening scene. Frames:
- Where Kael is and why it matters
- What the immediate stakes are
- What moral state he is arriving with

The player should understand the situation before the first choice. Not through explanation — through scene narration and stakes text.

### 2. DECIDE

Two to four decision scenes. Each scene:
- Presents a choice under genuine pressure
- Changes at least one moral state value
- Uses state from prior choices to frame what Kael sees

Later decide scenes should feel different from earlier ones because the state has moved. A high-hollow Kael reads the same field differently.

### 3. PEAK

One scene where accumulated state produces the hardest available choice. The scene should feel inevitable given the path taken — not arbitrary difficulty, but earned pressure.

### 4. LAND

One aftermath scene. The cost is made visible. The field is assessed. The account is written or avoided.

The aftermath does not resolve cleanly. The player should finish it carrying something uncomfortable.

The aftermath may offer 2–3 reporting choices before the terminal close choice. These shape the moral portrait but do not change the module's basic outcome.

### 5. CLOSE

Session complete screen. Triggered by the terminal choice in the aftermath scene.

Renders:
- Full account (all journal entries)
- Moral portrait (narrative sentences per state)
- Field summary
- Forward hook (conditional on moral state at close)

## State carry

Kael's moral state at close is the starting state for the next module. The forward hook is conditional on that state.

High Hollow opens different hooks than high Restraint. High Reputation with low Restraint opens different hooks than the reverse. The player's choices shape what follows — not in the abstract, but in the specific situation Kael faces next.

## Scene authoring rules

- Every scene has 2–4 choices. No fewer, no more.
- No choice is obviously correct. At least one path should feel costly regardless.
- Every choice changes at least one moral state value.
- No pre-reveal of state deltas. The player decides under uncertainty.
- Choice labels describe action, not outcome. "Hold one breath" not "Gain +2 Witness."

## Module length

**Minimum:** one Establish, two Decide, one Peak, one Aftermath, one Close. Six scenes total.

**Standard:** one Establish, three Decide, one Peak, one Aftermath, one Close. Seven scenes total.

**Maximum for a single session:** one Establish, four Decide, one Peak, one Aftermath, one Close. Eight scenes total.

Do not exceed eight scenes. A module that cannot be played in one session has broken the loop.

## The terminal choice

The final choice in the aftermath scene must have `"result": "The module ends..."` in its JSON definition. This triggers `state.sessionComplete = true` in the engine, which routes `render()` to the session complete screen instead of looping to aftermath.

All non-terminal aftermath choices use `"nextScene": "aftermath"` — this is intentional. The player may take 1–2 reporting actions before closing. The terminal choice is always available alongside them.
