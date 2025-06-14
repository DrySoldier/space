import { Dimensions, StyleSheet } from 'react-native';
import { moderateScale as ms } from '../../constants/scaling';

const {height, width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  player: {
    height: height * .16,
    width: width * .30,
    marginTop: height * .48,
  },
  playerContainer: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
});

export default styles;
