import {Animated, Easing, Image, ImageBackground, View} from 'react-native';
import {images, moderateScale as ms} from '../../constants';
import styles from './styles';
import {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

type TBranchRef = {
  animateOut: (callback: () => void) => void;
};

interface IBranch {
  side: number;
}

const Branch = ({side}: IBranch, ref: ForwardedRef<TBranchRef>) => {
  const translateY = useRef(new Animated.Value(ms(0))).current;

  const animateOut = (callback: () => void) => {
    Animated.timing(translateY, {
      toValue: ms(100),
      duration: 50,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      translateY.resetAnimation();

      callback();
    });
  };

  useImperativeHandle(ref, () => ({
    animateOut,
  }));

  switch (side) {
    case 0:
      return (
        <Animated.Image
          source={images.elevatorTile}
          style={[styles.branch, {transform: [{translateY}]}]}
        />
      );

    case 1:
      return (
        <Animated.View style={[styles.branch, {transform: [{translateY}]}]}>
          <Image source={images.elevatorTile} style={[styles.branch]} />
          <Image
            style={{
              width: ms(100),
              height: ms(100),
              marginLeft: ms(-100),
              marginTop: ms(-100),
            }}
            source={images.obstacleTile}
          />
        </Animated.View>
      );

    case 2:
      return (
        <Animated.View style={[styles.branch, {transform: [{translateY}]}]}>
          <Image source={images.elevatorTile} style={[styles.branch]} />
          <Image
            style={{
              width: ms(100),
              height: ms(100),
              marginLeft: ms(100),
              transform: [{rotate: '180deg'}],
              position: 'absolute',
            }}
            source={images.obstacleTile}
          />
        </Animated.View>
      );

    default:
      return (
        <Animated.Image
          source={images.elevatorTile}
          style={[styles.branch, {transform: [{translateY}]}]}
        />
      );
  }
};

export default forwardRef<TBranchRef, IBranch>(Branch);
