import {Stack} from 'expo-router';
import { MusicProvider } from '../context/MusicProvider';

export default function RootLayout() {
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
