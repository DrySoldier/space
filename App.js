import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Game from './src/components/Game';

export default function App() {
  const [isLoadingComplete, setLoadingComplete] = useState(true);

  if (isLoadingComplete) {
    return (
      <View style={styles.container}>
        <Game />
      </View>
    );
  } else {
    return <ActivityIndicator />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
