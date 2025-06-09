import {ForwardedRef, forwardRef, useImperativeHandle, useRef} from 'react';
import {Animated, Easing, Image} from 'react-native';
import {images, moderateScale as ms} from '@/constants';
import styles from './styles';

export type TBranchRef = {
  animateDown: (callback: () => void) => void;
};

interface IBranch {
  side: number;
  index: number;
}

const Branch = ({side, index}: IBranch, ref: ForwardedRef<TBranchRef>) => {
  const translateY = useRef(
    new Animated.Value(ms((index - 2) * ms(93))),
  ).current;

  const animateDown = (callback: () => void) => {
    Animated.timing(translateY, {
      toValue: (index - 1) * ms(100),
      duration: 50,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      callback();
    });
  };

  useImperativeHandle(ref, () => ({
    animateDown,
  }));

  switch (side) {
    case 0:
      return (
        <Animated.Image
          resizeMode="stretch"
          source={images.elevatorTile}
          style={[styles.branch, {marginTop: -0.2, transform: [{translateY}]}]}
        />
      );

    case 1:
      return (
        <Animated.View
          style={[styles.branch, {marginTop: -0.2, transform: [{translateY}]}]}>
          <Image
            style={{
              width: ms(100),
              height: ms(100),
              marginLeft: ms(-94),
              position: 'absolute',
            }}
            resizeMode="cover"
            source={images.obstacleTile}
          />
          <Image
            resizeMode="stretch"
            source={images.elevatorTile}
            style={[styles.branch]}
          />
        </Animated.View>
      );

    case 2:
      return (
        <Animated.View
          style={[styles.branch, {marginTop: -0.2, transform: [{translateY}]}]}>
          <Image
            style={{
              width: ms(100),
              height: ms(100),
              marginLeft: ms(94),
              transform: [{rotate: '180deg'}],
              position: 'absolute',
            }}
            resizeMode="cover"
            source={images.obstacleTile}
          />
          <Image
            resizeMode="stretch"
            source={images.elevatorTile}
            style={[styles.branch]}
          />
        </Animated.View>
      );

    case 3:
      return (
        <Animated.View style={[styles.branch, {transform: [{translateY}]}]}>
          <Image
            source={images.pitstop}
            resizeMode="stretch"
            style={[
              styles.branch,
              {marginTop: -0.2, transform: [{rotateY: '180deg'}]},
            ]}
          />
          <Image
            style={{
              width: ms(50),
              height: ms(65),
              marginLeft: ms(-32),
              marginTop: ms(8),
              position: 'absolute',
              transform: [{rotateY: '180deg'}],
            }}
            resizeMode="stretch"
            source={images.oxygenTank}
          />
        </Animated.View>
      );

    case 4:
      return (
        <Animated.View style={[styles.branch, {transform: [{translateY}]}]}>
          <Image
            source={images.pitstop}
            resizeMode="stretch"
            style={[styles.branch, {marginTop: -0.2}]}
          />
          <Image
            style={{
              width: ms(50),
              height: ms(65),
              marginLeft: ms(82),
              marginTop: ms(8),
              position: 'absolute',
            }}
            resizeMode="stretch"
            source={images.oxygenTank}
          />
        </Animated.View>
      );

    default:
      return (
        <Animated.Image
          resizeMode="stretch"
          source={images.elevatorTile}
          style={[styles.branch, {transform: [{translateY}]}]}
        />
      );
  }
};

export default forwardRef<TBranchRef, IBranch>(Branch);
