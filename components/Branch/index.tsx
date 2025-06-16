import {ForwardedRef, forwardRef, useImperativeHandle, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import {Image} from 'expo-image';
import {images} from '@/constants';
import styles, {BRANCH_HW, OBSTACLE_MARGIN} from './styles';

export type TBranchRef = {
  animateDown: (callback: () => void) => void;
};

interface IBranch {
  side: number;
  index: number;
}

const Branch = ({side, index}: IBranch, ref: ForwardedRef<TBranchRef>) => {
  const translateY = useRef(
    new Animated.Value((index - 2) * BRANCH_HW),
  ).current;

  const animateDown = (callback: () => void) => {
    Animated.timing(translateY, {
      toValue: (index - 1) * BRANCH_HW,
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
          style={[styles.branch, {transform: [{translateY}]}]}
        />
      );

    case 1:
      return (
        <Animated.View style={[styles.branch, {transform: [{translateY}]}]}>
          <Image
            style={[styles.obstacle, {marginLeft: -OBSTACLE_MARGIN * 3.1}]}
            resizeMode="contain"
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
        <Animated.View style={[styles.branch, {transform: [{translateY}]}]}>
          <Image
            style={[
              styles.obstacle,
              {
                marginLeft: OBSTACLE_MARGIN,
                transform: [{rotate: '180deg'}],
              },
            ]}
            resizeMode="contain"
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
            style={[styles.branch, {transform: [{rotateY: '180deg'}]}]}
          />
          <Image
            style={[
              styles.oxygen,
              {
                position: 'absolute',
                right: BRANCH_HW * 0.87,
                transform: [{rotateY: '180deg'}],
              },
            ]}
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
            style={[styles.branch]}
          />
          <Image
            style={[
              styles.oxygen,
              {
                left: BRANCH_HW * 0.87,
              },
            ]}
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
