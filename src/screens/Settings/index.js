import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Animated, Easing, Alert, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import RNBootSplash from 'react-native-bootsplash';
import { moderateScale as ms } from 'src/constants/scaling';
import { FastImageBackground } from '../../components';
import { images } from '../../constants/images';
import { removeData } from '../../utils/asyncData';

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

const Settings = ({ navigation }) => {
  const buttonDegree = useRef(new Animated.Value(0)).current;
  const astroDegree = useRef(new Animated.Value(0)).current;
  const astroPosition = useRef(new Animated.Value(0)).current;

  const [musicMuted, setMusicMuted] = useState(false);

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
    outputRange: ['360deg', '0deg'],
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
      <AnimatedFastImage
        style={{
          ...styles.astro,
          left: xPosition,
          transform: [{ rotate: astro360 }],
          top: ms(500),
        }}
        source={images['astro-right-2']}
      />
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ rotate: spin }], paddingLeft: 125 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <FastImageBackground
              style={styles.button}
              resizeMode="stretch"
              source={images.spaceProbe}
            >
              <Text style={styles.buttonText}>BACK</Text>
            </FastImageBackground>
          </TouchableOpacity>
        </Animated.View>
        <View style={{ flexDirection: 'row' }}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <TouchableOpacity onPress={() => setMusicMuted(!musicMuted)}>
              <FastImageBackground
                style={styles.button}
                resizeMode="stretch"
                source={images.spaceProbe}
              >
                <Text style={styles.buttonText}>{musicMuted ? 'UNMUTE' : 'MUTE'}</Text>
              </FastImageBackground>
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
              <FastImageBackground
                style={styles.button}
                resizeMode="stretch"
                source={images.spaceProbe}
              >
                <Text style={styles.buttonText}>CLEAR DATA</Text>
              </FastImageBackground>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <FastImageBackground
          style={styles.creditDisplay}
          resizeMode="stretch"
          source={images.spaceProbe}
        >
          <Text style={styles.buttonText}>Programming:</Text>
          <Text style={styles.buttonText}>Christian Cotham</Text>
        </FastImageBackground>
        <FastImageBackground
          style={{ ...styles.creditDisplay, marginLeft: ms(150) }}
          resizeMode="stretch"
          source={images.spaceProbe}
        >
          <Text style={styles.buttonText}>Art:</Text>
          <Text style={styles.buttonText}>Carrill Munnings</Text>
        </FastImageBackground>
        <FastImageBackground
          style={styles.creditDisplay}
          resizeMode="stretch"
          source={images.spaceProbe}
        >
          <Text style={styles.buttonText}>Music:</Text>
          <Text style={styles.buttonText}>Tyler Sawyer</Text>
        </FastImageBackground>
      </View>
    </FastImageBackground>
  );
};

export default Settings;

const styles = StyleSheet.create({
  button: {
    height: ms(130),
    width: ms(180),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(50)
  },
  creditDisplay: {
    height: ms(150),
    width: ms(250),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(75),
  },
  buttonContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'GillSans-Bold',
    textAlign: 'center'
  },
  buttonContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  astro: {
    height: ms(100),
    width: ms(100),
    position: 'absolute',
    top: ms(250),
  },
});
