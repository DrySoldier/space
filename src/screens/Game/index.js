import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Animated, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import ProgressBar from 'react-native-progress/Bar';
import { ThrownAway, HeightView, GameOverModal, FastImageBackground } from '../../components';
import { images, moderateScale as ms } from '../../constants';
import { randInt, useInterval } from '../../utils';

import styles from './styles';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const Game = ({ navigation }) => {
  // Current side player is on
  const [currentSide, setSide] = useState('left');
  // 0 - no branch, 1 - left side branch, 2 - right side branch
  // The rantInts set up random branches on the top
  const defaultBranches = [0, randInt(0, 2), 0, randInt(0, 2), 0, 0, 0, 0];
  const [branches, setNextBranch] = useState(defaultBranches);
  // Used to space out branches
  const [lastBranch, setLastBranch] = useState(-1);
  // All the branch views
  const [branchViews, setBranchViews] = useState([]);
  // Array to store thrown away squares
  const [thrownAwayArr, setThrownAwayArr] = useState([]);
  // A view set at the bottom, so to animate the entire stack of tiles going down
  const [heightArr, setHeightArr] = useState([
    <HeightView key={randInt(0, 99999)} callback={heightFinished} />,
  ]);
  // Score
  const [score, setScore] = useState(-1);
  // Game over modal
  const [modal, setModal] = useState(false);
  // Variable for if next branch is on left or right. -1 is neither.
  const [branchLocation, setBranchLocation] = useState(-1);
  // current player model TODO: Set up animated sprite
  const defaultPosition = images['astro-left-2'];
  const [playerModel, setPlayerModel] = useState(defaultPosition);
  const [step, setStep] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [progressBarVal, setProgressBarVal] = useState(1);
  const [progressBarPaused, setProgressBarPaused] = useState(false);

  const astroSwapSideVal = useRef(new Animated.Value(0)).current;
  const astroSpin = useRef(new Animated.Value(0)).current;

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

  const setBranchStatus = () => {
    const branchArr = branches.map((element) => {
      switch (element) {
        case 0:
          return (
            <FastImageBackground
              source={images.elevatorTile}
              key={randInt(0, 99999)}
              style={[styles.branch]}
            />
          );

        case 1:
          return (
            <FastImageBackground
              source={images.elevatorTile}
              key={randInt(0, 99999)}
              style={styles.branch}
            >
              <FastImage
                style={{
                  height: ms(100),
                  width: ms(100),
                  marginLeft: ms(-100),
                }}
                source={images.obstacleTile}
              />
            </FastImageBackground>
          );

        case 2:
          return (
            <FastImageBackground
              source={images.elevatorTile}
              key={randInt(0, 99999)}
              style={styles.branch}
            >
              <FastImage
                style={{
                  height: ms(100),
                  width: ms(100),
                  marginLeft: ms(100),
                  transform: [{ rotate: '180deg' }],
                }}
                source={images.obstacleTile}
              />
            </FastImageBackground>
          );

        default:
          return (
            <FastImageBackground
              source={images.elevatorTile}
              key={randInt(0, 99999)}
              style={[styles.branch]}
            />
          );
      }
    });
    setBranchViews(branchArr);
  };

  useInterval(() => {
    const progressBarDecrease = progressBarVal - 0.035;
    if (!progressBarPaused) {
      setProgressBarVal(progressBarDecrease);
    }
  }, 100);

  const _handlePress = (side) => {
    setStep(!step);
    setSide(side);

    const newThrownAway = <ThrownAway key={randInt(0, 99999)} />;
    setThrownAwayArr([newThrownAway, ...thrownAwayArr]);

    const newProgressBarVal = progressBarVal + 0.065;
    if (newProgressBarVal > 1) {
      setProgressBarVal(1);
    } else {
      setProgressBarVal(newProgressBarVal);
    }

    // Check to see if player is moving INTO a branch
    if ((side === 'left' && branchLocation === 1) || (side === 'right' && branchLocation === 2)) {
      setGameOver(true);
      return;
    } else {
      let copy = [...branches];
      copy.pop();
      copy.unshift(_generateNewBranch());
      setNextBranch(copy);
      setBranchLocation(branches[branches.length - 1]);
      setHeightArr([
        ...heightArr,
        <HeightView key={randInt(0, 99999)} callback={heightFinished} />,
      ]);
    }

    // Check to see if player is chopping tree below branch
    if (
      (side === 'left' && branches[branches.length - 1] === 1) ||
      (side === 'right' && branches[branches.length - 1] === 2)
    ) {
      setGameOver(true);
      return;
    } else {
      setScore(score + 1);
    }
  };

  const _generateNewBranch = () => {
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

  const heightFinished = () => {
    const heightArrCopy = [...heightArr];
    heightArrCopy.pop();
    setHeightArr(heightArrCopy);

    setBranchStatus();
  };

  useEffect(() => {
    setBranchStatus();
  }, []);

  useEffect(() => {
    if (progressBarVal <= 0) {
      setGameOver(true);
    }
  }, [progressBarVal]);

  useEffect(() => {
    let toValue = null;

    if (currentSide === 'left') {
      astroSwapSideVal.setValue(ms(70));
      toValue = ms(-70);
    } else if (currentSide === 'right') {
      astroSwapSideVal.setValue(ms(-70));
      toValue = ms(70);
    }

    Animated.timing(astroSwapSideVal, {
      toValue: toValue,
      duration: 25,
      useNativeDriver: true,
    }).start();
  }, [currentSide]);

  useEffect(() => {
    const stepNumber = step ? 1 : 2;

    if (currentSide === 'left') {
      setPlayerModel(images[`astro-right-${stepNumber}`]);
    } else if (currentSide === 'right') {
      setPlayerModel(images[`astro-left-${stepNumber}`]);
    }
  }, [step, currentSide]);

  useEffect(() => {
    if (gameOver) {
      setThrownAwayArr([]);
      setNextBranch(defaultBranches);
      setBranchLocation(-1);
      setModal(true);
      setProgressBarPaused(true);
      setProgressBarVal(1);

      Animated.timing(astroSpin, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else if (!gameOver) {
      setProgressBarPaused(false);
      setBranchStatus();
      setPlayerModel(defaultPosition);
      setModal(false);
      _handlePress('right');
      setScore(0);

      Animated.timing(astroSpin, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [gameOver, setGameOver]);

  return (
    <View style={styles.container}>
      <FastImageBackground source={images.space} style={styles.container}>
        <TouchableOpacity style={styles.leftSide} onPress={() => _handlePress('left')}>
          <View style={styles.side} />
        </TouchableOpacity>

        <View style={styles.middle} />

        <TouchableOpacity style={styles.rightSide} onPress={() => _handlePress('right')}>
          <View style={styles.side} />
        </TouchableOpacity>

        <View style={styles.branchContainer} pointerEvents="none">
          {heightArr}
          {branchViews}
        </View>

        <View style={styles.playerContainer} pointerEvents="none">
          <AnimatedFastImage
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
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={progressBarVal} width={200} height={20} />
          </View>
          <Text style={styles.score}>{score}</Text>
        </View>

        <View style={styles.ground} pointerEvents="none">
          {thrownAwayArr}
        </View>
        <GameOverModal
          navigation={navigation}
          visible={modal}
          score={score}
          resetGame={() => setGameOver(false)}
        />
      </FastImageBackground>
    </View>
  );
};

export default Game;
