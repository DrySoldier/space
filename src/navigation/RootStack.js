import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Game from 'src/screens/Game';

const Stack = createStackNavigator();

const RootStack = () => (
  <Stack.Navigator
    initialRouteName="Game"
    screenOptions={{ gestureEnabled: false, headerShown: false }}
  >
    <Stack.Screen component={Game} name="Game" />
  </Stack.Navigator>
);

export default RootStack;
