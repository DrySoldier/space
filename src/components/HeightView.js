import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { moderateScale as ms } from 'src/constants';

export const HeightView = ({ callback }) => {
  let heightValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heightValue, {
      toValue: ms(200),
      duration: 50,
    }).start(callback);
  }, []);

  return <Animated.View style={{ height: heightValue }} />;
};
