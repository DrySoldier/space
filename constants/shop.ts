export type UpgradeId =
  | 'hazard_relief'
  | 'oxygen_drain_relief'
  | 'tank_value_boost';

export interface UpgradeDef {
  id: UpgradeId;
  label: string;
  description: string;
  maxLevel: number;
  baseCost: number;
  costGrowth: number;
}

export const SHOP_CATALOG: UpgradeDef[] = [
  {
    id: 'hazard_relief',
    label: 'Hazard Relief',
    description: 'Softens hazard pressure in future runs.',
    maxLevel: 10,
    baseCost: 300,
    costGrowth: 1.35,
  },
  {
    id: 'oxygen_drain_relief',
    label: 'Oxygen Efficiency',
    description: 'Reduces effective oxygen drain over time.',
    maxLevel: 10,
    baseCost: 350,
    costGrowth: 1.4,
  },
  {
    id: 'tank_value_boost',
    label: 'Tank Value Boost',
    description: 'Increases credits earned from each run.',
    maxLevel: 20,
    baseCost: 500,
    costGrowth: 1.5,
  },
];

export const getUpgradeCost = (upgrade: UpgradeDef, level: number): number => {
  const safeLevel = Math.max(0, level);
  return Math.round(upgrade.baseCost * Math.pow(upgrade.costGrowth, safeLevel));
};

export const getTankValueMultiplier = (level: number): number => {
  const safeLevel = Math.max(0, level);
  return 1 + safeLevel * 0.2;
};
