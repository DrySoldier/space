# E0 — Foundation Cleanup + Reducer Refactor

## Goal

Stabilize the run loop and state management so future features (cutscenes, shop, hazards) are built on deterministic, testable behavior.

## Why First

Current game logic is concentrated in `app/screens/game/index.tsx` with coupled state/timer logic and module-level mutable values. This increases risk for regressions as systems are layered in.

## Scope

- Introduce reducer-based runtime state for the in-run game loop.
- Remove module-level mutable gameplay state (e.g., oxygen chance trackers).
- Normalize interval/tick lifecycle for score/oxygen updates.
- Preserve existing gameplay feel and outputs.

## Deliverables

- `state/game/` reducer + action definitions (or equivalent colocated architecture).
- Small pure helper functions for branch generation, collision, and scoring.
- `Game` screen simplified to dispatch actions + render state.

## Acceptance Criteria

- No negative score under any pause/resume/restart path.
- No mutable gameplay state outside reducer/store.
- Pause/resume/restart remains stable across app background/foreground transitions.
- Existing core loop behavior matches current production expectations.

## Dependencies

- None (foundation epic).

## Out of Scope

- New narrative UI.
- Shop purchases.
- New obstacle types.
