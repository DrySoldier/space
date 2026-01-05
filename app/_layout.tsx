import {Stack} from 'expo-router';
import {useEffect} from 'react';
import mobileAds from 'react-native-google-mobile-ads';
import {MusicProvider} from '../context/MusicProvider';

export default function RootLayout() {
  useEffect(() => {
    // Initialize Google Mobile Ads SDK once on app start
    mobileAds().initialize();
  }, []);
  return (
    <MusicProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animationTypeForReplace: 'pop',
          animation: 'fade',
        }}
      />
    </MusicProvider>
  );
}
