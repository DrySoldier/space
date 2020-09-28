import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import FastImage from 'react-native-fast-image';
import { moderateScale as ms } from '../constants/scaling';
import { images } from '../constants/images';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

interface ThrownAwayProps {
  spaceGuy: boolean;
}

export const ThrownAway: React.FC<ThrownAwayProps> = ({ spaceGuy }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const spin = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${randInt(5, 290)}deg`],
  });

  const marginTop = opacity.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, randInt(50, 200), randInt(50, 150)],
  });

  const marginLeft = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, randInt(300, 500)],
  });

  const marginRight = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, randInt(300, 500)],
  });

  const scale = opacity.interpolate({
    inputRange: [0.2, 1],
    outputRange: [0.78, 0],
  });

  const opacityInterpolate = opacity.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0.99, 1],
  });

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    <View style={styles.thrownAwayContainer}>
      <AnimatedFastImage
        source={images.elevatorTile}
        style={[
          styles.thrownAwayBranch,
          {
            opacity: opacityInterpolate,
            transform: [
              {
                scale,
              },
              {
                rotate: spin,
              },
            ],
            marginTop,
            marginLeft,
            marginRight,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  thrownAwayBranch: {
    height: ms(100),
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
