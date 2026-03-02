# Obstacle System Spec (Fireball)

## Objective

Add a timed side-lane hazard with clear telegraphing and deterministic collision behavior.

## Hazard Model

```ts
type LaneSide = 'left' | 'right';

interface FireballHazard {
  id: string;
  side: LaneSide;
  startAtMs: number;
  activeUntilMs: number;
  state: 'telegraph' | 'active' | 'ended';
}
```

## Behavioral Requirements

- Telegraph phase must clearly indicate imminent danger side.
- Active window should kill if player commits to hazard side during vulnerability window.
- Hazard should auto-expire and clear collision state reliably.

## Spawn Inputs

- Base spawn rate by level.
- Runtime modifiers from shop upgrades.

## Failure Handling

- Collision triggers same deterministic death/continue path as existing fatal events.
