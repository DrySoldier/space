import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  SafeAreaView,
  Image,
} from 'react-native';
import {ImageBackground} from 'expo-image';
import {Link} from 'expo-router';
import {useScoreboard} from '@/hooks/useScoreboard';
import {useRewardedAd} from '@/hooks/useRewardedAd';
import styles from './styles';
import {images} from '../../constants/images';
import {retrieveData, storeData} from '../../utils/asyncData';

interface IGameOverModal {
  visible: boolean;
  score: number;
  resetGame: () => void;
  /**
   * If true, show the Watch Ad CTA and do not persist the score yet.
   * When false, behave like a final game-over screen.
   */
  canContinue?: boolean;
  onContinue?: () => void;
}

const GameOverModal = ({
  visible,
  score,
  resetGame,
  canContinue = false,
  onContinue,
}: IGameOverModal) => {
  const [hiScore, setHiScore] = useState(0);
  const {addNewScore} = useScoreboard();
  const {isLoaded, isLoading, load, show} = useRewardedAd();

  const hasPersistedScoreRef = useRef(false);

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

  const hiScoreBeat = !canContinue && score >= hiScore;

  const startButtonRotateAnimation = () => {
    const randomDegree = Math.random();

    Animated.timing(buttonDegree, {
      toValue: randomDegree,
      duration: 5000,
      useNativeDriver: true,
    }).start(() => startButtonRotateAnimation());
  };

  const loadHiScore = async () => {
    const stored = await retrieveData('HISCORE');
    const parsedHiScore = Number(stored) || 0;
    setHiScore(parsedHiScore);
    return parsedHiScore;
  };

  useEffect(() => {
    if (visible && canContinue && !isLoaded && !isLoading) {
      load();
    }
  }, [visible, canContinue, isLoaded, isLoading, load]);

  useEffect(() => {
    if (visible) {
      hasPersistedScoreRef.current = false;
    }
  }, [visible]);

  const onPressContinue = async () => {
    if (!onContinue) return;
    if (!isLoaded) {
      load();
      return;
    }
    const rewarded = await show();
    if (rewarded) {
      onContinue();
    }
  };

  const saveScore = async () => {
    const parsedHiScore = await loadHiScore();

    if (score > parsedHiScore) {
      storeData('HISCORE', score);
      setHiScore(score);
    }
    addNewScore(score);
    hasPersistedScoreRef.current = true;
  };

  const handleRestart = async () => {
    // If this is the pre-continue state, persist the score before resetting
    if (canContinue) {
      await saveScore();
    }
    resetGame();
  };

  useEffect(() => {
    startButtonRotateAnimation();
  }, []);

  useEffect(() => {
    if (visible) {
      loadHiScore();
      if (!canContinue && !hasPersistedScoreRef.current) {
        saveScore();
      }
      if (hiScoreBeat) {
        fadeAnim.stopAnimation();
        fadeAnim.setValue(0);
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
    } else {
      fadeAnim.stopAnimation();
    }
  }, [visible, canContinue, hiScoreBeat]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={resetGame}>
      <SafeAreaView style={styles.modalContainer}>
        <ImageBackground
          resizeMode={'stretch'}
          source={images.panel}
          style={styles.headerPanel}>
          <Text style={styles.headerText}>Gravity Won</Text>
          <Image
            source={images.dividerHorizontal}
            resizeMode="stretch"
            style={{width: '70%'}}
          />
          {hiScoreBeat && (
            <Animated.Text
              style={[styles.personalBestText, {opacity: fadeAnim}]}>
              New Personal Best!
            </Animated.Text>
          )}
          <Text style={styles.scoreValue}>{score}</Text>
          <Text style={styles.bestValue}>Best: {hiScore}</Text>
        </ImageBackground>
        <View style={styles.ctaContainer}>
          <Animated.View style={{transform: []}}>
            <TouchableOpacity onPress={handleRestart}>
              <ImageBackground
                resizeMode={'stretch'}
                source={images.buttonNormal}
                style={[styles.ctaButton, styles.primaryCta]}>
                <Text style={styles.ctaText}>Restart</Text>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.secondaryRow}>
            <Animated.View style={{transform: []}}>
              <Link href="..">
                <ImageBackground
                  resizeMode={'stretch'}
                  source={images.buttonNormal}
                  style={styles.ctaButton}>
                  <Text style={styles.ctaText}>Main Menu</Text>
                </ImageBackground>
              </Link>
            </Animated.View>
            <Animated.View style={{transform: []}}>
              {canContinue ? (
                <TouchableOpacity
                  onPress={onPressContinue}
                  disabled={!isLoaded && isLoading}>
                  <ImageBackground
                    resizeMode={'stretch'}
                    source={images.buttonNormal}
                    style={styles.ctaButton}>
                    <Text style={styles.ctaText}>
                      {isLoaded
                        ? 'Watch Ad'
                        : isLoading
                          ? 'Loading…'
                          : 'Load Ad'}
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
              ) : (
                <ImageBackground
                  resizeMode={'stretch'}
                  source={images.buttonNormal}
                  style={[styles.ctaButton, styles.placeholderButton]}>
                  <Text style={styles.placeholderText}>No Ad</Text>
                </ImageBackground>
              )}
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default GameOverModal;
