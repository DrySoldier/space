import React, {useEffect, useMemo, useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import {Image, ImageBackground} from 'expo-image';

import {
  DialogueScene as DialogueSceneModel,
  DialogueSpeaker,
  images,
} from '@/constants';

import styles from './styles';

interface DialogueSceneProps {
  visible: boolean;
  scene: DialogueSceneModel;
  onComplete: () => void;
}

const speakerToDisplayName: Record<DialogueSpeaker, string> = {
  space_man: 'Space Man',
  player: 'You',
  system: 'System',
};

const speakerToPortrait: Record<DialogueSpeaker, number> = {
  space_man: images.merchantBright,
  player: images['astro-left-2'],
  system: images.merchantDark,
};

const DialogueScene = ({visible, scene, onComplete}: DialogueSceneProps) => {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setLineIndex(0);
    }
  }, [visible, scene.sceneId]);

  const currentLine = useMemo(
    () => scene.lines[lineIndex],
    [lineIndex, scene.lines],
  );

  const advance = () => {
    if (lineIndex >= scene.lines.length - 1) {
      onComplete();
      return;
    }

    setLineIndex(prev => prev + 1);
  };

  if (!visible || !currentLine) {
    return null;
  }

  return (
    <Pressable style={styles.overlay} onPress={advance}>
      <View style={styles.content}>
        <Image
          source={speakerToPortrait[currentLine.speaker]}
          style={styles.portrait}
        />
        <ImageBackground
          source={images.panel}
          resizeMode="stretch"
          style={styles.dialoguePanel}>
          <Text style={styles.dialogueText}>{currentLine.text}</Text>
          <Text style={styles.hintText}>Tap to continue</Text>
        </ImageBackground>
      </View>
    </Pressable>
  );
};

export default DialogueScene;
