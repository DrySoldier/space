import { StyleSheet } from 'react-native';
import { height, moderateScale as ms, width } from '../../constants/scaling';

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    gap: ms(20),
  },
  headerPanel: {
    width: width * 1.2,
    padding: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(6),
  },
  headerText: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(36),
  },
  subheaderText: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(16),
    opacity: 0.9,
  },
  scoreCard: {
    width: width * 1.1,
    paddingVertical: ms(18),
    paddingHorizontal: ms(24),
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(8),
  },
  scoreValue: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(52),
  },
  bestValue: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(20),
    opacity: 0.85,
  },
  ctaContainer: {
    width: '100%',
    alignItems: 'center',
    gap: ms(14),
    paddingBottom: ms(10),
  },
  ctaButton: {
    width: width * 0.42,
    height: ms(54),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(12),
  },
  primaryCta: {
    width: width * 0.7,
    height: ms(60),
  },
  secondaryRow: {
    flexDirection: 'row',
    width: width * 0.85,
    justifyContent: 'space-between',
  },
  placeholderButton: {
    opacity: 0.4,
  },
  placeholderText: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(16),
    textAlign: 'center',
    opacity: 0.6,
  },
  ctaText: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(18),
    textAlign: 'center',
  },
  personalBestText: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(14),
  },
});

export default styles;
