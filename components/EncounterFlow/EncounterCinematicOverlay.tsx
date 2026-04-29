import React, {useEffect, useRef, useState} from 'react';
import {Animated, Pressable, Text, View} from 'react-native';
import {Image, ImageBackground} from 'expo-image';

import {images, type DialogueLine} from '@/constants';

import {
  MERCHANT_FLICKER_INTERVAL_MS,
  MERCHANT_REVEAL_DELAY_MS,
  PANEL_POP_IN_MS,
  TABLET_FADE_IN_MS,
  TABLET_STATIC_EFFECT_MS,
} from './constants';

import styles from './styles';

interface EncounterCinematicOverlayProps {
  currentDialogueLine?: DialogueLine;
  isShopUnlockedLine: boolean;
  onAdvance: () => void;
}

const EncounterCinematicOverlay = ({
  currentDialogueLine,
  isShopUnlockedLine,
  onAdvance,
}: EncounterCinematicOverlayProps) => {
  const [panelVisible, setPanelVisible] = useState(false);
  const [merchantVisible, setMerchantVisible] = useState(false);

  const cinematicOpacity = useRef(new Animated.Value(0)).current;
  const staticOpacity = useRef(new Animated.Value(0)).current;
  const merchantOpacity = useRef(new Animated.Value(0)).current;
  const merchantFlickerOpacity = useRef(new Animated.Value(1)).current;
  const panelOpacity = useRef(new Animated.Value(0)).current;
  const panelScale = useRef(new Animated.Value(0.92)).current;
  const cinematicTabletY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    const intervalIds: ReturnType<typeof setInterval>[] = [];

    const pushTimeout = (callback: () => void, delayMs: number) => {
      const timeoutId = setTimeout(callback, delayMs);
      timeoutIds.push(timeoutId);
    };

    const pushInterval = (callback: () => void, delayMs: number) => {
      const intervalId = setInterval(callback, delayMs);
      intervalIds.push(intervalId);
      return intervalId;
    };

    setPanelVisible(false);
    setMerchantVisible(false);

    cinematicOpacity.setValue(0);
    staticOpacity.setValue(0);
    merchantOpacity.setValue(0);
    merchantFlickerOpacity.setValue(1);
    panelOpacity.setValue(0);
    panelScale.setValue(0.92);
    cinematicTabletY.setValue(0);

    Animated.timing(cinematicOpacity, {
      toValue: 1,
      duration: TABLET_FADE_IN_MS,
      useNativeDriver: true,
    }).start();

    const staticFlicker = () => {
      Animated.timing(staticOpacity, {
        toValue: Math.random() > 0.45 ? 0.9 : 0.22,
        duration: 70,
        useNativeDriver: true,
      }).start();
    };

    staticFlicker();
    const staticIntervalId = pushInterval(staticFlicker, 90);

    pushTimeout(() => {
      clearInterval(staticIntervalId);

      Animated.timing(staticOpacity, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }).start();

      setMerchantVisible(true);

      Animated.parallel([
        Animated.timing(merchantOpacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(cinematicTabletY, {
          toValue: 18,
          duration: 460,
          useNativeDriver: true,
        }),
      ]).start();

      pushInterval(() => {
        Animated.sequence([
          Animated.timing(merchantFlickerOpacity, {
            toValue: Math.random() > 0.5 ? 0.84 : 0.62,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(merchantFlickerOpacity, {
            toValue: 1,
            duration: 80,
            useNativeDriver: true,
          }),
        ]).start();
      }, MERCHANT_FLICKER_INTERVAL_MS);
    }, TABLET_FADE_IN_MS + TABLET_STATIC_EFFECT_MS);

    pushTimeout(() => {
      setPanelVisible(true);
      Animated.parallel([
        Animated.timing(panelOpacity, {
          toValue: 1,
          duration: PANEL_POP_IN_MS,
          useNativeDriver: true,
        }),
        Animated.timing(panelScale, {
          toValue: 1,
          duration: PANEL_POP_IN_MS,
          useNativeDriver: true,
        }),
      ]).start();
    },
    TABLET_FADE_IN_MS + TABLET_STATIC_EFFECT_MS + MERCHANT_REVEAL_DELAY_MS);

    return () => {
      timeoutIds.forEach(clearTimeout);
      intervalIds.forEach(clearInterval);
    };
  }, [
    cinematicOpacity,
    cinematicTabletY,
    merchantFlickerOpacity,
    merchantOpacity,
    panelOpacity,
    panelScale,
    staticOpacity,
  ]);

  return (
    <Animated.View
      style={[styles.encounterCinematicOverlay, {opacity: cinematicOpacity}]}
      pointerEvents="auto">
      <Animated.View style={{transform: [{translateY: cinematicTabletY}]}}>
        <View style={styles.spaceTabletContainer}>
          <View style={styles.tabletWindow}>
            <Animated.View
              pointerEvents="none"
              style={[styles.tabletStaticLayer, {opacity: staticOpacity}]}
            />
          </View>
          <View style={styles.cinematicMerchantBlackFill} />

          {merchantVisible && !isShopUnlockedLine && (
            <Animated.View
              style={[
                styles.cinematicMerchantContainer,
                {
                  opacity: merchantOpacity,
                },
              ]}>
              <Animated.View style={{opacity: merchantFlickerOpacity}}>
                <Image
                  source={images.merchantDark}
                  style={styles.cinematicMerchantImage}
                  resizeMode="stretch"
                />
              </Animated.View>
            </Animated.View>
          )}

          <Image source={images.spaceTablet} style={styles.spaceTablet} />
        </View>
      </Animated.View>

      {panelVisible && currentDialogueLine && (
        <Pressable style={styles.encounterPanelTapArea} onPress={onAdvance}>
          <Animated.View
            style={[
              styles.encounterPanelWrapper,
              {opacity: panelOpacity, transform: [{scale: panelScale}]},
            ]}>
            <ImageBackground
              source={images.panel}
              resizeMode="stretch"
              style={styles.encounterPanel}>
              <Text style={styles.encounterDialogueText}>
                {currentDialogueLine.text}
              </Text>
              <Text style={styles.encounterHintText}>Tap to continue</Text>
            </ImageBackground>
          </Animated.View>
        </Pressable>
      )}
    </Animated.View>
  );
};

export default EncounterCinematicOverlay;