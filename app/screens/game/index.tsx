import React, {useState, useEffect, createRef, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
  Platform,
} from 'react-native';
import {Image} from 'expo-image';
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

type TSide = 'left' | 'right';
type TBranch = {type: number; id: number; ref: React.RefObject<any>};

const defaultBranches = [
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

// Bump up the chance by 1 for every 5000, defaulting to 6 at 0
const getOxygenChance = (score: number) =>
  Math.min(6 + Math.floor(score / 7500), 14);

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

  const [score, setScore] = useState(-1);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  // animation for the astronaut
  const [step, setStep] = useState(false);

  let isMoving = useRef(false).current;

  const {refill, o2} = useOxygen(isMoving, paused, gameOver);

  const generateNewBranch = (lastBranch: TBranch) => {
    let nextBranch = randInt(0, 2);

    // Make empty branches a little more rare
    if (nextBranch === 0) {
      nextBranch = randInt(0, 2);
    }

    if (nextBranch === 0 && level === 3) {
      nextBranch = randInt(0, 2);
    }

    if (nextBranch === 0) {
      const hasOxygenTank = oxygenChance >= getOxygenChance(score);

      const side = randInt(0, 1);
      if (hasOxygenTank) {
        nextBranch = 3 + side;
        oxygenChance = 0;
        return nextBranch;
      }
    }

    if (level === 2 && lastBranch.type === nextBranch) {
      if (nextBranch === 1) {
        nextBranch++;
      } else if (nextBranch === 2) {
        nextBranch--;
      }
    } else if (level === 3) {
      if (oxygenChance > getOxygenChance(score)) {
        const side = randInt(0, 1);
        nextBranch = 3 + side;
        oxygenChance = 0;
      } else {
        const pseudoOxygen = randInt(0, 3);
        if (pseudoOxygen) oxygenChance++;
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
    const lastBranch = branches[7];
    const nextBranch = branches[6];
    const lastGeneratedBranch = branches[0];

    isMoving = true;

    branches.forEach(b => {
      b.ref?.current.animateDown(() => {
        if (b.id === lastBranch.id) {
          setBranches(prevState => {
            const copy = [...prevState];
            copy.pop();
            copy.unshift({
              type: generateNewBranch(lastGeneratedBranch),
              id: prevState[0].id + 1,
              ref: createRef(),
            });
            return copy;
          });
          isMoving = false;
        }
      });
    });

    setThrownAwayArr([
      ...thrownAwayArr,
      <ThrownAway side={lastBranch.type} key={randInt(0, 999999)} />,
    ]);

    // Check to see if player is chopping tree below branch
    if (
      (side === 'left' && nextBranch.type === 1) ||
      (side === 'right' && nextBranch.type === 2)
    ) {
      setGameOver(true);
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

  useEffect(() => {
    if (gameOver) {
      clearInterval(timerInterval);
      timerInterval = undefined;
    } else if (!gameOver) {
      timerInterval = setInterval(() => {
        setScore(prevState => {
          if (prevState > 0) {
            return prevState - 20;
          }
          return 0;
        });
      }, 1000);

      setLevel(1);
      refill(31);
      setThrownAwayArr([]);
      setBranches(defaultBranches);
      setScore(0);
    }

    return () => clearInterval(timerInterval);
  }, [gameOver]);

  useEffect(() => {
    if (paused) {
      clearInterval(timerInterval);
      timerInterval = undefined;
    } else {
      if (!timerInterval) {
        timerInterval = setInterval(() => {
          setScore(prevState => prevState - 20);
        }, 1000);
      }
    }
  }, [paused]);

  useEffect(() => {
    if (o2 <= 0) {
      setGameOver(true);
    }
  }, [o2]);

  return (
    <View style={styles.container}>
      <Background setLevel={setLevel} level={level} score={score} step={step} />
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

      <TouchableOpacity
        style={styles.leftSide}
        onPress={() => handlePress('left')}>
        <View style={styles.side} />
      </TouchableOpacity>

      <View style={styles.middle} />

      <TouchableOpacity
        style={styles.rightSide}
        onPress={() => handlePress('right')}>
        <View style={styles.side} />
      </TouchableOpacity>

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
          <Pressable onPress={() => setPaused(true)} style={styles.pauseButton}>
            <Image source={images.pause} style={styles.pauseImage} />
          </Pressable>
        )}
      </View>
      <OxygenMeter o2={o2} />

      <View style={styles.ground} pointerEvents="none">
        {thrownAwayArr}
      </View>

      {paused && (
        <View style={styles.pauseContainer}>
          <Pressable
            style={styles.continueButton}
            onPress={() => setPaused(false)}>
            <Image source={images.play} style={styles.pauseImage} />
          </Pressable>
          <Text style={styles.pauseText}>PAUSED</Text>
        </View>
      )}

      <GameOverModal
        visible={gameOver}
        score={score}
        resetGame={() => setGameOver(false)}
      />
    </View>
  );
};

export default Game;
