import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, Animated, Easing, Alert, StyleSheet, ImageBackground, Image } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { moderateScale as ms } from 'src/constants/scaling';
import { images } from '../../constants/images';
import { removeData } from '../../utils/asyncData';

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
      useNativeDriver: true
    }).start(() => startButtonRotateAnimation());
  };

  const startAstroRotateAnimation = () => {
    astroDegree.setValue(0);

    Animated.timing(astroDegree, {
      toValue: 1,
      duration: 10000,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => startAstroRotateAnimation());
  };

  const startAstroPositionAnimation = () => {
    astroPosition.setValue(0);

    Animated.timing(astroPosition, {
      toValue: 1,
      duration: 15000,
      easing: Easing.ease,
      useNativeDriver: true
    }).start(() => startAstroPositionAnimation());
  };

  useEffect(() => {
    startButtonRotateAnimation();
    startAstroRotateAnimation();
    startAstroPositionAnimation();

    RNBootSplash.hide({ duration: 250 });
  }, []);

  return (
    <ImageBackground source={images.space} style={{ flex: 1 }}>
      <Animated.Image
        style={{
          ...styles.astro,
          transform: [{ rotate: astro360 }, { translateX: xPosition }],
          top: ms(500),
        }}
        source={images['astro-right-2']}
      />
      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ rotate: spin }], paddingLeft: 125 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <ImageBackground
              style={styles.button}
              resizeMode="stretch"
              source={images.spaceProbe}
            >
              <Text style={styles.buttonText}>BACK</Text>
            </ImageBackground>
          </TouchableOpacity>
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
        <ImageBackground
          style={{ ...styles.creditDisplay, marginLeft: ms(150) }}
          resizeMode="stretch"
          source={images.spaceProbe}
        >
          <Text style={styles.buttonText}>Art:</Text>
          <Text style={styles.buttonText}>Carrill Munnings</Text>
        </ImageBackground>
        <ImageBackground
          style={styles.creditDisplay}
          resizeMode="stretch"
          source={images.spaceProbe}
        >
          <Text style={styles.buttonText}>Music:</Text>
          <Text style={styles.buttonText}>Tyler Sawyer</Text>
        </ImageBackground>
      </View>
    </ImageBackground>
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
