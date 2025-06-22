import { moderateScale as ms } from "@/constants";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    oxygenContainer: {
        position: 'absolute',
        left: ms(-24),
        flex: 1,
        alignItems: 'flex-start',
        transform: [{ rotateZ: '-90deg' }],
        top: ms(100)
    },
    oxygenGradient: {
        position: 'absolute',
        height: ms(24),
        marginLeft: ms(15.8),
        marginTop: ms(10)
    }
});

export default styles;
