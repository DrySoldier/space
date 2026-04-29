import React, {useCallback, useEffect, useState} from 'react';

import {
  SPACE_MAN_FIRST_CONTACT_SCENE,
  SPACE_MAN_SHOP_UNLOCK_LINE_ID,
} from '@/constants';
import {
  advanceProgressionTo,
  loadProgression,
  markEncounterCompleteAndUnlockShop,
} from '@/state/meta/progression';

import EncounterCinematicOverlay from './EncounterCinematicOverlay';
import EncounterFallingOverlay from './EncounterFallingOverlay';

interface EncounterFlowProps {
  encounterCheckSeq: number;
  score: number;
  onFlowResolved: () => void;
}

const EncounterFlow = ({
  encounterCheckSeq,
  score,
  onFlowResolved,
}: EncounterFlowProps) => {
  const [encounterPhase, setEncounterPhase] = useState<
    'idle' | 'falling' | 'cinematic'
  >('idle');
  const [dialogueLineIndex, setDialogueLineIndex] = useState(0);

  const currentDialogueLine =
    SPACE_MAN_FIRST_CONTACT_SCENE.lines[dialogueLineIndex];
  const isShopUnlockedLine =
    currentDialogueLine?.id === SPACE_MAN_SHOP_UNLOCK_LINE_ID;

  useEffect(() => {
    if (encounterCheckSeq <= 0 || encounterPhase !== 'idle') {
      return;
    }

    let cancelled = false;

    const maybeShowEncounter = async () => {
      const progression = await loadProgression();
      const shouldSkipEncounter = progression.encounterSeen;

      if (cancelled || shouldSkipEncounter) {
        if (!cancelled) {
          onFlowResolved();
        }
        return;
      }

      await advanceProgressionTo('milestone_hit');
      await advanceProgressionTo('catastrophe_triggered');
      await advanceProgressionTo('encounter_scene');

      if (!cancelled) {
        setEncounterPhase('falling');
      }
    };

    maybeShowEncounter();

    return () => {
      cancelled = true;
    };
  }, [encounterCheckSeq, encounterPhase, onFlowResolved]);

  useEffect(() => {
    if (encounterPhase === 'cinematic') {
      setDialogueLineIndex(0);
    }
  }, [encounterPhase]);

  const handleFallingComplete = useCallback(() => {
    setEncounterPhase('cinematic');
  }, []);

  const handleCinematicDialogueAdvance = useCallback(async () => {
    if (!currentDialogueLine) {
      return;
    }

    if (dialogueLineIndex < SPACE_MAN_FIRST_CONTACT_SCENE.lines.length - 1) {
      setDialogueLineIndex(previousState => previousState + 1);
      return;
    }

    await markEncounterCompleteAndUnlockShop();
    onFlowResolved();
    setEncounterPhase('idle');
  }, [currentDialogueLine, dialogueLineIndex, onFlowResolved]);

  return (
    <>
      {(encounterPhase === 'falling' || encounterPhase === 'cinematic') && (
        <EncounterFallingOverlay
          score={score}
          phase={encounterPhase}
          onComplete={handleFallingComplete}
        />
      )}

      {encounterPhase === 'cinematic' && (
        <EncounterCinematicOverlay
          currentDialogueLine={currentDialogueLine}
          isShopUnlockedLine={isShopUnlockedLine}
          onAdvance={handleCinematicDialogueAdvance}
        />
      )}
    </>
  );
};

export default EncounterFlow;
