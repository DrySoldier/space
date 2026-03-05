export type Side = 'left' | 'right';

export type BranchType = 0 | 1 | 2 | 3 | 4;

export type GameStatus = 'running' | 'paused' | 'pending_death' | 'game_over';

export interface BranchCell {
  type: BranchType;
  id: number;
}

export interface ThrownAwayEvent {
  id: string;
  side: number;
}

export interface GameState {
  status: GameStatus;
  side: Side;
  branches: BranchCell[];
  thrownAwayEvents: ThrownAwayEvent[];
  step: boolean;
  score: number;
  o2: number;
  runContinuesUsed: number;
  resumeSeq: number;
  oxygenChanceCounter: number;
  pendingBranchQueue: BranchType[];
  suppressNextAutoPause: boolean;
}

export type GameAction =
  | {type: 'RESET_RUN'}
  | {type: 'TICK_1S'}
  | {type: 'TOGGLE_PAUSE'}
  | {type: 'AUTO_PAUSE_ON_ACTIVE'}
  | {type: 'CHOP_RESOLVE'; side: Side; thrownAwayId: string}
  | {type: 'COMMIT_BRANCH_SHIFT'}
  | {type: 'CONTINUE_AFTER_AD'}
  | {type: 'END_GAME'};
