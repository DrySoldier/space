export type DialogueSpeaker = 'space_man' | 'player' | 'system';

export interface DialogueLine {
  id: string;
  speaker: DialogueSpeaker;
  text: string;
}

export interface DialogueScene {
  sceneId: string;
  lines: DialogueLine[];
  skippable?: boolean;
}

export const SPACE_MAN_SHOP_UNLOCK_LINE_ID = 'shop_unlocked';

export const SPACE_MAN_FIRST_CONTACT_SCENE: DialogueScene = {
  sceneId: 'space_man_first_contact',
  skippable: false,
  lines: [
    {
      id: 's1',
      speaker: 'space_man',
      text: "...",
    },
    {
      id: 's2',
      speaker: 'space_man',
      text: "Space Man. Can you hear me? Can you see me?",
    },
    {
      id: 's3',
      speaker: 'space_man',
      text: 'What do you seek from this tower?',
    },
    {
      id: 's4',
      speaker: 'space_man',
      text: '...',
    },
    {
      id: 's5',
      speaker: 'space_man',
      text: 'You and many others. Let me help you.',
    },
    {
      id: 's6',
      speaker: 'space_man',
      text: 'There is no free lunch in this world. Bring me oxygen tanks. Yes, they may be depleted.',
    },
    {
      id: 's7',
      speaker: 'space_man',
      text: 'I look forward to this mutually beneficial relationship.',
    },
    {
      id: SPACE_MAN_SHOP_UNLOCK_LINE_ID,
      speaker: 'space_man',
      text: 'Shop Unlocked.',
    },
  ],
};
