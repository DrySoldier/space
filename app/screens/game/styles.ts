import {StyleSheet} from 'react-native';
import {moderateScale as ms, width} from '../../../constants/scaling';
import {BRANCH_HW} from '../../../components/Branch/styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  leftSide: {
    flex: 4,
  },
  middle: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
  },
  rightSide: {
    flex: 4,
  },
  side: {
    height: '100%',
    width: '100%',
  },
  score: {
    color: 'white',
    fontSize: ms(28),
    fontFamily: 'Pixellari',
  },
  branchContainer: {
    overflow: 'visible',
    position: 'absolute',
    width: '100%',
    height: '100%',
    marginTop: -BRANCH_HW * 1.2,
    marginRight: BRANCH_HW,
  },
  branchContentContainer: {
    alignItems: 'center',
    height: '100%',
    width,
    overflow: 'visible',
  },
  headerContainer: {
    width: '100%',
    position: 'absolute',
    height: '85%',
    alignItems: 'center',
  },
  pauseContainer: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.3)',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    position: 'absolute',
    right: 25,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  continueButton: {
    position: 'absolute',
    right: 25,
    top: '8%',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  pauseText: {
    fontSize: ms(32),
    color: 'white',
    fontFamily: 'Pixellari',
    marginLeft: ms(12),
  },
  pauseImage: {
    height: ms(32),
    width: ms(32),
  },
});

export default styles;
