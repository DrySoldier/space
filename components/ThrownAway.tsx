import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { moderateScale as ms } from '../constants';
import { randInt } from '../utils';
import Branch from './Branch';

const ThrownAway = ({ side }: { side: Number }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  const spin = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${randInt(-60, 60)}deg`],
  });

  const marginTop = opacity.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [50, 500, 1000],
  });

  const marginLeft = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [0, randInt(-500, 500)],
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
      <Animated.View
        style={[
          {
            alignItems: 'center',
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
      >
        <Branch side={side} />
      </Animated.View>
    </View>
  );
};

export default ThrownAway;

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
