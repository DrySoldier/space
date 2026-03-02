# E3 — Fireball Obstacle System

## Goal

Add a new lane-based timed hazard (fireball/meteor pressure) that creates timing and side-selection decision pressure.

## Scope

- Add hazard entity model with side, active window, and lifecycle callbacks.
- Add visual/animation representation for active hazard windows.
- Integrate collision checks with player side and timing.
- Tie spawn tuning to level progression and later shop upgrades.

## Deliverables

- Hazard spawning logic module
- Render integration in game layer
- Collision integration in run reducer/logic

## Acceptance Criteria

- Hazard telegraphing is readable and fair.
- Entering active hazard window causes deterministic fail state.
- Hazard lifecycle exits cleanly with no persistent phantom collision.

## Dependencies

- E0 and E2 (for upgrade-modifiable tuning hooks).

## Out of Scope

- Full economy retune.
