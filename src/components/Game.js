import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableOpacity,
  Modal,
  Alert,
  Image,
  ImageBackground,
} from 'react-native';
import ThrownAway from 'src/components/ThrownAway';
import HeightView from 'src/components/HeightView';
import {moderateScale as ms} from 'src/constants/scaling';
import {images} from 'src/constants/images';

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function Game() {
  const [currentSide, changeSide] = useState('right');
  // 0 - no branch, 1 - left side branch, 2 - right side branch
  const [branches, setNextBranch] = useState([
    randInt(0, 2),
    0,
    randInt(0, 2),
    0,
    0,
    0,
    0,
  ]);
  const [lastBranch, setLastBranch] = useState(-1);
  const [branchViews, updateBranchViews] = useState([]);
  const [thrownAwayArr, setThrownAwayArr] = useState([]);
  const [heightArr, setHeightArr] = useState([
    <HeightView key={randInt(0, 99999)} callback={heightFinished} />,
  ]);
  const [score, setScore] = useState(-1);
  const [modal, setModal] = useState(false);
  const [branchLocation, setBranchLoc] = useState(-1);
  const [playerModel, setPlayerModel] = useState(images.astroLeft);

  let animatedValue = new Animated.Value(0);
  let nextBranch = -1;

  let spaceGuy = false;

  useEffect(() => {
    setBranchStatus();
    changeSide('right');
    _handlePress('left');
  }, []);

  useEffect(() => {
    let toValue = null;

    if (currentSide === 'left') {
      animatedValue.setValue(ms(125));
      toValue = ms(-125);
    } else if (currentSide === 'right') {
      animatedValue.setValue(ms(-125));
      toValue = ms(125);
    }

    Animated.timing(animatedValue, {
      toValue: toValue,
      duration: 25,
    }).start();
  }, [currentSide, changeSide]);

  useEffect(() => {}, [branches, setNextBranch]);

  const setBranchStatus = () => {
    let stuff = branches.map((element, index) => {
      switch (element) {
        case 0:
          return (
            <ImageBackground
              source={images.floor1}
              key={'nothing' + index + score}
              style={[styles.branch]}
            />
          );

        case 1:
          return (
            <ImageBackground
              source={images.floor1}
              key={'left' + index + score}
              style={[styles.branch, styles.branchLeft]}>
              <Image
                style={{
                  height: ms(100),
                  width: ms(100),
                  marginLeft: ms(-100),
                }}
                source={images.girder}
              />
            </ImageBackground>
          );

        case 2:
          return (
            <ImageBackground
              source={images.floor1}
              key={'right' + index + score}
              style={[styles.branch, styles.branchRight]}>
              <Image
                style={{height: ms(100), width: ms(100), marginLeft: ms(100)}}
                source={images.girder}
              />
            </ImageBackground>
          );

        default:
          return (
            <ImageBackground
              source={images.floor1}
              key={'nothing' + index + score}
              style={[styles.branch]}
            />
          );
      }
    });
    updateBranchViews(stuff);
  };

  const _handlePress = side => {
    changeSide(side);
    if (side === 'left') {
      setPlayerModel(images.astroRight);
    } else if (side === 'right') {
      setPlayerModel(images.astroLeft);
    }

    // Check to see if player is chopping tree below branch
    if (
      (side === 'left' && branches[6] === 1) ||
      (side === 'right' && branches[6] === 2)
    ) {
      setModal(true);
      spaceGuy = true;
      setPlayerModel(images.nothing);
    } else {
      setScore(score + 1);
    }

    // Check to see if player is moving INTO a branch
    if (
      (side === 'left' && branchLocation === 1) ||
      (side === 'right' && branchLocation === 2)
    ) {
      setModal(true);
      spaceGuy = true;
    } else {
      let copy = [...branches];
      copy.pop();
      copy.unshift(_generateNewBranch());
      setNextBranch(copy);
      setBranchLoc(branches[6]);
      setHeightArr([
        ...heightArr,
        <HeightView key={randInt(0, 99999)} callback={heightFinished} />,
      ]);
    }
  };

  const _generateNewBranch = () => {
    nextBranch = randInt(0, 2);

    // make empty branches a little more rare
    if (nextBranch === 0) {
      nextBranch = randInt(0, 2);
    }

    if (lastBranch != 0) {
      setLastBranch(0);
      return 0;
    } else {
      setLastBranch(nextBranch);
      return nextBranch;
    }
  };

  const heightFinished = () => {
    let copy = [...heightArr];
    copy.pop();
    setHeightArr(copy);

    var newThrownAway = (
      <ThrownAway spaceGuy={spaceGuy} key={randInt(0, 99999)} />
    );
    setThrownAwayArr([...thrownAwayArr, newThrownAway]);

    setBranchStatus();
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={images.space} style={styles.container}>
        <TouchableOpacity
          style={styles.leftSide}
          onPress={() => _handlePress('left')}>
          <View style={styles.side} />
        </TouchableOpacity>

        <View style={styles.middle} />

        <TouchableOpacity
          style={styles.rightSide}
          onPress={() => _handlePress('right')}>
          <View style={styles.side} />
        </TouchableOpacity>

        <View style={styles.branchContainer} pointerEvents="none">
          {heightArr}
          {branchViews}
        </View>

        <View style={styles.playerContainer} pointerEvents="none">
          <Animated.View style={{marginLeft: animatedValue}}>
            <Image style={styles.player} source={playerModel} />
          </Animated.View>
        </View>

        <View style={styles.headerContainer} pointerEvents="none">
          {
            //<ProgressBarAnimated value={progress} maxValue={100} width={barWidth}></ProgressBarAnimated>
          }
          <Text style={styles.score}>{score}</Text>
        </View>

        <View style={styles.ground} pointerEvents="none">
          {thrownAwayArr}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => Alert.alert('Modal has been closed.')}>
          <View style={styles.modalContainer}>
            <ImageBackground
              resizeMode={'stretch'}
              source={images.sign}
              style={styles.modal}>
              <Text>You Lost!</Text>
              <Text>{score}</Text>
              <TouchableOpacity
                onPress={() => {
                  setNextBranch([0, 0, 0, 0, 0, 0, 0]);
                  setScore(0);
                  setBranchLoc(-1);
                  setTimeout(() => {
                    setBranchStatus();
                    setModal(false);
                    setPlayerModel(images.astroRight);
                  }, 50);
                }}>
                <Text>Restart</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  leftSide: {
    flex: 4,
  },
  middle: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
  },
  middleContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  rightSide: {
    flex: 4,
  },
  side: {
    height: '100%',
    width: '100%',
  },
  player: {
    height: ms(100),
    width: ms(50),
    marginTop: ms(400),
  },
  playerContainer: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
  branchContainer: {
    flex: 1,
    paddingBottom: ms(190),
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
  branch: {
    width: ms(100),
    height: ms(100),
  },
  branchLeft: {
    //backgroundColor: 'green'
  },
  branchRight: {
    //backgroundColor: 'lightgreen',
  },
  score: {
    color: 'white',
    fontSize: ms(25),
    alignSelf: 'center',
    fontFamily: 'GillSans-Bold',
  },
  ground: {
    width: '100%',
    height: ms(160),
    alignSelf: 'flex-end',
    position: 'absolute',
  },
  modal: {
    height: ms(150),
    width: ms(125),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    height: '75%',
    width: '100%',
  },
  headerContainer: {
    width: '100%',
    position: 'absolute',
    height: '75%',
  },
});
