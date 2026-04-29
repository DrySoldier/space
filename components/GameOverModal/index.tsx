import React, {useRef, useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, Modal, SafeAreaView} from 'react-native';
import {ImageBackground} from 'expo-image';
import {useRouter} from 'expo-router';
import {useScoreboard} from '@/hooks/useScoreboard';
import {useRewardedAd} from '@/hooks/useRewardedAd';
import GameOverModalScoreboard from './Scoreboard';
import styles from './styles';
import {images} from '../../constants/images';
import {retrieveData, storeData} from '../../utils/asyncData';
import {calculateRunCurrencyPayout} from '@/utils';
import {loadShopState, saveShopState} from '@/state/meta/shop';

interface IGameOverModal {
  visible: boolean;
  score: number;
  tanksCollected: number;
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
  tanksCollected,
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
  const [shopUnlocked, setShopUnlocked] = useState(false);

  const hasPersistedScoreRef = useRef(false);
  const saveScorePromiseRef = useRef<Promise<boolean> | null>(null);
  const actionLockRef = useRef(false);

  const hiScoreBeat = score >= hiScore;

  const refreshShopUnlocked = async () => {
    const shopState = await loadShopState();
    setShopUnlocked(shopState.unlocked);
  };

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
      refreshShopUnlocked();
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
        const shopState = await loadShopState();
        const payoutCredits = calculateRunCurrencyPayout(
          score,
          tanksCollected,
          shopState.levels.tank_value_boost,
        );

        const nextShopState = {
          ...shopState,
          wallet: {
            oxygenCredits: shopState.wallet.oxygenCredits + payoutCredits,
          },
        };

        if (score > parsedHiScore) {
          await storeData('HISCORE', score);
          setHiScore(score);
        }

        await saveShopState(nextShopState);
        await storeData('CREDITS', nextShopState.wallet.oxygenCredits);
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

  const handleShop = async () => {
    await runLockedAction(async () => {
      const didSave = await saveScore();
      if (!didSave) return false;

      // Dismiss the modal state before leaving the game screen.
      resetGame();
      router.replace('/screens/shop');
      return true;
    });
  };

  useEffect(() => {
    if (visible && !hasPersistedScoreRef.current) {
      saveScore();
    }
  }, [visible]);

  const continueButton = canContinue ? (
    <TouchableOpacity
      onPress={onPressContinue}
      disabled={isActionLocked || (!isLoaded && isLoading)}>
      <ImageBackground
        resizeMode={'stretch'}
        source={images.adButton}
        style={styles.ctaButton}>
        <Text style={styles.ctaText}>
          {isLoaded ? 'Continue' : isLoading ? 'Loading…' : 'Load Ad'}
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
  );

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
          {shopUnlocked ? (
            <View style={styles.gridContainer}>
              <TouchableOpacity onPress={handleShop} disabled={isActionLocked}>
                <ImageBackground
                  resizeMode={'stretch'}
                  source={images.normalButton}
                  style={styles.ctaButton}>
                  <Text style={styles.ctaText}>Shop</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRestart} disabled={isActionLocked}>
                <ImageBackground
                  resizeMode={'stretch'}
                  source={images.normalButton}
                  style={styles.ctaButton}>
                  <Text style={styles.ctaText}>Restart</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleMainMenu} disabled={isActionLocked}>
                <ImageBackground
                  resizeMode={'stretch'}
                  source={images.normalButton}
                  style={styles.ctaButton}>
                  <Text style={styles.ctaText}>Main Menu</Text>
                </ImageBackground>
              </TouchableOpacity>

              {continueButton}
            </View>
          ) : (
            <>
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
                <View>{continueButton}</View>
              </View>

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
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default GameOverModal;
