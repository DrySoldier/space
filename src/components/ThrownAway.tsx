import React, { useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import FastImage from 'react-native-fast-image';
import { moderateScale as ms } from '../constants/scaling';
import { images } from '../constants/images';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

enum spaceGuySideTypes {
  LEFT = 'left',
  RIGHT = 'right',
}

interface ThrownAwayProps {
  spaceGuySide: spaceGuySideTypes;
}

export const ThrownAway: React.FC<ThrownAwayProps> = ({ spaceGuySide }) => {
  let opacity = new Animated.Value(0);
  let spinValue = new Animated.Value(0);

  let currentImage = require('../assets/newAssets/Elevator_tile.png');
  let currentHeight = ms(100);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${randInt(5, 290)}deg`],
  });

  let marginLeft = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, randInt(300, 500)],
  });

  let marginRight = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, randInt(300, 500)],
  });

  let marginTop = opacity.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, randInt(50, 200), randInt(50, 150)],
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  // Render spaceguy falling
  if (spaceGuySide) {
    currentImage = images[`astro-${spaceGuySide}`];
    currentHeight = ms(100);

    marginTop = opacity.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [-100, randInt(50, 200), randInt(50, 150)],
    });

    // If falling to left or right
    if (spaceGuySide === spaceGuySideTypes.RIGHT) {
      marginRight = -100;
    } else {
      marginLeft = -100;
    }
  }

  return (
    <View style={styles.thrownAwayContainer}>
      <AnimatedFastImage
        source={currentImage}
        style={[
          styles.thrownAwayBranch,
          {
            opacity: opacity.interpolate({
              inputRange: [0.8, 1],
              outputRange: [0.99, 1],
            }),
            transform: [
              {
                scale: opacity.interpolate({
                  inputRange: [0.2, 1],
                  outputRange: [0.8, 0],
                }),
              },
              {
                rotate: spin,
              },
            ],
            marginTop,
            marginLeft,
            marginRight,
            height: currentHeight,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  thrownAwayBranch: {
    width: ms(100),
    alignSelf: 'center',
  },
  thrownAwayContainer: {
    marginTop: ms(0),
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
