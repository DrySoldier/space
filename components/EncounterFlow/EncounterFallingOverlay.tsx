import React, {useEffect, useRef, useState} from 'react';
import {Animated, Easing, Text} from 'react-native';
import {
  AnimatedSprite,
  getFrames,
  type AnimatedSpriteType,
} from '@darrench3140/react-native-sprite-sheet';

import {images} from '@/constants';
import Background from '@/components/Background';

import {
  FALLING_TRANSITION_DURATION_MS,
  MERCHANT_WOBBLE_SWING_MS,
  TABLET_FALLING_FRAMES,
  TABLET_FINAL_FRAME_HOLD_MS,
  TABLET_SPRITE_FPS,
  TABLET_SPRITE_PLAY_DURATION_MS,
  TABLET_SPRITE_SHEET_SIZE,
} from './constants';
import styles from './styles';

interface EncounterFallingOverlayProps {
  score: number;
  phase: 'falling' | 'cinematic';
  onComplete: () => void;
}

const EncounterFallingOverlay = ({
  score,
  phase,
  onComplete,
}: EncounterFallingOverlayProps) => {
  const [step, setStep] = useState(false);

  const tabletSpriteRef = useRef<AnimatedSpriteType>(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const fallingMerchantY = useRef(new Animated.Value(-280)).current;
  const fallingWobble = useRef(new Animated.Value(0)).current;

  const fallingWobbleRotate = fallingWobble.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '18deg'],
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setStep(previousState => !previousState);
    }, 55);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let wobbleAnimation: Animated.CompositeAnimation | null = null;

    const randomWobbleMagnitude = () => 0.35 + Math.random() * 0.55;

    const runWobbleLoop = () => {
      if (cancelled) {
        return;
      }

      const rightTarget = randomWobbleMagnitude();
      const leftTarget = -randomWobbleMagnitude();

      wobbleAnimation = Animated.sequence([
        Animated.timing(fallingWobble, {
          toValue: rightTarget,
          easing: Easing.linear,
          duration: MERCHANT_WOBBLE_SWING_MS,
          useNativeDriver: true,
        }),
        Animated.timing(fallingWobble, {
          toValue: leftTarget,
          easing: Easing.linear,
          duration: MERCHANT_WOBBLE_SWING_MS,
          useNativeDriver: true,
        }),
        Animated.timing(fallingWobble, {
          toValue: 0,
          easing: Easing.linear,
          duration: MERCHANT_WOBBLE_SWING_MS,
          useNativeDriver: true,
        }),
      ]);

      wobbleAnimation.start(({finished}) => {
        if (finished) {
          runWobbleLoop();
        }
      });
    };

    runWobbleLoop();

    return () => {
      cancelled = true;
      wobbleAnimation?.stop();
    };
  }, [fallingWobble]);

  useEffect(() => {
    if (phase !== 'falling') {
      return;
    }

    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    const pushTimeout = (callback: () => void, delayMs: number) => {
      const timeoutId = setTimeout(callback, delayMs);
      timeoutIds.push(timeoutId);
    };

    fallingMerchantY.setValue(-500);
    overlayOpacity.setValue(0);
    fallingWobble.setValue(0);

    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();

    Animated.timing(fallingMerchantY, {
      toValue: 50,
      duration: FALLING_TRANSITION_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    pushTimeout(() => {
      tabletSpriteRef.current?.startAnimation('falling', false, TABLET_SPRITE_FPS);
    }, FALLING_TRANSITION_DURATION_MS + 900);

    pushTimeout(
      () => {
        onComplete();
      },
      FALLING_TRANSITION_DURATION_MS +
        TABLET_SPRITE_PLAY_DURATION_MS +
        TABLET_FINAL_FRAME_HOLD_MS,
    );

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [
    fallingMerchantY,
    fallingWobble,
    onComplete,
    overlayOpacity,
    phase,
    tabletSpriteRef,
  ]);

  useEffect(() => {
    if (phase !== 'cinematic') {
      return;
    }

    Animated.timing(fallingMerchantY, {
      toValue: 150,
      duration: FALLING_TRANSITION_DURATION_MS,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [fallingMerchantY, phase]);

  return (
    <Animated.View
      style={[styles.encounterTransitionOverlay, {opacity: overlayOpacity}]}
      pointerEvents="none">
      <Background score={score} step={step} />

      <Animated.View
        style={[
          styles.falling,
          {
            transform: [
              {translateY: fallingMerchantY},
              {rotate: fallingWobbleRotate},
            ],
          },
        ]}>
        <AnimatedSprite
          ref={tabletSpriteRef}
          source={images.tabletSpriteSheet}
          spriteSheetSize={TABLET_SPRITE_SHEET_SIZE}
          size={{width: 81, height: 152}}
          frames={TABLET_FALLING_FRAMES}
          fps={TABLET_SPRITE_FPS}
          inLoop={false}
          autoPlay={false}
          defaultAnimationName="falling"
          animations={{
            falling: getFrames(0, TABLET_FALLING_FRAMES.length - 1),
          }}
        />
      </Animated.View>

      {phase === 'falling' && (
        <Animated.View
          style={{
            bottom: '18%',
            position: 'absolute',
          }}>
          <Text style={styles.encounterTransitionText}>Falling through space...</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default EncounterFallingOverlay;