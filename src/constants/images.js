const images = {
  'astro-right': require('src/assets/newAssets/Astronaut-left-climb1.png'),
  'astro-left': require('src/assets/newAssets/Astronaut-right-climb2.png'),
  space: require('src/assets/newAssets/space-background.gif'),
  nothing: require('src/assets/nothing.png'),

  floorCorner: require('src/assets/future/Floor_1_Corner.png'),
  floorWaterClean: require('src/assets/future/Floor_1_Water_Clean.png'),
  floorWater: require('src/assets/future/Floor_1_Water.png'),
  floor1: require('src/assets/future/Floor_1.png'),
  floor2: require('src/assets/future/Floor_2.png'),
  girder: require('src/assets/future/girder.png'),
  pipeValve: require('src/assets/future/pipe-valve.png'),
  pipe: require('src/assets/future/pipe.png'),
  wallBlack: require('src/assets/future/wall-black.png'),
  wallCyan: require('src/assets/future/wall-cyan.png'),
  wallPink: require('src/assets/future/wall-pink.png'),
  wallRed: require('src/assets/future/wall-red.png'),
};

let imageValues = Object.values(images);

export { imageValues, images };
