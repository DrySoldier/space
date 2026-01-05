import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// Use test AdMob unit IDs by default in dev to avoid no-fill / account approval blockers.
// Set EXPO_PUBLIC_ADS_ENV=prod to force real unit IDs.
const ADS_ENV = process.env.EXPO_PUBLIC_ADS_ENV ?? 'dev';
const USE_TEST_IDS = ADS_ENV !== 'prod';
const REWARDED_UNIT_ID = USE_TEST_IDS
  ? TestIds.REWARDED
  : (Platform.select({
      ios: 'ca-app-pub-7460988456290280/1021212904',
      android: 'ca-app-pub-7460988456290280/7913924311',
    }) || TestIds.REWARDED);

const DEBUG_ADS = true;
const log = (...args: any[]) => {
  if (DEBUG_ADS) {
    // eslint-disable-next-line no-console
    console.log('[Ads][Rewarded]', ...args);
  }
};

export function useRewardedAd() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const rewardResolverRef = useRef<null | ((v: boolean) => void)>(null);

  const adRef = useRef<RewardedAd | null>(null);
  // Keep mirrors of state in refs so effect dependencies remain stable
  const isLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const rewardEarnedRef = useRef(false);

  const createAd = useCallback(() => {
    log('createAd()', { unitId: REWARDED_UNIT_ID, env: ADS_ENV, useTestIds: USE_TEST_IDS });
    const ad = RewardedAd.createForAdRequest(REWARDED_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    });

    ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      log('event: LOADED');
      setIsLoaded(true);
      setIsLoading(false);
      isLoadedRef.current = true;
      isLoadingRef.current = false;
    });
    ad.addAdEventListener(AdEventType.ERROR, (error: any) => {
      log('event: ERROR', error?.code, error?.message || error);
      setIsLoaded(false);
      setIsLoading(false);
      isLoadedRef.current = false;
      isLoadingRef.current = false;
      // Reject any pending reward awaiters
      rewardResolverRef.current?.(false);
      rewardResolverRef.current = null;
      rewardEarnedRef.current = false;
    });
    ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward: any) => {
      log('event: EARNED_REWARD', reward);
      // Mark reward earned; resolve after close event
      rewardEarnedRef.current = true;
    });
    ad.addAdEventListener(AdEventType.CLOSED, () => {
      log('event: CLOSED');
      // After closing, re-create ad for next time
      setIsLoaded(false);
      adRef.current?.removeAllListeners();
      adRef.current = null;
      isLoadedRef.current = false;
      // Resolve any pending show() promise now that the ad UI is gone
      if (rewardResolverRef.current) {
        const resolve = rewardResolverRef.current;
        const earned = rewardEarnedRef.current;
        rewardResolverRef.current = null;
        rewardEarnedRef.current = false;
        try { resolve(earned); } catch {}
      } else {
        rewardEarnedRef.current = false;
      }
      // Load a fresh ad in the background with a new instance
      setTimeout(() => {
        const next = createAd();
        try {
          next.load();
        } catch {}
      }, 0);
    });

    adRef.current = ad;
    return ad;
  }, []);

  const load = useCallback(() => {
    if (isLoadingRef.current || isLoadedRef.current) {
      log('load(): skipped', {
        isLoading: isLoadingRef.current,
        isLoaded: isLoadedRef.current,
      });
      return;
    }
    log('load(): start');
    setIsLoading(true);
    isLoadingRef.current = true;
    const ad = adRef.current ?? createAd();
    try {
      ad.load();
      log('load(): called ad.load()');
    } catch (e: any) {
      log('load(): exception calling ad.load()', e?.message || e);
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [createAd]);

  // Returns promise<boolean>: true if reward earned
  const show = useCallback(async (): Promise<boolean> => {
    if (!isLoaded) {
      log('show(): not loaded');
      return false;
    }
    log('show(): start');
    return new Promise<boolean>((resolve) => {
      rewardResolverRef.current = resolve;
      adRef.current
        ?.show()
        .then(() => log('show(): show() resolved'))
        .catch((err: any) => {
          log('show(): error', err?.message || err);
          resolve(false);
          rewardResolverRef.current = null;
        });
    });
  }, [isLoaded]);

  useEffect(() => {
    log('effect: initial load');
    // Create once and start loading; avoid effect churn on state flips
    const ad = createAd();
    try {
      ad.load();
    } catch {}
    return () => {
      log('cleanup: removeAllListeners');
      adRef.current?.removeAllListeners();
      adRef.current = null;
      isLoadedRef.current = false;
      isLoadingRef.current = false;
    };
  }, [createAd]);

  return {
    isLoaded,
    isLoading,
    load,
    show,
  };
}
