import { StyleSheet } from 'react-native';
import { height, moderateScale as ms, width } from '../../constants/scaling';

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  headerPanel: {
    width: width,
    height: 124,
    paddingTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(28),
  },
  subheaderText: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(16),
    opacity: 0.9,
  },
  scoreCard: {
    width: width,
    height: height * .25,
    marginTop: -4,
    paddingVertical: ms(24),
    paddingHorizontal: ms(24),
    alignItems: 'center',
    justifyContent: 'center',
    gap: ms(8),
  },
  scoreValue: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(44),
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
    marginTop: ms(64),
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
    gap: ms(12)
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
  scoreboardSection: {
    width: '100%',
    alignItems: 'center',
    gap: ms(8),
    marginTop: ms(6),
  },
  scoreboardSnippetCard: {
    width: '92%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: ms(8),
    paddingVertical: ms(8),
    paddingHorizontal: ms(10),
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  scoreboardLoadingContainer: {
    minHeight: ms(56),
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreboardPlaceholderText: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(12),
    textAlign: 'center',
    opacity: 0.75,
    paddingVertical: ms(8),
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: ms(4),
    gap: ms(8),
  },
  scoreMetaText: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(12),
    minWidth: ms(34),
    textAlign: 'center',
  },
  scoreNameText: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(12),
    flex: 1,
    textAlign: 'center',
  },
  playerScoreText: {
    color: '#FFE15A',
  },
});

export default styles;
