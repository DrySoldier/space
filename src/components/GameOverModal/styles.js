import { StyleSheet } from 'react-native';
import { moderateScale as ms } from 'src/constants/scaling';

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
    },
    hiScoreSpaceProbe: {
      height: ms(150),
      width: ms(250),
      justifyContent: 'center',
      alignItems: 'center',
      margin: ms(50)
    },
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
    white: {
      color: 'white',
      fontFamily: 'GillSans-Bold',
    },
  });

  export default styles;
  