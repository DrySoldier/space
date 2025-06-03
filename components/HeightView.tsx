import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { moderateScale as ms } from '../constants';

const HeightView = () => {
  const heightValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    heightValue.setValue(0);
    Animated.timing(heightValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  });

  return <Animated.View style={{ transform: [{ scaleY: heightValue }], height: ms(200) }} />;
};

export default HeightView;
