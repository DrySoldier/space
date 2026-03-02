# Progression State Machine Spec

## Objective

Define the persistent progression stages controlling narrative unlocks and menu availability.

## Stages

1. `pre_contact`
2. `milestone_hit`
3. `catastrophe_triggered`
4. `encounter_scene`
5. `shop_unlocked`

## Transition Rules

- `pre_contact -> milestone_hit`
  - Trigger: first milestone reached (based on existing level thresholds).
- `milestone_hit -> catastrophe_triggered`
  - Trigger: scripted catastrophic event activation.
- `catastrophe_triggered -> encounter_scene`
  - Trigger: run-end sequence/cinematic start.
- `encounter_scene -> shop_unlocked`
  - Trigger: dialogue completes and flag is persisted.

## Persistence Requirements

- Stage must persist across app restarts.
- Stage transition writes must be idempotent.
- Replaying completed one-time scenes is disabled by default.

## UI Gating

- Shop button visible only at `shop_unlocked` or later.
- Encounter scene available only during intended transition.

## Data Shape (proposed)

```ts
type ProgressionStage =
  | 'pre_contact'
  | 'milestone_hit'
  | 'catastrophe_triggered'
  | 'encounter_scene'
  | 'shop_unlocked';

interface MetaProgression {
  stage: ProgressionStage;
  encounterSeen: boolean;
  updatedAt: number;
}
```
