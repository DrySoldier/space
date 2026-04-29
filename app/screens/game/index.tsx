import React, {createRef, useEffect, useReducer, useRef, useState} from 'react';
import {Text, View, FlatList, Pressable, Platform, AppState} from 'react-native';
import {Image} from 'expo-image';
import * as Crypto from 'expo-crypto';

import {
  ThrownAway,
  Branch,
  GameOverModal,
  OxygenMeter,
  Background,
  EncounterFlow,
} from '@/components';
import {images} from '@/constants';
import {createInitialGameState, gameReducer, Side} from '@/state/game';
import type {TBranchRef} from '@/components/Branch';

import styles from './styles';
import Player from '@/components/Player';

const Game = () => {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialGameState,
  );
  const [animatingIn, setAnimatingIn] = useState(false);

  const branchRefs = useRef<Record<number, React.RefObject<TBranchRef | null>>>(
    {},
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const commitRafRef = useRef<number | null>(null);

  const paused = state.status === 'paused';
  const pendingDeath = state.status === 'pending_death';
  const gameOver = state.status === 'game_over';
  const encounterActive = state.narrativeEncounterPending;

  const getBranchRef = (id: number): React.RefObject<TBranchRef | null> => {
    if (!branchRefs.current[id]) {
      branchRefs.current[id] = createRef<TBranchRef>();
    }

    return branchRefs.current[id];
  };

  useEffect(() => {
    const listener = AppState.addEventListener('change', nextState => {
      if (nextState.match(/active/)) {
        dispatch({type: 'AUTO_PAUSE_ON_ACTIVE'});
      }
    });

    return () => listener.remove();
  }, []);

  useEffect(() => {
    if (state.status !== 'running') {
      return;
    }

    intervalRef.current = setInterval(() => {
      dispatch({type: 'TICK_1S'});
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.status]);

  useEffect(() => {
    if (!state.pendingBranchQueue.length || commitRafRef.current !== null) {
      return;
    }

    commitRafRef.current = requestAnimationFrame(() => {
      commitRafRef.current = null;
      dispatch({type: 'COMMIT_BRANCH_SHIFT'});
    });

    return () => {
      if (commitRafRef.current !== null) {
        cancelAnimationFrame(commitRafRef.current);
        commitRafRef.current = null;
      }
    };
  }, [state.pendingBranchQueue.length]);

  useEffect(() => {
    const activeBranchIds = new Set(state.branches.map(branch => branch.id));

    Object.keys(branchRefs.current).forEach(branchIdKey => {
      const branchId = Number(branchIdKey);

      if (!activeBranchIds.has(branchId)) {
        delete branchRefs.current[branchId];
      }
    });
  }, [state.branches]);

  const resetGame = () => {
    dispatch({type: 'RESET_RUN'});
    setAnimatingIn(false);
  };

  const handlePress = (side: Side) => {
    if (animatingIn || state.status !== 'running') {
      return;
    }

    dispatch({
      type: 'CHOP_RESOLVE',
      side,
      thrownAwayId: Crypto.randomUUID(),
    });

    state.branches.forEach(branch => {
      getBranchRef(branch.id).current?.animateDown();
    });
  };

  const continueRun = () => {
    dispatch({type: 'CONTINUE_AFTER_AD'});
    setAnimatingIn(false);
  };

  const togglePaused = () => {
    dispatch({type: 'TOGGLE_PAUSE'});
  };

  return (
    <View style={styles.container}>
      <Background score={state.score} step={state.step} />

      <FlatList
        pointerEvents="none"
        style={styles.branchContainer}
        contentContainerStyle={styles.branchContentContainer}
        data={state.branches}
        renderItem={({item, index}) => (
          <Branch side={item.type} index={index} ref={getBranchRef(item.id)} />
        )}
        removeClippedSubviews={Platform.OS === 'android'}
        keyExtractor={item => item.id.toString()}
      />

      {state.thrownAwayEvents.map(event => (
        <ThrownAway side={event.side} key={event.id} />
      ))}

      <Pressable style={styles.leftSide} onPressIn={() => handlePress('left')}>
        <View style={styles.side} />
      </Pressable>

      <View style={styles.middle} />

      <Pressable
        style={styles.rightSide}
        onPressIn={() => handlePress('right')}>
        <View style={styles.side} />
      </Pressable>

      <Player
        gameOver={gameOver}
        currentSide={state.side}
        setDisablePress={setAnimatingIn}
        step={state.step}
        pendingDeath={pendingDeath}
        resumeSeq={state.resumeSeq}
      />

      <View style={styles.headerContainer}>
        <Text style={styles.score}>{state.score}</Text>

        {!paused && !gameOver && !encounterActive && (
          <Pressable onPress={togglePaused} style={styles.pauseButton}>
            <Image source={images.pause} style={styles.pauseImage} />
          </Pressable>
        )}
      </View>

      <OxygenMeter o2={state.o2} />

      {paused && !pendingDeath && !encounterActive && (
        <View style={styles.pauseContainer}>
          <Pressable style={styles.continueButton} onPress={togglePaused}>
            <Image source={images.play} style={styles.pauseImage} />
          </Pressable>
          <Text style={styles.pauseText}>PAUSED</Text>
        </View>
      )}

      <GameOverModal
        canContinue={pendingDeath && state.runContinuesUsed < 1 && !encounterActive}
        onContinue={continueRun}
        visible={
          (pendingDeath || gameOver) &&
          !encounterActive &&
          !state.narrativeEncounterPending
        }
        score={state.score}
        tanksCollected={state.tanksCollected}
        resetGame={resetGame}
      />

      <EncounterFlow
        encounterCheckSeq={state.encounterCheckSeq}
        score={state.score}
        onFlowResolved={() => dispatch({type: 'ENCOUNTER_FLOW_RESOLVED'})}
      />
    </View>
  );
};

export default Game;
