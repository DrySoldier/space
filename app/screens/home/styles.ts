import { moderateScale as ms } from '@/constants';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: ms(34),
    fontFamily: 'Pixellari',
  },
  button: {
    height: ms(130),
    width: ms(180),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: ms(50),
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(16),
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
  flex: {flex: 1}
});

export default styles;
