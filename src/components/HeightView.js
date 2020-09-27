import React, { useEffect } from 'react';
import { Animated } from 'react-native';

export const HeightView = ({ callback }) => {
  let heightValue = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(heightValue, {
      toValue: 175,
      duration: 50,
    }).start(callback);
  }, []);

  return <Animated.View style={{ height: heightValue }} />;
};
