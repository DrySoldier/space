import {moderateScale as ms, width} from '@/constants';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: ms(16),
  },
  topLeftBar: {
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: ms(14),
    marginTop: ms(4),
  },
  backButton: {
    width: ms(108),
    height: ms(42),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: ms(8),
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(14),
  },
  headerPanel: {
    width: width * 0.9,
    height: ms(102),
    paddingTop: ms(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontFamily: 'Pixellari',
    textAlign: 'center',
    fontSize: ms(28),
  },
  walletPanel: {
    width: width * 0.9,
    minHeight: ms(88),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(12),
    marginTop: ms(8),
  },
  walletTitle: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(14),
    opacity: 0.85,
  },
  walletValue: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(20),
    marginTop: ms(4),
  },
  listContent: {
    width: width * 0.9,
    marginTop: ms(10),
    paddingBottom: ms(22),
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: ms(10),
  },
  cardWrapper: {
    width: '48.5%',
  },
  card: {
    width: '100%',
    minHeight: ms(168),
    padding: ms(12),
    justifyContent: 'space-between',
    gap: ms(6),
  },
  cardTitle: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(13),
  },
  cardDescription: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Pixellari',
    fontSize: ms(10),
  },
  cardMeta: {
    color: 'white',
    fontFamily: 'Pixellari',
    fontSize: ms(10),
  },
  buyButton: {
    width: '100%',
    height: ms(34),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: ms(4),
  },
  disabledBuyButton: {
    opacity: 0.5,
  },
  statusText: {
    color: '#FFE15A',
    fontFamily: 'Pixellari',
    fontSize: ms(12),
    marginTop: ms(4),
  },
});

export default styles;
