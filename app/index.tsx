import {useEffect, useState} from 'react';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Image} from 'expo-image';
import {images} from '@/constants';
import {useRouter} from 'expo-router';
import {retrieveData, storeData} from '@/utils/asyncData';
import * as Crypto from 'expo-crypto';
import {StatusBar} from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded, error] = useFonts({
    Pixellari: require('../assets/fonts/Pixellari.ttf'),
  });
  const [uuidLoaded, setUUIDLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (uuidLoaded && (loaded || error)) {
      SplashScreen.hideAsync();
      router.navigate('/screens/home');
    }
  }, [loaded, error, uuidLoaded]);

  useEffect(() => {
    (async function () {
      const deviceId = await retrieveData('UUID');

      if (!deviceId) {
        const uuid = Crypto.randomUUID();

        await storeData('UUID', uuid);
      }
      setUUIDLoaded(true);
    })();

    NavigationBar.setPositionAsync('absolute');
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Image source={images.space} style={{height: '100%', width: '100%'}} />
    </>
  );
}
