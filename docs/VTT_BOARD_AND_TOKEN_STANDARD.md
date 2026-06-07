# Vallum VTT Board and Token Standard

## Purpose

Define the reusable visual and technical contract for scene boards, zones, tokens, overlays and future party presence.

The standard supports coded fallback boards now and image-backed VTT boards later without rewriting the narrative engine.

## Board authority

A board is owned by the story module that uses it. The engine owns rendering and interaction contracts. Canonical art assets belong in the campaign or world asset path.

## Board package

Recommended structure:

```text
assets/
  boards/
    noise-of-purpose/
      ridge-caravan.webp
      ridge-caravan.json
      ridge-caravan-thumb.webp
  tokens/
    heroes/
      kael.svg
    roles/
      warrior.svg
    npcs/
      captain.svg
    objectives/
      civilians.svg
```

## Board definition

A board definition should support:

```json
{
  "id": "ridge-caravan",
  "title": "The Ridge Above the Fire",
  "image": "assets/boards/noise-of-purpose/ridge-caravan.webp",
  "fallback": "coded",
  "aspectRatio": "16:10",
  "perspective": "top-down-tabletop",
  "zones": [],
  "anchors": [],
  "overlays": [],
  "accessibility": {}
}
```

## Zones

Zones convert art into playable space.

Each zone requires:

- stable ID;
- human-readable label;
- geometry;
- semantic role;
- player visibility;
- optional highlight style;
- optional state conditions;
- accessibility description.

Suggested roles:

- player start;
- objective;
- threat;
- route;
- cover;
- hazard;
- investigation;
- social focus;
- exit;
- hidden.

Geometry may initially use rectangles or circles. Polygons can follow when the board system is stable.

## Anchors

Anchors are token positions within zones. They prevent every module from hard-coding coordinates into runtime logic.

Examples:

- `kael-ridge`;
- `captain-road`;
- `civilian-cluster`;
- `party-entry`;
- `gm-focus`.

## Overlays

Overlays represent change without replacing the background image.

Supported initial overlays:

- rain;
- smoke;
- fire;
- danger pulse;
- active route;
- selected zone;
- objective secured;
- objective lost;
- threat weakened;
- aftermath tint.

Overlays must remain readable and should never turn the board into an effects display.

## Choice linkage

A choice may reference one or more board zones:

```json
{
  "label": "Move for the civilians",
  "focusZones": ["civilians", "escape-road"]
}
```

When the player focuses or hovers the choice, the board may highlight referenced zones. This reveals spatial relevance, not mechanical outcome.

Pre-choice state deltas remain hidden.

## Consequence linkage

A resolved choice may produce board effects:

```json
{
  "boardEffects": [
    { "type": "set-overlay", "id": "civilians-secured" },
    { "type": "move-token", "token": "kael", "anchor": "civilian-cluster" }
  ]
}
```

Board consequences should correspond with narrative consequence and account updates.

## Token design language

Tokens must feel like physical tabletop pieces while remaining readable at board scale.

### Shared construction

- raised base;
- material face;
- rim colour;
- crest or initial;
- cast shadow;
- active ring;
- accessible label;
- consistent scale system.

### Token tiers

| Tier | Use | Detail level |
|---|---|---|
| Hero | player lead and major protagonists | unique crest, premium rim, named identity |
| Companion | persistent party members | distinct material and personality accent |
| Named NPC | recurring non-player characters | simplified unique symbol |
| Role | generic warrior, scout, scholar or guard | class/role letter or icon |
| Objective | civilians, evidence, wagon, gate | symbolic marker |
| Threat | captain, creature, hazard | strong silhouette and threat accent |

## Kael token specification

- shape: circular or shield-base miniature;
- material: dark iron;
- rim: candle gold;
- mark: raised K or ridge/storm crest;
- shadow: soft lower-right cast shadow;
- active state: restrained gold ring and slight lift;
- damaged state: no flashing; use muted crack, rim wear or shadow shift;
- scale: visually dominant over objectives, not over board geography.

## Future companion model

Companion tokens must support:

- active/inactive state;
- controlled-by AI, player or remote human;
- trust/conflict indicator outside the token, not encoded as a cluttered badge;
- optional speaking focus;
- persistent identity across boards;
- common base scale.

## Table perspective

Use a top-down board with subtle tabletop depth:

- board frame and shadow;
- slight token extrusion;
- restrained perspective cues;
- no free camera;
- no full 3D engine dependency;
- no perspective distortion that damages zone accuracy.

## Accessibility

- every token requires an accessible name;
- every zone requires a text description;
- colour cannot be the only state signal;
- highlight states require outline or texture changes;
- board actions must remain keyboard reachable;
- reduced-motion mode disables pulsing and token lift animations;
- the scene must remain understandable through GM text if board art is unavailable.

## Asset rules

- original or licensed assets only;
- no dependence on copyrighted commercial game maps or token art;
- optimise board assets for web delivery;
- provide thumbnails where a campaign selector requires them;
- retain source and licence metadata;
- use coded fallback for missing assets.

## First board acceptance criteria

The Ridge Above the Fire board is accepted when:

- the player immediately identifies ridge, caravan, civilians, captain and road;
- Kael's token feels like a board piece rather than a floating letter;
- the board reads at the target large-screen distance;
- choice focus can identify relevant zones without revealing outcome;
- at least two consequences visibly alter the board;
- the board remains usable without audio;
- the board falls back safely if the image fails to load.
