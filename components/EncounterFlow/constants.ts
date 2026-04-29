import type {Frame} from '@darrench3140/react-native-sprite-sheet';

export const FALLING_TRANSITION_DURATION_MS = 7000;
export const TABLET_FINAL_FRAME_HOLD_MS = 1400;
export const TABLET_SPRITE_FPS = 2.5;
export const TABLET_SPRITE_SHEET_SIZE = {width: 249, height: 45};
export const TABLET_FALLING_FRAMES: Frame[] = [
  {frame: {x: 0, y: 0, w: 25, h: 44}},
  {frame: {x: 26, y: 0, w: 25, h: 45}},
  {frame: {x: 51, y: 0, w: 29, h: 45}},
  {frame: {x: 82, y: 0, w: 28, h: 45}},
  {frame: {x: 112, y: 2, w: 29, h: 43}},
  {frame: {x: 143, y: 2, w: 27, h: 43}},
  {frame: {x: 172, y: 2, w: 26, h: 43}},
];
export const TABLET_SPRITE_PLAY_DURATION_MS =
  TABLET_FALLING_FRAMES.length * (1000 / TABLET_SPRITE_FPS);
export const TABLET_FADE_IN_MS = 380;
export const TABLET_STATIC_EFFECT_MS = 1800;
export const MERCHANT_REVEAL_DELAY_MS = 250;
export const PANEL_POP_IN_MS = 220;
export const MERCHANT_WOBBLE_SWING_MS = 2200;
export const MERCHANT_FLICKER_INTERVAL_MS = 95;