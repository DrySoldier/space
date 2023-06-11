import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { moderateScale as ms } from '../constants/scaling';
import { images } from '../constants/images';
import { randInt } from '../utils';

export const ThrownAway = () => {
  const opacity = useRef(new Animated.Value(0)).current;

  const spin = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${randInt(5, 290)}deg`],
  });

  const marginTop = opacity.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [50, randInt(100, 200), randInt(50, 150)],
  });

  const marginLeft = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, randInt(300, 500)],
  });

  const scale = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const opacityInterpolate = opacity.interpolate({
    inputRange: [0.8, 1],
    outputRange: [0.99, 1],
  });

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 750,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.thrownAwayContainer}>
      <Animated.Image
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
              {
                translateY: marginTop,
              },
              {
                translateX: marginLeft,
              }
            ],
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
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
