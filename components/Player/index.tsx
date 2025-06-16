import {View, Animated} from 'react-native';
import React, {SetStateAction, useEffect, useRef, useState} from 'react';
import {images, moderateScale as ms, width} from '@/constants';
import styles from './style';
import {randInt} from '@/utils';
import {BRANCH_HW} from '../Branch/styles';

const defaultPosition = images['astro-right-2'];
type TSide = 'left' | 'right';

interface IPlayer {
  currentSide: TSide;
  setCurrentSide: React.Dispatch<SetStateAction<TSide>>;
  setDisablePress: React.Dispatch<SetStateAction<boolean>>;
  gameOver: boolean;
  step: boolean;
}

const PLAYER_RIGHT_X = BRANCH_HW - width * 0.1;
const PLAYER_LEFT_X = -(width * 0.16);

const Player = ({currentSide, setCurrentSide, setDisablePress, gameOver, step}: IPlayer) => {
  // current player model TODO: Set up animated sprite
  const [playerModel, setPlayerModel] = useState(defaultPosition);

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

  useEffect(() => {
    let toValue = 0;

    if (currentSide === 'left') {
      toValue = PLAYER_LEFT_X;
    } else if (currentSide === 'right') {
      toValue = PLAYER_RIGHT_X;
    }

    Animated.timing(astroSwapSideVal, {
      toValue: toValue,
      duration: 100,
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
  }, [step]);

  useEffect(() => {
    if (gameOver) {
      Animated.timing(astroSpin, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } else {
      setPlayerModel(defaultPosition);
      animateAstronautIn();
    }
  }, [gameOver]);

  const animateAstronautIn = () => {
    setDisablePress(true);
    astroSwapSideVal.setValue(-300);
    astroSpin.setValue(1);

    Animated.parallel([
      Animated.timing(astroSwapSideVal, {
        toValue: PLAYER_LEFT_X,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(astroSpin, {
        toValue: 0,
        duration: 750,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDisablePress(false);
      setCurrentSide('left');
    });
  };

  return (
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
  );
};

export default Player;
