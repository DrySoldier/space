import { StyleSheet } from 'react-native';
import { moderateScale as ms } from '../constants/scaling';

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 36,
    fontFamily: 'GillSans-Bold',
  },
  button: {
    height: ms(130),
    width: ms(180),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(50),
  },
  buttonText: {
    color: 'white',
    fontFamily: 'GillSans-Bold',
    textAlign: 'center'
  },
  buttonContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  subtitle: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'GillSans-Bold',
  },
  titleContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  astro: {
    height: ms(100),
    width: ms(100),
    position: 'absolute',
    top: ms(120),
  },
});

export default styles;
