import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {Image} from 'expo-image';
import {images} from '@/constants';
import {useRouter} from 'expo-router';
import {retrieveData, storeData} from '@/utils/asyncData';
import * as Crypto from 'expo-crypto';

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
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Image
        source={images['astro-left-2']}
        style={{height: 200, width: 200}}
      />
    </View>
  );
}
