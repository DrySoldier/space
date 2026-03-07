const BASE_TANK_CREDIT = 50;
const SCORE_DIVISOR = 10_000;
const EFFICIENCY_NUMERATOR = 8;
const EFFICIENCY_OFFSET = 4;
const MIN_EFFICIENCY = 0.4;
const MAX_EFFICIENCY = 1;
const TANK_VALUE_BOOST_STEP = 0.2;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/**
 * Run-end currency payout model.
 *
 * - Every oxygen tank is worth 50 credits.
 * - Score contributes an additional bonus that is damped by how many tanks
 *   the player already collected in this run.
 */
export const calculateRunCurrencyPayout = (
  score: number,
  tanksCollected: number,
  tankValueBoostLevel = 0,
): number => {
  const safeScore = Math.max(0, score);
  const safeTanksCollected = Math.max(0, tanksCollected);
  const safeTankValueBoostLevel = Math.max(0, tankValueBoostLevel);

  const tankCredits = safeTanksCollected * BASE_TANK_CREDIT;
  const rawBonusTankUnits = safeScore / SCORE_DIVISOR;
  const efficiency = clamp(
    EFFICIENCY_NUMERATOR / (safeTanksCollected + EFFICIENCY_OFFSET),
    MIN_EFFICIENCY,
    MAX_EFFICIENCY,
  );

  const scoreBonusCredits = Math.round(
    rawBonusTankUnits * BASE_TANK_CREDIT * efficiency,
  );

  const baseRunCredits = tankCredits + scoreBonusCredits;
  const tankValueMultiplier = 1 + safeTankValueBoostLevel * TANK_VALUE_BOOST_STEP;

  return Math.round(baseRunCredits * tankValueMultiplier);
};

export const runCurrencyConstants = {
  BASE_TANK_CREDIT,
  SCORE_DIVISOR,
  EFFICIENCY_NUMERATOR,
  EFFICIENCY_OFFSET,
  MIN_EFFICIENCY,
  MAX_EFFICIENCY,
  TANK_VALUE_BOOST_STEP,
};
