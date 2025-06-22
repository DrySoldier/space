import { StyleSheet } from 'react-native';
import { moderateScale as ms } from '../../constants/scaling';

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        position: "absolute",
        width: '100%',
    },
    image: {
        width: '100%',
        height: 800,
        marginTop: -1,
    },
    levelNameBackground: {
        height: 75,
        width: 125,
        justifyContent: 'center',
        alignItems: 'center',
      },
      levelNameText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: ms(15),
        paddingHorizontal: 24,
        fontFamily: 'Pixellari',
        textAlign: 'center'
      },
      backgroundColorShift2: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ff9900',
        position: 'absolute',
      },
      backgroundColorShift3: {
        width: '100%',
        height: '100%',
        backgroundColor: 'blue',
        position: 'absolute',
      },
      levelNameContainer: {
        position: 'absolute',
        left: 25,
        top: 0,
      }
});

export default styles;
