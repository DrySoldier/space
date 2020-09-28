import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Animated, Easing } from 'react-native';
import FastImage from 'react-native-fast-image';
import { moderateScale as ms } from 'src/constants/scaling';
import { FastImageBackground } from '../../components';
import { images } from '../../constants/images';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const Home = ({ navigation }) => {
  const buttonDegree = useRef(new Animated.Value(0)).current;
  const astroDegree = useRef(new Animated.Value(0)).current;
  const astroPosition = useRef(new Animated.Value(0)).current;

  const spin = buttonDegree.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });

  const oppositeSpin = buttonDegree.interpolate({
    inputRange: [0, 1],
    outputRange: ['10deg', '-10deg'],
  });

  const astro360 = astroDegree.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const xPosition = astroPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 500],
  });

  const startButtonRotateAnimation = () => {
    const randomDegree = Math.random();

    Animated.timing(buttonDegree, {
      toValue: randomDegree,
      duration: 5000,
    }).start(() => startButtonRotateAnimation());
  };

  const startAstroRotateAnimation = () => {
    astroDegree.setValue(0);
  
    Animated.timing(astroDegree, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear
    }).start(() => startAstroRotateAnimation());
  };

  const startAstroPositionAnimation = () => {
    astroPosition.setValue(0);

    Animated.timing(astroPosition, {
      toValue: 1,
      duration: 15000,
      easing: Easing.ease
    }).start(() => startAstroPositionAnimation());
  };

  useEffect(() => {
    startButtonRotateAnimation();
    startAstroRotateAnimation();
    startAstroPositionAnimation();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FastImageBackground source={images.space} style={{ flex: 1 }}>
        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 36, fontFamily: 'GillSans-Bold' }}>SPACE GAME</Text>
          <Text style={{ color: 'white', fontSize: 12, fontFamily: 'GillSans-Bold' }}>(title pending)</Text>
        </View>
        <AnimatedFastImage style={{ height: 100, width: 100, position: 'absolute', top: ms(250), left: xPosition, transform: [{ rotate: astro360 }] }} source={images["astro-right-2"]} />
        <View style={{ flex: 3, alignItems: 'center', justifyContent: 'space-evenly' }}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <TouchableOpacity onPress={() => navigation.navigate('Game')}>
              <FastImageBackground
                style={{
                  height: 130,
                  width: 180,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 50,
                }}
                resizeMode="stretch"
                source={images.spaceProbe}
              >
                <Text style={{ color: 'white', fontFamily: 'GillSans-Bold' }}>PLAY</Text>
              </FastImageBackground>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ transform: [{ rotate: oppositeSpin }] }}>
            <TouchableOpacity>
              <FastImageBackground
                style={{
                  height: 130,
                  width: 180,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 50,
                }}
                resizeMode="stretch"
                source={images.spaceProbe}
              >
                <Text style={{ color: 'white', fontFamily: 'GillSans-Bold' }}>LEADERBOAD</Text>
              </FastImageBackground>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <View style={{ flex: 1 }} />
      </FastImageBackground>
    </View>
  );
};

export default Home;
