import {View, Image} from 'react-native';
import React from 'react';
import {LinearGradient} from 'expo-linear-gradient';
import {images, moderateScale as ms} from '@/constants';
import styles from './styles';

const TICK = ms(3.14);

const OxygenMeter = ({o2}: {o2: number}) => {
  const colors =
    o2 > 10
      ? (['#46c9ff', '#1b8dff'] as const)
      : (['#ffae42', '#d21e2b'] as const);

  return (
    <View style={styles.oxygenContainer} pointerEvents='none'>
      <LinearGradient
        colors={colors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[
          styles.oxygenGradient,
          {
            width: TICK * Math.floor(o2),
          },
        ]}
      />
      <View />
      <Image
        source={images.oxygenMeter}
        resizeMode="stretch"
        style={{height: ms(45), width: ms(135)}}
      />
    </View>
  );
};

export default OxygenMeter;
