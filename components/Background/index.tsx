import {Animated, Easing, Text} from 'react-native';
import React, {SetStateAction, useEffect, useRef} from 'react';
import {Image, ImageBackground} from 'expo-image';
import {images} from '@/constants';
import styles from './styles';

interface IBackground {
  level: number;
  setLevel: React.Dispatch<SetStateAction<number>>;
  score: number;
  step: boolean;
}

const backgroundSize = 1600;

const levelNames = {
  2: 'Solaris',
  3: 'The Unheard',
};

const Background = ({level, setLevel, score, step}: IBackground) => {
  const levelOpacity = useRef(new Animated.Value(0)).current;
  const levelOpacity2Interpolate = levelOpacity.interpolate({
    inputRange: [0, 30000, 55000],
    outputRange: [0, 0.12, 0],
  });
  const levelOpacity3Interpolate = levelOpacity.interpolate({
    inputRange: [45000, 60000],
    outputRange: [0, 0.15],
  });

  const buttonDegree = useRef(new Animated.Value(0)).current;
  const offsetY = useRef(new Animated.Value(0)).current;
  const levelNameY = useRef(new Animated.Value(-200)).current;

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

  useEffect(() => {
    levelOpacity.stopAnimation();
    Animated.timing(levelOpacity, {
      toValue: score,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    if (level !== 2 && score >= 35000 && score < 60000) {
      startButtonRotateAnimation();
      levelNameY.setValue(-200);
      setLevel(2);
    }

    if (level !== 3 && score >= 60000) {
      levelNameY.setValue(-200);
      setLevel(3);
    }
  }, [score]);

  useEffect(() => {
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
      if (level === 2 || level === 3) {
        Animated.timing(levelNameY, {
          toValue: current + 100,
          duration: 5000,
          easing: Easing.bezier(0, 0.55, 0.45, 1),
          useNativeDriver: true,
        }).start();
      }
    });
  }, [step]);
  return (
    <>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [{translateY: offsetY}],
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

      {(level === 2 || level === 3) && (
        <Animated.View
          style={[
            styles.levelNameContainer,
            {
              transform: [{rotate: spin}, {translateY: levelNameY}],
            },
          ]}>
          <ImageBackground
            source={images.spaceScreen}
            resizeMode="stretch"
            style={styles.levelNameBackground}>
            <Text style={styles.levelNameText}>{levelNames[level]}</Text>
          </ImageBackground>
        </Animated.View>
      )}
      <Animated.View
        style={[
          styles.backgroundColorShift2,
          {
            opacity: levelOpacity2Interpolate,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.backgroundColorShift3,
          {
            opacity: levelOpacity3Interpolate,
          },
        ]}
      />
    </>
  );
};

export default Background;
