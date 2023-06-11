import React, { useRef, useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, Modal, Alert, Animated, ImageBackground } from 'react-native';
import styles from './styles';
import { images } from '../../constants/images';
import { retrieveData, storeData } from '../../utils/asyncData';

export const GameOverModal = ({ visible, score, resetGame, navigation }) => {
  const buttonDegree = useRef(new Animated.Value(0)).current;

  const [hiScore, setHiScore] = useState(null);

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
      useNativeDriver: true
    }).start(() => startButtonRotateAnimation());
  };
  const saveScore = async () => {
    const hiScore = await retrieveData('HISCORE');

    if (score > hiScore) {
      storeData('HISCORE', score);
      setHiScore(score);
    } else {
      setHiScore(hiScore);
    }
  };

  useEffect(() => {
    startButtonRotateAnimation();
  }, []);

  useEffect(() => {
    saveScore();
  }, [score]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => Alert.alert('Modal has been closed.')}
    >
      <View style={styles.modalContainer}>
        <ImageBackground
          resizeMode={'stretch'}
          source={images.spaceProbe}
          style={styles.mainSpaceProbe}
        >
          <View style={styles.gameOverContainer}>
            <Text style={styles.headerText}>Game Over</Text>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.headerText}>Your score</Text>
              <Text style={styles.scoreText}>{score}</Text>
            </View>
          </View>
        </ImageBackground>
        <ImageBackground
          resizeMode={'stretch'}
          source={images.spaceProbe}
          style={styles.hiScoreSpaceProbe}
        >
          <View style={styles.hiScoreContainer}>
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.headerText}>Hi-Score</Text>
              <Text style={styles.scoreText}>{hiScore}</Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <ImageBackground
                resizeMode={'stretch'}
                source={images.spaceProbe}
                style={styles.spaceProbe}
              >
                <Text style={styles.text}>Main Menu</Text>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={{ transform: [{ rotate: oppositeSpin }] }}>
            <TouchableOpacity onPress={resetGame}>
              <ImageBackground
                resizeMode={'stretch'}
                source={images.spaceProbe}
                style={styles.spaceProbe}
              >
                <Text style={styles.text}>Restart</Text>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};
