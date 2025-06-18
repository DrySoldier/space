import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Animated, Easing, Alert, ImageBackground } from 'react-native';
import { images } from '../../../constants';
import { removeData } from '../../../utils/asyncData';
import { Link } from 'expo-router';
import { randInt } from '../../../utils';
import styles from './styles';

const Settings = () => {
  const buttonDegree = useRef(new Animated.Value(0)).current;
  const astroPosition = useRef(new Animated.Value(0)).current;
  const astroRotate = useRef(new Animated.Value(0)).current;

  const [musicMuted, setMusicMuted] = useState(false);

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
      useNativeDriver: true
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
  }, []);

  return (
    <ImageBackground source={images.space} style={{ flex: 1 }}>
      <Animated.View
        style={{
          ...styles.astro,
          transform: [{ translateX: xPosition }],
        }}
      >
        <Animated.Image
          style={{
            ...styles.astro,
            transform: [{ rotateZ: astro360 }],
          }}
          source={images["astro-right-2"]}
        />
      </Animated.View>
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ rotate: spin }], paddingLeft: 125 }}>
          <Link href="..">
            <ImageBackground
              style={styles.button}
              resizeMode="stretch"
              source={images.spaceProbe}
            >
              <Text style={styles.buttonText}>BACK</Text>
            </ImageBackground>
          </Link>
        </Animated.View>
        <View style={{ flexDirection: 'row' }}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <TouchableOpacity onPress={() => setMusicMuted(!musicMuted)}>
              <ImageBackground
                style={styles.button}
                resizeMode="stretch"
                source={images.spaceProbe}
              >
                <Text style={styles.buttonText}>{musicMuted ? 'UNMUTE' : 'MUTE'}</Text>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ transform: [{ rotate: oppositeSpin }] }}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  'Clear data?',
                  'This will reset your hi-score',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    { text: 'OK', onPress: () => removeData('HISCORE') },
                  ],
                  { cancelable: false },
                )
              }
            >
              <ImageBackground
                style={styles.button}
                resizeMode="stretch"
                source={images.spaceProbe}
              >
                <Text style={styles.buttonText}>CLEAR DATA</Text>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <ImageBackground
          style={styles.creditDisplay}
          resizeMode="stretch"
          source={images.spaceProbe}
        >
          <Text style={styles.buttonText}>Programming:</Text>
          <Text style={styles.buttonText}>Christian Cotham</Text>
        </ImageBackground>
      </View>
    </ImageBackground>
  );
};

export default Settings;