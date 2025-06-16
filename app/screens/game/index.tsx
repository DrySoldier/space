import React, {useState, useEffect, useRef, createRef} from 'react';
import {
  Text,
  View,
  Animated,
  TouchableOpacity,
  FlatList,
  Easing,
  Pressable,
  Platform,
} from 'react-native';
import {Image, ImageBackground} from 'expo-image';
import {ThrownAway, Branch, GameOverModal, OxygenMeter} from '@/components';
import {images} from '@/constants';
import {randInt} from '@/utils';

import styles from './styles';
import {useOxygen} from '@/app/hooks/useOxygen';
import Player from '@/components/Player';

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

const backgroundSize = 1600;

let timerInterval: any;
let oxygenChance = 0;

// Bump up the chance by 1 for every 5000, defaulting to 6 at 0
const getOxygenChance = (score: number) =>
  Math.min(6 + Math.floor(score / 5000), 12);

const Game = () => {
  // Current side player is on
  const [currentSide, setCurrentSide] = useState<TSide>('left');
  // 0 - no branch, 1 - left side branch, 2 - right side branch
  // The rantInts set up random branches on the top
  const [branches, setBranches] = useState<TBranch[]>(defaultBranches);
  // All the branch views
  // Array to store thrown away squares
  const [thrownAwayArr, setThrownAwayArr] = useState<React.JSX.Element[]>([]);
  const [paused, setPaused] = useState(false);

  const [animatingIn, setAnimatingIn] = useState(false);

  const [score, setScore] = useState(-1);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const [isMoving, setIsMoving] = useState(false);

  const levelOpacity = useRef(new Animated.Value(0)).current;
  const levelOpacityInterpolate = levelOpacity.interpolate({
    inputRange: [0, 35000],
    outputRange: [0, 0.12],
  });

  // animation for the astronaut
  const [step, setStep] = useState(false);

  const {refill, o2} = useOxygen(isMoving, paused, gameOver);

  const offsetY = useRef(new Animated.Value(0)).current;
  const levelNameY = useRef(new Animated.Value(-200)).current;

  const buttonDegree = useRef(new Animated.Value(0)).current;

  const spin = buttonDegree.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });

  const startButtonRotateAnimation = () => {
    const randomDegree = Math.random();

    Animated.timing(buttonDegree, {
      toValue: randomDegree,
      duration: 5000,
      useNativeDriver: true,
    }).start(() => startButtonRotateAnimation());
  };

  const generateNewBranch = (lastBranch: TBranch) => {
    let nextBranch = randInt(0, 2);

    // Make empty branches a little more rare
    if (nextBranch === 0) {
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
    } else if (lastBranch.type !== 0) {
      oxygenChance++;
      nextBranch = 0;
    }

    return nextBranch;
  };

  const handlePress = (side: TSide) => {
    if (animatingIn || paused || gameOver) return;

    // Handle background shift
    offsetY.stopAnimation(current => {
      const target = current + 20;

      Animated.timing(offsetY, {
        toValue: target,
        duration: 5000,
        easing: Easing.bezier(0, 0.55, 0.45, 1),
        useNativeDriver: true,
      }).start();

      const wrapped = target % backgroundSize;
      if (wrapped > backgroundSize - 10) {
        offsetY.setValue(0);
      }
    });

    levelNameY.stopAnimation(current => {
      if (level === 2) {
        Animated.timing(levelNameY, {
          toValue: current + 100,
          duration: 5000,
          easing: Easing.bezier(0, 0.55, 0.45, 1),
          useNativeDriver: true,
        }).start();
      }
    });

    setCurrentSide(side);
    setStep(prevState => !prevState);

    // Handle branch animations
    const lastBranch = branches[7];
    const nextBranch = branches[6];
    const lastGeneratedBranch = branches[0];

    setIsMoving(true);

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
          setIsMoving(false);
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
      setScore(30000);
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
    levelOpacity.stopAnimation();
    Animated.timing(levelOpacity, {
      toValue: score,
      duration: 750,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (level !== 2 && score >= 35000) {
      startButtonRotateAnimation();
      levelNameY.setValue(-200);
      setLevel(2);
    }
  }, [score]);

  useEffect(() => {
    if (o2 <= 0) {
      setGameOver(true);
    }
  }, [o2]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [
              {translateY: offsetY},
              {
                skewY: '2deg',
              },
            ],
          },
        ]}>
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
        <Animated.View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#ff9900',
            position: 'absolute',
            opacity: levelOpacityInterpolate,
          }}
        />
      </Animated.View>

      {level === 2 && (
        <Animated.View
          style={{
            position: 'absolute',
            left: 25,
            top: 0,
            transform: [{rotate: spin}, {translateY: levelNameY}],
          }}>
          <ImageBackground
            source={images.spaceProbe}
            resizeMode="stretch"
            style={styles.levelNameBackground}>
            <Text
              style={styles.levelNameText}>{`Solaris`}</Text>
          </ImageBackground>
        </Animated.View>
      )}

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
