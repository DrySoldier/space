import {SHOP_CATALOG, UpgradeDef, UpgradeId, getUpgradeCost} from '@/constants';
import {retrieveData, storeData} from '@/utils/asyncData';

export interface MetaWallet {
  oxygenCredits: number;
}

export type UpgradeLevels = Record<UpgradeId, number>;

export interface ShopState {
  unlocked: boolean;
  wallet: MetaWallet;
  levels: UpgradeLevels;
  version: number;
}

type PurchaseFailureReason = 'upgrade_not_found' | 'max_level' | 'insufficient_credits';

export interface ShopPurchaseResult {
  ok: boolean;
  shopState: ShopState;
  cost?: number;
  reason?: PurchaseFailureReason;
}

const SHOP_STATE_VERSION = 1;

const createDefaultUpgradeLevels = (): UpgradeLevels =>
  SHOP_CATALOG.reduce((acc, upgrade) => {
    acc[upgrade.id] = 0;
    return acc;
  }, {} as UpgradeLevels);

export const createDefaultShopState = (
  oxygenCredits = 0,
  unlocked = false,
): ShopState => ({
  unlocked,
  wallet: {
    oxygenCredits: Math.max(0, oxygenCredits),
  },
  levels: createDefaultUpgradeLevels(),
  version: SHOP_STATE_VERSION,
});

const sanitizeShopState = (value: Partial<ShopState>): ShopState => {
  const defaultState = createDefaultShopState();

  return {
    unlocked:
      typeof value.unlocked === 'boolean' ? value.unlocked : defaultState.unlocked,
    wallet: {
      oxygenCredits: Math.max(
        0,
        Number(value.wallet?.oxygenCredits) || defaultState.wallet.oxygenCredits,
      ),
    },
    levels: {
      ...defaultState.levels,
      ...(value.levels || {}),
    },
    version: Number(value.version) || SHOP_STATE_VERSION,
  };
};

const getUpgradeById = (upgradeId: UpgradeId): UpgradeDef | undefined =>
  SHOP_CATALOG.find(upgrade => upgrade.id === upgradeId);

const parseShopState = (raw: string | null | undefined): ShopState | null => {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<ShopState>;
    return sanitizeShopState(parsed);
  } catch (error) {
    return null;
  }
};

export const loadShopState = async (): Promise<ShopState> => {
  const rawShopState = await retrieveData('SHOP_STATE');
  const parsedShopState = parseShopState(rawShopState);

  if (parsedShopState) {
    return parsedShopState;
  }

  // Migration path for legacy CREDITS-only wallet.
  const rawLegacyCredits = await retrieveData('CREDITS');
  const legacyCredits = Math.max(0, Number(rawLegacyCredits) || 0);
  const fallbackShopState = createDefaultShopState(legacyCredits, true);
  await saveShopState(fallbackShopState);
  return fallbackShopState;
};

export const saveShopState = async (shopState: ShopState) => {
  await storeData('SHOP_STATE', JSON.stringify(shopState));
};

export const addShopCredits = async (credits: number): Promise<ShopState> => {
  const safeCredits = Math.max(0, Math.round(credits));
  const currentShopState = await loadShopState();

  const nextShopState: ShopState = {
    ...currentShopState,
    wallet: {
      oxygenCredits: currentShopState.wallet.oxygenCredits + safeCredits,
    },
  };

  await saveShopState(nextShopState);
  return nextShopState;
};

export const applyShopPurchase = (
  shopState: ShopState,
  upgradeId: UpgradeId,
): ShopPurchaseResult => {
  const upgrade = getUpgradeById(upgradeId);

  if (!upgrade) {
    return {
      ok: false,
      reason: 'upgrade_not_found',
      shopState,
    };
  }

  const currentLevel = shopState.levels[upgradeId] || 0;

  if (currentLevel >= upgrade.maxLevel) {
    return {
      ok: false,
      reason: 'max_level',
      shopState,
    };
  }

  const nextCost = getUpgradeCost(upgrade, currentLevel);

  if (shopState.wallet.oxygenCredits < nextCost) {
    return {
      ok: false,
      reason: 'insufficient_credits',
      cost: nextCost,
      shopState,
    };
  }

  const nextShopState: ShopState = {
    ...shopState,
    wallet: {
      oxygenCredits: shopState.wallet.oxygenCredits - nextCost,
    },
    levels: {
      ...shopState.levels,
      [upgradeId]: currentLevel + 1,
    },
  };

  return {
    ok: true,
    cost: nextCost,
    shopState: nextShopState,
  };
};

export const purchaseUpgradeById = async (
  upgradeId: UpgradeId,
): Promise<ShopPurchaseResult> => {
  const currentShopState = await loadShopState();
  const result = applyShopPurchase(currentShopState, upgradeId);

  if (result.ok) {
    await saveShopState(result.shopState);
  }

  return result;
};
