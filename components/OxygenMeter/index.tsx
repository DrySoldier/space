import {View, Image} from 'react-native';
import React from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {images, moderateScale as ms, width} from '@/constants';

const HEIGHT = ms(70);
const TICK = ms(4.3);

const OxygenMeter = ({o2}: {o2: number}) => {
  const colors =
    o2 > 10
      ? (['#46c9ff', '#1b8dff'] as const)
      : (['#ffae42', '#d21e2b'] as const);

  return (
    <View
      style={{
        position: 'absolute',
        top: ms(100),
        left: width * .27,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
      <LinearGradient
        colors={colors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          width: TICK * Math.floor(o2),
          height: HEIGHT,
          marginLeft: ms(18.7),
        }}
      />
      <View />
      <Image
        source={images.oxygenMeter}
        resizeMode="stretch"
        style={{height: HEIGHT, width: ms(180)}}
      />
    </View>
  );
};

export default OxygenMeter;
