import { StyleSheet } from 'react-native';
import { height, moderateScale as ms, width } from '../../constants/scaling';

export const BRANCH_HW = height * .12;

const styles = StyleSheet.create({
    branch: {
        width: BRANCH_HW,
        height: BRANCH_HW,
        position: 'absolute',
    },
    obstacleLeft: {
        width: BRANCH_HW * 2,
        height: BRANCH_HW,
        position: 'absolute',
        marginLeft: -BRANCH_HW / 2
    },
    obstacleRight: {
        width: BRANCH_HW * 2,
        height: BRANCH_HW,
        position: 'absolute',
    },
    oxygen: {
        marginTop: 12,
        position: 'absolute',
        width: BRANCH_HW * 0.5,
        height: BRANCH_HW * 0.65,
    },
});

export default styles;
