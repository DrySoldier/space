import { Platform, StyleSheet } from 'react-native';
import { height, moderateScale as ms } from '../../../constants/scaling';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'black'
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
    marginTop: ms(325),
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
    overflow: 'visible',
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: Platform.OS === 'ios' ? height * .06 : height * .03
  },
  branchContentContainer: {
    alignItems: 'center',
    width: '75%',
    height: '100%',
    overflow: 'visible',
  },
  ground: {
    width: '100%',
    height: '28.5%',
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
    height: '85%',
  },
  white: {
    color: 'white',
  },
  progressBarContainer: {
    alignItems: 'center',
    marginBottom: ms(15),
  },
  pauseContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.3)',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    position: 'absolute',
    right: 25,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  continueButton: {
    position: 'absolute',
    right: 25,
    top: '8%',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  pauseText: {
    fontSize: ms(32),
    color: 'white',
    marginLeft: ms(12)
  },
  pauseImage: {
    height: ms(32),
    width: ms(32),
  },
});

export default styles;
