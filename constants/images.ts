const images = {
  'astro-left-1': require('../assets/newAssets/astro-left-climb1.png'),
  'astro-left-2': require('../assets/newAssets/astro-left-climb2.png'),
  'astro-right-1': require('../assets/newAssets/astro-right-climb1.png'),
  'astro-right-2': require('../assets/newAssets/astro-right-climb2.png'),
  space: require('../assets/newAssets/space-background.gif'),
  nothing: require('../assets/nothing.png'),
  spaceProbe: require('../assets/newAssets/space-probe.png'),
  elevatorTile: require('../assets/newAssets/elevator-tile.png'),
  obstacleTile: require('../assets/newAssets/obstacle-tile.png')
};

let imageValues = Object.values(images);

export { imageValues, images };
