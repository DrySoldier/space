import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const HeightView = ({ callback }) => {
  let heightValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heightValue, {
      toValue: 175,
      duration: 50,
    }).start(callback);
  }, []);

  return <Animated.View style={{ height: heightValue }} />;
};
