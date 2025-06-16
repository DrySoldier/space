import { moderateScale as ms, width } from "@/constants";
import { StyleSheet } from "react-native";

export const OXYGEN_HEIGHT = ms(70);

const styles = StyleSheet.create({
    oxygenContainer: {
        position: 'absolute',
        top: ms(100),
        left: width * .29,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    oxygenGradient: {
        position: 'absolute',
        backgroundColor: 'red',
        height: OXYGEN_HEIGHT,
        marginLeft: ms(18.7),
    }
});

export default styles;
