import React, {createContext, useContext, useEffect, useState} from 'react';
import Audio, {useAudioPlayer} from 'expo-audio';
import {retrieveData, storeData} from '../utils/asyncData';

type MusicCtx = {isPlaying: boolean; toggle: () => void};
const MusicContext = createContext<MusicCtx | null>(null);

const music = require('../assets/sound/SynthyBoi1.wav');

export function MusicProvider({children}: {children: React.ReactNode}) {
  const player = useAudioPlayer(music);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    (async () => {
      const isMuted = await retrieveData('MUTED');

      if (isMuted !== 'true' && isMuted !== 'false') {
        await storeData('MUTED', 'false');
      }

      player.loop = true;
      player.play();

      if (isMuted === 'true') {
        player.pause();
        setIsPlaying(false);
      }
    })();
  }, []);

  const toggle = async () => {
    if (isPlaying) {
      await storeData('MUTED', 'true');
      player.pause();
      setIsPlaying(false);
    } else {
      await storeData('MUTED', 'false');
      setIsPlaying(true);
      player.play();
    }
  };

  return (
    <MusicContext.Provider value={{isPlaying, toggle}}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be inside <MusicProvider/>');
  return ctx;
};
