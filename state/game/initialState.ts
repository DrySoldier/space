import {INITIAL_BRANCH_COUNT, MAX_O2} from './constants';
import {BranchCell, GameState} from './types';

export const buildInitialBranches = (): BranchCell[] =>
  Array.from({length: INITIAL_BRANCH_COUNT}, (_, index) => ({
    type: 0,
    id: INITIAL_BRANCH_COUNT - index - 1,
  }));

export const createInitialGameState = (): GameState => ({
  status: 'running',
  side: 'left',
  branches: buildInitialBranches(),
  thrownAwayEvents: [],
  step: false,
  score: 0,
  o2: MAX_O2,
  tanksCollected: 0,
  runContinuesUsed: 0,
  resumeSeq: 0,
  oxygenChanceCounter: 0,
  pendingBranchQueue: [],
  suppressNextAutoPause: false,
});
