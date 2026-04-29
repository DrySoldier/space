import {moderateScale as ms, width} from '@/constants';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(14),
  },
  content: {
    width: width * 0.92,
    alignItems: 'center',
  },
  portrait: {
    width: ms(140),
    height: ms(140),
    marginBottom: ms(8),
  },
  speakerPanel: {
    width: '100%',
    height: ms(74),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ms(2),
    paddingTop: ms(10),
  },
  speakerText: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(20),
  },
  dialoguePanel: {
    width: '100%',
    minHeight: ms(186),
    paddingHorizontal: ms(14),
    paddingVertical: ms(14),
    justifyContent: 'space-between',
  },
  dialogueText: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(14),
    lineHeight: ms(19),
  },
  hintText: {
    color: 'rgba(255,255,255,0.75)',
    fontFamily: 'Pixellari',
    fontSize: ms(11),
    marginTop: ms(10),
    textAlign: 'right',
  },
});

export default styles;
