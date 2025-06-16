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

const Background = ({level, setLevel, score, step}: IBackground) => {
  const levelOpacity = useRef(new Animated.Value(0)).current;
  const levelOpacityInterpolate = levelOpacity.interpolate({
    inputRange: [0, 35000],
    outputRange: [0, 0.12],
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
  }, [step]);
  return (
    <>
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
          style={[
            styles.backgroundColorShift,
            {
              opacity: levelOpacityInterpolate,
            },
          ]}
        />
      </Animated.View>

      {level === 2 && (
        <Animated.View
          style={[
            styles.levelNameContainer,
            {
              transform: [{rotate: spin}, {translateY: levelNameY}],
            },
          ]}>
          <ImageBackground
            source={images.spaceProbe}
            resizeMode="stretch"
            style={styles.levelNameBackground}>
            <Text style={styles.levelNameText}>{`Solaris`}</Text>
          </ImageBackground>
        </Animated.View>
      )}
    </>
  );
};

export default Background;
