import {retrieveData, storeData} from '@/utils/asyncData';
import {loadShopState, saveShopState} from './shop';

export type ProgressionStage =
  | 'pre_contact'
  | 'milestone_hit'
  | 'catastrophe_triggered'
  | 'encounter_scene'
  | 'shop_unlocked';

export interface MetaProgression {
  stage: ProgressionStage;
  encounterSeen: boolean;
  updatedAt: number;
}

const stageOrder: ProgressionStage[] = [
  'pre_contact',
  'milestone_hit',
  'catastrophe_triggered',
  'encounter_scene',
  'shop_unlocked',
];

const toStageIndex = (stage: ProgressionStage) => stageOrder.indexOf(stage);

const defaultProgressionState = (): MetaProgression => ({
  stage: 'pre_contact',
  encounterSeen: false,
  updatedAt: Date.now(),
});

const normalizeProgression = (
  value: Partial<MetaProgression> | null | undefined,
): MetaProgression => {
  const fallback = defaultProgressionState();
  const stage = value?.stage;

  return {
    stage:
      stage && (stageOrder as string[]).includes(stage)
        ? stage
        : fallback.stage,
    encounterSeen:
      typeof value?.encounterSeen === 'boolean'
        ? value.encounterSeen
        : fallback.encounterSeen,
    updatedAt: Number(value?.updatedAt) || fallback.updatedAt,
  };
};

const parseProgression = (
  raw: string | null | undefined,
): MetaProgression | null => {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<MetaProgression>;
    return normalizeProgression(parsed);
  } catch (error) {
    return null;
  }
};

export const loadProgression = async (): Promise<MetaProgression> => {
  const raw = await retrieveData('PROGRESSION_STAGE');
  const parsed = parseProgression(raw);

  if (parsed) return parsed;

  const fallback = defaultProgressionState();
  await saveProgression(fallback);
  return fallback;
};

export const saveProgression = async (progression: MetaProgression) => {
  await storeData('PROGRESSION_STAGE', JSON.stringify(progression));
};

export const advanceProgressionTo = async (
  targetStage: ProgressionStage,
): Promise<MetaProgression> => {
  const current = await loadProgression();
  const nextStage =
    toStageIndex(targetStage) >= toStageIndex(current.stage)
      ? targetStage
      : current.stage;

  const next: MetaProgression = {
    ...current,
    stage: nextStage,
    updatedAt: Date.now(),
  };

  await saveProgression(next);
  return next;
};

export const markEncounterCompleteAndUnlockShop = async () => {
  const progression = await loadProgression();
  const nextProgression: MetaProgression = {
    ...progression,
    stage: 'shop_unlocked',
    encounterSeen: true,
    updatedAt: Date.now(),
  };

  await saveProgression(nextProgression);

  const shopState = await loadShopState();
  if (!shopState.unlocked) {
    await saveShopState({...shopState, unlocked: true});
  }

  return nextProgression;
};
