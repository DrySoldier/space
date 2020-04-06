import React, {useEffect} from 'react';
import {Animated} from 'react-native';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const HeightView = props => {
  let heightValue = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(heightValue, {
      toValue: 175,
      duration: 50,
    }).start(props.callback);
  }, []);

  return <Animated.View style={{height: heightValue}} />;
};

export default HeightView;
