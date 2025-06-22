const images = {
  'astro-left-1': require('../assets/newAssets/astro-left-climb1.png'),
  'astro-left-2': require('../assets/newAssets/astro-left-climb2.png'),
  'astro-right-1': require('../assets/newAssets/astro-right-climb1.png'),
  'astro-right-2': require('../assets/newAssets/astro-right-climb2.png'),
  space: require('../assets/newAssets/space-background.gif'),
  nothing: require('../assets/nothing.png'),
  spaceProbe: require('../assets/newAssets/space-probe.png'),
  elevatorTile: require('../assets/newAssets/elevator-tile.png'),
  obstacleTile: require('../assets/newAssets/obstacle-tile.png'),
  oxygenMeter: require('../assets/newAssets/meter.png'),
  oxygenTank: require('../assets/newAssets/oxygen-tank.png'),
  pitstop: require('../assets/newAssets/pitstop.png'),
  pause: require('../assets/newAssets/pause.png'),
  play: require('../assets/newAssets/play.png'),
  spaceScreen: require('../assets/newAssets/space-screen.png'),
  obstacleTileLeft: require('../assets/newAssets/elevator-tile-obstacle-left.png'),
  obstacleTileRight: require('../assets/newAssets/elevator-tile-obstacle-right.png'),
};

let imageValues = Object.values(images);

export { imageValues, images };
