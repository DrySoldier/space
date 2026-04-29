import {StyleSheet} from 'react-native';
import {moderateScale as ms, width} from '@/constants';

const styles = StyleSheet.create({
  encounterTransitionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 40,
  },
  falling: {
    width: ms(124),
    height: ms(124),
  },
  encounterTransitionText: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(16),
  },
  encounterCinematicOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    marginTop: 100,
    zIndex: 45,
  },
  spaceTabletContainer: {
    width: ms(220),
    height: ms(220),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(26),
  },
  spaceTablet: {
    width: ms(220),
    height: ms(220),
    left: 0,
  },
  tabletWindow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  tabletStaticLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cinematicMerchantContainer: {
    width: ms(200),
    height: ms(175),
    position: 'absolute',
    top: 30,
    overflow: 'hidden',
  },
  cinematicMerchantBlackFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
    margin: ms(20),
  },
  cinematicMerchantImage: {
    width: ms(200),
    height: ms(175),
  },
  encounterPanelTapArea: {
    width: '100%',
    alignItems: 'center',
  },
  encounterPanelWrapper: {
    width: width * 0.74,
  },
  encounterPanel: {
    width: '100%',
    minHeight: ms(112),
    paddingHorizontal: ms(26),
    paddingTop: ms(20),
    paddingBottom: ms(24),
    justifyContent: 'space-between',
  },
  encounterDialogueText: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(12),
    lineHeight: ms(16),
  },
  encounterHintText: {
    color: 'rgba(255,255,255,0.76)',
    fontFamily: 'Pixellari',
    fontSize: ms(10),
    textAlign: 'right',
    marginTop: ms(6),
  },
});

export default styles;
