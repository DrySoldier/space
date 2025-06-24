import {Animated, Easing, Text} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Image, ImageBackground} from 'expo-image';
import {images} from '@/constants';
import styles from './styles';
import {getLevel} from '../../utils/level';

interface IBackground {
  score: number;
  step: boolean;
}

const backgroundSize = 1600;

const levelNames = {
  2: 'Solaris',
  3: 'Elysia',
};

const Background = ({score, step}: IBackground) => {
  const levelOpacity = useRef(new Animated.Value(0)).current;
  const levelOpacity2Interpolate = levelOpacity.interpolate({
    inputRange: [0, 30000, 57500, 60000],
    outputRange: [0, 0.12, 0.12, 0],
  });
  const levelOpacity3Interpolate = levelOpacity.interpolate({
    inputRange: [57500, 60000, 999999999],
    outputRange: [0, 0.15, 0.15],
  });

  const offsetY = useRef(new Animated.Value(0)).current;
  const levelNameY = useRef(new Animated.Value(-200)).current;
  const level = getLevel(score);

  useEffect(() => {
    levelOpacity.stopAnimation();
    Animated.timing(levelOpacity, {
      toValue: score,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

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

  useEffect(() => {
    if (level === 1) {
      Animated.timing(levelOpacity, {
        toValue: 0,
        duration: 5000,
        easing: Easing.bezier(0, 0.55, 0.45, 1),
        useNativeDriver: true,
      }).start();
    }

    if (level === 2) {
      levelNameY.stopAnimation(() => {
        levelNameY.setValue(-200);
      });
    }

    if (level === 3) {
      levelNameY.stopAnimation(() => {
        levelNameY.setValue(-200);
      });
    }
  }, [level]);

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
              transform: [{rotate: '-5deg'}, {translateY: levelNameY}],
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
