import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Animated,
  TouchableOpacity,
  FlatList,
  Image,
  Easing,
} from 'react-native';
import {ThrownAway, Branch} from '../../../components';
import {images, moderateScale as ms} from '../../../constants';
import {randInt} from '../../../utils';

import styles from './styles';
import GameOverModal from '../../../components/GameOverModal';

type TSide = 'left' | 'right';

const defaultBranches = [0, randInt(0, 2), 0, 0, 0, 0, 0, 0];

const backgroundSize = 1600;

const Game = () => {
  // Current side player is on
  const [currentSide, setCurrentSide] = useState('left');
  // 0 - no branch, 1 - left side branch, 2 - right side branch
  // The rantInts set up random branches on the top
  const [branches, setBranches] = useState<Number[]>(defaultBranches);
  // Used to space out branches
  const [lastBranch, setLastBranch] = useState(-1);
  // All the branch views
  // Array to store thrown away squares
  const [thrownAwayArr, setThrownAwayArr] = useState<React.JSX.Element[]>([]);

  const [branchesElevated, setBranchesElevated] = useState(0);

  const [disablePress, setDisablePress] = useState(false);

  const [score, setScore] = useState(-1);
  // current player model TODO: Set up animated sprite
  const defaultPosition = images['astro-right-2'];

  const [playerModel, setPlayerModel] = useState(defaultPosition);
  // animation for the astronaut
  const [step, setStep] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const astroSwapSideVal = useRef(new Animated.Value(0)).current;
  const astroSpin = useRef(new Animated.Value(0)).current;
  const offsetY = useRef(new Animated.Value(0)).current;

  const spin = astroSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${randInt(5, 290)}deg`],
  });

  const scale = astroSpin.interpolate({
    inputRange: [0.2, 1],
    outputRange: [0.78, 0],
  });

  const astroFall = astroSpin.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const animateAstronautIn = () => {
    setDisablePress(true);

    astroSwapSideVal.setValue(-300);
    astroSpin.setValue(1);

    Animated.parallel([
      Animated.timing(astroSwapSideVal, {
        toValue: ms(-70),
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(astroSpin, {
        toValue: 0,
        duration: 750,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentSide('left');
      setDisablePress(false);
    });
  };

  const handlePress = (side: TSide) => {
    if (disablePress) return;

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

    setStep(!step);
    setCurrentSide(side);

    let toValue = 0;

    if (side === 'left') {
      toValue = ms(-70);
    } else if (side === 'right') {
      toValue = ms(70);
    }

    Animated.timing(astroSwapSideVal, {
      toValue: toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();

    setThrownAwayArr([
      ...thrownAwayArr,
      <ThrownAway
        side={branches[branches.length - 1]}
        key={randInt(0, 9999999)}
      />,
    ]);

    let copy = [...branches];
    copy.pop();
    copy.unshift(generateNewBranch());
    setBranches(copy);

    // Check to see if player is chopping tree below branch
    if (
      (side === 'left' && branches[branches.length - 2] === 1) ||
      (side === 'right' && branches[branches.length - 2] === 2)
    ) {
      setGameOver(true);
      return;
    } else {
      setScore(prevState => prevState + 100);
    }
  };

  const generateNewBranch = () => {
    let nextBranch = randInt(0, 2);

    // Make empty branches a little more rare
    if (nextBranch === 0) {
      nextBranch = randInt(0, 2);
    }

    if (lastBranch !== 0) {
      setLastBranch(0);
      return 0;
    } else {
      setLastBranch(nextBranch);
      return nextBranch;
    }
  };

  useEffect(() => {
    const stepNumber = step ? 1 : 2;

    if (currentSide === 'left') {
      setPlayerModel(images[`astro-right-${stepNumber}`]);
    } else if (currentSide === 'right') {
      setPlayerModel(images[`astro-left-${stepNumber}`]);
    }
  }, [step]);

  useEffect(() => {
    let timerInterval: any;

    if (gameOver) {
      clearInterval(timerInterval);

      Animated.timing(astroSpin, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else if (!gameOver) {
      timerInterval = setInterval(() => {
        setScore(prevState => prevState - 20);
      }, 1000);

      animateAstronautIn();
      setThrownAwayArr([]);
      setBranches(defaultBranches);
      setPlayerModel(defaultPosition);
      setScore(0);
    }

    return () => clearInterval(timerInterval);
  }, [gameOver]);

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
      </Animated.View>
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

      <FlatList
        pointerEvents="none"
        style={styles.branchContainer}
        contentContainerStyle={{
          alignItems: 'center',
        }}
        data={branches}
        renderItem={({item}) => <Branch side={item} />}
      />

      <View style={styles.playerContainer} pointerEvents="none">
        <Animated.Image
          style={{
            ...styles.player,
            transform: [
              {
                translateX: astroSwapSideVal,
              },
              {
                translateY: astroFall,
              },
              {
                scale,
              },
              {
                rotate: spin,
              },
            ],
          }}
          source={playerModel}
        />
      </View>

      <View style={styles.headerContainer} pointerEvents="none">
        <Text style={styles.score}>{score}</Text>
      </View>

      <View style={styles.ground} pointerEvents="none">
        {thrownAwayArr}
      </View>
      <GameOverModal
        visible={gameOver}
        score={score}
        resetGame={() => setGameOver(false)}
      />
    </View>
  );
};

export default Game;
