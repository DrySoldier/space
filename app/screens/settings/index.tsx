import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Alert,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import * as Crypto from 'expo-crypto';
import {images} from '../../../constants';
import {removeData, storeData} from '../../../utils/asyncData';
import {Link, useRouter} from 'expo-router';
import {randInt} from '../../../utils';
import styles from './styles';
import {useScoreboard} from '../../../hooks/useScoreboard';
import { useMusic } from '../../../context/MusicProvider';

const Settings = () => {
  const router = useRouter();
  const {getScoreByUUID, updateName, userScore} = useScoreboard();
  const music = useMusic();

  const [name, setName] = useState(userScore?.name || '');

  const buttonDegree = useRef(new Animated.Value(0)).current;
  const astroPosition = useRef(new Animated.Value(0)).current;
  const astroRotate = useRef(new Animated.Value(0)).current;

  const changeNameScale = useRef(new Animated.Value(0)).current;

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

  const clearAllData = async () => {
    await removeData('HISCORE');
    await removeData('UUID');
    await removeData('MUTED');

    const uuid = Crypto.randomUUID();

    await storeData('UUID', uuid);
    router.dismissAll();
    router.replace('/');
  };

  useEffect(() => {
    startButtonRotateAnimation();
    startAstroAnimation();
    getScoreByUUID();
  }, []);

  useEffect(() => {
    if (userScore?.name) {
      Animated.timing(changeNameScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [userScore]);

  return (
    <ImageBackground source={images.space} style={styles.container}>
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
          source={images['astro-right-2']}
        />
      </Animated.View>
      <View style={styles.buttonContainer}>
        <Animated.View style={{transform: [{rotate: spin}], paddingLeft: 125}}>
          <Link href="..">
            <ImageBackground
              style={styles.button}
              resizeMode="stretch"
              source={images.spaceProbe}>
              <Text style={styles.buttonText}>BACK</Text>
            </ImageBackground>
          </Link>
        </Animated.View>
        <View style={{flexDirection: 'row'}}>
          <Animated.View style={{transform: [{rotate: spin}]}}>
            <TouchableOpacity onPress={() => music.toggle()}>
              <ImageBackground
                style={styles.button}
                resizeMode="stretch"
                source={images.spaceProbe}>
                <Text style={styles.buttonText}>
                  {music.isPlaying ? 'MUTE' : 'UNMUTE'}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{transform: [{rotate: oppositeSpin}]}}>
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
                    {text: 'OK', onPress: clearAllData},
                  ],
                  {cancelable: false},
                )
              }>
              <ImageBackground
                style={styles.button}
                resizeMode="stretch"
                source={images.spaceProbe}>
                <Text style={styles.buttonText}>CLEAR DATA</Text>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Animated.View style={{transform: [{scale: changeNameScale}]}}>
          {!!userScore?.name && (
            <KeyboardAvoidingView behavior="position">
              <ImageBackground
                style={styles.nameChange}
                resizeMode="stretch"
                source={images.spaceScreen}>
                <Text style={styles.changeNameText}>Change Name</Text>
                <TextInput
                  style={styles.changeNameInput}
                  defaultValue={userScore?.name || ''}
                  onChangeText={setName}
                  onEndEditing={() => updateName(name)}
                  maxLength={16}
                  value={name}
                />
              </ImageBackground>
            </KeyboardAvoidingView>
          )}
        </Animated.View>
        <ImageBackground
          style={styles.creditDisplay}
          resizeMode="stretch"
          source={images.spaceProbe}>
          <Text style={styles.buttonText}>Programming:</Text>
          <Text style={styles.buttonText}>Christian Cotham</Text>
        </ImageBackground>
      </View>
    </ImageBackground>
  );
};

export default Settings;
