import React from 'react';
import { Text, View, TouchableOpacity, Modal, Alert } from 'react-native';
import { FastImageBackground } from '../FastImageBackground';
import styles from './styles';

export const GameOverModal = ({ visible, score, resetGame }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => Alert.alert('Modal has been closed.')}
    >
      <View style={styles.modalContainer}>
        <FastImageBackground
          resizeMode={'stretch'}
          source={require('../../assets/newAssets/Spaceprobe.png')}
          style={styles.modal}
        >
          <Text style={styles.white}>You Lost!</Text>
          <Text style={styles.white}>{score}</Text>
          <TouchableOpacity onPress={resetGame}>
            <Text style={styles.white}>Restart</Text>
          </TouchableOpacity>
        </FastImageBackground>
      </View>
    </Modal>
  );
};
