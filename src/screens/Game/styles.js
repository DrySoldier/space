import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    leftSide: {
      flex: 4,
    },
    middle: {
      flex: 1,
      height: '100%',
      flexDirection: 'column',
    },
    middleContainer: {
      position: 'absolute',
      height: '100%',
      width: '100%',
    },
    rightSide: {
      flex: 4,
    },
    side: {
      height: '100%',
      width: '100%',
    },
    player: {
      height: ms(100),
      width: ms(50),
      marginTop: ms(400),
    },
    playerContainer: {
      width: '100%',
      position: 'absolute',
      alignItems: 'center',
    },
    branchContainer: {
      flex: 1,
      paddingBottom: ms(190),
      width: '100%',
      position: 'absolute',
      alignItems: 'center',
    },
    branch: {
      width: ms(100),
      height: ms(100),
    },
    branchLeft: {
      //backgroundColor: 'green'
    },
    branchRight: {
      //backgroundColor: 'lightgreen',
    },
    score: {
      color: 'white',
      fontSize: ms(25),
      alignSelf: 'center',
      fontFamily: 'GillSans-Bold',
    },
    ground: {
      width: '100%',
      height: ms(160),
      alignSelf: 'flex-end',
      position: 'absolute',
    },
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
    headerContainer: {
      width: '100%',
      position: 'absolute',
      height: '75%',
    },
    white: {
      color: 'white',
    },
  });

  export default styles;
  