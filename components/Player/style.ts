import { StyleSheet } from 'react-native';
import { moderateScale as ms } from '../../constants/scaling';

const styles = StyleSheet.create({
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
});

export default styles;
