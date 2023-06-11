import {
  Animated,
  Easing,
  Image,
  Image as NativeImage,
  ImageLoadEventData,
  ImageSourcePropType,
  ImageStyle,
  NativeSyntheticEvent,
  Platform,
  View,
  ViewStyle,
} from 'react-native';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import styled from '@emotion/native';

function resolveAssetSource(source, callback) {
  if (Platform.OS === 'web') {
    Image.getSize(source, (width, height) => {
      callback({width, height});
    });
  } else {
    let _source = Image.resolveAssetSource(source);
    const width = _source.width;
    const height = _source.height;
    callback({width, height});
  }
}

export const SpriteSheet = forwardRef(
  (
    {
      source,
      height,
      width,
      rows = 1,
      columns = 1,
      frameHeight: _frameHeight,
      frameWidth: _frameWidth,
      animations = {},
      offsetY: offsetYProp = 0,
      offsetX: offsetXProp = 0,
      viewStyle,
      imageStyle,
      onLoad,
    },
    ref,
  ) => {
    let time = useRef < Animated.Value > new Animated.Value(0);
    // let [interpolationRanges, setInterpolationRanges] = useState({});
    const interpolationRanges = useRef < any > {};

    const [imageHeight, setImageHeight] = useState(0);
    const [imageWidth, setImageWidth] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [frameHeight, setFrameHeight] = useState(0);
    const [frameWidth, setFrameWidth] = useState(0);
    const [animationState, setAnimationState] =
      useState <
      AnimationStateType >
      {
        fps: 24,
        loop: false,
        resetAfterFinish: false,
        onFinish: () => {},
        length: 0,
        animationType: '',
      };

    useEffect(() => {
      resolveAssetSource(source, ({width: $width, height: $height}) => {
        let ratio = 1;
        let _imageHeight = $height;
        let _imageWidth = $width;
        let _offsetX = -offsetXProp;
        let _offsetY = -offsetYProp;
        let $frameHeight = $height / rows;
        let $frameWidth = $width / columns;

        if (width) {
          ratio = (width * columns) / $width;
          _imageHeight = $height * ratio;
          _imageWidth = width * columns;
          $frameHeight = ($height / rows) * ratio;
          $frameWidth = width;
        } else if (height) {
          ratio = (height * rows) / $height;
          _imageHeight = height * rows;
          _imageWidth = $width * ratio;
          $frameHeight = height;
          $frameWidth = ($width / columns) * ratio;
        }

        setImageHeight(_imageHeight);
        setImageWidth(_imageWidth);

        setOffsetX(_offsetX);
        setOffsetY(_offsetY);

        setFrameHeight($frameHeight);
        setFrameWidth($frameWidth);
      });
    }, [source]);

    useEffect(() => {
      const {fps, loop, resetAfterFinish, onFinish, length} = animationState;
      let animation = Animated.sequence([
        Animated.timing(time.current, {
          toValue: 0,
          duration: 0,
          delay: (length / fps) * 1000,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(time.current, {
          toValue: length,
          duration: 0,
          easing: Easing.linear,
          useNativeDriver: false,
          delay: (length / fps) * 1000,
        }),
      ]);

      time.current.setValue(0);

      if (loop) {
        Animated.loop(animation).start();
      } else {
        animation.start(() => {
          if (resetAfterFinish) {
            time.current.setValue(0);
          }
          onFinish();
        });
      }
    }, [animationState.animationType]);

    const getFrameCoords = i => {
      let currentColumn = i % columns;
      let xAdjust = -currentColumn * frameWidth;
      xAdjust -= offsetX;
      let yAdjust = -((i - currentColumn) / columns) * frameHeight;
      yAdjust -= offsetY;

      return {
        x: xAdjust,
        y: Math.floor(yAdjust),
      };
    };

    // GENERATE INTERPOLATION RANGES
    useEffect(() => {
      const ranges = {};

      for (let key in animations) {
        let {length} = animations[key];
        let input = [].concat(...Array.from({length}, (_, i) => [i, i + 1]));
        ranges[key] = {
          translateY: {
            in: input,
            out: [].concat(
              ...animations[key].map(i => {
                let {y} = getFrameCoords(i);
                return [y, y];
              }),
            ),
          },
          translateX: {
            in: input,
            out: [].concat(
              ...animations[key].map(i => {
                let {x} = getFrameCoords(i);
                return [x, x];
              }),
            ),
          },
        };
      }

      interpolationRanges.current = ranges;
      // setInterpolationRanges({ ...interpolationRanges, ...ranges });
    }, [animations, frameWidth, frameHeight, offsetX, offsetY]);

    useImperativeHandle(
      ref,
      () => {
        return {
          stop(cb) {
            time.current.stopAnimation(cb);
          },
          reset(cb) {
            time.current.stopAnimation(cb);
            time.current.setValue(0);
          },
          play({
            type,
            fps = 24,
            loop = false,
            resetAfterFinish = false,
            onFinish = () => {},
          }) {
            let {length} = animations[type];

            setAnimationState({
              animationType: type,
              fps,
              loop,
              resetAfterFinish,
              onFinish,
              length,
            });
          },
        };
      },
      [],
    );

    let {
      translateY = {in: [0, 0], out: [offsetY, offsetY]},
      translateX = {in: [0, 0], out: [offsetX, offsetX]},
    } = interpolationRanges.current[animationState.animationType] || {};

    const transformStyle = [
      {
        translateX: time.current.interpolate({
          inputRange: translateX.in,
          outputRange: translateX.out,
        }),
      },
      {
        translateY: time.current.interpolate({
          inputRange: translateY.in,
          outputRange: translateY.out,
        }),
      },
    ];

    return (
      <View
        style={[
          viewStyle,
          {
            height: frameHeight,
            width: frameWidth,
            overflow: 'hidden',
          },
        ]}>
        <Animated.Image
          source={source}
          onLoad={onLoad}
          style={[
            imageStyle,
            {
              height: imageHeight,
              width: imageWidth,
              // Transform properties are GPU accelerated and supported by Native Driver
              transform: animationState.animationType ? transformStyle : [],
            },
          ]}
        />
      </View>
    );
  },
);
