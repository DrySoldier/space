import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Animated, Easing} from 'react-native';
import {ImageBackground} from 'expo-image';
import {Link, useFocusEffect} from 'expo-router';
import {images} from '../../../constants/images';
import styles from './styles';
import {randInt} from '../../../utils';
import {moderateScale} from '@/constants';
import {loadShopState} from '@/state/meta/shop';

const Home = () => {
  const [shopUnlocked, setShopUnlocked] = useState(false);
  const buttonDegree = useRef(new Animated.Value(0)).current;
  const astroPosition = useRef(new Animated.Value(0)).current;
  const astroRotate = useRef(new Animated.Value(0)).current;

  const refreshShopUnlocked = async () => {
    const shopState = await loadShopState();
    setShopUnlocked(shopState.unlocked);
  };

  const spin = buttonDegree.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });

  const oppositeSpin = buttonDegree.interpolate({
    inputRange: [0, 1],
    outputRange: ['10deg', '-10deg'],
  });

  const astro360 = astroRotate.interpolate({
    inputRange: [0, 1],
    outputRange: [`0deg`, `360deg`],
  });

  const xPosition = astroPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 650],
  });

  const startButtonRotateAnimation = () => {
    const randomDegree = Math.random();

    Animated.timing(buttonDegree, {
      toValue: randomDegree,
      duration: 5000,
      useNativeDriver: true,
    }).start(() => startButtonRotateAnimation());
  };

  const startAstroAnimation = () => {
    const newDuration = randInt(6000, 18000);
    const newRotate = Math.random();
    astroPosition.setValue(0);

    Animated.parallel([
      Animated.timing(astroPosition, {
        toValue: 1,
        duration: newDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(astroRotate, {
        toValue: newRotate,
        duration: newDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => startAstroAnimation());
  };

  useEffect(() => {
    startButtonRotateAnimation();
    startAstroAnimation();
    refreshShopUnlocked();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refreshShopUnlocked();
    }, []),
  );

  return (
    <ImageBackground source={images.space} style={styles.flex}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>SPACE CLIMB</Text>
        <Text style={styles.subtitle}>The Ascent</Text>
      </View>
      <Animated.View
        style={{
          ...styles.astro,
          transform: [{translateX: xPosition}],
        }}>
        <Animated.Image
          style={{
            ...styles.astro,
            transform: [{rotateZ: astro360}],
          }}
          source={images['astro-left-2']}
        />
      </Animated.View>
      <View style={styles.buttonContainer}>
        <Animated.View
          style={{transform: [{rotate: spin}], paddingLeft: moderateScale(125)}}>
          <Link href="/screens/game">
            <ImageBackground
              style={styles.button}
              resizeMode="stretch"
              source={images.spaceProbe}>
              <Text style={styles.buttonText}>PLAY</Text>
            </ImageBackground>
          </Link>
        </Animated.View>
        <Animated.View style={{transform: [{rotate: oppositeSpin}]}}>
          <Link href="/screens/settings">
            <ImageBackground
              style={styles.button}
              resizeMode="stretch"
              source={images.spaceProbe}>
              <Text style={styles.buttonText}>SETTINGS</Text>
            </ImageBackground>
          </Link>
        </Animated.View>
        {shopUnlocked && (
          <Animated.View style={{transform: [{rotate: spin}]}}>
            <Link href="/screens/shop">
              <ImageBackground
                style={styles.button}
                resizeMode="stretch"
                source={images.spaceProbe}>
                <Text style={styles.buttonText}>SHOP</Text>
              </ImageBackground>
            </Link>
          </Animated.View>
        )}
      </View>
      <View style={styles.flex} />
    </ImageBackground>
  );
};

export default Home;
