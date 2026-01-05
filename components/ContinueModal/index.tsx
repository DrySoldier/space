import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { ImageBackground } from 'expo-image';
import { images } from '@/constants';
import { useRewardedAd } from '@/hooks/useRewardedAd';

interface Props {
  visible: boolean;
  onContinue: () => void;
  onEndRun: () => void;
}

const ContinueModal = ({ visible, onContinue, onEndRun }: Props) => {
  const { isLoaded, isLoading, load, show } = useRewardedAd();

  useEffect(() => {
    if (visible && !isLoaded && !isLoading) {
      load();
    }
  }, [visible, isLoaded, isLoading, load]);

  const handleContinue = async () => {
    if (!isLoaded) {
      load();
      return;
    }
    const rewarded = await show();
    if (rewarded) onContinue();
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ImageBackground
          resizeMode="stretch"
          source={images.spaceScreen}
          style={{ width: 320, padding: 16 }}
        >
          <Text
            style={{ color: 'white', fontFamily: 'Pixellari', fontSize: 28, textAlign: 'center', marginBottom: 12 }}
          >
            Continue?
          </Text>
          <TouchableOpacity onPress={handleContinue} disabled={!isLoaded && isLoading}>
            <ImageBackground
              resizeMode={'stretch'}
              source={images.spaceProbe}
              style={{ height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
            >
              <Text style={{ color: 'white', fontFamily: 'Pixellari', fontSize: 18 }}>
                {isLoaded ? 'Watch Ad to Continue' : isLoading ? 'Loading Ad…' : 'Load Ad'}
              </Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity onPress={onEndRun}>
            <ImageBackground
              resizeMode={'stretch'}
              source={images.spaceProbe}
              style={{ height: 56, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: 'white', fontFamily: 'Pixellari', fontSize: 18 }}>End Run</Text>
            </ImageBackground>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </Modal>
  );
};

export default ContinueModal;

