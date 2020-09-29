import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Animated, Easing } from 'react-native';
import FastImage from 'react-native-fast-image';
import RNBootSplash from 'react-native-bootsplash';
import { FastImageBackground } from '../../components';
import { images } from '../../constants/images';
import styles from './styles';

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
      easing: Easing.linear,
    }).start(() => startAstroRotateAnimation());
  };

  const startAstroPositionAnimation = () => {
    astroPosition.setValue(0);

    Animated.timing(astroPosition, {
      toValue: 1,
      duration: 15000,
      easing: Easing.ease,
    }).start(() => startAstroPositionAnimation());
  };

  useEffect(() => {
    startButtonRotateAnimation();
    startAstroRotateAnimation();
    startAstroPositionAnimation();

    RNBootSplash.hide({ duration: 250 });
  }, []);

  return (
    <FastImageBackground source={images.space} style={{ flex: 1 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>SPACE CLIMB</Text>
        <Text style={styles.subtitle}>(title pending)</Text>
      </View>
      <AnimatedFastImage
        style={{ ...styles.astro, left: xPosition, transform: [{ rotate: astro360 }] }}
        source={images['astro-right-2']}
      />
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ rotate: spin }], paddingLeft: 125 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Game')}>
            <FastImageBackground
              style={styles.button}
              resizeMode="stretch"
              source={images.spaceProbe}
            >
              <Text style={styles.buttonText}>PLAY</Text>
            </FastImageBackground>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={{ transform: [{ rotate: oppositeSpin }] }}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <FastImageBackground
              style={styles.button}
              resizeMode="stretch"
              source={images.spaceProbe}
            >
              <Text style={styles.buttonText}>SETTINGS</Text>
            </FastImageBackground>
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={{ flex: 1 }} />
    </FastImageBackground>
  );
};

export default Home;
