# Reducer Architecture Spec (E0)

## Objective

Define reducer-centric runtime state model to replace coupled local state in `app/screens/game/index.tsx`.

## Problems Addressed

- Coupled state transitions spread across handlers/effects.
- Mutable module-level gameplay state.
- Interval lifecycle duplication and drift risk.

## Proposed Shape

```ts
interface RunState {
  status: 'idle' | 'running' | 'paused' | 'pending_death' | 'game_over';
  score: number;
  o2: number;
  side: 'left' | 'right';
  branches: Array<{ id: number; type: number }>;
  runContinuesUsed: number;
  oxygenChance: number;
  resumeSeq: number;
}
```

## Action Families

- Lifecycle: `RESET_RUN`, `PAUSE`, `RESUME`, `END_GAME`
- Tick: `TICK_1S` (single source for periodic updates)
- Input: `CHOP_LEFT`, `CHOP_RIGHT`
- Outcomes: `COLLIDE`, `COLLECT_OXYGEN`, `INCREMENT_SCORE`, `CONTINUE_RUN`

## Design Rules

1. Reducer must be pure and deterministic.
2. Side effects (timers, ad callbacks, persistence) remain outside reducer.
3. Any gameplay randomization should come from helper functions with explicit inputs.

## Migration Plan

1. Introduce reducer with parity behavior.
2. Move one concern at a time (score/o2, then branch generation, then death/resume).
3. Delete superseded local `useState` slices after parity validation.
