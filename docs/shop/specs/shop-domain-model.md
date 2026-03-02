# Shop Domain Model Spec

## Objective

Define canonical data model for currency, upgrades, pricing, and purchase validation.

## Core Concepts

- **Currency:** oxygen tanks carried from runs after unlock.
- **Wallet:** persistent spendable balance.
- **Catalog:** static definition of upgrades and pricing curves.
- **Purchase:** validated transition from wallet + upgrade level N -> N+1.

## Proposed Types

```ts
type UpgradeId =
  | 'hazard_relief'
  | 'oxygen_spawn_boost'
  | 'tank_value_boost';

interface UpgradeDef {
  id: UpgradeId;
  label: string;
  description: string;
  maxLevel: number;
  baseCost: number;
  costGrowth: number; // multiplicative or stepped growth factor
}

interface MetaWallet {
  oxygenCredits: number;
}

type UpgradeLevels = Record<UpgradeId, number>;

interface ShopState {
  wallet: MetaWallet;
  levels: UpgradeLevels;
  version: number;
}
```

## Purchase Rules

1. Upgrade must exist in catalog.
2. Current level must be `< maxLevel`.
3. Wallet must meet computed next-level cost.
4. Apply deduction + level increment atomically.

## Derived Runtime Effects

- `hazard_relief` -> lowers hazard frequency or active duration.
- `oxygen_spawn_boost` -> increases oxygen spawn chance.
- `tank_value_boost` -> increases currency earned per tank.
