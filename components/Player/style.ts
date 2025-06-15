import { Dimensions, StyleSheet } from 'react-native';
import { moderateScale as ms } from '../../constants/scaling';

const {height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  player: {
    height: height * .15,
    width: ms(75),
    marginTop: height * .33,
  },
  playerContainer: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
});

export default styles;
