const images = {
  'astro-left-1': require('src/assets/newAssets/astro-left-climb1.png'),
  'astro-left-2': require('src/assets/newAssets/astro-left-climb2.png'),
  'astro-right-1': require('src/assets/newAssets/astro-right-climb1.png'),
  'astro-right-2': require('src/assets/newAssets/astro-right-climb2.png'),
  space: require('src/assets/newAssets/space-background.gif'),
  nothing: require('src/assets/nothing.png'),
  spaceProbe: require('src/assets/newAssets/space-probe.png'),
  elevatorTile: require('src/assets/newAssets/elevator-tile.png'),
  obstacleTile: require('src/assets/newAssets/obstacle-tile.png')
};

let imageValues = Object.values(images);

export { imageValues, images };
