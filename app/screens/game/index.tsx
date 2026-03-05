import React, {createRef, useEffect, useReducer, useRef, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
  AppState,
} from 'react-native';
import {Image} from 'expo-image';
import * as Crypto from 'expo-crypto';
import {
  ThrownAway,
  Branch,
  GameOverModal,
  OxygenMeter,
  Background,
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

  const paused = state.status === 'paused';
  const pendingDeath = state.status === 'pending_death';
  const gameOver = state.status === 'game_over';

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

    // Keep visual branch animation, but decouple state progression from animation callbacks.
    // Callback-driven commits can be dropped under very rapid tapping.
    state.branches.forEach(branch => {
      getBranchRef(branch.id).current?.animateDown(() => {});
    });

    setTimeout(() => {
      dispatch({type: 'COMMIT_BRANCH_SHIFT'});
    }, 25);
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

        {!paused && !gameOver && (
          <Pressable onPress={togglePaused} style={styles.pauseButton}>
            <Image source={images.pause} style={styles.pauseImage} />
          </Pressable>
        )}
      </View>
      <OxygenMeter o2={state.o2} />

      {paused && !pendingDeath && (
        <View style={styles.pauseContainer}>
          <Pressable style={styles.continueButton} onPress={togglePaused}>
            <Image source={images.play} style={styles.pauseImage} />
          </Pressable>
          <Text style={styles.pauseText}>PAUSED</Text>
        </View>
      )}

      <GameOverModal
        canContinue={pendingDeath && state.runContinuesUsed < 1}
        onContinue={continueRun}
        visible={pendingDeath || gameOver}
        score={state.score}
        resetGame={resetGame}
      />
    </View>
  );
};

export default Game;
