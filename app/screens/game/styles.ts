import { StyleSheet } from 'react-native';
import { moderateScale as ms } from '../../../constants/scaling';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'black'
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: "absolute",
    width: '100%',
  },
  image: {
    width: '100%',
    height: 800,
    marginTop: -1
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
    flex: 1,
    width: '100%',
    position: 'absolute',
    overflow: 'visible',
    backgroundColor: 'red',
    top: 20,
    left: 150
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
});

export default styles;
