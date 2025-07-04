import React, {useState, createRef, useEffect} from 'react';
import {
  Text,
  View,
  FlatList,
  Pressable,
  Platform,
  AppState,
  AppStateStatus,
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
import {randInt} from '@/utils';

import styles from './styles';
import Player from '@/components/Player';
import {useOxygen} from '@/hooks/useOxygen';
import {getLevel} from '../../../utils/level';

type TSide = 'left' | 'right';
type TBranch = {type: number; id: number; ref: React.RefObject<any>};

const defaultBranches = [
  {type: 0, id: 8, ref: createRef()},
  {type: 0, id: 7, ref: createRef()},
  {type: 0, id: 6, ref: createRef()},
  {type: 0, id: 5, ref: createRef()},
  {type: 0, id: 4, ref: createRef()},
  {type: 0, id: 3, ref: createRef()},
  {type: 0, id: 2, ref: createRef()},
  {type: 0, id: 1, ref: createRef()},
  {type: 0, id: 0, ref: createRef()},
];

let timerInterval: any;
let oxygenChance = 0;

// Bump up the chance by 1 for every 7500, defaulting to 6 at 0
const getOxygenChance = (score: number) =>
  Math.min(6 + Math.floor(score / 7500), 16);

const Game = () => {
  // Current side player is on
  const [currentSide, setCurrentSide] = useState<TSide>('left');
  // All the branch views
  // 0 - no branch, 1 - left side branch, 2 - right side branch
  // 3 - left side oxygen tank, 4 - right side oxygen tank
  const [branches, setBranches] = useState<TBranch[]>(defaultBranches);
  // Array to store thrown away squares
  const [thrownAwayArr, setThrownAwayArr] = useState<React.JSX.Element[]>([]);
  const [paused, setPaused] = useState(false);

  const [animatingIn, setAnimatingIn] = useState(false);

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  // animation for the astronaut
  const [step, setStep] = useState(false);
  const [backgrounded, setAppBackgrounded] = useState<AppStateStatus>('active');

  const level = getLevel(score);

  useEffect(() => {
    const listener = AppState.addEventListener('change', state =>
      setAppBackgrounded(state),
    );

    return () => listener.remove();
  }, []);

  useEffect(() => {
    if (backgrounded.match(/active/) && !gameOver && !!score) {
      setPaused(() => {
        clearInterval(timerInterval);
        timerInterval = undefined;
        return true;
      });
    }
  }, [backgrounded]);

  const resetGame = () => {
    timerInterval = setInterval(() => {
      setScore(prevState => {
        if (prevState > 0) {
          return prevState - 20;
        }
        return 0;
      });
    }, 1000);

    setGameOver(false);
    refill(31);
    setThrownAwayArr([]);
    setBranches(defaultBranches);
    setScore(0);
  };

  const endGame = () => {
    setGameOver(true);
    clearInterval(timerInterval);
    timerInterval = undefined;
  };

  const {refill, o2} = useOxygen(paused, gameOver, endGame);

  const generateNewBranch = (lastBranch: TBranch): number => {
    if (
      (score >= 35_000 && score < 36_000) ||
      (score >= 60_000 && score < 61_000)
    ) {
      return 0;
    }

    const biasedRand012 = (): 0 | 1 | 2 => {
      const r = randInt(0, 8);
      return r === 0 ? 0 : r < 5 ? 1 : 2;
    };

    let nextBranch: number = biasedRand012();
    if (level === 3 && nextBranch === 0) nextBranch = randInt(0, 2);

    if (nextBranch === 0 && oxygenChance >= getOxygenChance(score)) {
      oxygenChance = 0;
      return 3 + randInt(0, 1);
    }

    if (level === 2 && lastBranch.type === nextBranch) {
      nextBranch = nextBranch === 1 ? 2 : 1;
    } else if (level === 3) {
      if (oxygenChance > getOxygenChance(score) * 3) {
        oxygenChance = 0;
        return 3 + randInt(0, 1);
      }
      if (randInt(0, 3)) oxygenChance++;
      if (lastBranch.type === nextBranch && randInt(0, 1)) {
        nextBranch = nextBranch === 1 ? 2 : 1;
      }
    } else if (lastBranch.type !== 0) {
      oxygenChance++;
      nextBranch = 0;
    }

    return nextBranch;
  };

  const handlePress = (side: TSide) => {
    if (animatingIn || paused || gameOver) return;

    setCurrentSide(side);
    setStep(prevState => !prevState);

    // Handle branch animations
    const lastBranch = branches[branches.length - 1];
    const nextBranch = branches[branches.length - 2];
    const lastGeneratedBranch = branches[0];

    branches.forEach(b => {
      b.ref?.current?.animateDown(() => {
        if (b.id === lastBranch.id) {
          requestAnimationFrame(() =>
            setBranches(prevState => {
              const copy = [...prevState];
              copy.pop();
              copy.unshift({
                type: generateNewBranch(lastGeneratedBranch),
                id: prevState[0].id + 1,
                ref: createRef(),
              });
              return copy;
            }),
          );
        }
      });
    });

    setThrownAwayArr([
      ...thrownAwayArr,
      <ThrownAway side={lastBranch.type} key={Crypto.randomUUID()} />,
    ]);

    // Check to see if player is chopping tree below branch
    if (
      (side === 'left' && nextBranch.type === 1) ||
      (side === 'right' && nextBranch.type === 2)
    ) {
      endGame();
      return;
    } else {
      if (side === 'left' && nextBranch.type === 3) {
        refill(8);
      } else if (side === 'right' && nextBranch.type === 4) {
        refill(8);
      }

      setScore(prevState => prevState + 100);
    }
  };

  const togglePaused = () => {
    setPaused(prev => {
      if (prev) {
        if (!timerInterval) {
          timerInterval = setInterval(() => {
            setScore(prevState => prevState - 20);
          }, 1000);
        }
      } else {
        clearInterval(timerInterval);
        timerInterval = undefined;
      }
      return !prev;
    });
  };

  return (
    <View style={styles.container}>
      <Background score={score} step={step} />
      <FlatList
        pointerEvents="none"
        style={styles.branchContainer}
        contentContainerStyle={styles.branchContentContainer}
        data={branches}
        renderItem={({item, index}) => (
          <Branch side={item.type} index={index} ref={item.ref} />
        )}
        removeClippedSubviews={Platform.OS === 'android'}
        keyExtractor={item => item.id.toString()}
      />

      {thrownAwayArr}

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
        setCurrentSide={setCurrentSide}
        currentSide={currentSide}
        setDisablePress={setAnimatingIn}
        step={step}
      />

      <View style={styles.headerContainer}>
        <Text style={styles.score}>{score}</Text>

        {!paused && !gameOver && (
          <Pressable onPress={togglePaused} style={styles.pauseButton}>
            <Image source={images.pause} style={styles.pauseImage} />
          </Pressable>
        )}
      </View>
      <OxygenMeter o2={o2} />

      {paused && (
        <View style={styles.pauseContainer}>
          <Pressable style={styles.continueButton} onPress={togglePaused}>
            <Image source={images.play} style={styles.pauseImage} />
          </Pressable>
          <Text style={styles.pauseText}>PAUSED</Text>
        </View>
      )}

      <GameOverModal visible={gameOver} score={score} resetGame={resetGame} />
    </View>
  );
};

export default Game;
