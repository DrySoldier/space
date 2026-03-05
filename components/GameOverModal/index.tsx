import React, {useRef, useEffect, useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import {ImageBackground} from 'expo-image';
import {useRouter} from 'expo-router';
import {useScoreboard} from '@/hooks/useScoreboard';
import {useRewardedAd} from '@/hooks/useRewardedAd';
import GameOverModalScoreboard from './Scoreboard';
import styles from './styles';
import {images} from '../../constants/images';
import {retrieveData, storeData} from '../../utils/asyncData';

interface IGameOverModal {
  visible: boolean;
  score: number;
  resetGame: () => void;
  /**
   * If true, show the Watch Ad CTA.
   * Score persistence is handled on death/modal open.
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
  const router = useRouter();
  const [hiScore, setHiScore] = useState(0);
  const {scores, addNewScore} = useScoreboard();
  const {isLoaded, isLoading, load, show} = useRewardedAd();
  const [isActionLocked, setIsActionLocked] = useState(false);
  const [isSavingScore, setIsSavingScore] = useState(false);

  const hasPersistedScoreRef = useRef(false);
  const saveScorePromiseRef = useRef<Promise<boolean> | null>(null);
  const actionLockRef = useRef(false);

  const hiScoreBeat = score >= hiScore;

  const loadHiScore = async () => {
    const stored = await retrieveData('HISCORE');
    const parsedHiScore = Number(stored) || 0;
    setHiScore(parsedHiScore);
    return parsedHiScore;
  };

  const unlockActions = () => {
    actionLockRef.current = false;
    setIsActionLocked(false);
  };

  const runLockedAction = async (
    action: () => Promise<boolean | void> | boolean | void,
  ) => {
    if (actionLockRef.current) return;

    actionLockRef.current = true;
    setIsActionLocked(true);

    try {
      const shouldStayLocked = await action();
      if (!shouldStayLocked) {
        unlockActions();
      }
    } catch (error) {
      unlockActions();
    }
  };

  useEffect(() => {
    if (visible && canContinue && !isLoaded && !isLoading) {
      load();
    }
  }, [visible, canContinue, isLoaded, isLoading, load]);

  useEffect(() => {
    if (visible) {
      hasPersistedScoreRef.current = false;
      saveScorePromiseRef.current = null;
      setIsSavingScore(false);
      unlockActions();
    }
  }, [visible]);

  const onPressContinue = async () => {
    await runLockedAction(async () => {
      // Ensure this death is posted even when player chooses to continue.
      const didSave = await saveScore();
      if (!didSave) return false;

      if (!onContinue) return false;

      if (!isLoaded) {
        load();
        return false;
      }

      const rewarded = await show();
      if (rewarded) {
        onContinue();
        return true;
      }

      return false;
    });
  };

  const saveScore = async (): Promise<boolean> => {
    if (saveScorePromiseRef.current) return saveScorePromiseRef.current;
    if (hasPersistedScoreRef.current) return true;

    const savePromise = (async () => {
      // Flip immediately to prevent duplicate concurrent submissions.
      hasPersistedScoreRef.current = true;
      setIsSavingScore(true);

      try {
        const parsedHiScore = await loadHiScore();

        if (score > parsedHiScore) {
          storeData('HISCORE', score);
          setHiScore(score);
        }
        await addNewScore(score);
        return true;
      } catch (error) {
        // Allow a retry from another path (restart/main menu/continue) if save fails.
        hasPersistedScoreRef.current = false;
        return false;
      } finally {
        setIsSavingScore(false);
      }
    })();

    saveScorePromiseRef.current = savePromise;
    const didSave = await savePromise;
    saveScorePromiseRef.current = null;

    return didSave;
  };

  const handleRestart = async () => {
    await runLockedAction(async () => {
      // Always persist current death before starting a new run.
      const didSave = await saveScore();
      if (!didSave) return false;

      resetGame();
      return true;
    });
  };

  const handleMainMenu = async () => {
    await runLockedAction(async () => {
      // Always persist current death before leaving game screen.
      const didSave = await saveScore();
      if (!didSave) return false;

      router.push('..');
      return true;
    });
  };

  useEffect(() => {
    if (visible && !hasPersistedScoreRef.current) {
      saveScore();
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={resetGame}>
      <SafeAreaView style={styles.modalContainer}>
        <ImageBackground
          resizeMode={'stretch'}
          source={images.panelHeader}
          style={styles.headerPanel}>
          <Text style={styles.headerText}>Game Over</Text>
        </ImageBackground>
        <ImageBackground
          resizeMode={'stretch'}
          source={images.panel}
          style={styles.scoreCard}>
          <Text style={styles.scoreValue}>{score}</Text>

          <GameOverModalScoreboard
            scores={scores}
            isLoading={isSavingScore}
            score={score}
            personalBest={hiScore}
            isPersonalBest={hiScoreBeat}
          />
        </ImageBackground>
        <View style={styles.ctaContainer}>
          <View>
            <TouchableOpacity onPress={handleRestart} disabled={isActionLocked}>
              <ImageBackground
                resizeMode={'stretch'}
                source={images.normalButton}
                style={[styles.ctaButton, styles.primaryCta]}>
                <Text style={styles.ctaText}>Restart</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <View style={styles.secondaryRow}>
            <View>
              <TouchableOpacity
                onPress={handleMainMenu}
                disabled={isActionLocked}>
                <ImageBackground
                  resizeMode={'stretch'}
                  source={images.normalButton}
                  style={styles.ctaButton}>
                  <Text style={styles.ctaText}>Main Menu</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
            <View>
              {canContinue ? (
                <TouchableOpacity
                  onPress={onPressContinue}
                  disabled={isActionLocked || (!isLoaded && isLoading)}>
                  <ImageBackground
                    resizeMode={'stretch'}
                    source={images.adButton}
                    style={styles.ctaButton}>
                    <Text style={styles.ctaText}>
                      {isLoaded
                        ? 'Continue'
                        : isLoading
                          ? 'Loading…'
                          : 'Load Ad'}
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
              ) : (
                <ImageBackground
                  resizeMode={'stretch'}
                  source={images.adButton}
                  style={[styles.ctaButton, styles.placeholderButton]}>
                  <Text style={styles.placeholderText}>Claimed</Text>
                </ImageBackground>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default GameOverModal;
