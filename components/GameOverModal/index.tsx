import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Alert,
  Animated,
  FlatList,
} from 'react-native';
import {ImageBackground} from 'expo-image';
import {Link} from 'expo-router';
import styles from './styles';
import {images} from '../../constants/images';
import {retrieveData, storeData} from '../../utils/asyncData';
import {useScoreboard} from '@/hooks/useScoreboard';
import {moderateScale as ms, width} from '../../constants';

interface IGameOverModal {
  visible: boolean;
  score: number;
  resetGame: () => void;
}

const GameOverModal = ({visible, score, resetGame}: IGameOverModal) => {
  const [hiScore, setHiScore] = useState(0);
  const {scores, addNewScore, loadAbove, loadBelow} = useScoreboard();

  const scoreboardRef = useRef<FlatList>(null);

  const buttonDegree = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const spin = buttonDegree.interpolate({
    inputRange: [0, 1],
    outputRange: ['-10deg', '10deg'],
  });

  const oppositeSpin = buttonDegree.interpolate({
    inputRange: [0, 1],
    outputRange: ['10deg', '-10deg'],
  });

  const hiScoreBeat = score >= hiScore;

  const startButtonRotateAnimation = () => {
    const randomDegree = Math.random();

    Animated.timing(buttonDegree, {
      toValue: randomDegree,
      duration: 5000,
      useNativeDriver: true,
    }).start(() => startButtonRotateAnimation());
  };

  const saveScore = async () => {
    const hiScore = await retrieveData('HISCORE');

    const parsedHiScore = Number(hiScore);

    if (score > parsedHiScore) {
      storeData('HISCORE', score);
      setHiScore(score);

      addNewScore(score);
    } else {
      setHiScore(parsedHiScore);
      addNewScore(parsedHiScore);
    }
  };

  useEffect(() => {
    startButtonRotateAnimation();
  }, []);

  useEffect(() => {
    if (visible) {
      saveScore();
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      fadeAnim.stopAnimation();
    }
  }, [visible]);

  useEffect(() => {
    (async () => {
      if (scores.length > 0 && scores.length < 26) {
        const playerScoreIndex = scores.findIndex(e => !!e.player);

        if (playerScoreIndex > 8) {
          scoreboardRef?.current?.scrollToOffset({
            animated: true,
            offset: playerScoreIndex * 12,
          });
        }
      }
    })();
  }, [scores]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={resetGame}>
      <View style={styles.modalContainer}>
        <ImageBackground
          resizeMode={'stretch'}
          source={images.spaceScreen}
          style={[
            styles.mainSpaceProbe,
            hiScoreBeat && {height: ms(150), width: ms(300)},
          ]}>
          <Text
            style={[
              styles.headerText,
              hiScoreBeat && {paddingHorizontal: ms(40)},
            ]}>
            Game Over
          </Text>
          {hiScoreBeat && (
            <Animated.Text
              style={{
                color: 'white',
                fontFamily: 'Pixellari',
                fontSize: ms(16),
                opacity: fadeAnim,
              }}>
              New Personal Best!
            </Animated.Text>
          )}
        </ImageBackground>
        <ImageBackground
          resizeMode={'stretch'}
          source={images.spaceScreen}
          style={styles.hiScoreSpaceProbe}>
          <FlatList
            data={scores}
            ref={scoreboardRef}
            onEndReached={loadBelow}
            onRefresh={loadAbove}
            refreshing={false}
            renderItem={({item}) => (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: width * 0.75,
                  paddingHorizontal: 12,
                }}>
                <Text
                  style={{
                    color: item.player ? 'yellow' : 'white',
                    fontFamily: 'Pixellari',
                    fontSize: 24,
                  }}>
                  {item.rk}
                </Text>
                <Text
                  style={{
                    color: item.player ? 'yellow' : 'white',
                    fontFamily: 'Pixellari',
                    fontSize: 20,
                  }}>
                  {item.name}
                </Text>
                <Text
                  style={{
                    color: item.player ? 'yellow' : 'white',
                    fontFamily: 'Pixellari',
                    fontSize: 24,
                  }}>
                  {item.score}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.hiScoreContainer}>
                <Text style={styles.headerText}>Hi-Score</Text>
                <Text style={styles.scoreText}>{hiScore}</Text>
              </View>
            }
          />
        </ImageBackground>
        <View style={styles.buttonContainer}>
          <Animated.View style={{transform: [{rotate: spin}]}}>
            <Link href="..">
              <ImageBackground
                resizeMode={'stretch'}
                source={images.spaceProbe}
                style={styles.spaceProbe}>
                <Text style={styles.text}>Main Menu</Text>
              </ImageBackground>
            </Link>
          </Animated.View>
          <Animated.View style={{transform: [{rotate: oppositeSpin}]}}>
            <TouchableOpacity onPress={resetGame}>
              <ImageBackground
                resizeMode={'stretch'}
                source={images.spaceProbe}
                style={styles.spaceProbe}>
                <Text style={styles.text}>Restart</Text>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default GameOverModal;
