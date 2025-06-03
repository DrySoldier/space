import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale as ms } from '../../../constants/scaling';

const { height } = Dimensions.get('window');

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
    height: ms(125),
    width: ms(75),
    marginTop: ms(350),
  },
  playerContainer: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
  score: {
    color: 'white',
    fontSize: ms(25),
    alignSelf: 'center',
    fontFamily: 'GillSans-Bold',
  },
  branchContainer: {
    flex: 1,
    paddingBottom: ms(550),
    width: '100%',
    position: 'absolute',
  },
  ground: {
    width: '100%',
    height: height * 0.28,
    alignSelf: 'flex-end',
    position: 'absolute',
  },
  modal: {
    height: ms(200),
    width: ms(200),
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
  white: {
    color: 'white',
  },
  progressBarContainer: {
    alignItems: 'center',
    marginBottom: ms(15),
  },
});

export default styles;
