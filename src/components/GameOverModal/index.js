import React, { useRef, useEffect } from 'react';
import { Text, View, TouchableOpacity, Modal, Alert, Animated } from 'react-native';
import { FastImageBackground } from '../FastImageBackground';
import styles from './styles';
import { images } from '../../constants/images';

export const GameOverModal = ({ visible, score, resetGame, navigation }) => {
  const buttonDegree = useRef(new Animated.Value(0)).current;

  const spin = buttonDegree.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });

  const oppositeSpin = buttonDegree.interpolate({
    inputRange: [0, 1],
    outputRange: ['10deg', '-10deg'],
  });

  const startButtonRotateAnimation = () => {
    const randomDegree = Math.random();

    Animated.timing(buttonDegree, {
      toValue: randomDegree,
      duration: 5000,
    }).start(() => startButtonRotateAnimation());
  };

  useEffect(() => {
    startButtonRotateAnimation();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => Alert.alert('Modal has been closed.')}
    >
      <View style={styles.modalContainer}>
        <FastImageBackground
          resizeMode={'stretch'}
          source={images.spaceProbe}
          style={styles.mainSpaceProbe}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              paddingVertical: 75,
              paddingHorizontal: 115,
            }}
          >
            <Text style={styles.white}>Game Over</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.white}>Your score</Text>
              <Text style={styles.white}>{score}</Text>
            </View>
          </View>
        </FastImageBackground>
        <FastImageBackground
          resizeMode={'stretch'}
          source={images.spaceProbe}
          style={styles.hiScoreSpaceProbe}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              paddingVertical: 50,
              paddingHorizontal: 50,
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.white}>Hi-Score</Text>
              <Text style={styles.white}>{score}</Text>
            </View>
          </View>
        </FastImageBackground>
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <FastImageBackground
                resizeMode={'stretch'}
                source={images.spaceProbe}
                style={styles.spaceProbe}
              >
                <Text
                  style={{
                    color: 'white',
                    paddingHorizontal: 25,
                    textAlign: 'center',
                    fontFamily: 'Gill Sans',
                  }}
                >
                  Main Menu
                </Text>
              </FastImageBackground>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ transform: [{ rotate: oppositeSpin }] }}>
            <TouchableOpacity onPress={resetGame}>
              <FastImageBackground
                resizeMode={'stretch'}
                source={images.spaceProbe}
                style={styles.spaceProbe}
              >
                <Text
                  style={{
                    color: 'white',
                    paddingHorizontal: 25,
                    textAlign: 'center',
                    fontFamily: 'Gill Sans',
                  }}
                >
                  Restart
                </Text>
              </FastImageBackground>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};
