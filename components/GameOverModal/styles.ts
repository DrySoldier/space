import { StyleSheet } from 'react-native';
import { moderateScale as ms } from '../../constants/scaling';

const styles = StyleSheet.create({
  mainSpaceProbe: {
    height: ms(250),
    width: ms(350),
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceProbe: {
    height: ms(100),
    width: ms(150),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 50,
  },
  hiScoreSpaceProbe: {
    height: ms(150),
    width: ms(250),
    justifyContent: 'center',
    alignItems: 'center',
    margin: ms(50),
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  text: {
    color: 'white',
    fontFamily: 'GillSans-Bold',
    textAlign: 'center',
  },
  headerText: {
    color: 'white',
    fontFamily: 'GillSans-Bold',
    textAlign: 'center',
    fontSize: 24,
  },
  scoreText: {
    color: 'white',
    fontFamily: 'GillSans-Bold',
    textAlign: 'center',
    fontSize: 28,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  hiScoreContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 50,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 75,
    paddingHorizontal: 115,
  }
});

export default styles;
