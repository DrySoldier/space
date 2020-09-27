import React, { useState, useEffect } from 'react';
import { Text, View, Animated, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { moderateScale as ms } from 'src/constants/scaling';
import { images } from 'src/constants/images';
import { ThrownAway, HeightView, GameOverModal, FastImageBackground } from '../../components';

import styles from './styles';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const Game = () => {
  // Current side player is on
  const [currentSide, setSide] = useState('left');
  // 0 - no branch, 1 - left side branch, 2 - right side branch
  // The rantInts set up random branches on the top
  const defaultBranches = [randInt(0, 2), 0, randInt(0, 2), 0, 0, 0, 0];
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
  const [branchLocation, setBranchLoc] = useState(-1);
  // current player model TODO: Set up animated sprite
  const [playerModel, setPlayerModel] = useState(
    require('../../assets/newAssets/Astronaut-right-climb2.png'),
  );
  const [gameOver, setGameOver] = useState(false);

  let animatedValue = new Animated.Value(0);
  let nextBranch = -1;

  let spaceGuySide;

  useEffect(() => {
    setBranchStatus();
  }, []);

  useEffect(() => {
    let toValue = null;

    if (currentSide === 'left') {
      animatedValue.setValue(ms(125));
      toValue = ms(-125);
    } else if (currentSide === 'right') {
      animatedValue.setValue(ms(-125));
      toValue = ms(125);
    }

    Animated.timing(animatedValue, {
      toValue: toValue,
      duration: 25,
    }).start();
  }, [currentSide, setSide]);

  useEffect(() => {
    if (gameOver) {
      setPlayerModel(images.nothing);
      setNextBranch(defaultBranches);
      setBranchLoc(-1);
      setSide('right');
      setModal(true);
    } else if (!gameOver) {
      setBranchStatus();
      setPlayerModel(require('../../assets/newAssets/Astronaut-right-climb1.png'));
      setModal(false);
      _handlePress('right');
      setScore(0);
    }
  }, [gameOver, setGameOver]);

  const setBranchStatus = () => {
    const branchArr = branches.map((element, index) => {
      switch (element) {
        case 0:
          return (
            <FastImageBackground
              source={require('../../assets/newAssets/Elevator_tile.png')}
              key={'nothing' + index + score}
              style={[styles.branch]}
            />
          );

        case 1:
          return (
            <FastImageBackground
              source={require('../../assets/newAssets/Elevator_tile.png')}
              key={'left' + index + score}
              style={[styles.branch, styles.branchLeft]}
            >
              <FastImage
                style={{
                  height: ms(100),
                  width: ms(100),
                  marginLeft: ms(-100),
                }}
                source={require('../../assets/newAssets/Obstacle_tile.png')}
              />
            </FastImageBackground>
          );

        case 2:
          return (
            <FastImageBackground
              source={require('../../assets/newAssets/Elevator_tile.png')}
              key={'right' + index + score}
              style={[styles.branch, styles.branchRight]}
            >
              <FastImage
                style={{ height: ms(100), width: ms(100), marginLeft: ms(100) }}
                source={require('../../assets/newAssets/Obstacle_tile.png')}
              />
            </FastImageBackground>
          );

        default:
          return (
            <FastImageBackground
              source={require('../../assets/newAssets/Elevator_tile.png')}
              key={'nothing' + index + score}
              style={[styles.branch]}
            />
          );
      }
    });
    setBranchViews(branchArr);
  };

  const _handlePress = (side) => {
    setSide(side);
    setPlayerModel(images[`astro-${side}`]);

    // Check to see if player is moving INTO a branch
    if ((side === 'left' && branchLocation === 1) || (side === 'right' && branchLocation === 2)) {
      setGameOver(true);
      spaceGuySide = side;
    } else {
      let copy = [...branches];
      copy.pop();
      copy.unshift(_generateNewBranch());
      setNextBranch(copy);
      setBranchLoc(branches[6]);
      setHeightArr([
        ...heightArr,
        <HeightView key={randInt(0, 99999)} callback={heightFinished} />,
      ]);
    }

    // Check to see if player is chopping tree below branch
    if ((side === 'left' && branches[6] === 1) || (side === 'right' && branches[6] === 2)) {
      setGameOver(true);
      spaceGuySide = side;
    } else {
      setScore(score + 1);
    }
  };

  const _generateNewBranch = () => {
    nextBranch = randInt(0, 2);

    // make empty branches a little more rare
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
    let copy = [...heightArr];
    copy.pop();
    setHeightArr(copy);

    var newThrownAway = <ThrownAway spaceGuySide={spaceGuySide} key={randInt(0, 99999)} />;
    setThrownAwayArr([...thrownAwayArr, newThrownAway]);

    setBranchStatus();
  };

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
          <Animated.View style={{ marginLeft: animatedValue }}>
            <FastImage style={styles.player} source={playerModel} />
          </Animated.View>
        </View>

        <View style={styles.headerContainer} pointerEvents="none">
          {
            //<ProgressBarAnimated value={progress} maxValue={100} width={barWidth}></ProgressBarAnimated>
          }
          <Text style={styles.score}>{score}</Text>
        </View>

        <View style={styles.ground} pointerEvents="none">
          {thrownAwayArr}
        </View>
        <GameOverModal visible={modal} score={score} resetGame={() => setGameOver(false)} />
      </FastImageBackground>
    </View>
  );
};

export default Game;
