import { Dimensions, StyleSheet } from 'react-native';
import { moderateScale as ms, width } from '../../constants/scaling';
import { BRANCH_HW } from '../Branch/styles';

const {height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  player: {
    height: height * .15,
    width: ms(75),
  },
  playerContainer: {
    flex: 1,
    position: 'absolute',
    top: BRANCH_HW * 5.2,
    height: '100%',
  },
});

export default styles;
