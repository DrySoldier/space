import { moderateScale as ms } from "@/constants";
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    button: {
        height: ms(130),
        width: ms(180),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: ms(50)
    },
    creditDisplay: {
        height: ms(150),
        width: ms(250),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ms(75),
    },
    buttonContainer: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Pixellari',
        textAlign: 'center',
        fontSize: ms(16),
    },
    changeNameText: {
        color: 'white',
        fontFamily: 'Pixellari',
        textAlign: 'center',
        fontSize: ms(22),
    },
    astro: {
        height: ms(100),
        width: ms(100),
        position: 'absolute',
        top: ms(250),
    },
    nameChange: {
        height: ms(150),
        width: ms(450),
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeNameInput: {
        backgroundColor: 'gray',
        width: '35%',
        height: ms(32),
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginTop: ms(24),
        borderRadius: 6,
        color: 'white',
        fontFamily: 'Pixellari',
        fontSize: 18,
    },
    activityIndicator: { paddingTop: ms(36), paddingBottom: ms(8) },
    container: {flex: 1}
})

export default styles;
