import { StyleSheet } from 'react-native';
import { height, moderateScale as ms, width } from '../../constants/scaling';

const styles = StyleSheet.create({
  mainSpaceProbe: {
    height: ms(120),
    width: ms(220),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(12)
  },
  spaceProbe: {
    height: ms(100),
    width: ms(150),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(40),
  },
  hiScoreSpaceProbe: {
    height: height * .4,
    width: width * 1.4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: ms(26),
    paddingBottom: height * .065
  },
  modalContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80%',
    width: '100%',
    marginTop: ms(80)
  },
  text: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(16),
    textAlign: 'center',
  },
  headerText: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(42),
  },
  hiscoreText: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(42),
  },
  scoreText: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(64),
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  hiScoreContainer: {
    flex: 1,
    height: height * .3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(50),
  },
});

export default styles;
