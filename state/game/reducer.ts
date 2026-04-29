import { randInt } from '@/utils';
import { getLevel } from '@/utils/level';

import {
  FIRST_CONTACT_MILESTONE_SCORE,
  MAX_O2,
  O2_DRAIN_PER_TICK,
  O2_PICKUP_AMOUNT,
  SCORE_DECAY_PER_TICK,
  SCORE_GAIN_PER_CHOP,
} from './constants';
import { createInitialGameState } from './initialState';
import { BranchCell, BranchType, GameAction, GameState } from './types';

const getOxygenChanceThreshold = (score: number) =>
  Math.min(6 + Math.floor(score / 7500), 16);

const generateNewBranch = (
  state: GameState,
  lastGeneratedBranch: BranchCell,
): { branchType: BranchType; oxygenChanceCounter: number } => {
  const { score, oxygenChanceCounter } = state;
  const level = getLevel(score);

  if ((score >= 35_000 && score < 36_000) || (score >= 60_000 && score < 61_000)) {
    return { branchType: 0, oxygenChanceCounter };
  }

  const biasedRand012 = (): 0 | 1 | 2 => {
    const r = randInt(0, 8);
    return r === 0 ? 0 : r < 5 ? 1 : 2;
  };

  let nextBranch: BranchType = biasedRand012();
  let nextOxygenChanceCounter = oxygenChanceCounter;

  if (level === 3 && nextBranch === 0) {
    nextBranch = randInt(0, 2) as 0 | 1 | 2;
  }

  if (nextBranch === 0 && nextOxygenChanceCounter >= getOxygenChanceThreshold(score)) {
    return {
      branchType: (3 + randInt(0, 1)) as 3 | 4,
      oxygenChanceCounter: 0,
    };
  }

  if (level === 2 && lastGeneratedBranch.type === nextBranch) {
    nextBranch = nextBranch === 1 ? 2 : 1;
  } else if (level === 3) {
    if (nextOxygenChanceCounter > getOxygenChanceThreshold(score) * 3) {
      return {
        branchType: (3 + randInt(0, 1)) as 3 | 4,
        oxygenChanceCounter: 0,
      };
    }

    if (randInt(0, 3)) {
      nextOxygenChanceCounter++;
    }

    if (lastGeneratedBranch.type === nextBranch && randInt(0, 1)) {
      nextBranch = nextBranch === 1 ? 2 : 1;
    }
  } else if (lastGeneratedBranch.type !== 0) {
    nextOxygenChanceCounter++;
    nextBranch = 0;
  }

  return {
    branchType: nextBranch,
    oxygenChanceCounter: nextOxygenChanceCounter,
  };
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'RESET_RUN':
      return createInitialGameState();

    case 'TICK_1S': {
      if (state.status !== 'running') {
        return state;
      }

      const nextScore = Math.max(0, state.score - SCORE_DECAY_PER_TICK);
      const nextO2 = Math.max(0, state.o2 - O2_DRAIN_PER_TICK);

      if (nextO2 <= 0) {
        const nextStatus =
          state.runContinuesUsed > 0 ? 'game_over' : 'pending_death';
        const shouldCheckEncounter =
          (nextStatus === 'pending_death' || nextStatus === 'game_over') &&
          nextScore >= FIRST_CONTACT_MILESTONE_SCORE;

        return {
          ...state,
          score: nextScore,
          o2: 0,
          status: nextStatus,
          encounterCheckSeq: shouldCheckEncounter
            ? state.encounterCheckSeq + 1
            : state.encounterCheckSeq,
          narrativeEncounterPending:
            shouldCheckEncounter || state.narrativeEncounterPending,
        };
      }

      return {
        ...state,
        score: nextScore,
        o2: nextO2,
      };
    }

    case 'TOGGLE_PAUSE': {
      if (state.status === 'running') {
        return {
          ...state,
          status: 'paused',
        };
      }

      if (state.status === 'paused') {
        return {
          ...state,
          status: 'running',
        };
      }

      return state;
    }

    case 'AUTO_PAUSE_ON_ACTIVE': {
      if (state.status !== 'running' || state.score <= 0) {
        return state;
      }

      if (state.suppressNextAutoPause) {
        return {
          ...state,
          suppressNextAutoPause: false,
        };
      }

      return {
        ...state,
        status: 'paused',
      };
    }

    case 'CHOP_RESOLVE': {
      if (state.status !== 'running') {
        return state;
      }

      const { branches } = state;
      const lastBranch = branches[branches.length - 1];
      const nextBranch = branches[branches.length - 2];
      const lastGeneratedBranch = branches[0];

      const { branchType, oxygenChanceCounter } = generateNewBranch(
        state,
        lastGeneratedBranch,
      );

      const wouldCollide =
        (action.side === 'left' && nextBranch.type === 1) ||
        (action.side === 'right' && nextBranch.type === 2);

      const collectedTank =
        (action.side === 'left' && nextBranch.type === 3) ||
        (action.side === 'right' && nextBranch.type === 4);

      const nextThrownAwayEvents = [
        ...state.thrownAwayEvents,
        {
          id: action.thrownAwayId,
          side: lastBranch.type,
        },
      ].slice(-25);

      if (wouldCollide) {
        const nextStatus =
          state.runContinuesUsed === 0 ? 'pending_death' : 'game_over';
        const shouldCheckEncounter =
          (nextStatus === 'pending_death' || nextStatus === 'game_over') &&
          state.score >= FIRST_CONTACT_MILESTONE_SCORE;

        return {
          ...state,
          side: action.side,
          step: !state.step,
          thrownAwayEvents: nextThrownAwayEvents,
          oxygenChanceCounter,
          pendingBranchQueue: [...state.pendingBranchQueue, branchType],
          status: nextStatus,
          encounterCheckSeq: shouldCheckEncounter
            ? state.encounterCheckSeq + 1
            : state.encounterCheckSeq,
          narrativeEncounterPending:
            shouldCheckEncounter || state.narrativeEncounterPending,
        };
      }

      return {
        ...state,
        side: action.side,
        step: !state.step,
        thrownAwayEvents: nextThrownAwayEvents,
        oxygenChanceCounter,
        pendingBranchQueue: [...state.pendingBranchQueue, branchType],
        score: state.score + SCORE_GAIN_PER_CHOP,
        o2: collectedTank ? Math.min(MAX_O2, state.o2 + O2_PICKUP_AMOUNT) : state.o2,
        tanksCollected: collectedTank ? state.tanksCollected + 1 : state.tanksCollected,
      };
    }

    case 'COMMIT_BRANCH_SHIFT': {
      const [nextBranchType, ...remainingPendingQueue] = state.pendingBranchQueue;

      if (nextBranchType === undefined) {
        return state;
      }

      const nextBranches = [...state.branches];
      nextBranches.pop();
      nextBranches.unshift({
        type: nextBranchType,
        id: state.branches[0].id + 1,
      });

      return {
        ...state,
        branches: nextBranches,
        pendingBranchQueue: remainingPendingQueue,
      };
    }

    case 'CONTINUE_AFTER_AD':
      return {
        ...state,
        status: 'running',
        runContinuesUsed: state.runContinuesUsed + 1,
        o2: MAX_O2,
        tanksCollected: 0,
        branches: state.branches.map(branch => ({ ...branch, type: 0 })),
        suppressNextAutoPause: true,
        resumeSeq: state.resumeSeq + 1,
        pendingBranchQueue: [],
        side: 'left',
      };

    case 'ENCOUNTER_FLOW_RESOLVED':
      return {
        ...state,
        narrativeEncounterPending: false,
      };

    case 'END_GAME':
      return {
        ...state,
        status: 'game_over',
        encounterCheckSeq:
          state.score >= FIRST_CONTACT_MILESTONE_SCORE
            ? state.encounterCheckSeq + 1
            : state.encounterCheckSeq,
        narrativeEncounterPending:
          state.score >= FIRST_CONTACT_MILESTONE_SCORE ||
          state.narrativeEncounterPending,
      };

    default:
      return state;
  }
};
