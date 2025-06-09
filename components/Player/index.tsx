import {View, Animated} from 'react-native';
import React, {SetStateAction, useEffect, useRef, useState} from 'react';
import {images, moderateScale as ms} from '@/constants';
import styles from './style';
import {randInt} from '@/utils';

const defaultPosition = images['astro-right-2'];

type TSide = 'left' | 'right';

interface IPlayer {
  currentSide: TSide
  setCurrentSide: React.Dispatch<SetStateAction<TSide>>;
  setDisablePress: React.Dispatch<SetStateAction<boolean>>;
  gameOver: boolean;
  step: boolean;
}

const Player = ({
  currentSide,
  setCurrentSide,
  setDisablePress,
  gameOver,
  step,
}: IPlayer) => {
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
      toValue = ms(-65);
    } else if (currentSide === 'right') {
      toValue = ms(65);
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
