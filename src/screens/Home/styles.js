import { StyleSheet } from 'react-native';
import { moderateScale as ms } from 'src/constants/scaling';

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 36,
    fontFamily: 'GillSans-Bold',
  },
  button: {
    height: 130,
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 50,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'GillSans-Bold',
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
    height: 100,
    width: 100,
    position: 'absolute',
    top: ms(250),
  },
});

export default styles;
