import { StyleSheet } from 'react-native';
import { moderateScale as ms } from 'src/constants/scaling';

const styles = StyleSheet.create({
    modal: {
      height: ms(200),
      width: ms(200),
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      height: '75%',
      width: '100%',
    },
    white: {
      color: 'white',
    },
  });

  export default styles;
  