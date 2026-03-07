# Oxygen and Currency Curve Notes

## Objective

Define baseline balancing intent for oxygen pressure, progression bottlenecks, and shop upgrade impact.

## Desired Feel

- **Early game:** frequent progress, mild pressure, fast first upgrades.
- **Mid game:** oxygen decisions matter; upgrades are clearly felt.
- **Late game:** tighter optimization and hazard mastery required.

## Control Levers

- Oxygen spawn chance baseline and growth.
- Oxygen refill amount.
- Hazard frequency and active duration.
- Currency per tank and multiplier upgrades.

## Baseline Strategy

- Keep base oxygen chance conservative enough to create scarcity after first milestones.
- Allow `oxygen_spawn_boost` to relieve bottlenecks gradually (not instantly).
- Keep hazard pressure meaningful even after one or two relief upgrades.

## Run-End Currency Payout (Locked v1)

- Each oxygen tank collected in-run contributes a fixed base payout:
  - `BASE_TANK_CREDIT = 50`
- Score contributes a bonus, but is damped by tanks already collected:
  - `SCORE_DIVISOR = 10_000`
  - `efficiency = clamp(8 / (tanksCollected + 4), 0.4, 1.0)`
  - `scoreBonusCredits = round((score / SCORE_DIVISOR) * BASE_TANK_CREDIT * efficiency)`

Final payout:

```ts
tankCredits = tanksCollected * 50;
totalCredits = tankCredits + scoreBonusCredits;
```

### Sample outputs at 50k score

- `tanksCollected = 3` -> bonus `250` (~5 tank values)
- `tanksCollected = 7` -> bonus `182` (~3.6 tank values)
- `tanksCollected = 12` -> bonus `125` (2.5 tank values)
- `tanksCollected = 16` -> bonus `100` (2 tank values)

This preserves a clear baseline reward per tank while giving strong runs extra payout without runaway scaling.

## Validation Questions

- How many runs to first meaningful purchase?
- At what upgrade levels does run depth noticeably increase?
- Does any upgrade trivialize hazard/oxygen pressure too early?
