import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { moderateScale as ms } from 'src/constants/scaling';
import { images } from 'src/constants/images';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const ThrownAway = (props) => {
  let opacity = new Animated.Value(0);
  let spinValue = new Animated.Value(0);

  let currentImage = require("../assets/newAssets/Elevator_tile.png");
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

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
      }),
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
      }),
    ]).start();
  }, []);

  // Render spaceguy falling
  if (props.spaceGuy) {
    currentImage = require('../assets/newAssets/Astronaut-left-climb2.png');
    currentHeight = ms(100);
  }

  // If falling to left or right
  if (randInt(0, 1) === 0) {
    marginRight = 0;
  } else {
    marginLeft = 0;
  }

  return (
    <View style={styles.thrownAwayContainer}>
      <Animated.Image
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
            marginTop: opacity.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, randInt(50, 200), randInt(50, 150)],
            }),
            marginLeft: marginLeft,
            marginRight: marginRight,
            height: currentHeight,
          },
        ]}
        pointerEvents="none"
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

export default ThrownAway;
